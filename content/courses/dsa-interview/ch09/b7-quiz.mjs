/** 9.7 — Quiz Chương 9 (bài MỚI ★, slug dsa-9-7-quiz). Mọi output nhắc trong câu hỏi là output THẬT (các tệp .out trong ma/ch09/b1…b6). */
export default {
  title: '9.7 — Chapter 9 quiz: dynamic programming and greedy|||9.7 — Quiz Chương 9: quy hoạch động và tham lam',
  slug: 'dsa-9-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: đọc mã đoán output thật, chọn trạng thái, bẫy memo bằng 0, tràn số Java, thứ tự vòng lặp, cái túi một hàng, tham lam sai, ReDoS và khoá memo chậm — 15 phút.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Chapter 9 quiz: dynamic programming and greedy</h2>
<p class="lead">Ten questions in 15 minutes. None of them asks for a definition. You will read code and predict its real output, choose a state for a problem, find the bug in a solution that passes the examples, and decide when greedy is safe. Every number quoted here was produced by running the code of lessons 9.1–9.6.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write Climbing Stairs four ways (recursion, memo, table, two variables) and say the complexity of each.</li>
<li>I say state, transition, base case and order before I write DP code.</li>
<li>I know which DP family a problem belongs to (prefix, ending here, remaining amount, two sequences, knapsack, interval, grid, state machine).</li>
<li>I can explain why a one-row knapsack loops capacity downwards and why loop order changes a count.</li>
<li>I can show a counterexample before trusting a greedy rule, and test it against a DP or brute force.</li>
<li>I know the traps: falsy memo checks, int overflow, recursion depth, string memo keys.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Quiz</span>
<h2>Quiz Chương 9: quy hoạch động và tham lam</h2>
<p class="lead">Mười câu trong 15 phút. Không câu nào hỏi định nghĩa. Bạn sẽ đọc mã và đoán output thật, chọn trạng thái cho một đề, tìm lỗi trong một lời giải qua hết ví dụ, và quyết định lúc nào tham lam là an toàn. Mọi con số trong quiz đều sinh ra bằng cách chạy mã của các bài 9.1–9.6.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được Climbing Stairs bốn cách (đệ quy, nhớ, bảng, hai biến) và nói được độ phức tạp từng cách.</li>
<li>Tôi nói trạng thái, chuyển, ca cơ sở và thứ tự tính trước khi viết code DP.</li>
<li>Tôi xếp được một đề vào đúng họ DP (tiền tố, kết thúc tại đây, phần còn lại, hai dãy, cái túi, khoảng, lưới, máy trạng thái).</li>
<li>Tôi giải thích được vì sao cái túi một hàng chạy sức chứa từ trên xuống và vì sao thứ tự vòng lặp làm đổi kết quả đếm.</li>
<li>Tôi đưa ra được phản ví dụ trước khi tin một luật tham lam, và kiểm nó so với DP hoặc vét cạn.</li>
<li>Tôi biết các bẫy: tra memo kiểu truthy, tràn int, độ sâu đệ quy, khoá memo dạng chuỗi.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Ways to climb n steps using only 2-step and 4-step moves, memoised with if (memo[n]) return memo[n]; instead of memo[n] !== undefined. For n = 61 (odd, so the answer is 0), what does the real run show?|||Số cách leo n bậc chỉ bằng bước 2 và bước 4, có nhớ bằng if (memo[n]) return memo[n]; thay cho memo[n] !== undefined. Với n = 61 (lẻ, nên đáp án là 0), lần chạy thật cho thấy gì?',
        options: [
          'The same 63 calls as the correct version, because the 0 is stored in the array.|||Cùng 63 lời gọi như bản đúng, vì số 0 vẫn được cất trong mảng.',
          'Answer 0, but 7,049,155 calls instead of 63: every stored 0 is recomputed.|||Đáp án 0, nhưng 7.049.155 lời gọi thay vì 63: mọi số 0 đã cất bị tính lại.',
          'A wrong non-zero answer, because the zero entries get overwritten by later sums.|||Một đáp án khác 0 sai, vì các ô bằng 0 bị các tổng về sau ghi đè.',
          'RangeError, because the falsy check makes the recursion infinite for odd n.|||RangeError, vì phép kiểm truthy làm đệ quy vô hạn khi n lẻ.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: 0 is falsy, so a solved subproblem whose answer is 0 looks "not computed" and is solved again — and again. The answer stays correct (0), which is why the bug survives the examples, but the work grows exponentially: 7,049,155 calls versus 63 for n = 61. The recursion is not infinite (every call goes to a smaller n), so there is no RangeError; and nothing overwrites the zeros — they are simply never trusted.|||VI: 0 là giá trị falsy, nên một bài toán con đã giải có đáp án 0 trông như "chưa tính" và bị giải lại — lần này qua lần khác. Đáp án vẫn đúng (0), chính vì thế lỗi sống sót qua các ví dụ, nhưng khối lượng việc tăng theo hàm mũ: 7.049.155 lời gọi so với 63 với n = 61. Đệ quy không vô hạn (mỗi lời gọi đi về n nhỏ hơn), nên không có RangeError; và không có gì ghi đè các số 0 — chúng chỉ đơn giản là không bao giờ được tin.',
      },
      {
        question: 'A sign-up form checks names with a pattern shaped like /^(a+)+$/ in Node. Measured on "a".repeat(n) + "!": n = 18 took 1.8 ms, n = 27 took 908.7 ms. What is the right reading and fix?|||Một form đăng ký kiểm tên bằng mẫu có dạng /^(a+)+$/ trên Node. Đo trên "a".repeat(n) + "!": n = 18 mất 1,8 ms, n = 27 mất 908,7 ms. Cách đọc và cách sửa đúng là gì?',
        options: [
          'Linear growth with a large constant; caching the compiled RegExp object fixes it.|||Tăng tuyến tính với hằng số lớn; cache đối tượng RegExp đã biên dịch là sửa được.',
          'The engine is fine; the time goes into building the long test strings with repeat.|||Engine không sao; thời gian nằm ở việc dựng chuỗi thử dài bằng repeat.',
          'Quadratic growth; a per-IP rate limit on the form is a complete fix on its own.|||Tăng bậc hai; giới hạn tần suất theo IP cho form là đủ sửa hoàn toàn.',
          'Each extra character doubles the time (backtracking); avoid nested quantifiers and cap input length.|||Mỗi ký tự thêm làm thời gian gấp đôi (quay lui); tránh lượng từ lồng nhau và chặn độ dài đầu vào.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The run printed ×2.0 for every +1 character — 9 characters more, about 2⁹ = 512 times slower. That is exponential backtracking (ReDoS), the same disease as naive recursion without a memo; the DP for regex matching (LC 10) answers the same inputs in microseconds. Caching the RegExp does not change the algorithm, building a 27-character string is instant, and a rate limit only slows the attack: by the same doubling, a single 40-character request would cost about two hours of CPU.|||VI: Lần chạy in ×2,0 cho mỗi +1 ký tự — thêm 9 ký tự là chậm khoảng 2⁹ = 512 lần. Đó là quay lui hàm mũ (ReDoS), cùng bệnh với đệ quy ngây thơ không có memo; DP so khớp regex (LC 10) trả lời cùng đầu vào trong vài micro giây. Cache RegExp không đổi thuật toán, dựng chuỗi 27 ký tự là tức thì, còn giới hạn tần suất chỉ làm chậm cuộc tấn công: theo đúng tốc độ gấp đôi đó, một request 40 ký tự đã tốn chừng hai giờ CPU.',
      },
      {
        question: 'Java Coin Change: you initialise dp[a] = Integer.MAX_VALUE for a ≥ 1 and write dp[a] = Math.min(dp[a], dp[a - c] + 1). For coins = [2], amount = 3 (impossible), what does the real run print where −1 was expected?|||Coin Change bằng Java: bạn khởi tạo dp[a] = Integer.MAX_VALUE với a ≥ 1 và viết dp[a] = Math.min(dp[a], dp[a - c] + 1). Với coins = [2], amount = 3 (không đổi được), lần chạy thật in gì ở chỗ lẽ ra là −1?',
        options: ['-2147483648', '-1', '2147483647', '0'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: dp[1] stays MAX_VALUE, then dp[3] = min(MAX_VALUE, dp[1] + 1) and MAX_VALUE + 1 silently wraps to −2,147,483,648, which wins the min. The final "if dp[amount] == MAX_VALUE return −1" no longer fires. −1 is the tempting option because on coins = [5, 10], amount = 3 the wrong version happens to print −1 (no coin ever fits, so no +1 is executed). Fix: use amount + 1 as "infinity".|||VI: dp[1] giữ nguyên MAX_VALUE, rồi dp[3] = min(MAX_VALUE, dp[1] + 1) và MAX_VALUE + 1 lặng lẽ quay vòng thành −2.147.483.648, thắng luôn phép min. Câu "if dp[amount] == MAX_VALUE return −1" ở cuối không còn kích hoạt. −1 là phương án hấp dẫn vì với coins = [5, 10], amount = 3 bản sai tình cờ in −1 (không đồng nào vừa nên chẳng có phép +1 nào chạy). Cách sửa: dùng amount + 1 làm "vô cực".',
      },
      {
        question: 'Coin Change II with the coin loop outside — for (coin) for (a = coin..amount) dp[a] += dp[a − coin] — gives change(5, [1,2,5]) = 4. You swap the loops (amounts outside, coins inside). What does it return now?|||Coin Change II với vòng đồng xu ở ngoài — for (coin) for (a = coin..amount) dp[a] += dp[a − coin] — cho change(5, [1,2,5]) = 4. Bạn đổi chỗ hai vòng (số tiền ở ngoài, đồng xu ở trong). Giờ nó trả về gì?',
        options: [
          '4, because addition is commutative and the order of loops cannot change a count.|||4, vì phép cộng giao hoán nên thứ tự vòng lặp không thể làm đổi kết quả đếm.',
          '5, because the swapped version also counts the coin 5 being used twice.|||5, vì bản đổi chỗ đếm thêm cả trường hợp dùng đồng 5 hai lần.',
          '9, because it now counts ordered sequences: 1+2+2 and 2+1+2 are different.|||9, vì giờ nó đếm dãy có thứ tự: 1+2+2 và 2+1+2 là khác nhau.',
          '3, because it misses the combinations that reuse the smallest coin.|||3, vì nó bỏ sót các tổ hợp dùng lại đồng nhỏ nhất.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: With coins outside, each combination is built in one fixed coin order, so it is counted once (4). With amounts outside, every dp[a] may end with any coin, so each ORDER is a different path: the real run lists 9 sequences — that is LC 377 Combination Sum IV. The additions are commutative, but which partial sums exist when dp[a] is read is not. Using 5 twice would exceed the amount, so 5 is impossible.|||VI: Khi đồng xu ở ngoài, mỗi tổ hợp được dựng theo một thứ tự đồng xu cố định nên chỉ được đếm một lần (4). Khi số tiền ở ngoài, mỗi dp[a] có thể kết thúc bằng bất kỳ đồng nào, nên mỗi THỨ TỰ là một đường khác nhau: lần chạy thật liệt kê 9 dãy — đó là LC 377 Combination Sum IV. Phép cộng giao hoán, nhưng việc những tổng con nào đã có lúc dp[a] được đọc thì không. Dùng đồng 5 hai lần thì vượt số tiền, nên 5 là không thể.',
      },
      {
        question: 'A vending machine has coins [1, 3, 4] and always gives the largest coin that still fits. Which statement matches the real runs?|||Một máy bán hàng có các đồng [1, 3, 4] và luôn trả đồng lớn nhất còn vừa. Câu nào khớp với các lần chạy thật?',
        options: [
          'Greedy is optimal for any coin set that contains 1, since 1 can always fill the gap.|||Tham lam tối ưu với mọi bộ đồng có chứa 1, vì đồng 1 luôn lấp được chỗ thiếu.',
          'For 6 it gives 4+1+1 (3 coins) while 3+3 needs 2; on 1..10,000 it is worse 2,499 times.|||Với 6 nó trả 4+1+1 (3 đồng) trong khi 3+3 chỉ cần 2; trên 1..10.000 nó tệ hơn 2.499 lần.',
          'It is wrong only for a few small amounts; above 100 greedy and DP always agree.|||Nó chỉ sai ở vài số tiền nhỏ; trên 100 thì tham lam và DP luôn trùng nhau.',
          'It fails at 6, and a VND-like set [1,2,5,10,…,500] fails just as often on 1..10,000.|||Nó sai ở 6, và bộ kiểu VNĐ [1,2,5,10,…,500] cũng sai nhiều như vậy trên 1..10.000.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Containing 1 guarantees that greedy finds SOME answer, not the fewest coins. The run found 2,499 bad amounts out of 10,000, the first ten being 6, 10, 14, …, 42 — so the failures never stop. The VND-like canonical set had 0 mismatches on the same range, which is exactly why cashiers can be greedy and this machine cannot.|||VI: Có đồng 1 chỉ bảo đảm tham lam tìm được MỘT cách trả, không phải cách ít đồng nhất. Lần chạy tìm ra 2.499 số tiền sai trên 10.000, mười số đầu là 6, 10, 14, …, 42 — tức là các chỗ sai không bao giờ dừng. Bộ kiểu VNĐ (hệ chính tắc) có 0 chỗ lệch trên cùng dải, đó chính là lý do thu ngân được phép tham lam còn cái máy này thì không.',
      },
      {
        question: 'Maximal Square: find the largest square made only of 1s in a 0/1 grid. Which state gives an O(1) transition from neighbouring cells?|||Maximal Square: tìm hình vuông lớn nhất chỉ gồm số 1 trên lưới 0/1. Trạng thái nào cho công thức chuyển O(1) từ các ô láng giềng?',
        options: [
          'dp[r][c] = area of the largest square anywhere inside the top-left part up to (r, c).|||dp[r][c] = diện tích hình vuông lớn nhất ở bất kỳ đâu trong phần trên-trái tới (r, c).',
          'dp[r][c] = number of 1s in the top-left part (a 2D prefix sum), then compare areas.|||dp[r][c] = số ô 1 trong phần trên-trái (tổng tiền tố 2D), rồi so các diện tích.',
          'dp[r][c] = area of the largest square ending at (r, c), as the min of three areas + 1.|||dp[r][c] = diện tích hình vuông lớn nhất kết thúc tại (r, c), bằng min ba diện tích + 1.',
          'dp[r][c] = side of the largest all-1 square whose bottom-right corner is (r, c).|||dp[r][c] = cạnh của hình vuông toàn 1 lớn nhất có góc dưới-phải tại (r, c).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: "Ending here" with the SIDE gives dp = 1 + min(up, left, up-left): three side-2 squares glue into a side-3 square, and any smaller neighbour means a hole. With areas, min(4, 4, 4) + 1 = 5 is not even a square. A prefix "best anywhere" has no transition (it says nothing about the current cell), and prefix sums can test one candidate square in O(1) but still have to try sizes.|||VI: "Kết thúc tại đây" với CẠNH cho dp = 1 + min(trên, trái, chéo): ba hình vuông cạnh 2 dán thành một hình cạnh 3, và một láng giềng nhỏ hơn nghĩa là có lỗ. Dùng diện tích thì min(4, 4, 4) + 1 = 5, còn chẳng phải số chính phương. "Tốt nhất ở đâu đó" kiểu tiền tố không có công thức chuyển (nó chẳng nói gì về ô hiện tại), còn tổng tiền tố kiểm được một hình vuông ứng viên trong O(1) nhưng vẫn phải thử các kích thước.',
      },
      {
        question: 'Your Stock-with-Cooldown solution keeps two variables, hold and free. It returns 0 on [5,4,3,2,1] and 0 on [1], but 4 on [1,2,3,0,2], where the answer is 3. What is the root cause?|||Lời giải Stock with Cooldown của bạn giữ hai biến, hold và free. Nó trả 0 trên [5,4,3,2,1] và 0 trên [1], nhưng 4 trên [1,2,3,0,2], nơi đáp án là 3. Nguyên nhân gốc là gì?',
        options: [
          'The state misses a dimension: it cannot tell "sold today", so it buys the next day.|||Trạng thái thiếu một chiều: nó không phân biệt "vừa bán hôm nay", nên mua ngay hôm sau.',
          'hold should start at 0 instead of −∞, otherwise the first purchase is counted twice.|||hold phải khởi đầu bằng 0 thay vì −∞, không thì lần mua đầu bị tính hai lần.',
          'The two updates must run in the other order so that each reads today’s value.|||Hai phép cập nhật phải chạy theo thứ tự ngược lại để mỗi cái đọc giá trị hôm nay.',
          'Integer overflow happens when −∞ is added to a price in the sell transition.|||Tràn số xảy ra khi cộng −∞ với một giá ở mũi chuyển bán.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Profit 4 = sell on day 2 at 3, buy on day 3 at 0, sell at 2 — buying the day after a sale, which the rules forbid. The future ("may I buy tomorrow?") depends on a fact the state does not record. Adding the third state (hold / sold / rest) gives 3, and a brute force over all action sequences agreed on 2,000 random cases. hold = 0 would mean owning a share for free (wrong in the other direction); in TypeScript −∞ + price is just −∞, no overflow.|||VI: Lãi 4 = bán ngày 2 giá 3, mua ngày 3 giá 0, bán giá 2 — tức mua ngay hôm sau một lần bán, điều luật chơi cấm. Tương lai ("mai có được mua không?") phụ thuộc vào một sự thật mà trạng thái không ghi lại. Thêm trạng thái thứ ba (hold / sold / rest) cho ra 3, và vét cạn mọi chuỗi hành động khớp trên 2.000 ca ngẫu nhiên. hold = 0 nghĩa là có cổ phiếu miễn phí (sai theo chiều ngược lại); trong TypeScript −∞ + giá vẫn là −∞, không có tràn số.',
      },
      {
        question: 'Partition Equal Subset Sum with one row: for (x of nums) for (j = x; j <= target; j++) dp[j] ||= dp[j − x]. It passes [1,5,11,5] → true and [1,2,3,5] → false. What does it answer for [1,2,5]?|||Partition Equal Subset Sum với một hàng: for (x of nums) for (j = x; j <= target; j++) dp[j] ||= dp[j − x]. Nó qua [1,5,11,5] → true và [1,2,3,5] → false. Nó trả lời gì cho [1,2,5]?',
        options: [
          'false, correctly, because the one-row loop is equivalent to the two-row table.|||false, đúng, vì vòng lặp một hàng tương đương với bảng hai hàng.',
          'false, but only by luck; the bug would show on [2,2], which it calls false.|||false, nhưng chỉ do may; lỗi sẽ lộ ở [2,2], nơi nó trả false.',
          'true, because j going up lets one item be used again (reaching 4 as 2+2).|||true, vì j chạy lên cho phép dùng lại một món (đạt 4 bằng 2+2).',
          'It throws, because dp[j − x] reads a negative index when j starts at x.|||Nó ném lỗi, vì dp[j − x] đọc chỉ số âm khi j bắt đầu từ x.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Target = 8 / 2 = 4. Going upwards, dp[2] is set by x = 2 and then read again by dp[4] in the same pass — the 2 is used twice, so the real run says true while the answer is false (no subset of {1,2,5} sums to 4). Downwards, dp[j − x] is still the previous item’s row. [2,2] really is true and the up version also says true, so it does not expose the bug; j − x ≥ 0 because j starts at x.|||VI: Target = 8 / 2 = 4. Khi chạy lên, dp[2] được x = 2 bật lên rồi bị dp[4] đọc lại ngay trong cùng lượt — số 2 bị dùng hai lần, nên lần chạy thật nói true trong khi đáp án là false (không tập con nào của {1,2,5} có tổng 4). Khi chạy xuống, dp[j − x] vẫn là hàng của món trước. [2,2] thật sự là true và bản chạy lên cũng nói true, nên nó không làm lộ lỗi; j − x ≥ 0 vì j bắt đầu từ x.',
      },
      {
        question: 'A login page shows "Did you mean …?" using edit distance ≤ 2 against every account name; typing cuonghoag shows "Did you mean cuonghoang?". Why is this dangerous, and what does jql.ts do differently?|||Một trang đăng nhập hiện "Did you mean …?" bằng khoảng cách sửa ≤ 2 so với mọi tên tài khoản; gõ cuonghoag thì hiện "Did you mean cuonghoang?". Vì sao nguy hiểm, và jql.ts làm khác thế nào?',
        options: [
          'Edit distance is O(n·m) per name, so the page times out once there are many accounts.|||Khoảng cách sửa là O(n·m) mỗi tên, nên trang quá giờ khi có nhiều tài khoản.',
          'Plain Levenshtein ignores swapped letters, so it suggests the wrong account.|||Levenshtein thường bỏ qua chữ đảo chỗ, nên nó gợi ý nhầm tài khoản.',
          'Only the threshold is wrong: with ≤ 1 instead of ≤ 2 the page would be safe.|||Chỉ ngưỡng là sai: dùng ≤ 1 thay cho ≤ 2 thì trang sẽ an toàn.',
          'It reveals which accounts exist; jql.ts suggests only among the members the caller can see.|||Nó tiết lộ tài khoản nào tồn tại; jql.ts chỉ gợi ý trong các thành viên người gọi đã thấy.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Each suggestion confirms a real username to an anonymous visitor — user enumeration, the first step of password guessing. jql.ts runs the same edit distance (with swaps counted as 1: "Bgu" → "Bug" is 2 plain, 1 with swaps) but its candidate list is ctx.members, people already visible to the caller. A smaller threshold still leaks names, and names are short, so O(n·m) per name is cheap.|||VI: Mỗi lời gợi ý xác nhận một tên tài khoản có thật cho một người lạ — dò tên tài khoản (user enumeration), bước đầu của đoán mật khẩu. jql.ts chạy cùng phép khoảng cách sửa (có tính đảo chữ = 1: "Bgu" → "Bug" là 2 theo cách thường, 1 khi tính đảo chữ) nhưng danh sách ứng viên là ctx.members, những người người gọi đã được thấy. Ngưỡng nhỏ hơn vẫn lộ tên, còn tên thì ngắn nên O(n·m) mỗi tên là rẻ.',
      },
      {
        question: 'A top-down 2D DP with memo key `${i},${j}` passes small tests but times out at n = m = 5,000. Measured at L = 1,000 in Node: string keys 412.0 ms, numeric Map 107.5 ms, Int32Array 16.8 ms, bottom-up 3.3 ms. Best fix?|||Một DP 2 chiều từ trên xuống với khoá memo `${i},${j}` qua test nhỏ nhưng quá giờ ở n = m = 5.000. Đo ở L = 1.000 trên Node: khoá chuỗi 412,0 ms, Map khoá số 107,5 ms, Int32Array 16,8 ms, từ dưới lên 3,3 ms. Cách sửa tốt nhất?',
        options: [
          'Keep the string keys and raise the stack size, since the time is lost in recursion.|||Giữ khoá chuỗi và nâng kích thước ngăn xếp, vì thời gian mất ở đệ quy.',
          'Index states as i * (m + 1) + j in a typed array, or go bottom-up: same O(n·m), far smaller constant.|||Đánh chỉ số i * (m + 1) + j vào mảng có kiểu, hoặc đi từ dưới lên: cùng O(n·m), hằng số nhỏ hơn nhiều.',
          'Use a plain object {} as the memo, which is faster than a Map for string keys.|||Dùng object thường {} làm memo, vốn nhanh hơn Map với khoá chuỗi.',
          'Nothing in the code: a timeout here proves the problem needs a lower complexity.|||Không sửa gì trong code: quá giờ ở đây chứng tỏ đề cần độ phức tạp thấp hơn.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: All four measured versions are O(n·m) and return the same LCS (643). The string version allocates and hashes a new string per call: about 25× slower than the Int32Array and over 100× slower than the table. The stack is not the problem (the recursion is at most n + m deep), and nothing measured supports {} — besides, user-shaped string keys in {} are the prototype trap of lesson 1.1. The complexity is already right; the constant is not.|||VI: Cả bốn phiên bản đã đo đều O(n·m) và cho cùng LCS (643). Bản khoá chuỗi cấp phát và băm một chuỗi mới ở mỗi lời gọi: chậm khoảng 25 lần so với Int32Array và hơn 100 lần so với bản bảng. Ngăn xếp không phải vấn đề (đệ quy sâu tối đa n + m), và không phép đo nào ủng hộ {} — hơn nữa, khoá chuỗi dạng tuỳ ý trong {} chính là bẫy prototype của bài 1.1. Độ phức tạp đã đúng; hằng số thì chưa.',
      },
    ],
  },
};
