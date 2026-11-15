/** 10.5 — Kiểm tra Chương 10: 10 câu tình huống. Mọi output nhắc tới trong câu hỏi là output THẬT ở ../ma/ch10
 *  (số đo của câu 1 đọc thẳng từ oa-do.ts.out để luôn khớp khi đo lại). Đáp án rải: 0 ×3 · 1 ×2 · 2 ×3 · 3 ×2. */
import { doc } from '../_chung.mjs';

const dong = (nhan) => doc('ch10/b4/oa-do.ts.out').split('\n').filter((l) => l.startsWith(nhan)).pop();
const ms = (nhan) => Number(dong(nhan).split('|')[2].trim());
const SP = ms('java Scanner + println'), TP = ms('java Tokenizer + PrintWriter');
const s = (x, vi) => (x / 1000).toFixed(1).replace('.', vi ? ',' : '.');

export default {
  title: '10.5 — Chapter 10 check|||10.5 — Kiểm tra Chương 10',
  slug: 'dsa-10-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười tình huống về nói lời giải, xin gợi ý, code sạch, tự test, kiểm thử đối chiếu và bài test online (đọc stdin, ghi output, chiến lược thời gian).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Check</span>
<h2>Chapter 10 check</h2>
<p class="lead">Ten situations from a real interview hour and a real OA, fifteen minutes. Every output quoted in a question is the real output of a program from this chapter.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can run the stuck protocol aloud and ask for a hint that shows my work.</li>
<li>I can say a complexity aloud in English ("O of n log n") and in Vietnamese.</li>
<li>I can spot duplicated code and the edge case it forgets.</li>
<li>I trace one normal example and two edge cases before I say "done".</li>
<li>I can write a differential-testing harness against a brute force.</li>
<li>I can write a token-based stdin reader and a flushed buffered writer from memory in Node and Java.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Kiểm tra Chương 10</h2>
<p class="lead">Mười tình huống lấy từ một giờ phỏng vấn thật và một bài OA thật, mười lăm phút. Mọi output được trích trong câu hỏi đều là output thật của chương trình trong chương này.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chạy to được quy trình khi bí và xin được một gợi ý có kèm phần đã làm.</li>
<li>Tôi đọc to được độ phức tạp bằng tiếng Anh ("O of n log n") và bằng tiếng Việt.</li>
<li>Tôi nhận ra code bị lặp và trường hợp biên mà nó bỏ quên.</li>
<li>Tôi chạy tay một ví dụ thường và hai ca biên trước khi nói "xong".</li>
<li>Tôi viết được chương trình kiểm thử đối chiếu với bản vét cạn.</li>
<li>Tôi viết từ trí nhớ được bộ đọc stdin theo token và bộ ghi có đệm có flush, bằng Node và Java.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: `An OA problem: read 10⁶ numbers, print the running sum after each. Your Java solution is O(n) and correct, but the largest test is Time Limit Exceeded (limit 4 s). It uses Scanner and System.out.println inside the loop. What is the best first fix?|||Một bài OA: đọc 10⁶ số, in tổng dồn sau mỗi số. Lời giải Java của bạn O(n) và đúng, nhưng test lớn nhất bị quá giờ (giới hạn 4 giây). Bạn dùng Scanner và System.out.println trong vòng lặp. Cách sửa đầu tiên tốt nhất là gì?`,
        options: [
          'Look for an O(log n) algorithm — O(n) must be too slow for 10⁶|||Tìm thuật toán O(log n) — O(n) chắc chắn quá chậm với 10⁶',
          'Read with BufferedReader + StringTokenizer and print through one PrintWriter flushed at the end|||Đọc bằng BufferedReader + StringTokenizer và in qua một PrintWriter flush ở cuối',
          'Increase the stack size with -Xss so the JVM runs faster|||Tăng kích thước stack bằng -Xss để JVM chạy nhanh hơn',
          'Store the sums in int instead of long to save time|||Lưu tổng bằng int thay vì long để đỡ tốn thời gian',
        ],
        correctIndex: 1, points: 1,
        explanation: `EN: Measured in lesson 10.4 on 10⁶ numbers: Scanner + println ${s(SP)} s, StringTokenizer + PrintWriter ${s(TP)} s — same O(n) algorithm, the difference is pure I/O. O(n) for 10⁶ is about a million steps, far below the limit, so hunting for O(log n) is wasted (and impossible: you must read every number). int would also overflow the running sum.|||VI: Đo ở bài 10.4 với 10⁶ số: Scanner + println ${s(SP, true)} giây, StringTokenizer + PrintWriter ${s(TP, true)} giây — cùng thuật toán O(n), chênh lệch hoàn toàn do vào/ra. O(n) với 10⁶ là cỡ một triệu bước, thấp xa giới hạn, nên đi tìm O(log n) là phí công (và không thể: phải đọc từng số). Dùng int còn làm tràn tổng dồn.`,
      },
      {
        question: 'Node, input "5" on line 1 and "3  -1 4 1 5 " (two spaces after 3, a trailing space, Windows CR LF line endings) on line 2. The code: lines = input.split(newline); a = lines[1].split(" ").map(Number); then sums and maxes a[0..n−1]. What did it print when run for real?|||Node, đầu vào "5" ở dòng 1 và "3  -1 4 1 5 " (hai dấu cách sau số 3, một dấu cách cuối dòng, xuống dòng kiểu Windows CR LF) ở dòng 2. Code: lines = input.split(xuống dòng); a = lines[1].split(" ").map(Number); rồi tính tổng và max của a[0..n−1]. Khi chạy thật nó in gì?',
        options: [
          'sum=12 max=5 — Number() trims the spaces and the CR|||sum=12 max=5 — Number() tự bỏ dấu cách và CR',
          'A TypeError crash on the empty token|||Sập với TypeError ở token rỗng',
          'sum=7 max=4 — the empty token became 0 and pushed the 5 out of the first n|||sum=7 max=4 — token rỗng thành 0 và đẩy số 5 ra khỏi n phần tử đầu',
          'sum=NaN max=NaN — every token is invalid because of the CR|||sum=NaN max=NaN — mọi token đều hỏng vì có CR',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: split(" ") on a double space yields an empty string, and Number("") is 0 — no error. The first five tokens are 3, 0, −1, 4, 1: sum 7, max 4 (real output of oa-mau.ts). A silent wrong answer, worse than a crash. "sum=12" is what the token-based readers printed; NaN appears only for the layout where the numbers continue on the next lines.|||VI: split(" ") gặp dấu cách đôi sinh ra chuỗi rỗng, và Number("") là 0 — không báo lỗi. Năm token đầu là 3, 0, −1, 4, 1: tổng 7, max 4 (output thật của oa-mau.ts). Sai câm, tệ hơn sập. "sum=12" là thứ các bộ đọc theo token in ra; NaN chỉ xuất hiện ở bố cục các số trải sang dòng sau.',
      },
      {
        question: 'Your Java OA solution prints through new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out))) and you forgot out.flush(). Run on a tiny input (print 1, 2, 3), what does the judge receive?|||Lời giải OA Java của bạn in qua new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out))) và bạn quên out.flush(). Chạy với đầu vào nhỏ (in 1, 2, 3), máy chấm nhận được gì?',
        options: [
          'Nothing: empty output, exit code 0 — every test is Wrong Answer|||Không gì cả: output rỗng, mã thoát 0 — mọi test đều Wrong Answer',
          'The three lines — the JVM flushes every writer when main returns|||Đủ ba dòng — JVM tự flush mọi bộ ghi khi main kết thúc',
          'A Runtime Error, because the stream was not closed|||Runtime Error, vì luồng chưa được đóng',
          'Only the first line, the rest stays in the buffer|||Chỉ dòng đầu, phần còn lại kẹt trong bộ đệm',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: The real run of GhiQuenFlush printed "" with exit code 0: the buffered data dies with the program. The JVM does not flush your PrintWriter for you (System.out itself is flushed, but your writer’s buffer sits in front of it). No exception either — which is why this bug is so hard to see in an OA.|||VI: Lần chạy thật của GhiQuenFlush in ra "" với mã thoát 0: dữ liệu trong bộ đệm chết theo chương trình. JVM không flush PrintWriter của bạn hộ bạn (System.out thì được đẩy, nhưng bộ đệm của bộ ghi nằm chắn phía trước nó). Cũng không có ngoại lệ nào — vì vậy lỗi này rất khó thấy trong bài OA.',
      },
      {
        question: 'Your differential-testing harness (fast "max sum of k consecutive" vs brute force, Park–Miller random inputs) reports: first failure seed 2: nums=[0,-4,4] k=2 fast=-4 brute=0. What is the most likely conclusion?|||Chương trình kiểm thử đối chiếu của bạn ("tổng lớn nhất của k phần tử liên tiếp" bản nhanh vs vét cạn, đầu vào ngẫu nhiên Park–Miller) báo: first failure seed 2: nums=[0,-4,4] k=2 fast=-4 brute=0. Kết luận hợp lý nhất?',
        options: [
          'The brute force mishandles negative numbers|||Bản vét cạn xử lý sai số âm',
          'k = 2 with n = 3 is an invalid input the generator should not produce|||k = 2 với n = 3 là đầu vào không hợp lệ mà bộ sinh không nên tạo ra',
          'The random generator is broken because seed 2 is too small|||Bộ sinh ngẫu nhiên hỏng vì seed 2 quá nhỏ',
          'The fast version never looks at the last window [-4, 4], whose sum 0 is the answer|||Bản nhanh không bao giờ xét cửa sổ cuối [-4, 4], có tổng 0 là đáp án',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The windows are [0,−4] = −4 and [−4,4] = 0. The fast version returned −4, the first window — exactly the off-by-one "s < n − k" that skips the last start. The brute force sums every window from scratch and is trusted by construction. In the real run the bug disagreed on 398 of 2,000 random tests; the fixed version on 0.|||VI: Các cửa sổ là [0,−4] = −4 và [−4,4] = 0. Bản nhanh trả −4, tức cửa sổ đầu — đúng lỗi lệch một "s < n − k" bỏ sót điểm bắt đầu cuối cùng. Bản vét cạn cộng lại từng cửa sổ từ đầu và đáng tin theo cách xây dựng. Lần chạy thật: bản lỗi lệch 398 trên 2.000 test ngẫu nhiên; bản đã sửa lệch 0.',
      },
      {
        question: 'Your fixed-window solution returns 9 on the sample [2,1,5,1,3,2], k = 3 (correct). You suspect the loop bound s < n − k. Which ONE extra test exposes it?|||Lời giải cửa sổ cố định của bạn trả 9 với ví dụ mẫu [2,1,5,1,3,2], k = 3 (đúng). Bạn nghi điều kiện vòng lặp s < n − k. Test thêm nào (MỘT test) làm lộ lỗi?',
        options: [
          '[1,2,3], k = 2 — the best window is the last one|||[1,2,3], k = 2 — cửa sổ tốt nhất là cửa sổ cuối',
          '[5,5,5,5], k = 2 — all equal|||[5,5,5,5], k = 2 — toàn bằng nhau',
          '[4,-1,2], k = 3 — a single window|||[4,-1,2], k = 3 — chỉ có một cửa sổ',
          '[7], k = 1 — one element|||[7], k = 1 — một phần tử',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: A bug that skips the last window only shows when the last window is the unique best. Real outputs: [1,2,3] k=2 → buggy 3, correct 5. All-equal, k = n and one-element inputs all passed (10, 5, 7) because the first window is already optimal. Choose edge cases that target the suspected line, not random "weird" ones.|||VI: Lỗi bỏ sót cửa sổ cuối chỉ lộ khi cửa sổ cuối là tốt nhất duy nhất. Output thật: [1,2,3] k=2 → bản lỗi 3, đúng là 5. Các ca toàn bằng nhau, k = n và một phần tử đều qua (10, 5, 7) vì cửa sổ đầu đã là tối ưu. Hãy chọn ca biên nhắm vào đúng dòng đang nghi ngờ, không phải ca "lạ" ngẫu nhiên.',
      },
      {
        question: 'LC 238 (product except self, no division). After two minutes you have the O(n²) brute force and see each answer is "left part × right part". Which request for help is best?|||LC 238 (tích trừ chính nó, không dùng phép chia). Sau hai phút bạn đã có bản vét cạn O(n²) và thấy mỗi đáp án là "phần trái × phần phải". Câu xin trợ giúp nào tốt nhất?',
        options: [
          '"I have not seen this problem before and I don’t know the trick. Could you just tell me the approach so we can move on?"|||"Em chưa gặp bài này và không biết mẹo. Anh/chị nói luôn hướng giải để mình làm tiếp được không ạ?"',
          '"Sorry, I am a bit stuck here. Could you give me a hint about what to do next?"|||"Xin lỗi, em hơi bị kẹt ở đây. Anh/chị gợi ý giúp em nên làm gì tiếp được không ạ?"',
          '"Each answer is a left product times a right product, but recomputing them is O(n²). Am I on the right track, or is there a structure I should reuse?"|||"Mỗi đáp án là tích trái nhân tích phải, nhưng tính lại chúng tốn O(n²). Em đi đúng hướng chưa, hay có cấu trúc nào em nên dùng lại?"',
          'Say nothing and keep thinking for as long as it takes, because any hint request is recorded as a minus on the scoring sheet|||Không nói gì, cứ nghĩ tiếp bao lâu cũng được, vì xin gợi ý nào cũng bị ghi điểm trừ trên phiếu chấm',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The good request shows the work and the exact gap, so the interviewer can answer with the smallest possible hint ("what if you knew the product of everything to the left?"). "Could you give me a hint?" is polite but forces them to guess where you are. Silence is the worst option: it gives them nothing to score and nothing to help with.|||VI: Câu tốt cho thấy phần đã làm và lỗ hổng chính xác, nên người phỏng vấn trả lời được bằng gợi ý nhỏ nhất ("nếu em biết tích của mọi phần tử bên trái thì sao?"). "Anh/chị gợi ý giúp em" lịch sự nhưng bắt họ đoán bạn đang ở đâu. Im lặng là tệ nhất: không có gì để chấm, không biết giúp từ đâu.',
      },
      {
        question: 'LC 3 with a map lastSeen. You write: if (prev !== undefined) left = prev + 1 — without the check prev >= left. What does it return for "abba" (real run)?|||LC 3 với map lastSeen. Bạn viết: if (prev !== undefined) left = prev + 1 — thiếu điều kiện prev >= left. Với "abba" nó trả gì (chạy thật)?',
        options: [
          '2 — the map still stores the latest position of every character, so the window stays correct|||2 — map vẫn lưu vị trí mới nhất của mọi ký tự, nên cửa sổ vẫn đúng',
          '3 — at the last "a", left jumps BACK to 1 and the window "bba" is counted|||3 — ở chữ "a" cuối, left nhảy LÙI về 1 và cửa sổ "bba" bị tính',
          '4 — left never moves after the second "b", so the whole string is counted|||4 — sau chữ "b" thứ hai left không dời nữa, nên cả chuỗi bị tính',
          '1 — every repeated character resets the window to a single character|||1 — mỗi ký tự lặp lại đều đặt cửa sổ về còn đúng một ký tự',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: At index 3, "a" was last seen at 0, which is already outside the window (left = 2). Without prev >= left, left becomes 1 and length 3 − 1 + 1 = 3 is recorded — wrong, the answer is 2. This is why the smooth conversation of 10.1 names "abba" before coding: the test exists for that one condition.|||VI: Ở chỉ số 3, "a" lần cuối thấy ở 0 — đã nằm ngoài cửa sổ (left = 2). Thiếu prev >= left thì left thành 1 và độ dài 3 − 1 + 1 = 3 bị ghi nhận — sai, đáp án là 2. Vì thế kịch bản trơn tru ở 10.1 gọi tên "abba" trước khi code: phép test đó tồn tại vì đúng một điều kiện ấy.',
      },
      {
        question: 'Java binary search: lo = 2,000,000,000 and hi = 2,100,000,000, both int. What does (lo + hi) / 2 print?|||Tìm kiếm nhị phân Java: lo = 2.000.000.000 và hi = 2.100.000.000, đều là int. (lo + hi) / 2 in ra gì?',
        options: [
          '2050000000|||2050000000',
          '4100000000 — Java promotes the sum to long automatically|||4100000000 — Java tự nâng tổng lên long',
          'An ArithmeticException for overflow|||ArithmeticException vì tràn số',
          '-97483648 — the sum wraps around past 2³¹ − 1|||-97483648 — tổng tràn qua 2³¹ − 1 và quay vòng',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: 4.1·10⁹ does not fit in an int (max ≈ 2.147·10⁹); Java int arithmetic wraps silently, and the real run printed −97483648. lo + (hi − lo) / 2 and (lo + hi) >>> 1 both print 2050000000. Java never throws on int overflow (only Math.addExact does), and it does not promote to long by itself.|||VI: 4,1·10⁹ không vừa int (tối đa ≈ 2,147·10⁹); phép tính int của Java tràn và quay vòng âm thầm, lần chạy thật in −97483648. lo + (hi − lo) / 2 và (lo + hi) >>> 1 đều in 2050000000. Java không bao giờ ném lỗi khi int tràn (chỉ Math.addExact mới ném), và không tự nâng lên long.',
      },
      {
        question: 'A 90-minute OA with three problems. At minute 60, problems 1 and 3 pass all tests; for problem 2 you have a correct O(n²) brute force but your O(n log n) idea still fails the samples. What should you do now?|||Bài OA 90 phút, ba bài. Phút thứ 60, bài 1 và 3 đã qua hết test; bài 2 bạn có bản vét cạn O(n²) đúng nhưng ý tưởng O(n log n) vẫn sai cả ví dụ mẫu. Giờ nên làm gì?',
        options: [
          'Submit the brute force now for partial credit, then keep working on the fast version, resubmitting only if it passes|||Nộp ngay bản vét cạn để ăn điểm từng phần, rồi làm tiếp bản nhanh, chỉ nộp lại nếu nó qua',
          'Keep debugging the fast version and submit only when it is finished, so the brute force does not lower the score|||Gỡ lỗi tiếp bản nhanh và chỉ nộp khi xong, để bản vét cạn không kéo điểm xuống',
          'Rewrite problems 1 and 3 in a faster style to secure them|||Viết lại bài 1 và 3 cho nhanh hơn để chắc điểm',
          'Leave problem 2 empty — a slow solution looks worse than no solution|||Bỏ trống bài 2 — lời giải chậm trông tệ hơn không có lời giải',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Scores are counted per hidden test case, so a correct brute force collects the small tests (Codility’s correctness part, HackerRank’s passed cases). Many platforms keep only the last submission, so submit the safe version first and overwrite it only with something that passes. Rewriting solved problems spends time for no points; an empty answer scores zero.|||VI: Điểm tính theo từng test ẩn, nên vét cạn đúng gom được các test nhỏ (phần correctness của Codility, số test qua của HackerRank). Nhiều nền tảng chỉ giữ lần nộp cuối, nên nộp bản an toàn trước và chỉ ghi đè bằng bản đã qua. Viết lại bài đã xong tốn giờ mà không thêm điểm; bỏ trống là 0 điểm.',
      },
      {
        question: 'Summary Ranges, "dirty" version: the code that closes a range is copied once inside the loop and once after it, and the start is x1 = a[0]. Run for real on the empty array [], what does the TypeScript version return?|||Summary Ranges, bản "bẩn": đoạn đóng một dải được chép một lần trong vòng lặp và một lần sau vòng, điểm đầu là x1 = a[0]. Chạy thật với mảng rỗng [], bản TypeScript trả về gì?',
        options: [
          '[] — the loop body never runs on an empty array, so nothing is ever pushed|||[] — thân vòng lặp không bao giờ chạy với mảng rỗng, nên không có gì được thêm vào',
          'A TypeError crash, because reading a[0] of an empty array is not allowed in JS|||Sập với TypeError, vì đọc a[0] của mảng rỗng là không được phép trong JS',
          '["undefined"] — the copied block after the loop pushes the missing a[0] as text|||["undefined"] — đoạn chép sau vòng lặp đẩy a[0] không tồn tại vào dưới dạng chữ',
          '["0"] — undefined is converted to the number 0 before it is turned into text|||["0"] — undefined bị đổi thành số 0 trước khi chuyển thành chữ',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: a[0] of an empty array is undefined in JS (no error), the loop does not run, and the duplicated "close the last range" block after it pushes "" + undefined = "undefined". The Java version throws ArrayIndexOutOfBoundsException. The clean version (an early return / a while loop that extends each run) returns []. Duplicated code is where forgotten edge cases hide.|||VI: a[0] của mảng rỗng trong JS là undefined (không báo lỗi), vòng lặp không chạy, và đoạn "đóng dải cuối" bị chép nằm sau vòng đẩy "" + undefined = "undefined". Bản Java ném ArrayIndexOutOfBoundsException. Bản sạch (trả về sớm / vòng while mở rộng từng dải) trả về []. Code bị lặp là chỗ các ca biên bị quên trốn vào.',
      },
    ],
  },
};
