/** Kiểm tra Mục 0 — 10 câu tình huống. Số liệu trong câu hỏi là output thật ở ../ma/ch00. */
export default {
  title: '0.3 — Section 0 check|||0.3 — Kiểm tra Mục 0',
  slug: 'dsa-0-3-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về vòng coding, Big-O từ ràng buộc, chi phí ẩn và khung 6 bước.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Check</span>
<h2>Section 0 check</h2>
<p class="lead">Ten situations, fifteen minutes. Each explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the four axes of the interview rubric.</li>
<li>I can turn a constraint like n ≤ 10⁵ into a target complexity.</li>
<li>I can count the steps of the six common loop shapes by eye.</li>
<li>I know three library calls that hide an O(n) loop.</li>
<li>I can run the six-step framework on LC 121 out loud.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Kiểm tra Mục 0</h2>
<p class="lead">Mười tình huống, mười lăm phút. Mỗi lời giải thích nói vì sao đáp án đúng là đúng, và vì sao phương án hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi kể được bốn trục của bảng chấm phỏng vấn.</li>
<li>Tôi đổi được ràng buộc kiểu n ≤ 10⁵ thành độ phức tạp đích.</li>
<li>Tôi đếm được số bước của sáu dạng vòng lặp hay gặp bằng mắt.</li>
<li>Tôi biết ba lời gọi thư viện giấu một vòng O(n).</li>
<li>Tôi chạy được khung 6 bước trên LC 121 thành tiếng.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'The constraints say 1 ≤ n ≤ 2·10⁵. Your first idea checks every pair. What should you say?|||Ràng buộc ghi 1 ≤ n ≤ 2·10⁵. Ý tưởng đầu tiên của bạn là kiểm mọi cặp. Bạn nên nói gì?',
        options: [
          'It passes: pairs are only n(n−1)/2, half of n²|||Qua được: số cặp chỉ là n(n−1)/2, một nửa n²',
          'Too slow: about 2·10¹⁰ pairs, minutes at 10⁸ steps/s — I need O(n log n) or O(n)|||Quá chậm: khoảng 2·10¹⁰ cặp, mất vài phút ở 10⁸ bước/giây — cần O(n log n) hoặc O(n)',
          'It depends on the language: Java is fast enough for O(n²)|||Tuỳ ngôn ngữ: Java đủ nhanh cho O(n²)',
          'It passes if I break out of the loop as soon as I find the answer|||Qua được nếu thoát vòng lặp ngay khi tìm thấy đáp án',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: n(n−1)/2 at n = 2·10⁵ is about 2·10¹⁰ — halving n² does not change the class, and at ~10⁸ steps/s that is minutes. Java’s constant is smaller (our measurement: ~2.8·10⁸ steps/s) but not 100× smaller. Breaking early does not help the worst case, which is what judges test.|||VI: n(n−1)/2 với n = 2·10⁵ là khoảng 2·10¹⁰ — chia đôi n² không đổi được hạng, và ở ~10⁸ bước/giây là vài phút. Hằng số của Java nhỏ hơn (số đo: ~2,8·10⁸ bước/giây) nhưng không nhỏ hơn 100 lần. Thoát sớm không cứu được trường hợp xấu nhất — thứ máy chấm luôn test.',
      },
      {
        question: 'How many times does the inner body run for n = 16?\nfor (i = 0; i < n; i++) for (j = i + 1; j < n; j++) count++|||Với n = 16, thân vòng trong chạy bao nhiêu lần?\nfor (i = 0; i < n; i++) for (j = i + 1; j < n; j++) count++',
        options: ['64', '256', '128', '120'],
        correctIndex: 3, points: 1,
        explanation: 'EN: Every pair once: n(n−1)/2 = 16·15/2 = 120 — the measured output of dem-vong.ts. 256 is the full n×n loop (j from 0); 64 is n·log₂n, the shape with j *= 2.|||VI: Mỗi cặp một lần: n(n−1)/2 = 16·15/2 = 120 — đúng output đo được của dem-vong.ts. 256 là vòng n×n đầy đủ (j từ 0); 64 là n·log₂n, dạng có j *= 2.',
      },
      {
        question: 'Naive recursive fib made 21,891 calls for n = 20 and 2,692,537 for n = 30. Roughly how many for n = 40?|||Fib đệ quy ngây thơ gọi 21.891 lần với n = 20 và 2.692.537 lần với n = 30. Với n = 40 khoảng bao nhiêu?',
        options: [
          'About 3·10⁸ — each +10 multiplies the calls by ~123|||Khoảng 3·10⁸ — mỗi lần +10 nhân số lời gọi lên ~123',
          'About 3.6·10⁶ — the calls grow by about 900,000 every +10|||Khoảng 3,6·10⁶ — số lời gọi tăng khoảng 900.000 mỗi lần +10',
          'About 5.4·10⁶ — doubling n doubles the work|||Khoảng 5,4·10⁶ — gấp đôi n thì gấp đôi khối lượng',
          'About 2.7·10¹² — each +10 squares the calls|||Khoảng 2,7·10¹² — mỗi lần +10 bình phương số lời gọi',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: 2,692,537 / 21,891 ≈ 123, the same ratio as from n = 10 (177 calls) to 20. Exponential growth multiplies by a constant per fixed step: 2,692,537 × 123 ≈ 3.3·10⁸. The "+900,000" option treats it as linear, the most common misreading.|||VI: 2.692.537 / 21.891 ≈ 123, đúng tỉ số từ n = 10 (177 lời gọi) lên 20. Tăng theo hàm mũ là nhân một hằng số mỗi bước cố định: 2.692.537 × 123 ≈ 3,3·10⁸. Phương án "+900.000" coi nó là tuyến tính — cách đọc sai hay gặp nhất.',
      },
      {
        question: 'A teammate removes duplicates with: for (const x of a) if (!out.includes(x)) out.push(x). On 100,000 distinct numbers it took ~1.1 s. Complexity?|||Một bạn cùng nhóm khử trùng bằng: for (const x of a) if (!out.includes(x)) out.push(x). Với 100.000 số khác nhau mất ~1,1 giây. Độ phức tạp?',
        options: [
          'O(n) — there is only one loop|||O(n) — chỉ có một vòng lặp',
          'O(n log n) — includes uses binary search|||O(n log n) — includes dùng tìm kiếm nhị phân',
          'O(n²) — includes scans out on every iteration|||O(n²) — includes quét out ở mỗi vòng',
          'O(1) amortised — push is amortised O(1)|||O(1) khấu hao — push là O(1) khấu hao',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: includes is a linear scan of an unsorted array, so the loop hides a second loop: O(n²). Measured: 10.9 ms at 10⁴ → 1,093 ms at 10⁵ (×100 for ×10). "Only one loop" is the trap: count library calls too. A Set makes it O(n).|||VI: includes là phép quét tuyến tính trên mảng chưa sắp xếp, nên vòng lặp giấu một vòng thứ hai: O(n²). Số đo: 10,9 ms ở 10⁴ → 1.093 ms ở 10⁵ (×100 khi ×10). "Chỉ một vòng" là cái bẫy: phải đếm cả lời gọi thư viện. Dùng Set thì thành O(n).',
      },
      {
        question: 'You have clarified the problem and worked two examples. What is the next step of the framework?|||Bạn đã hỏi làm rõ đề và giải tay hai ví dụ. Bước tiếp theo của khung là gì?',
        options: [
          'Start coding the optimal solution so there is time to test|||Code ngay lời giải tối ưu để còn thời gian test',
          'State the brute force and its complexity, then look for the repeated work|||Nói lời giải vét cạn và độ phức tạp của nó, rồi tìm phần việc bị lặp',
          'Code the brute force fully so you have something working|||Code đầy đủ bản vét cạn để có cái gì đó chạy được',
          'Ask the interviewer which pattern the problem uses|||Hỏi người phỏng vấn đề này dùng mẫu bài nào',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Step 3 is saying (not coding) the brute force with its complexity: it proves understanding and is the baseline for step 4. Coding it fully wastes 10 minutes on something you will throw away — do it only if asked or if you truly cannot improve it.|||VI: Bước 3 là NÓI (không code) bản vét cạn kèm độ phức tạp: nó chứng tỏ bạn hiểu đề và là mốc cho bước 4. Code đầy đủ nó phí 10 phút cho thứ sẽ vứt đi — chỉ làm khi được yêu cầu hoặc khi thật sự không cải tiến được.',
      },
      {
        question: 'Your JavaScript BFS uses queue.shift() and is slow on 100,000 nodes (we measured 846 ms just to drain such a queue). Best fix?|||BFS bằng JavaScript của bạn dùng queue.shift() và chậm với 100.000 đỉnh (đo được 846 ms chỉ để rút hết một hàng đợi như vậy). Sửa thế nào tốt nhất?',
        options: [
          'Keep the array and move a head index instead of shifting|||Giữ mảng và dời một chỉ số đầu hàng thay vì shift',
          'Use unshift() to add and pop() to remove|||Dùng unshift() để thêm và pop() để lấy ra',
          'Sort the queue before each shift|||Sắp xếp hàng đợi trước mỗi lần shift',
          'Convert the queue to a Set|||Đổi hàng đợi thành Set',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: shift() moves every remaining element: O(n) per call. A head pointer makes dequeue O(1) (0.17 ms in the same measurement). unshift() has exactly the same O(n) problem at the other end; a Set has no order guarantee for a queue in this sense and does not allow duplicates.|||VI: shift() dời mọi phần tử còn lại: O(n) mỗi lần gọi. Một con trỏ đầu hàng làm thao tác lấy ra thành O(1) (0,17 ms trong cùng phép đo). unshift() mắc đúng bệnh O(n) đó ở đầu kia; Set không phải hàng đợi và không cho phần tử trùng.',
      },
      {
        question: 'A function loops over an array of n items, then, separately, over a list of m items. Its time complexity?|||Một hàm lặp qua mảng n phần tử, rồi lặp riêng qua danh sách m phần tử. Độ phức tạp thời gian?',
        options: ['O(n·m)', 'O(max(n, m)²)', 'O(n²)', 'O(n + m)'],
        correctIndex: 3, points: 1,
        explanation: 'EN: Loops one after the other add: n + m (measured: twoLoops(16,16) = 32). Multiplication (n·m) is for a loop inside a loop. O(n + m) and O(max(n, m)) are the same class, but O(n + m) says more clearly what grows.|||VI: Hai vòng nối tiếp thì cộng: n + m (đo: twoLoops(16,16) = 32). Phép nhân (n·m) dành cho vòng trong vòng. O(n + m) và O(max(n, m)) cùng hạng, nhưng O(n + m) nói rõ hơn cái gì tăng.',
      },
      {
        question: 'For LC 121, why is [2, 4, 1, 3] (expected answer 2) a valuable test case?|||Với LC 121, vì sao [2, 4, 1, 3] (đáp án 2) là một ca test giá trị?',
        options: [
          'It is close to the largest input the constraints allow, so it checks the speed|||Nó gần với đầu vào lớn nhất ràng buộc cho phép, nên nó kiểm được tốc độ',
          'It contains duplicate prices, which break a solution that stores prices in a hash map|||Nó có giá trùng nhau, làm hỏng lời giải lưu giá vào hash map',
          'The global minimum comes after the best pair, so "max − min" gives the wrong answer|||Giá nhỏ nhất toàn cục đến sau cặp tốt nhất, nên "max − min" cho sai đáp án',
          'It makes the best profit negative, and the function must return that negative number|||Nó làm lợi nhuận tốt nhất bị âm, và hàm phải trả về đúng số âm đó',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: max − min would be 4 − 1 = 3, but you cannot buy at 1 (day 2) and sell at 4 (day 1). The correct answer is 2 (buy 2, sell 4, or buy 1, sell 3). A test that separates a tempting wrong idea from the right one is worth more than ten random ones. Profit is never negative: 0 means "do not trade".|||VI: max − min sẽ là 4 − 1 = 3, nhưng không thể mua ở 1 (ngày 2) rồi bán ở 4 (ngày 1). Đáp án đúng là 2 (mua 2 bán 4, hoặc mua 1 bán 3). Một ca test tách được ý tưởng sai-mà-hấp-dẫn khỏi ý đúng đáng giá hơn mười ca ngẫu nhiên. Lợi nhuận không bao giờ âm: 0 nghĩa là "không giao dịch".',
      },
      {
        question: 'A "recruiter" sends a GitHub repo and asks you to run npm install && npm start before the interview. What do you do?|||Một "nhà tuyển dụng" gửi repo GitHub và bảo bạn chạy npm install && npm start trước buổi phỏng vấn. Bạn làm gì?',
        options: [
          'Verify the sender, read the package.json scripts, and run it only in a throw-away VM|||Kiểm người gửi, đọc scripts trong package.json, và chỉ chạy trong máy ảo dùng một lần',
          'Run it as asked: the npm registry scans every package for malware before it lets you install it|||Cứ chạy như được bảo: kho npm đã quét mã độc mọi gói trước khi cho bạn cài',
          'Run it with sudo, so the project runs as the system user and cannot touch your own files|||Chạy bằng sudo, để dự án chạy dưới quyền hệ thống và không đụng được tệp của bạn',
          'Run it on your laptop but turn off Wi-Fi first, then turn it back on when the call starts|||Chạy trên laptop nhưng tắt Wi-Fi trước, rồi bật lại khi cuộc gọi bắt đầu',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: This is the "Contagious Interview" pattern documented by Unit 42 since 2023: the project carries malware (BeaverTail) that runs on install/start. npm does not vet packages; sudo gives it MORE power; turning Wi-Fi back on lets it phone home later. Real coding rounds run in the company’s platform or a blank file.|||VI: Đây đúng là kiểu "Contagious Interview" Unit 42 ghi nhận từ 2023: dự án mang mã độc (BeaverTail) chạy khi cài/khởi động. npm không kiểm duyệt gói; sudo cho nó NHIỀU quyền hơn; bật lại Wi-Fi là để nó gửi dữ liệu về sau. Vòng coding thật chạy trên nền tảng của công ty hoặc một tệp trắng.',
      },
      {
        question: 'Which of these is NOT one of the four axes interviewers commonly score?|||Cái nào KHÔNG phải một trong bốn trục người phỏng vấn thường chấm?',
        options: [
          'Communication — clarifying, explaining trade-offs|||Communication — hỏi làm rõ, giải thích đánh đổi',
          'How many LeetCode problems you have solved|||Bạn đã giải bao nhiêu đề LeetCode',
          'Testing — checking normal and edge cases, fixing your own bugs|||Testing — kiểm ca thường và ca biên, tự sửa lỗi',
          'Problem solving — a systematic path to an efficient solution|||Problem solving — con đường có hệ thống tới lời giải hiệu quả',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The four axes are communication, problem solving, technical competency and testing. Your problem count is invisible to the interviewer and only matters through those four — which is why memorising problems fails.|||VI: Bốn trục là giao tiếp, giải quyết vấn đề, năng lực kỹ thuật và kiểm thử. Số đề bạn đã giải thì người phỏng vấn không nhìn thấy, nó chỉ có ý nghĩa qua bốn trục kia — vì thế học thuộc đề thất bại.',
      },
    ],
  },
};
