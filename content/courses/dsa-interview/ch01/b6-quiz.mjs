/** Kiểm tra Chương 1 — 10 câu tình huống. Mọi output nhắc trong câu hỏi là output THẬT (../ma/ch01 + nháp $TMPDIR/dsa-nhap/ch01/quiz.ts). */
export default {
  title: '1.6 — Chapter 1 check|||1.6 — Kiểm tra Chương 1',
  slug: 'dsa-1-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về tổng tiền tố, hiệu mảng, comparator, tính ổn định, top-k và thao tác bit — đọc mã đoán output, chọn mẫu cho đề lạ, tìm lỗi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Chapter 1 check</h2>
<p class="lead">Ten situations, fifteen minutes. Several questions show real code and ask what it prints — every output quoted here was produced by actually running it. Each explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write Subarray Sum Equals K with a prefix-count map and explain the <code>{0: 1}</code> entry.</li>
<li>I can say when a sliding window fails and a prefix sum is needed instead.</li>
<li>I can turn "many range updates" into a difference array and one prefix pass.</li>
<li>I can write a correct numeric comparator in TypeScript and in Java, and explain stability.</li>
<li>I can solve Top K Frequent in O(n log n) and in O(n), and say why the O(n) version is possible.</li>
<li>I know what XOR, <code>n &amp; (n − 1)</code> and a bitmask do, and the 32-bit trap in JavaScript.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Kiểm tra Chương 1</h2>
<p class="lead">Mười tình huống, mười lăm phút. Nhiều câu cho mã thật và hỏi nó in ra gì — mọi output nhắc tới ở đây đều do chạy thật mà có. Mỗi lời giải thích nói vì sao đáp án đúng là đúng, và vì sao phương án hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được Subarray Sum Equals K bằng map đếm tiền tố và giải thích được mục <code>{0: 1}</code>.</li>
<li>Tôi nói được khi nào cửa sổ trượt thất bại và phải dùng tổng tiền tố.</li>
<li>Tôi biến được "rất nhiều lần cập nhật đoạn" thành hiệu mảng và một lượt cộng dồn.</li>
<li>Tôi viết được comparator số đúng trong TypeScript và Java, và giải thích được tính ổn định.</li>
<li>Tôi giải được Top K Frequent trong O(n log n) và O(n), và nói được vì sao bản O(n) khả thi.</li>
<li>Tôi biết XOR, <code>n &amp; (n − 1)</code> và bitmask làm gì, và cái bẫy 32-bit của JavaScript.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Your LC 560 solution (prefix sums + a count map) returns 2 for nums = [1, 2, -1, 3, -2, 2], k = 3. The expected answer is 4. Which bug produces exactly this?|||Lời giải LC 560 của bạn (tổng tiền tố + map đếm) trả về 2 với nums = [1, 2, -1, 3, -2, 2], k = 3. Đáp án đúng là 4. Lỗi nào sinh ra đúng kết quả này?',
        options: [
          'The map starts empty instead of {0: 1}, so subarrays that start at index 0 are never counted|||Map khởi tạo rỗng thay vì {0: 1}, nên mảng con bắt đầu ở chỉ số 0 không bao giờ được đếm',
          'The current sum is inserted into the map before seen[sum − k] is added to the answer|||Tổng hiện tại được cất vào map trước khi cộng seen[sum − k] vào đáp án',
          'The map keeps the first index of each prefix sum instead of how many times it appeared|||Map giữ chỉ số đầu tiên của mỗi tổng tiền tố thay vì số lần nó xuất hiện',
          'The Java prefix sum is an int and it overflowed on this input|||Tổng tiền tố trong Java là int và đã bị tràn với đầu vào này',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Running the version without {0: 1} prints exactly 2: the two subarrays that start at index 0 ([1, 2] and [1, 2, -1, 3, -2]) need the empty prefix 0 as their partner. Inserting before counting is a real bug too, but it only shows when k = 0 (our run: [0, 0, 0], k = 0 gives 9 instead of 6); with k = 3 it still prints 4. Overflow is impossible with values this small.|||VI: Chạy bản thiếu {0: 1} in ra đúng 2: hai mảng con bắt đầu ở chỉ số 0 ([1, 2] và [1, 2, -1, 3, -2]) cần tiền tố rỗng 0 làm "người còn lại". Cất trước rồi mới đếm cũng là lỗi thật, nhưng chỉ lộ khi k = 0 (chạy thật: [0, 0, 0], k = 0 cho 9 thay vì 6); với k = 3 nó vẫn in 4. Tràn số là không thể với giá trị nhỏ như vậy.',
      },
      {
        question: 'Constraints: n ≤ 10⁵, values between −10⁴ and 10⁴. Count the contiguous subarrays whose sum is divisible by k. Which plan do you propose?|||Ràng buộc: n ≤ 10⁵, giá trị từ −10⁴ tới 10⁴. Đếm số mảng con liên tiếp có tổng chia hết cho k. Bạn đề xuất hướng nào?',
        options: [
          'A sliding window: grow the right end, shrink the left end while the sum is too big — O(n)|||Cửa sổ trượt: nới đầu phải, co đầu trái khi tổng quá lớn — O(n)',
          'Sort the array, then two pointers from both ends — O(n log n)|||Sắp xếp mảng, rồi hai con trỏ từ hai đầu — O(n log n)',
          'Prefix sums mod k in a count map starting {0: 1}, normalising negative remainders — O(n)|||Tổng tiền tố mod k trong map đếm khởi tạo {0: 1}, chuẩn hoá số dư âm — O(n)',
          'Every start with a running sum to the right — O(n²), fast enough for 10⁵|||Mỗi điểm đầu kéo một tổng chạy sang phải — O(n²), đủ nhanh với 10⁵',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Two prefixes with the same remainder differ by a multiple of k — count remainders like LC 974, and fix the sign because -7 % 5 is -2 in both JavaScript and Java. A window needs all values positive (negatives here). Sorting destroys contiguity, so the subarrays are no longer the same. O(n²) at n = 10⁵ is 10¹⁰ steps: minutes, not a second.|||VI: Hai tiền tố cùng số dư thì chênh nhau một bội của k — đếm số dư như LC 974, và sửa dấu vì -7 % 5 là -2 ở cả JavaScript lẫn Java. Cửa sổ trượt cần mọi giá trị dương (ở đây có số âm). Sắp xếp phá tính liên tiếp, các mảng con không còn là chúng nữa. O(n²) với n = 10⁵ là 10¹⁰ bước: vài phút, không phải một giây.',
      },
      {
        question: 'What does this print in Node?\nconsole.log([10, 9, 1].sort())|||Đoạn này in ra gì trong Node?\nconsole.log([10, 9, 1].sort())',
        options: ['[1, 9, 10]', '[1, 10, 9]', '[10, 9, 1]', 'TypeError: a comparator is required|||TypeError: cần truyền comparator'],
        correctIndex: 1, points: 1,
        explanation: 'EN: Without a comparator, Array.prototype.sort converts elements to strings and compares them as text: "1" < "10" < "9". Our run printed [1,10,9]. The fix for numbers is .sort((a, b) => a - b). There is no error — that is what makes the bug survive small tests like [3, 1, 2].|||VI: Không có comparator, Array.prototype.sort đổi phần tử thành chuỗi rồi so như văn bản: "1" < "10" < "9". Chạy thật in ra [1,10,9]. Cách sửa cho số là .sort((a, b) => a - b). Không có lỗi nào văng ra — chính vì vậy lỗi sống sót qua các test nhỏ như [3, 1, 2].',
      },
      {
        question: 'Java:\nInteger[] xs = {2_000_000_000, -2_000_000_000, 0};\nArrays.sort(xs, (p, q) -> p - q);\nSystem.out.println(Arrays.toString(xs));\nWhat is printed?|||Java:\nInteger[] xs = {2_000_000_000, -2_000_000_000, 0};\nArrays.sort(xs, (p, q) -> p - q);\nSystem.out.println(Arrays.toString(xs));\nIn ra gì?',
        options: ['[-2000000000, 0, 2000000000]', '[2000000000, 0, -2000000000]', 'ArithmeticException: integer overflow', '[2000000000, -2000000000, 0]'],
        correctIndex: 3, points: 1,
        explanation: 'EN: 2,000,000,000 − (−2,000,000,000) overflows int and wraps to −294,967,296, so the comparator claims the big number is smaller; the order it produces is simply wrong — our run printed [2000000000, -2000000000, 0]. int subtraction never throws (only Math.subtractExact does). Use Integer.compare(p, q) — LC 452 is built to catch exactly this.|||VI: 2.000.000.000 − (−2.000.000.000) tràn int và quay vòng thành −294.967.296, nên comparator khẳng định số lớn là nhỏ hơn; thứ tự nó tạo ra đơn giản là sai — chạy thật in ra [2000000000, -2000000000, 0]. Phép trừ int không bao giờ ném lỗi (chỉ Math.subtractExact mới ném). Dùng Integer.compare(p, q) — đề LC 452 được dựng ra để bắt đúng lỗi này.',
      },
      {
        question: 'A list already ordered by name — An:8 Bao:8 Chi:9 Duc:7 Lan:7 Minh:8 — is sorted by score, high to low, with a hand-written selection sort. The result starts Chi:9 Bao:8 An:8. Why is Bao now before An?|||Một danh sách đã xếp theo tên — An:8 Bao:8 Chi:9 Duc:7 Lan:7 Minh:8 — được sắp theo điểm từ cao xuống thấp bằng selection sort tự viết. Kết quả bắt đầu bằng Chi:9 Bao:8 An:8. Vì sao Bao lại đứng trước An?',
        options: [
          'The comparator should have compared names with localeCompare|||Comparator lẽ ra phải so tên bằng localeCompare',
          'JavaScript’s Array.prototype.sort is not stable|||Array.prototype.sort của JavaScript không ổn định',
          'Selection sort is not stable: swapping An (index 0) with Chi (index 2) moved An past Bao|||Selection sort không ổn định: đổi chỗ An (chỉ số 0) với Chi (chỉ số 2) đẩy An vượt qua Bao',
          'Equal scores end up in random order with every sorting algorithm|||Với mọi thuật toán sắp xếp, các điểm bằng nhau đều ra thứ tự ngẫu nhiên',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Our run of sort-on-dinh.ts printed exactly "Chi:9 Bao:8 An:8 …" for the selection sort, while the built-in stable sort printed "Chi:9 An:8 Bao:8 …". A long-distance swap can jump over an equal element. Array.prototype.sort has been required to be stable since ES2019, and stable algorithms (merge sort, TimSort, insertion sort) never reorder equal elements.|||VI: Chạy thật sort-on-dinh.ts in ra đúng "Chi:9 Bao:8 An:8 …" với selection sort, còn phép sắp ổn định có sẵn in "Chi:9 An:8 Bao:8 …". Một phép đổi chỗ ở xa có thể nhảy qua đầu một phần tử bằng nó. Array.prototype.sort bắt buộc ổn định từ ES2019, và các thuật toán ổn định (merge sort, TimSort, insertion sort) không bao giờ đảo thứ tự các phần tử bằng nhau.',
      },
      {
        question: 'Lab bookings as half-open hours: [0, 2), [1, 5), [1, 3), [4, 6), over 6 hours (indices 0–5). With diff[enter] += 1, diff[leave] −= 1 and one prefix pass, how many students are in the lab at each hour?|||Các lượt đặt phòng lab theo giờ, dạng nửa mở: [0, 2), [1, 5), [1, 3), [4, 6), trong 6 giờ (chỉ số 0–5). Dùng diff[giờ vào] += 1, diff[giờ ra] −= 1 rồi một lượt cộng dồn, mỗi giờ có bao nhiêu sinh viên trong phòng?',
        options: ['[1, 3, 2, 1, 2, 1]', '[1, 3, 3, 2, 2, 2]', '[1, 2, -1, -1, 1, -1]', '[2, 3, 2, 1, 1, 1]'],
        correctIndex: 0, points: 1,
        explanation: 'EN: diff = [1, 2, -1, -1, 1, -1, -1]; its running sums over hours 0–5 are [1, 3, 2, 1, 2, 1] (checked by running it). [1, 3, 3, 2, 2, 2] is what you get if you treat the leave hour as still inside (inclusive ranges). [1, 2, -1, -1, 1, -1] is the diff array itself — the prefix pass was forgotten.|||VI: diff = [1, 2, -1, -1, 1, -1, -1]; cộng dồn trên giờ 0–5 được [1, 3, 2, 1, 2, 1] (đã chạy thật để kiểm). [1, 3, 3, 2, 2, 2] là kết quả khi coi giờ ra vẫn nằm trong khoảng (đoạn đóng). [1, 2, -1, -1, 1, -1] là chính mảng diff — quên lượt cộng dồn.',
      },
      {
        question: 'P is the (m+1)×(n+1) 2-D prefix table: P[r][c] = sum of rows < r and columns < c. Which expression gives the sum of rows r1..r2 and columns c1..c2, both inclusive?|||P là bảng tiền tố 2D cỡ (m+1)×(n+1): P[r][c] = tổng các hàng < r và các cột < c. Biểu thức nào cho tổng các hàng r1..r2 và cột c1..c2, tính cả hai đầu?',
        options: [
          'P[r2][c2] − P[r1][c2] − P[r2][c1] + P[r1][c1]',
          'P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] − P[r1][c1]',
          'P[r2+1][c2+1] − P[r1−1][c2+1] − P[r2+1][c1−1] + P[r1−1][c1−1]',
          'P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1]',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Inclusion–exclusion: take the big rectangle, cut the rows above and the columns to the left, then add back the corner that was cut twice. On the lesson’s matrix, sumRegion(1, 1, 2, 2) = 21 − 4 − 9 + 3 = 11, the real output. The second option subtracts the corner a third time (gives 5); the first misses row r2 and column c2; the third is the formula for a table WITHOUT the extra zero row/column and reads index −1 when r1 = 0.|||VI: Bao hàm – loại trừ: lấy hình chữ nhật lớn, cắt các hàng phía trên và các cột bên trái, rồi cộng lại góc bị cắt hai lần. Với ma trận trong bài, sumRegion(1, 1, 2, 2) = 21 − 4 − 9 + 3 = 11, đúng output thật. Phương án thứ hai trừ góc thêm lần nữa (ra 5); phương án đầu bỏ sót hàng r2 và cột c2; phương án thứ ba là công thức cho bảng KHÔNG có hàng/cột số 0 thêm vào, và đọc chỉ số −1 khi r1 = 0.',
      },
      {
        question: 'What does this print in Node?\nconsole.log(2 ** 31 | 0)|||Đoạn này in ra gì trong Node?\nconsole.log(2 ** 31 | 0)',
        options: ['2147483648', '-2147483648', '0', '2147483647'],
        correctIndex: 1, points: 1,
        explanation: 'EN: Every bitwise operator in JavaScript first converts its operands to 32-bit SIGNED integers. 2³¹ does not fit; its bit pattern is a 1 followed by 31 zeros, which in two’s complement is −2³¹. Our run printed -2147483648. To keep unsigned 32-bit values use >>> 0 (−1 >>> 0 printed 4294967295) — the trick this website’s CIDR check (src/utils/cidr.ts) relies on.|||VI: Mọi toán tử bit trong JavaScript đều đổi toán hạng thành số nguyên 32 bit CÓ DẤU trước. 2³¹ không vừa; mẫu bit của nó là một số 1 theo sau 31 số 0, mà trong bù hai đó là −2³¹. Chạy thật in ra -2147483648. Muốn giữ giá trị 32 bit không dấu thì dùng >>> 0 (−1 >>> 0 in ra 4294967295) — đúng mẹo mà phần kiểm CIDR của trang này (src/utils/cidr.ts) dựa vào.',
      },
      {
        question: 'isPowerOfTwo = (n) => (n & (n - 1)) === 0. For which input does it return a WRONG answer?|||isPowerOfTwo = (n) => (n & (n - 1)) === 0. Với đầu vào nào nó trả lời SAI?',
        options: ['0', '1', '1024', '6'],
        correctIndex: 0, points: 1,
        explanation: 'EN: n & (n − 1) clears the lowest 1-bit, so the test asks "at most one 1-bit". 0 has no 1-bit at all, so it returns true although 0 is not a power of two (our run: 0 → true). 1 = 2⁰ and 1024 = 2¹⁰ are correctly true, 6 = 110₂ is correctly false. In JavaScript −2³¹ also returns true. Fix: n > 0 && (n & (n − 1)) === 0.|||VI: n & (n − 1) xoá bit 1 thấp nhất, nên phép kiểm hỏi "có nhiều nhất một bit 1". 0 không có bit 1 nào, nên nó trả true dù 0 không phải luỹ thừa của 2 (chạy thật: 0 → true). 1 = 2⁰ và 1024 = 2¹⁰ trả true là đúng, 6 = 110₂ trả false là đúng. Trong JavaScript −2³¹ cũng trả true. Cách sửa: n > 0 && (n & (n − 1)) === 0.',
      },
      {
        question: 'LC 347 Top K Frequent Elements, n ≤ 10⁵. You gave an O(n log n) sort; the interviewer asks for O(n). What makes the O(n) bucket solution possible?|||LC 347 Top K Frequent Elements, n ≤ 10⁵. Bạn đã đưa lời giải sắp xếp O(n log n); người phỏng vấn hỏi O(n). Điều gì làm lời giải xô O(n) khả thi?',
        options: [
          'The values themselves are small, so they can be used as array indices|||Bản thân các giá trị nhỏ, nên dùng được làm chỉ số mảng',
          'A hash map keeps its keys ordered by how often they were inserted|||Hash map giữ các khoá theo thứ tự số lần được chèn',
          'A heap of size k sorts the counts in O(n) time|||Một heap cỡ k sắp các số đếm trong O(n)',
          'Each count is an integer between 1 and n, so the count can be an array index|||Mỗi số đếm là số nguyên từ 1 tới n, nên chính số đếm làm được chỉ số mảng',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: bucket[c] holds the values seen exactly c times, and c is always in 1..n — so n + 1 buckets suffice and no comparison is needed. The values can be huge or negative, so they cannot be indices. A Map keeps insertion order, not frequency order. A heap of size k gives O(n log k), a good alternative but not O(n).|||VI: bucket[c] chứa các giá trị xuất hiện đúng c lần, và c luôn nằm trong 1..n — nên n + 1 xô là đủ và không cần phép so sánh nào. Các giá trị có thể rất lớn hoặc âm, nên không làm chỉ số được. Map giữ thứ tự chèn, không phải thứ tự tần suất. Heap cỡ k cho O(n log k), một phương án tốt nhưng không phải O(n).',
      },
    ],
  },
};
