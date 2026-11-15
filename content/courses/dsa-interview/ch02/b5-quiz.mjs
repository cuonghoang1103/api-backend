/** 2.5 — Quiz chương 2. Mọi output nhắc trong câu hỏi lấy từ ../ma/ch02/*.out (chạy thật). */
// Nguyên văn dòng lỗi trong ma/ch02/bay-diem-vao.ts.out (có nháy đơn ASCII nên để trong chuỗi nháy kép).
const LOI = "TypeError: Cannot read properties of null (reading 'next')";

export default {
  title: '2.5 — Chapter 2 quiz: two pointers and sliding windows|||2.5 — Quiz chương 2: hai con trỏ và cửa sổ trượt',
  slug: 'dsa-2-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống: đoán output của mã có lỗi, chọn mẫu theo ràng buộc, độ phức tạp khấu hao, rate limiter bị dồn ở mép cửa sổ, chứng minh Floyd và ca biên nhanh/chậm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Chapter 2 quiz: two pointers and sliding windows</h2>
<p class="lead">Ten questions, fifteen minutes. Most of them show you code or a situation from this chapter and ask what really happens — every output mentioned was produced by running the programs of lessons 2.1–2.4. Aim for 8/10; for each miss, reopen the lesson the explanation points to.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can state, for a converging-pointer move, which candidates it discards and why they are useless.</li>
<li>I can say which window variant a problem needs (longest / shortest / count) and where to record the answer.</li>
<li>I can explain why a for loop with an inner while is still O(n) for a sliding window.</li>
<li>I can explain why negative numbers break a sum window, and what to use instead.</li>
<li>I can derive a = kL − b for Floyd’s phase 2 and pick the right middle of a list.</li>
<li>I can explain why a fixed-window rate limiter lets up to twice the limit through at its edge.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Quiz</span>
<h2>Quiz chương 2: hai con trỏ và cửa sổ trượt</h2>
<p class="lead">Mười câu, mười lăm phút. Phần lớn câu đưa cho bạn một đoạn mã hay một tình huống trong chương và hỏi chuyện gì thật sự xảy ra — mọi output nhắc tới đều sinh ra bằng cách chạy thật các chương trình của bài 2.1–2.4. Nhắm 8/10; câu nào sai thì mở lại bài mà phần giải thích chỉ tới.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được, với mỗi lần dời con trỏ đối đầu, nó loại những ứng viên nào và vì sao chúng vô dụng.</li>
<li>Tôi nói được một đề cần biến thể cửa sổ nào (dài nhất / ngắn nhất / đếm) và ghi nhận đáp án ở đâu.</li>
<li>Tôi giải thích được vì sao vòng for có while bên trong vẫn là O(n) với cửa sổ trượt.</li>
<li>Tôi giải thích được vì sao số âm làm gãy cửa sổ tính tổng, và dùng gì thay thế.</li>
<li>Tôi suy ra được a = kL − b cho pha 2 của Floyd và chọn đúng điểm giữa của danh sách.</li>
<li>Tôi giải thích được vì sao rate limiter cửa sổ cố định cho lọt tới gấp đôi hạn mức ở mép cửa sổ.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'You solve Longest Substring Without Repeating Characters with the "jump" version but write l = last[c] + 1 (no max). "abcabcbb" and "pwwkew" pass. What does your function return for "abba"?|||Bạn giải Longest Substring Without Repeating Characters bằng bản "nhảy" nhưng viết l = last[c] + 1 (thiếu max). "abcabcbb" và "pwwkew" đều qua. Hàm của bạn trả về gì với "abba"?',
        options: [
          '2 — the bug only matters for longer strings|||2 — lỗi chỉ lộ ra với chuỗi dài hơn',
          '3 — at the last "a", l jumps back to 1 and "bba" is counted|||3 — tới chữ "a" cuối, l lùi về 1 và "bba" bị tính',
          '4 — the whole string is counted because both letters repeat symmetrically|||4 — cả chuỗi bị tính vì hai chữ lặp đối xứng nhau',
          '1 — after the second "b", l never moves forward again|||1 — sau chữ "b" thứ hai, l không bao giờ tiến lên nữa',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The real run prints "jump without max = 3" for "abba" (lesson 2.2). At the second b, l jumps to 2; at the last a, last[a] = 0 is already outside the window, so l = 0 + 1 = 1 moves BACKWARDS and the window "bba" (with two b’s) is counted as length 3. "2" is the correct answer of the fixed code, which is exactly why this bug survives the first two tests. Fix: l = max(l, last[c] + 1).|||VI: Lần chạy thật in "jump without max = 3" với "abba" (bài 2.2). Tới chữ b thứ hai, l nhảy lên 2; tới chữ a cuối, last[a] = 0 đã nằm ngoài cửa sổ, nên l = 0 + 1 = 1 bị LÙI lại và cửa sổ "bba" (có hai chữ b) bị tính là dài 3. "2" là đáp án của bản đã sửa — chính vì vậy lỗi này qua được hai test đầu. Cách sửa: l = max(l, last[c] + 1).',
      },
      {
        question: 'Constraints: nums is sorted, n ≤ 2·10⁵, find two indices whose values sum to target, extra memory must be O(1). Which answer should you give as your final solution?|||Ràng buộc: nums đã sắp xếp, n ≤ 2·10⁵, tìm hai chỉ số có tổng giá trị bằng target, bộ nhớ phụ phải là O(1). Bạn nên chốt lời giải nào?',
        options: [
          'Two pointers from both ends: O(n) time, O(1) memory, each step discards one element that cannot be in any pair|||Hai con trỏ từ hai đầu: O(n) thời gian, O(1) bộ nhớ, mỗi bước loại một phần tử không thể nằm trong cặp nào',
          'A hash map of value → index: O(n) time, which is optimal, so the memory limit does not matter|||Hash map giá trị → chỉ số: O(n) thời gian là tối ưu, nên giới hạn bộ nhớ không quan trọng',
          'Binary search the complement for every element: O(n log n), the best possible on sorted input|||Tìm nhị phân phần bù cho từng phần tử: O(n log n), tốt nhất có thể trên đầu vào đã sắp',
          'Brute force over all pairs: 2·10⁵ is small enough for O(n²) within a second|||Vét cạn mọi cặp: 2·10⁵ đủ nhỏ để O(n²) chạy trong một giây',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Two pointers meet both limits and are the best: O(n) time, O(1) memory (lesson 2.1 measured 0.95 ms at n = 10⁶). The hash map breaks the O(1)-memory constraint. Binary search is a good intermediate answer but not the best — two pointers use the order across elements, not once per element. Brute force at 2·10⁵ is ~2·10¹⁰ pair checks: the lesson measured 3.5 s already at 10⁵.|||VI: Hai con trỏ thoả cả hai giới hạn và là tốt nhất: O(n) thời gian, O(1) bộ nhớ (bài 2.1 đo được 0,95 ms ở n = 10⁶). Hash map phạm ràng buộc bộ nhớ O(1). Tìm nhị phân là câu trả lời trung gian tốt nhưng chưa phải tốt nhất — hai con trỏ dùng thứ tự xuyên qua các phần tử, không phải riêng từng phần tử. Vét cạn ở 2·10⁵ là khoảng 2·10¹⁰ phép kiểm cặp: bài học đo được 3,5 giây ngay ở 10⁵.',
      },
      {
        question: 'What does maxArea([1, 2, 4, 3]) return for the two-pointer Container With Most Water from lesson 2.1?|||maxArea([1, 2, 4, 3]) của lời giải hai con trỏ Container With Most Water ở bài 2.1 trả về bao nhiêu?',
        options: ['4', '6', '3', '8'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The real output is "maxArea([1,2,4,3]) = 4   brute = 4": walls 2 and 3 at distance 2 give min(2, 3) × 2 = 4. 8 would be 4 × 2, but the water level is set by the SHORTER wall, not the taller one; 6 mixes up width and height; 3 is the widest container (min(1, 3) × 3), which the algorithm leaves at step 1 by moving the short wall.|||VI: Output thật là "maxArea([1,2,4,3]) = 4   brute = 4": tường 2 và 3 cách nhau 2 cho min(2, 3) × 2 = 4. 8 là 4 × 2, nhưng mực nước do tường THẤP hơn quyết định, không phải tường cao hơn; 6 là nhầm chiều rộng với chiều cao; 3 là bể rộng nhất (min(1, 3) × 3), thuật toán rời nó ngay ở bước 1 bằng cách dời tường thấp.',
      },
      {
        question: 'You remove the three duplicate-skipping lines from the 3Sum solution (sort + fix one + two pointers). What does it return for [-2, 0, 0, 2, 2]?|||Bạn xoá ba dòng bỏ trùng khỏi lời giải 3Sum (sắp xếp + cố định một + hai con trỏ). Nó trả về gì với [-2, 0, 0, 2, 2]?',
        options: [
          '[[-2, 0, 2]] — the triples are unique anyway because the array is sorted|||[[-2, 0, 2]] — bộ ba vẫn không trùng vì mảng đã sắp xếp',
          '[] — without the skips, the pointers cross before the first match|||[] — không có các dòng bỏ qua thì hai con trỏ vượt nhau trước lần trúng đầu tiên',
          '[[-2, 0, 2], [-2, 0, 2]] — the same triple is reported twice|||[[-2, 0, 2], [-2, 0, 2]] — cùng một bộ ba bị báo hai lần',
          '[[-2, 0, 2], [0, 0, 0]] — it also finds a triple of zeros|||[[-2, 0, 2], [0, 0, 0]] — nó còn tìm ra bộ ba toàn số 0',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Real output: "without dedup = [[-2,0,2],[-2,0,2]]". After the first hit (l on the first 0, r on the last 2), l++ and r-- land on another 0 and another 2, which sum to the same triple. Sorting puts equal values side by side — it does not remove them; you still have to skip them. There is no [0, 0, 0]: the array has only two zeros.|||VI: Output thật: "without dedup = [[-2,0,2],[-2,0,2]]". Sau lần trúng đầu (l ở số 0 thứ nhất, r ở số 2 cuối), l++ và r-- rơi vào một số 0 khác và một số 2 khác, cộng ra đúng bộ ba cũ. Sắp xếp chỉ đặt các giá trị bằng nhau cạnh nhau — không xoá chúng; bạn vẫn phải tự bỏ qua. Không có [0, 0, 0]: mảng chỉ có hai số 0.',
      },
      {
        question: 'An endpoint is protected by express-rate-limit + rate-limit-redis (10 requests per 60 s; the window opens at the key’s first hit). An attacker sends 1 request at t = 0, waits, then 9 requests at 59.91–59.99 s and 10 at 60.00–60.09 s. How many are accepted inside those 200 ms?|||Một endpoint được bảo vệ bằng express-rate-limit + rate-limit-redis (10 request mỗi 60 giây; cửa sổ mở ra từ lần chạm đầu tiên của khoá). Kẻ tấn công gửi 1 request lúc t = 0, chờ, rồi 9 request ở 59,91–59,99 s và 10 request ở 60,00–60,09 s. Bao nhiêu request được chấp nhận trong 200 ms đó?',
        options: [
          '10 — the limit is 10, so no more than 10 can ever pass in any minute|||10 — hạn mức là 10 nên không bao giờ quá 10 request lọt trong một phút bất kỳ',
          '11 — the limiter approximates the previous window and lets one extra through|||11 — bộ giới hạn xấp xỉ cửa sổ trước nên cho lọt thêm một',
          '19 — 9 at the end of the first window, then a fresh window accepts 10|||19 — 9 request ở cuối cửa sổ thứ nhất, rồi một cửa sổ mới tinh nhận thêm 10',
          '20 — every request passes because the attacker never exceeds 10 per window|||20 — mọi request đều lọt vì kẻ tấn công không lần nào vượt 10 trong một cửa sổ',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Real run (scenario C, lesson 2.2): "fixed window (from first hit) … 19 of them inside [59900, 60100) ms" — 2 × max − 1. The opener at t = 0 started the window, so at 60.00 s it expires and the counter restarts. 10 is what a sliding window LOG allows; 11 is the sliding COUNTER in scenario B; 20 is the clock-aligned fixed window in scenario B — anchoring to the first hit costs the attacker exactly that one opener.|||VI: Lần chạy thật (kịch bản C, bài 2.2): "fixed window (from first hit) … 19 of them inside [59900, 60100) ms" — tức 2 × max − 1. Request mở màn lúc t = 0 đã mở cửa sổ, nên tới 60,00 s nó hết hạn và bộ đếm làm lại từ đầu. 10 là con số sliding window LOG cho phép; 11 là sliding COUNTER ở kịch bản B; 20 là cửa sổ cố định căn theo đồng hồ ở kịch bản B — neo vào lần chạm đầu chỉ bắt kẻ tấn công trả đúng một request mở màn.',
      },
      {
        question: 'Which of these problems can NOT be solved correctly with the "grow right, shrink left" sliding window?|||Đề nào dưới đây KHÔNG giải đúng được bằng cửa sổ trượt "mở rộng phải, co trái"?',
        options: [
          'Longest subarray with at most 2 distinct values|||Mảng con dài nhất có tối đa 2 giá trị khác nhau',
          'Shortest subarray with sum ≥ target, all numbers positive|||Mảng con ngắn nhất có tổng ≥ target, mọi số đều dương',
          'Longest run of 1s after flipping at most k zeros|||Đoạn số 1 dài nhất sau khi lật tối đa k số 0',
          'Count subarrays with sum exactly k when nums may contain negative numbers|||Đếm số mảng con có tổng đúng bằng k khi nums có thể chứa số âm',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: With negatives, growing the window can DECREASE the sum, so "too big ⇒ shrink" throws away left parts that a later negative would repair. The real run on [1, -1, 1, 1], k = 2 gave "window = 1, prefix sums = 2". Use prefix sums + a hash map (lesson 1.2). The other three are monotonic: distinct count, a positive sum and a zero count only grow when the window grows.|||VI: Có số âm thì nới cửa sổ có thể làm tổng GIẢM, nên "lớn quá ⇒ co" vứt đi phần bên trái mà một số âm phía sau lẽ ra chữa được. Lần chạy thật trên [1, -1, 1, 1], k = 2 cho "window = 1, prefix sums = 2". Hãy dùng tổng tiền tố + hash map (bài 1.2). Ba đề còn lại đều đơn điệu: số loại khác nhau, tổng các số dương và số lượng số 0 chỉ tăng khi cửa sổ nới ra.',
      },
      {
        question: 'Your sliding-window code has a while loop inside a for loop. The interviewer says: "Nested loops — so it’s O(n²), right?" What is the best reply?|||Code cửa sổ trượt của bạn có một vòng while nằm trong vòng for. Người phỏng vấn nói: "Hai vòng lồng nhau — vậy là O(n²) đúng không?" Câu trả lời tốt nhất là gì?',
        options: [
          'Yes in the worst case, but the average case is O(n) because the while rarely runs|||Đúng ở trường hợp xấu nhất, nhưng trung bình là O(n) vì vòng while hiếm khi chạy',
          'It is O(n) amortised: l only moves forward, so the inner loop runs at most n times in total across the whole for loop|||Nó là O(n) khấu hao: l chỉ tiến lên, nên vòng trong chạy tổng cộng tối đa n lần trong suốt cả vòng for',
          'It is O(n log n), because each shrink halves the remaining window|||Nó là O(n log n), vì mỗi lần co làm cửa sổ còn lại giảm một nửa',
          'It is O(n·k) where k is the window size, which is fine because k is small|||Nó là O(n·k) với k là kích thước cửa sổ, chấp nhận được vì k nhỏ',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The cost of the inner loop is bounded by the total distance l travels, which is at most n — independent of how the work is spread over iterations. The trace of LC 209 in lesson 2.2 shows it: 6 grow steps + 5 shrink steps for n = 6. "Average case" is the wrong word: the bound holds for EVERY input, which is what "amortised" means. Nothing halves the window, and k does not appear in the cost.|||VI: Chi phí của vòng trong bị chặn bởi tổng quãng đường l đi, tối đa n — bất kể công việc rải ra các vòng thế nào. Bảng vết LC 209 ở bài 2.2 cho thấy rõ: 6 bước mở rộng + 5 bước co với n = 6. "Trung bình" là từ sai: cận này đúng với MỌI đầu vào, đó mới là nghĩa của "khấu hao". Không có gì làm cửa sổ giảm một nửa, và k không có mặt trong chi phí.',
      },
      {
        question: 'A linked list has a tail of a = 2 nodes before the cycle, and the cycle has L = 6 nodes. Floyd’s phase 1 has just found the meeting point. How many steps does phase 2 (one pointer from head, one from the meeting point, both speed 1) take to reach the entry?|||Một danh sách liên kết có đuôi a = 2 nút trước chu trình, và chu trình có L = 6 nút. Pha 1 của Floyd vừa tìm được điểm gặp. Pha 2 (một con trỏ từ head, một từ điểm gặp, cả hai tốc độ 1) mất bao nhiêu bước để tới điểm vào?',
        options: [
          '2 — exactly a, because a = kL − b|||2 — đúng bằng a, vì a = kL − b',
          '4 — the distance b from the entry to the meeting point|||4 — khoảng cách b từ điểm vào tới điểm gặp',
          '6 — one full lap of the cycle|||6 — trọn một vòng chu trình',
          'It depends on where the pointers met, so it cannot be known from a and L|||Còn tuỳ hai con trỏ gặp nhau ở đâu, nên không biết được chỉ từ a và L',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Phase 2 always takes a steps: the pointer from head needs a steps to the entry, and the pointer at the meeting point (b past the entry) needs kL − b = a steps to come back to it. The trace in lesson 2.3 (8 nodes, a = 2, L = 6) shows p: 0 → 1 → 2 and q: 6 → 7 → 2. b is 4 in that example, but that is the distance already walked, not the one left; the meeting point does depend on a and L, and phase 2 still takes a steps.|||VI: Pha 2 luôn tốn a bước: con trỏ từ head cần a bước tới điểm vào, còn con trỏ ở điểm gặp (đã qua điểm vào b bước) cần kL − b = a bước để quay về đó. Bảng vết ở bài 2.3 (8 nút, a = 2, L = 6) cho thấy p: 0 → 1 → 2 và q: 6 → 7 → 2. b bằng 4 trong ví dụ đó, nhưng đó là quãng đã đi chứ không phải quãng còn lại; điểm gặp có phụ thuộc a và L, nhưng pha 2 vẫn luôn tốn a bước.',
      },
      {
        question: 'slow = fast = head; while (fast !== null && fast.next !== null) { slow = slow.next; fast = fast.next.next; } return slow.val. What does it return for 1 → 2 → 3 → 4 → 5 → 6?|||slow = fast = head; while (fast !== null && fast.next !== null) { slow = slow.next; fast = fast.next.next; } return slow.val. Nó trả về gì với 1 → 2 → 3 → 4 → 5 → 6?',
        options: ['3', '5', '6', '4'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Real output: "[1,2,3,4,5,6]: middleNode = 4, firstMiddle = 3". This condition stops on the SECOND middle (what LC 876 wants). 3 is what the other condition, fast.next && fast.next.next, returns — the first middle, needed to split a list in half for Palindrome Linked List or Reorder List. 5 and 6 would need slow to move more often than every other node.|||VI: Output thật: "[1,2,3,4,5,6]: middleNode = 4, firstMiddle = 3". Điều kiện này dừng ở điểm giữa THỨ HAI (đúng thứ LC 876 muốn). 3 là kết quả của điều kiện kia, fast.next && fast.next.next — điểm giữa thứ nhất, cần khi cắt đôi danh sách cho Palindrome Linked List hay Reorder List. 5 và 6 đòi slow phải đi nhiều hơn mỗi hai nút một bước.',
      },
      {
        question: 'A teammate writes the cycle check as while (fast.next !== null && fast !== null). Tests on 1 → 2 → 3 (no cycle) pass. What happens on 1 → 2 → 3 → 4 (no cycle) in JavaScript?|||Một bạn cùng nhóm viết phép kiểm chu trình là while (fast.next !== null && fast !== null). Test trên 1 → 2 → 3 (không chu trình) qua. Chuyện gì xảy ra với 1 → 2 → 3 → 4 (không chu trình) trong JavaScript?',
        options: [
          'It returns false, the same as on 1 → 2 → 3|||Nó trả về false, giống hệt với 1 → 2 → 3',
          'It loops forever, because fast never becomes null|||Nó lặp vô hạn, vì fast không bao giờ thành null',
          LOI + ' (fast became null)|||' + LOI + ' (fast đã là null)',
          'It returns true, because the last node is mistaken for the head|||Nó trả về true, vì nút cuối bị nhầm là head',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Real run (lesson 2.3): "wrong order on [1,2,3,4] (no cycle): ' + LOI + '". On an odd length, fast stops on the last node and fast.next is null, so the loop exits cleanly; on an even length fast jumps to null and the next check reads null.next. Check fast before fast.next. In Java the same bug is a NullPointerException.|||VI: Lần chạy thật (bài 2.3): "wrong order on [1,2,3,4] (no cycle): ' + LOI + '". Độ dài lẻ thì fast dừng ở nút cuối và fast.next là null, nên vòng lặp thoát êm; độ dài chẵn thì fast nhảy vào null và phép kiểm tiếp theo đọc null.next. Hãy kiểm fast trước fast.next. Trong Java, cùng lỗi đó là NullPointerException.',
      },
    ],
  },
};
