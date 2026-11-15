/** 8.5 — Quiz Chương 8. Mọi output nhắc trong câu hỏi lấy từ lần chạy thật trong ../ma/ch08 hoặc nháp $TMPDIR/dsa-nhap/ch08. */
export default {
  title: '8.5 — Chapter 8 quiz: backtracking|||8.5 — Quiz Chương 8: quay lui',
  slug: 'dsa-8-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống thật về quay lui: đọc mã đoán output (bẫy tham chiếu, quên bỏ chọn, i > 0), chọn núm vặn cho combination sum, n tối đa đo thật, số nút N-Queens, Word Search, hoán vị có trùng và rò rỉ thời gian.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Chapter 8 quiz: backtracking</h2>
<p class="lead">Ten questions taken from situations you will actually meet: a submission whose answers are all empty, an output that starts right and then turns into garbage, a constraint that should make you push back on the problem, a one-character bug in a duplicate check, and the measurements of this chapter. Every output quoted in a question came from running real programs. 15 minutes.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write the choose / explore / unchoose template and answer its four questions (path, choices, record, undo) for a new problem.</li>
<li>I can explain why <code>res.push(path)</code> gives empty answers and what a missing pop looks like in the output.</li>
<li>I can pick <code>i</code>, <code>i + 1</code> or <code>0</code> for the next level and say why.</li>
<li>I can write the same-level duplicate skip with <code>i &gt; start</code> and the Permutations II rule with <code>!used[i − 1]</code>.</li>
<li>I can give the measured limits: 2ⁿ·n up to n ≈ 20, n!·n up to n ≈ 10–11.</li>
<li>I can write N-Queens with three Sets and explain <code>r − c</code> and <code>r + c</code>.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Quiz</span>
<h2>Quiz Chương 8: quay lui</h2>
<p class="lead">Mười câu lấy từ những tình huống bạn sẽ gặp thật: một lượt nộp mà mọi đáp án đều rỗng, một output đúng lúc đầu rồi thành rác, một ràng buộc lẽ ra phải khiến bạn hỏi lại người ra đề, một lỗi một ký tự trong phép bỏ trùng, và các phép đo của chương này. Mọi output nhắc trong câu hỏi đều lấy từ lần chạy chương trình thật. 15 phút.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được khuôn chọn / đi tiếp / bỏ chọn và trả lời được bốn câu hỏi của nó (đường đi, lựa chọn, ghi, hoàn tác) cho một đề mới.</li>
<li>Tôi giải thích được vì sao <code>res.push(path)</code> cho ra đáp án rỗng và thiếu pop thì output trông thế nào.</li>
<li>Tôi chọn được <code>i</code>, <code>i + 1</code> hay <code>0</code> cho tầng sau và nói được vì sao.</li>
<li>Tôi viết được luật bỏ trùng cùng tầng với <code>i &gt; start</code> và luật của Permutations II với <code>!used[i − 1]</code>.</li>
<li>Tôi nêu được giới hạn đo thật: 2ⁿ·n tới n ≈ 20, n!·n tới n ≈ 10–11.</li>
<li>Tôi viết được N-Queens bằng ba Set và giải thích được <code>r − c</code> và <code>r + c</code>.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Your Subsets solution records answers with res.push(path) (no copy) and pops correctly after every recursive call. What does it return for [1, 2, 3]?|||Lời giải Subsets của bạn ghi đáp án bằng res.push(path) (không chép) và pop đúng sau mỗi lời gọi đệ quy. Với [1, 2, 3] nó trả về gì?',
        options: [
          '[[],[],[],[],[],[],[],[]]',
          '[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]',
          '[[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3]]',
          'A ConcurrentModificationException / TypeError at the first push|||Ném ConcurrentModificationException / TypeError ở lần push đầu tiên',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: All eight entries are the same array object (the real run printed eight [] and "same object? true"). By the time the function returns, every push has been popped, so that one array is empty. The tempting "eight [1,2,3]" imagines the array is frozen at its deepest moment — but nothing is frozen; you see its final state. Adding a list to a list stores a reference: copy with [...path] / new ArrayList<>(path).|||VI: Cả tám phần tử là cùng một đối tượng mảng (lần chạy thật in tám [] và "same object? true"). Lúc hàm trả về, mọi lần push đã bị pop, nên mảng duy nhất đó rỗng. Phương án hấp dẫn "tám [1,2,3]" tưởng mảng bị đóng băng ở lúc sâu nhất — nhưng không có gì bị đóng băng; bạn thấy trạng thái cuối của nó. Thêm danh sách vào danh sách là cất tham chiếu: hãy chép bằng [...path] / new ArrayList<>(path).',
      },
      {
        question: 'A classmate’s Subsets output on [1,2,3] is [[],[1],[1,2],[1,2,3],[1,2,3,3],[1,2,3,3,2],…]. The first four answers are right. Which line is most likely missing?|||Output Subsets của một bạn trên [1,2,3] là [[],[1],[1,2],[1,2,3],[1,2,3,3],[1,2,3,3,2],…]. Bốn đáp án đầu đúng. Dòng nào nhiều khả năng bị thiếu nhất?',
        options: [
          'The copy when recording: res.push([...path])|||Phép chép khi ghi: res.push([...path])',
          'The unchoose after the recursive call: path.pop()|||Bước bỏ chọn sau lời gọi đệ quy: path.pop()',
          'The start index: recursing with i + 1 instead of start + 1|||Chỉ số start: đệ quy với i + 1 thay vì start + 1',
          'The base case that stops when path.length === nums.length|||Điều kiện dừng khi path.length === nums.length',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: "Right at first, then garbage that keeps growing" is the signature of a missing undo: the 3 chosen in the deepest branch is never removed and leaks into the sibling branches (the real run printed exactly this list). A missing copy would make all answers identical, not growing. A wrong start index produces repeats like [1,3,3] from the beginning, and Subsets records at every node, so it needs no length base case.|||VI: "Lúc đầu đúng, rồi thành rác càng lúc càng dài" là dấu hiệu của thiếu hoàn tác: số 3 chọn ở nhánh sâu nhất không bao giờ được gỡ và rò sang các nhánh anh em (lần chạy thật in đúng danh sách này). Thiếu phép chép sẽ làm mọi đáp án giống hệt nhau, không dài dần. Sai start sinh thứ lặp kiểu [1,3,3] ngay từ đầu, còn Subsets ghi ở mọi nút nên không cần điều kiện dừng theo độ dài.',
      },
      {
        question: 'An online assessment says: print every permutation of n distinct letters, 1 ≤ n ≤ 12. Based on the chapter’s measurements, what is the best response?|||Một bài thi online ghi: in mọi hoán vị của n chữ cái khác nhau, 1 ≤ n ≤ 12. Dựa trên các phép đo của chương, phản ứng tốt nhất là gì?',
        options: [
          'Fine: backtracking is O(n·n!), and n = 12 is within the n ≤ 20–25 row of the limits table, so just generate and print them|||Ổn: quay lui là O(n·n!), mà n = 12 nằm trong dòng n ≤ 20–25 của bảng giới hạn, nên cứ sinh rồi in ra',
          'Point out that n = 12 means 479,001,600 permutations — just walking them took about 8 s in Java — and ask if a count or the k-th permutation is wanted|||Chỉ ra rằng n = 12 là 479.001.600 hoán vị — chỉ đi qua đã mất khoảng 8 giây trên Java — và hỏi lại có phải đề cần số lượng hay hoán vị thứ k',
          'Use memoisation: permutations share long prefixes, so caching each prefix turns the search into a polynomial DP|||Dùng ghi nhớ: các hoán vị chung nhiều tiền tố dài, nên lưu kết quả từng tiền tố biến cuộc tìm thành DP đa thức',
          'Keep the algorithm but replace used[] with a bitmask, which the N-Queens measurement showed is about 100 times faster|||Giữ thuật toán nhưng thay used[] bằng bitmask, thứ mà phép đo N-Queens cho thấy nhanh hơn khoảng 100 lần',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The measured walk for n = 12 printed 479,001,600 answers in about 7.8 s in Java and over a minute in Node — and printing 12 characters per line multiplies the output to about 6 GB. The output itself is too big, so no algorithm can help; clarify the task. The first option reads the wrong row: n ≤ 20–25 is the limit for 2ⁿ; for n! it is n ≤ 10–11. DP cannot shrink an output that is n! lines long, and a bitmask (measured 10–45× on N-Queens, not 100×) changes the constant, not the 12× growth per step.|||VI: Phép đo walk ở n = 12 in 479.001.600 đáp án trong khoảng 7,8 giây trên Java và hơn một phút trên Node — mà in 12 ký tự mỗi dòng thì output lên tới khoảng 6 GB. Chính output đã quá lớn nên không thuật toán nào cứu được; hãy hỏi lại đề. Phương án đầu đọc nhầm dòng: n ≤ 20–25 là giới hạn của 2ⁿ; với n! là n ≤ 10–11. DP không thể thu nhỏ một output dài n! dòng, còn bitmask (đo được 10–45 lần ở N-Queens, không phải 100 lần) chỉ đổi hằng số, không đổi mức tăng 12 lần mỗi nấc.',
      },
      {
        question: 'For Subsets II you wrote the skip as if (i > 0 && a[i] == a[i − 1]) continue; on the sorted array [1, 2, 2]. What does it return?|||Với Subsets II bạn viết luật bỏ là if (i > 0 && a[i] == a[i − 1]) continue; trên mảng đã sort [1, 2, 2]. Nó trả về gì?',
        options: [
          '[[],[1],[1,2],[1,2,2],[2],[2,2]]',
          '[[],[1],[1,2],[1,2],[1,2,2],[2],[2],[2,2]]',
          '[[],[1],[1,2],[2]]',
          '[[],[1],[2]]',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The real run printed [[],[1],[1,2],[2]]: [1,2,2] and [2,2] are gone, because i > 0 also skips the second 2 when it is the FIRST candidate of a deeper level (i == start). The tempting first option is what i > start produces — the correct rule. The second option is the naive version with no skip at all.|||VI: Lần chạy thật in [[],[1],[1,2],[2]]: mất [1,2,2] và [2,2], vì i > 0 bỏ luôn số 2 thứ hai cả khi nó là ứng viên ĐẦU TIÊN của một tầng sâu hơn (i == start). Phương án đầu hấp dẫn chính là thứ i > start sinh ra — luật đúng. Phương án thứ hai là bản naive không bỏ gì.',
      },
      {
        question: 'Combination Sum (reuse allowed), candidates sorted [2, 3, 6, 7], target 7. Inside the loop you recurse with bt(0, remain − a[i]) instead of bt(i, remain − a[i]). What is returned?|||Combination Sum (được dùng lại), ứng viên đã sort [2, 3, 6, 7], target 7. Trong vòng lặp bạn đệ quy bt(0, remain − a[i]) thay vì bt(i, remain − a[i]). Kết quả trả về là gì?',
        options: [
          '[[2,2,3],[7]]',
          '[[7]]',
          '[[2,2,3],[7]] but about twice as slow|||[[2,2,3],[7]] nhưng chậm gấp đôi',
          '[[2,2,3],[2,3,2],[3,2,2],[7]]',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Starting every level at 0 lets a smaller number come after a bigger one, so each combination appears in every order: the real run printed [[2,2,3],[2,3,2],[3,2,2],[7]]. The tempting [[2,2,3],[7]] is the correct output, which needs bt(i): i keeps the combination non-decreasing and still allows reuse. [[7]] is what bt(i + 1) gives — no reuse.|||VI: Cho mọi tầng bắt đầu từ 0 nghĩa là số nhỏ được đứng sau số lớn, nên mỗi tổ hợp xuất hiện theo mọi thứ tự: lần chạy thật in [[2,2,3],[2,3,2],[3,2,2],[7]]. Phương án hấp dẫn [[2,2,3],[7]] là output đúng, cần bt(i): i giữ tổ hợp không giảm mà vẫn cho dùng lại. [[7]] là thứ bt(i + 1) cho ra — không được dùng lại.',
      },
      {
        question: 'n = 8 queens. How many nodes does the three-Set version visit, compared with "one queen per row, check the whole board only at the leaf"?|||n = 8 quân hậu. Bản ba Set đi qua bao nhiêu nút, so với "mỗi hàng một hậu, chỉ kiểm cả bàn ở lá"?',
        options: [
          '2,057 vs 19,173,961|||2.057 so với 19.173.961',
          '2,057 vs 109,601|||2.057 so với 109.601',
          '92 vs 40,320|||92 so với 40.320',
          '16,777,216 vs 19,173,961|||16.777.216 so với 19.173.961',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The measurement table gives 2,057 nodes for the three Sets and 19,173,961 (the full 8⁸ tree, counted exactly) for one-per-row with a leaf check. The tempting 109,601 is the middle version — one queen per row AND per column (permutations), diagonals checked at the leaf. 92 is the number of solutions, not nodes; 16,777,216 is only the leaves of the unpruned tree.|||VI: Bảng đo cho 2.057 nút với ba Set và 19.173.961 (cả cây 8⁸, đếm chính xác) với mỗi hàng một hậu kiểm ở lá. Con số hấp dẫn 109.601 là bản ở giữa — mỗi hàng VÀ mỗi cột một hậu (hoán vị), đường chéo kiểm ở lá. 92 là số lời giải, không phải số nút; 16.777.216 chỉ là số lá của cây không cắt nhánh.',
      },
      {
        question: 'Your Word Search uses a separate boolean[][] visited. You set visited[r][c] = true before exploring the neighbours and never set it back. Small tests pass, but a word that clearly exists returns false. Why?|||Word Search của bạn dùng một mảng boolean[][] visited riêng. Bạn đặt visited[r][c] = true trước khi đi các ô kề và không bao giờ đặt lại. Test nhỏ qua, nhưng một từ rõ ràng có trên bảng lại trả false. Vì sao?',
        options: [
          'The recursion is too deep for 15-letter words and returns false on overflow|||Đệ quy quá sâu với từ 15 chữ và trả false khi tràn',
          'The four directions must be tried in the order down, up, right, left|||Bốn hướng phải được thử theo thứ tự xuống, lên, phải, trái',
          'Cells used by a failed path stay blocked, so a later path that needs them is refused|||Ô đã bị một đường thất bại dùng qua vẫn bị chặn, nên đường sau cần tới chúng bị từ chối',
          'The outer loop must start from the cell that holds the word’s last letter|||Vòng ngoài phải bắt đầu từ ô chứa chữ cuối của từ',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: In a backtracking DFS, visited means "on my current path" and must be cleared on the way back — the chapter restores the cell and prints "board restored: true" to prove it. Never clearing it turns visited into "ever touched", which is the BFS meaning. Depth 15 is nowhere near a stack overflow, and direction order or starting cell only change speed (starting from the rarer end is a pruning, not a correctness fix).|||VI: Trong DFS quay lui, visited nghĩa là "đang nằm trên đường đi của tôi" và phải được gỡ khi quay về — chương này trả lại ô và in "board restored: true" để chứng minh. Không bao giờ gỡ biến visited thành "đã từng chạm", tức nghĩa của BFS. Độ sâu 15 còn xa mới tràn ngăn xếp, còn thứ tự hướng hay ô xuất phát chỉ đổi tốc độ (bắt đầu từ đầu hiếm là cắt nhánh, không phải sửa cho đúng).',
      },
      {
        question: 'A server checks a 6-digit code by comparing digit by digit and returning at the first mismatch, so the time leaks how many leading digits are right. In the chapter’s model of that leak, how many tries does a backtracking attacker need for the secret 999999?|||Một máy chủ kiểm mã 6 chữ số bằng cách so từng chữ số và trả về ngay ở chỗ sai đầu tiên, nên thời gian để lộ có bao nhiêu chữ số đầu đúng. Trong mô hình rò rỉ của chương, kẻ tấn công quay lui cần bao nhiêu lần thử với mã bí mật 999999?',
        options: [
          '1,000,000, the same as without the leak|||1.000.000, bằng như khi không rò rỉ',
          '6, one per digit|||6, mỗi chữ số một lần',
          '600,000, because each try still has to wait for the timing|||600.000, vì mỗi lần thử vẫn phải chờ đo thời gian',
          '60: at most 10 digits for each of the 6 positions|||60: tối đa 10 chữ số cho mỗi vị trí trong 6 vị trí',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The real run printed 60 tries for 999999 (31 for 481516, 6 for 000000) against 1,000,000 with a yes/no checker. The leak is a prefix signal, and a prefix signal is exactly what pruning needs: fix one position at a time. "6" is the best case (000000), not the worst. The defence is a constant-time comparison (crypto.timingSafeEqual, as in this site’s otp.service.ts and internal.routes.ts) plus an attempt limit.|||VI: Lần chạy thật in 60 lần thử cho 999999 (31 cho 481516, 6 cho 000000) so với 1.000.000 khi hàm kiểm chỉ trả có/không. Rò rỉ là một tín hiệu về tiền tố, mà tín hiệu tiền tố chính là thứ cắt nhánh cần: cố định từng vị trí một. "6" là trường hợp tốt nhất (000000), không phải xấu nhất. Cách phòng là so sánh thời gian hằng số (crypto.timingSafeEqual, như otp.service.ts và internal.routes.ts của trang này) cộng giới hạn số lần thử.',
      },
      {
        question: 'In Combination Sum you sorted the candidates but wrote continue (instead of break) when a[i] > remain. On 38 candidates with target 80, what did the chapter measure for this version compared with sort + break?|||Ở Combination Sum bạn đã sort ứng viên nhưng viết continue (thay vì break) khi a[i] > remain. Với 38 ứng viên và target 80, chương đo được gì cho bản này so với sort + break?',
        options: [
          'Wrong answers: continue skips the too-big value but also some valid combinations that come after it|||Sai đáp án: continue bỏ giá trị quá lớn nhưng bỏ luôn vài tổ hợp hợp lệ đứng sau nó',
          'About the same speed, because sorting 38 numbers dominates the running time of the whole search|||Tốc độ gần như nhau, vì sort 38 số chiếm phần lớn thời gian chạy của cả cuộc tìm',
          'The same answers and the same number of calls, but about 10× more loop checks and 6–10× more time|||Cùng đáp án và cùng số lời gọi, nhưng nhiều vòng lặp hơn khoảng 10 lần và chậm hơn 6–10 lần',
          'More calls (nodes) than sort + break, because every too-big candidate is still called, but the same number of loop checks|||Nhiều lời gọi (nút) hơn sort + break, vì ứng viên quá lớn vẫn bị gọi, nhưng cùng số vòng lặp',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Both versions reject before calling, so they make the same 3,607,112 calls and find the same 425,977 answers; but continue keeps scanning every bigger candidate: 69,154,561 loop checks vs 6,776,923, about 204 ms vs 32 ms in Node and 150 ms vs 15 ms in Java. The answers are never wrong with continue — only slower. "More calls" describes the unsorted version that rejects on entry (4,967,724 calls).|||VI: Cả hai bản đều loại trước khi gọi, nên cùng 3.607.112 lời gọi và cùng 425.977 đáp án; nhưng continue vẫn quét mọi ứng viên lớn hơn: 69.154.561 lượt kiểm so với 6.776.923, khoảng 204 ms so với 32 ms trên Node và 150 ms so với 15 ms trên Java. Dùng continue không bao giờ sai đáp án — chỉ chậm hơn. "Nhiều lời gọi hơn" là bản không sort, loại ở đầu hàm (4.967.724 lời gọi).',
      },
      {
        question: 'Permutations II on [1, 1, 2] (sorted, with a used[] array). Which skip condition produces [[1,1,2],[1,2,1],[2,1,1]] without ever building a duplicate?|||Permutations II trên [1, 1, 2] (đã sort, có mảng used[]). Điều kiện bỏ nào cho ra [[1,1,2],[1,2,1],[2,1,1]] mà không bao giờ dựng một bản trùng?',
        options: [
          'if (i > 0 && a[i] == a[i − 1]) continue;',
          'if (i > 0 && a[i] == a[i − 1] && !used[i − 1]) continue;',
          'No skip; after sorting, duplicates cannot appear|||Không bỏ gì; sau khi sort thì không thể có bản trùng',
          'No skip; put each result into a Set<List<Integer>> at the end|||Không bỏ gì; cuối cùng bỏ từng kết quả vào một Set<List<Integer>>',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Allowing a twin only after the twin before it is used forces twins into index order, so each distinct permutation is built once (the real run printed exactly the three). Without the used check, the second 1 can never be placed and the real run returned []. With no skip, the run printed six permutations, each twice. A Set at the end gives the right list but still builds every duplicate first — the question asked for never building one.|||VI: Chỉ cho một bản trùng vào khi bản ngay trước nó đã được dùng thì các bản trùng buộc phải theo thứ tự chỉ số, nên mỗi hoán vị khác nhau chỉ được dựng một lần (lần chạy thật in đúng ba cái). Thiếu phép kiểm used thì số 1 thứ hai không bao giờ được đặt và lần chạy thật trả []. Không bỏ gì thì lần chạy in sáu hoán vị, mỗi cái hai lần. Set ở cuối cho danh sách đúng nhưng vẫn dựng mọi bản trùng trước — câu hỏi đòi không bao giờ dựng.',
      },
    ],
  },
};
