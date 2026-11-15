/** 0.2 — Khung 6 bước giải mọi đề, minh hoạ trọn vẹn bằng LC 121. Mã/output: ../ma/ch00/mua-ban-*. */
import { maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, hoiThoai, baiNay, lienKet } from '../_chung.mjs';
import { vetMuaBan } from '../ma/ch00/mua-ban.vet.mjs';

const P = [7, 1, 5, 3, 6, 4];
const BANG = bangVet(['day', 'prices', 'minSoFar (before)', 'sell today', 'best', 'minSoFar (after)'],
  vetMuaBan(P).map((h) => {
    const minIdx = P.indexOf(h.minSau);
    return [String(h.i), oMang(P, { to: { [h.i]: 'r', ...(h.minTruoc !== Infinity ? { [P.indexOf(h.minTruoc)]: 'l' } : {}) } }),
      h.minTruoc === Infinity ? '∞' : String(h.minTruoc), h.loiNeuBan === null ? '—' : String(h.loiNeuBan), `<strong>${h.best}</strong>`, String(h.minSau) + (minIdx === h.i ? ' (new)' : '')];
  }));

const BAN_DO = [
  ['pair / complement, unsorted', 'cặp / phần bù, chưa sắp xếp', 'hash map', '1.1'],
  ['sum of a range, many queries; subarray sum = k', 'tổng một đoạn, nhiều truy vấn; mảng con tổng = k', 'prefix sum', '1.2'],
  ['sorted array, pair / triplet, palindrome', 'mảng đã sắp xếp, cặp / bộ ba, đối xứng', 'two pointers', '2.1'],
  ['longest / shortest contiguous subarray or substring with a condition', 'mảng con / chuỗi con liên tiếp dài nhất / ngắn nhất thoả điều kiện', 'sliding window', '2.2'],
  ['matching brackets, "next greater", undo', 'ngoặc khớp, "phần tử lớn hơn kế tiếp", hoàn tác', 'stack / monotonic stack', '3.1'],
  ['sorted or monotonic, "minimum X such that…"', 'đã sắp xếp hoặc đơn điệu, "X nhỏ nhất sao cho…"', 'binary search (on the answer)', '4.1 / 4.3'],
  ['tree, hierarchy, "for every node…"', 'cây, phân cấp, "với mọi nút…"', 'DFS / BFS on trees', '5.1'],
  ['top k, k-th largest, merge k sorted, running median', 'top k, lớn thứ k, gộp k dãy, trung vị động', 'heap', '6.1'],
  ['meetings, bookings, overlapping ranges', 'lịch họp, đặt chỗ, khoảng chồng nhau', 'intervals (sort by start)', '6.3'],
  ['grid / network / dependencies, shortest steps', 'lưới / mạng / phụ thuộc, số bước ít nhất', 'graph BFS / DFS / topo sort', '7.2 / 7.3'],
  ['all combinations / permutations / arrangements', 'mọi tổ hợp / hoán vị / cách sắp', 'backtracking', '8.1'],
  ['count ways / min cost / max value, choices overlap', 'đếm số cách / chi phí nhỏ nhất / giá trị lớn nhất, lựa chọn chồng chéo', 'dynamic programming', '9.1'],
];
const banDo = (lang) => `<table>\n<thead><tr><th>${lang === 'en' ? 'You see' : 'Bạn thấy'}</th><th>${lang === 'en' ? 'Try' : 'Thử'}</th><th>${lang === 'en' ? 'Lesson' : 'Bài'}</th></tr></thead>\n<tbody>\n` +
  BAN_DO.map((r) => `<tr><td>${lang === 'en' ? r[0] : r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('\n') + '\n</tbody></table>';

const DE = [
  [lc(121, 'best-time-to-buy-and-sell-stock', 'Best Time to Buy and Sell Stock', 'Easy'), 'The worked example of this lesson; do it again from a blank file with the six steps.', 'Ví dụ giải mẫu của bài; làm lại từ tệp trắng theo sáu bước.'],
  [lc(125, 'valid-palindrome', 'Valid Palindrome', 'Easy'), 'Clarify: which characters count? case? empty string? Then two pointers.', 'Hỏi làm rõ: ký tự nào được tính? hoa/thường? chuỗi rỗng? Rồi hai con trỏ.'],
  [lc(1672, 'richest-customer-wealth', 'Richest Customer Wealth', 'Easy'), 'Tiny problem for practising steps 1–2 and 6 out loud.', 'Đề rất nhỏ để luyện to thành tiếng bước 1–2 và 6.'],
  [lc(53, 'maximum-subarray', 'Maximum Subarray', 'Medium'), 'Brute force O(n²) → the same "best ending here" idea as LC 121 (Kadane).', 'Vét cạn O(n²) → cùng ý "tốt nhất kết thúc tại đây" như LC 121 (Kadane).'],
  [lc(238, 'product-of-array-except-self', 'Product of Array Except Self', 'Medium'), 'Clarify the "no division" rule; examples with a zero expose bugs.', 'Hỏi rõ luật "không dùng phép chia"; ví dụ có số 0 lộ ra lỗi.'],
  [lc(122, 'best-time-to-buy-and-sell-stock-ii', 'Best Time to Buy and Sell Stock II', 'Medium'), 'Follow-up of LC 121: many transactions. Same steps, new insight.', 'Câu hỏi nối tiếp của LC 121: được mua bán nhiều lần. Cùng các bước, ý chính mới.'],
];

export default {
  title: '0.2 — A framework for any problem|||0.2 — Khung giải mọi đề',
  slug: 'dsa-0-2-khung',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sáu bước — hỏi làm rõ, ví dụ, vét cạn, tối ưu, code, test — chạy trọn vẹn trên LC 121 với bảng vết và mô phỏng; lịch 45 phút; bản đồ "dấu hiệu → mẫu bài" của cả khoá.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>A framework for any problem</h2>
<p class="lead">When the problem appears on the screen, the worst thing you can do is start typing. The second worst is to sit in silence. This lesson gives you a six-step routine that turns 45 minutes of panic into a predictable process the interviewer can follow and score — and we run it end to end on one real problem, with every output coming from a real run.</p>

<h3>The everyday picture: a ticket at work</h3>
<p>In your SWP391 team project, the "product owner" writes: <em>"Students should see their best grade."</em> A good developer does not start coding. They ask: best grade of what — one course or all? What if a student has no grades yet? Then they write two or three examples that everyone agrees on (the acceptance criteria), build the simplest version that works, improve it if it is slow, and test the weird cases before saying "done". The six steps below are that same discipline, compressed into 45 minutes.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Khung giải mọi đề</h2>
<p class="lead">Khi đề hiện lên màn hình, điều tệ nhất bạn có thể làm là gõ ngay. Điều tệ thứ hai là ngồi im. Bài này cho bạn một quy trình sáu bước biến 45 phút hoảng loạn thành một tiến trình đoán trước được mà người phỏng vấn theo dõi và chấm điểm được — và ta chạy trọn vẹn nó trên một đề thật, mọi output đều lấy từ lần chạy thật.</p>

<h3>Hình dung đời thường: một ticket ở công ty</h3>
<p>Trong đồ án nhóm SWP391, "product owner" (chủ sản phẩm) ghi: <em>"Sinh viên muốn xem điểm cao nhất của mình."</em> Một lập trình viên tốt không code ngay. Họ hỏi: cao nhất của cái gì — một môn hay mọi môn? Sinh viên chưa có điểm nào thì sao? Rồi họ viết hai ba ví dụ cả nhóm cùng đồng ý (tiêu chí chấp nhận — acceptance criteria), dựng bản đơn giản nhất chạy được, cải tiến nếu chậm, và test những trường hợp lạ trước khi nói "xong". Sáu bước dưới đây là đúng kỷ luật đó, nén vào 45 phút.</p>
</div>

<div class="ml-en">
<h3>The six steps</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Understand &amp; clarify (3–5′)</span><span class="lz-d">Restate the problem in your own words. Ask about input size, empty input, duplicates, negatives, sortedness, output format, what to return if there is no answer.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Examples (2–3′)</span><span class="lz-d">Work one normal example by hand. Write one or two edge cases and their expected answers. These become your tests in step 6.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Brute force (2′)</span><span class="lz-d">Say the simplest correct idea and its complexity. Do not code it unless asked. It is your safety net.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Optimise (5–10′)</span><span class="lz-d">Read the constraints (0.1 table). Find the repeated work in the brute force. Match the signals to a pattern (map below). State the new complexity. Ask "shall I code this?"</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Code (15–20′)</span><span class="lz-d">Clear names, small helpers, narrate the one or two subtle decisions. Do not go silent for more than a minute.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Test (5′)</span><span class="lz-d">Trace your step-2 example through the code line by line, then the edge cases. Fix bugs out loud. Restate time and space.</span></div>
</div>
<p>The minute budget adds up to about 40; the remaining time is the greeting and your questions at the end. If the interviewer interrupts with a hint, that is not a failure: incorporate it and say what changed.</p>
</div>
<div class="ml-vi">
<h3>Sáu bước</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Hiểu &amp; hỏi làm rõ (3–5′)</span><span class="lz-d">Nói lại đề bằng lời của mình. Hỏi về kích thước đầu vào, đầu vào rỗng, phần tử trùng, số âm, đã sắp xếp chưa, định dạng kết quả, không có đáp án thì trả gì.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Ví dụ (2–3′)</span><span class="lz-d">Giải tay một ví dụ bình thường. Viết một hai trường hợp biên kèm đáp án mong đợi. Chúng thành bộ test ở bước 6.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Vét cạn (2′)</span><span class="lz-d">Nói ý tưởng đúng đơn giản nhất và độ phức tạp của nó. Không code nó trừ khi được yêu cầu. Nó là lưới an toàn của bạn.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tối ưu (5–10′)</span><span class="lz-d">Đọc ràng buộc (bảng ở bài 0.1). Tìm phần việc bị lặp trong bản vét cạn. Khớp dấu hiệu với một mẫu bài (bản đồ bên dưới). Nói độ phức tạp mới. Hỏi "em code bản này nhé?"</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Code (15–20′)</span><span class="lz-d">Tên biến rõ, hàm phụ nhỏ, thuật lại một hai quyết định tinh tế. Đừng im lặng quá một phút.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Test (5′)</span><span class="lz-d">Chạy tay ví dụ ở bước 2 qua từng dòng code, rồi tới các trường hợp biên. Sửa lỗi thành tiếng. Nhắc lại thời gian và bộ nhớ.</span></div>
</div>
<p>Ngân sách phút cộng lại khoảng 40; phần còn lại là chào hỏi và câu hỏi của bạn ở cuối buổi. Nếu người phỏng vấn ngắt lời để gợi ý, đó không phải là thất bại: hãy dùng gợi ý và nói rõ điều gì thay đổi.</p>
</div>

<div class="ml-en">
<h3>Running it: Best Time to Buy and Sell Stock (LC 121)</h3>
<p><strong>Step 1 — understand.</strong> <em>"I get the price of one stock for each day, in order. I may buy once and sell once, later. Return the biggest profit; if no trade makes money, return 0."</em> Clarifying questions and the answers that matter: can prices be equal or only fall? (yes ⇒ answer 0 must be possible); can I sell on the same day? (no ⇒ "later" is strict); how many days? (up to 10⁵ ⇒ step 4 target is O(n) or O(n log n)); can the list be empty? (assume it can, return 0).</p>
<p><strong>Step 2 — examples.</strong> <code>[7, 1, 5, 3, 6, 4]</code> → buy at 1, sell at 6 → <strong>5</strong> (not 7 − 1: you cannot sell before you buy). Edge cases: <code>[7, 6, 4, 3, 1]</code> → 0; <code>[5]</code> → 0; and a sneaky one, <code>[2, 4, 1, 3]</code> → 2, where the global minimum (1) comes <em>after</em> the best pair, so "find min, find max" is wrong.</p>
<p><strong>Step 3 — brute force.</strong> <em>"Try every buy day i and every later sell day j, keep the best difference: O(n²) time, O(1) space. With n = 10⁵ that is 5·10⁹ pairs — too slow, but correct."</em></p>
<p><strong>Step 4 — optimise.</strong> For a fixed sell day j, the inner loop is looking for one thing: the <em>cheapest</em> price before j. That is a single number we can carry along as we walk: <code>minSoFar</code>. One pass, O(n) time, O(1) space.</p>
</div>
<div class="ml-vi">
<h3>Chạy thử: Best Time to Buy and Sell Stock (LC 121)</h3>
<p><strong>Bước 1 — hiểu đề.</strong> <em>"Em có giá một cổ phiếu mỗi ngày, theo thứ tự. Em được mua một lần và bán một lần, bán sau ngày mua. Trả về lợi nhuận lớn nhất; nếu không giao dịch nào có lời thì trả 0."</em> Những câu hỏi làm rõ và câu trả lời có tác dụng: giá có thể bằng nhau hoặc chỉ giảm không? (có ⇒ đáp án 0 phải xảy ra được); bán cùng ngày được không? (không ⇒ "sau" là nghiêm ngặt); bao nhiêu ngày? (tới 10⁵ ⇒ đích ở bước 4 là O(n) hoặc O(n log n)); danh sách có rỗng được không? (giả sử có, trả 0).</p>
<p><strong>Bước 2 — ví dụ.</strong> <code>[7, 1, 5, 3, 6, 4]</code> → mua ở 1, bán ở 6 → <strong>5</strong> (không phải 7 − 1: không được bán trước khi mua). Trường hợp biên: <code>[7, 6, 4, 3, 1]</code> → 0; <code>[5]</code> → 0; và một ca "bẫy", <code>[2, 4, 1, 3]</code> → 2, nơi giá nhỏ nhất toàn cục (1) đến <em>sau</em> cặp tốt nhất, nên "tìm min, tìm max rồi trừ" là sai.</p>
<p><strong>Bước 3 — vét cạn.</strong> <em>"Thử mọi ngày mua i và mọi ngày bán j sau đó, giữ hiệu lớn nhất: O(n²) thời gian, O(1) bộ nhớ. Với n = 10⁵ là 5·10⁹ cặp — quá chậm, nhưng đúng."</em></p>
<p><strong>Bước 4 — tối ưu.</strong> Với một ngày bán j cố định, vòng trong chỉ đi tìm một thứ: giá <em>rẻ nhất</em> trước ngày j. Đó chỉ là một con số ta mang theo khi đi: <code>minSoFar</code> (rẻ nhất tới giờ). Một lượt, O(n) thời gian, O(1) bộ nhớ.</p>
</div>
${maHai('ch00/mua-ban-co-phieu.ts', 'ch00/MuaBanCoPhieu.java', { vungTs: 'tot', vungJava: 'tot' })}
<div class="ml-en">
<p><strong>Step 5 — code, narrated.</strong> Two decisions worth saying out loud: <code>best</code> starts at 0, not at −∞, because "do nothing" is allowed; and inside the loop we compute the profit <em>before</em> updating <code>minSoFar</code>, so we never sell on the day we buy. (The Java version also guards <code>p − Integer.MAX_VALUE</code> on day 0 — with non-negative prices it cannot overflow, but writing the guard costs nothing and avoids the question.)</p>
<p><strong>Step 6 — test.</strong> Trace the main example through the loop. This table is produced by running the algorithm: red = today, blue = the cheapest earlier day.</p>
</div>
<div class="ml-vi">
<p><strong>Bước 5 — code, vừa gõ vừa thuật.</strong> Hai quyết định đáng nói to: <code>best</code> bắt đầu bằng 0, không phải −∞, vì "không làm gì" là được phép; và trong vòng lặp ta tính lợi nhuận <em>trước</em> khi cập nhật <code>minSoFar</code>, nên không bao giờ bán đúng ngày mua. (Bản Java còn chặn phép <code>p − Integer.MAX_VALUE</code> ở ngày 0 — với giá không âm thì không tràn số được, nhưng viết thêm dòng chặn chẳng tốn gì và khỏi bị hỏi vặn.)</p>
<p><strong>Bước 6 — test.</strong> Chạy tay ví dụ chính qua vòng lặp. Bảng này sinh ra bằng cách chạy thuật toán thật: đỏ = hôm nay, xanh dương = ngày rẻ nhất trước đó.</p>
</div>
${BANG}
<div class="ml-en">
<p>Read the "best" column: it becomes 4 on day 2 (buy 1, sell 5), then 5 on day 4 (buy 1, sell 6), and stays 5. Then run all the examples from step 2, against the brute force as a second opinion:</p>
</div>
<div class="ml-vi">
<p>Đọc cột "best": thành 4 ở ngày 2 (mua 1, bán 5), rồi 5 ở ngày 4 (mua 1, bán 6), và giữ nguyên 5. Sau đó chạy toàn bộ ví dụ từ bước 2, đối chiếu với bản vét cạn như một "ý kiến thứ hai":</p>
</div>
${ketQua('ch00/mua-ban-co-phieu.ts')}
${ketQua('ch00/MuaBanCoPhieu.java')}
<div class="ml-en">
<p>All six pass, including the sneaky <code>[2, 4, 1, 3]</code>. Comparing a fast solution with a slow-but-obviously-correct one on many inputs is called <strong>differential testing</strong> (or a brute-force oracle); in a real codebase you would generate a thousand random arrays and compare. Finish with the complexity sentence: <em>"O(n) time, O(1) extra space."</em></p>
${moPhong('ch00/mua-ban.sim.js', 'en', 'LC 121 — minSoFar walking along the prices', 'Array + bar chart: today in one colour, the cheapest earlier day in another, the log explains each step.')}
</div>
<div class="ml-vi">
<p>Cả sáu đều qua, kể cả ca bẫy <code>[2, 4, 1, 3]</code>. So một lời giải nhanh với một lời giải chậm-nhưng-hiển-nhiên-đúng trên nhiều đầu vào gọi là <strong>differential testing (kiểm thử đối chiếu)</strong> — hay "dùng vét cạn làm trọng tài"; ở dự án thật bạn sẽ sinh ngẫu nhiên một nghìn mảng rồi so. Kết thúc bằng câu độ phức tạp: <em>"O(n) thời gian, O(1) bộ nhớ phụ."</em></p>
${moPhong('ch00/mua-ban.sim.js', 'vi', 'LC 121 — minSoFar đi dọc dãy giá', 'Mảng + biểu đồ cột: hôm nay một màu, ngày rẻ nhất trước đó một màu, nhật ký giải thích từng bước.')}
</div>

<div class="ml-en">
<h3>The pattern map: signals → pattern → lesson</h3>
<p>Step 4 is where knowledge enters. When you cannot see the trick, scan this map — every chapter of the course is a row. You will refine it in your own notebook as you learn.</p>
${banDo('en')}
</div>
<div class="ml-vi">
<h3>Bản đồ mẫu bài: dấu hiệu → mẫu → bài học</h3>
<p>Bước 4 là chỗ kiến thức bước vào. Khi chưa thấy mẹo, quét bản đồ này — mỗi chương của khoá là một dòng. Bạn sẽ chỉnh nó dần trong sổ của mình khi học.</p>
${banDo('vi')}
</div>

<div class="ml-en">
<h3>Step 1 checklist: the clarifying questions</h3>
<ul>
<li><strong>Size:</strong> how large can n be? (decides the target complexity)</li>
<li><strong>Empty / single:</strong> can the input be empty or have one element? What do I return?</li>
<li><strong>Values:</strong> negatives? zeros? duplicates? very large numbers (overflow in Java <code>int</code>)?</li>
<li><strong>Order:</strong> is it sorted? Does the output order matter?</li>
<li><strong>Answers:</strong> exactly one, several (return any?), or none (what then)?</li>
<li><strong>Constraints on me:</strong> in place? O(1) extra space? no division? may I modify the input?</li>
</ul>
<p>You will not ask all of them every time — ask the two or three that change your code. Asking nothing is a red flag; asking twenty is stalling.</p>
</div>
<div class="ml-vi">
<h3>Bảng kiểm bước 1: những câu hỏi làm rõ</h3>
<ul>
<li><strong>Kích thước:</strong> n lớn tới đâu? (quyết định độ phức tạp đích)</li>
<li><strong>Rỗng / một phần tử:</strong> đầu vào rỗng hoặc chỉ một phần tử được không? Khi đó trả gì?</li>
<li><strong>Giá trị:</strong> có số âm? số 0? trùng lặp? số rất lớn (tràn <code>int</code> của Java)?</li>
<li><strong>Thứ tự:</strong> đã sắp xếp chưa? Thứ tự kết quả có quan trọng không?</li>
<li><strong>Đáp án:</strong> đúng một, nhiều (trả cái nào cũng được?), hay không có (khi đó làm gì)?</li>
<li><strong>Ràng buộc với lời giải:</strong> làm tại chỗ (in place)? bộ nhớ phụ O(1)? không dùng phép chia? được sửa đầu vào không?</li>
</ul>
<p>Không cần hỏi hết mọi lần — hỏi hai ba câu làm thay đổi code của bạn. Không hỏi gì là dấu hiệu xấu; hỏi hai mươi câu là câu giờ.</p>
</div>

<div class="ml-en">
<h3>🕵️ Step 6 is how attackers think, too</h3>
<p>The edge cases you test in step 6 — empty input, one element, huge values, duplicates, the "minimum after the maximum" case — are the same inputs an attacker or a fuzzer throws at an API: an empty JSON array, a negative quantity in a shopping cart, 2³¹ in a field that is stored in an <code>int</code>, a list of a million items. Production bugs like "negative quantity gives the customer money back" or "a huge page size freezes the server" are exactly step-6 failures. Building the habit in interviews pays off the first time you write an endpoint.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Bước 6 cũng là cách kẻ tấn công suy nghĩ</h3>
<p>Những trường hợp biên bạn test ở bước 6 — đầu vào rỗng, một phần tử, giá trị khổng lồ, trùng lặp, ca "nhỏ nhất nằm sau lớn nhất" — cũng chính là những đầu vào kẻ tấn công hay một công cụ fuzz (sinh dữ liệu bậy) ném vào API: một mảng JSON rỗng, số lượng âm trong giỏ hàng, giá trị 2³¹ ở một trường lưu bằng <code>int</code>, một danh sách một triệu phần tử. Những lỗi production kiểu "số lượng âm làm shop trả tiền ngược cho khách" hay "page size thật lớn làm treo máy chủ" chính là thất bại ở bước 6. Tập thói quen này khi phỏng vấn sẽ trả công ngay lần đầu bạn viết một endpoint.</p>
${lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'API Design 2.2 — Kiểm dữ liệu vào ngay cửa', sub: 'Schema, object strict, 415 và 413 — bước 6 viết thành code chặn ở API', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🎤 The whole routine in one conversation (LC 121)</h3>
${hoiThoai([
  ['I', 'You get daily stock prices. Find the maximum profit from one buy and one later sell.'],
  ['C', 'Let me restate: one buy, one sell strictly after it, return the best profit, and 0 if no trade makes money. How many days can there be, and can the list be empty?'],
  ['I', 'Up to 10⁵ days; assume it can be empty.'],
  ['C', 'Example: 7, 1, 5, 3, 6, 4 gives 5 — buy at 1, sell at 6. Edge cases: a falling list gives 0, and 2, 4, 1, 3 gives 2 — the minimum comes after the best pair, so I cannot just subtract min from max.'],
  ['N', 'The sneaky example shows the interviewer you thought before coding.'],
  ['C', 'Brute force is every pair, O(n²) — 5·10⁹ pairs at 10⁵, too slow. But for each sell day I only need the cheapest earlier price, which I can carry as I walk. One pass, O(n) time, O(1) space. Shall I code it?'],
  ['I', 'Please.'],
  ['C', '(coding) best starts at 0 because not trading is allowed… I compute today’s profit before updating the minimum, so I never sell on the buying day.'],
  ['C', 'Testing 2, 4, 1, 3: min becomes 2, profit at 4 is 2, min becomes 1, profit at 3 is 2. Returns 2. Empty list: the loop does not run, returns 0. O(n) time, O(1) space.'],
  ['I', 'What if you could make as many transactions as you like?'],
  ['C', 'Then every rising day-to-day step is profit I can take, so I sum all positive differences — that is LC 122, still O(n).'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Cả quy trình trong một cuộc hội thoại (LC 121)</h3>
${hoiThoai([
  ['I', 'Cho giá cổ phiếu từng ngày. Tìm lợi nhuận lớn nhất từ một lần mua và một lần bán sau đó.'],
  ['C', 'Em nói lại nhé: mua một lần, bán một lần sau ngày mua, trả lợi nhuận tốt nhất, và 0 nếu không giao dịch nào có lời. Có tối đa bao nhiêu ngày, và danh sách có thể rỗng không ạ? <em>("Let me restate the problem…")</em>'],
  ['I', 'Tới 10⁵ ngày; cứ giả sử có thể rỗng.'],
  ['C', 'Ví dụ: 7, 1, 5, 3, 6, 4 cho 5 — mua ở 1, bán ở 6. Ca biên: dãy giảm dần cho 0, và 2, 4, 1, 3 cho 2 — giá nhỏ nhất đến sau cặp tốt nhất, nên không thể lấy max trừ min.'],
  ['N', 'Ví dụ "bẫy" cho người phỏng vấn thấy bạn đã nghĩ trước khi code.'],
  ['C', 'Vét cạn là mọi cặp, O(n²) — 5·10⁹ cặp ở 10⁵, quá chậm. Nhưng với mỗi ngày bán em chỉ cần giá rẻ nhất trước đó, thứ em mang theo được khi đi. Một lượt, O(n) thời gian, O(1) bộ nhớ. Em code nhé? <em>("Shall I go ahead and code it?")</em>'],
  ['I', 'Ừ.'],
  ['C', '(vừa code) best bắt đầu bằng 0 vì không giao dịch là được phép… Em tính lợi nhuận hôm nay trước khi cập nhật giá rẻ nhất, nên không bao giờ bán đúng ngày mua.'],
  ['C', 'Test 2, 4, 1, 3: min thành 2, lời ở 4 là 2, min thành 1, lời ở 3 là 2. Trả 2. Danh sách rỗng: vòng không chạy, trả 0. O(n) thời gian, O(1) bộ nhớ.'],
  ['I', 'Nếu được giao dịch bao nhiêu lần tuỳ thích thì sao?'],
  ['C', 'Khi đó mọi bước tăng giá giữa hai ngày liền nhau đều là lợi nhuận lấy được, nên em cộng mọi hiệu dương — đó là LC 122, vẫn O(n).'],
], 'vi')}
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>"min and max" instead of "min so far".</strong></p><p>The most common wrong answer to LC 121 is <code>max(prices) − min(prices)</code>. It fails exactly on <code>[2, 4, 1, 3]</code> (returns 3, answer is 2) — which is why step 2 asks for one sneaky example before you code.</p></div>
<h3>Common mistakes</h3>
<ul>
<li>Skipping step 2 and discovering in step 6 that you misunderstood the problem.</li>
<li>Coding the brute force "to have something" when it is obviously too slow — say it, don't code it, unless asked.</li>
<li>Optimising without reading the constraints (aiming for O(n) when O(n log n) is plenty and simpler).</li>
<li>Testing by saying "looks right" instead of tracing variables line by line.</li>
<li>Forgetting to restate the final complexity.</li>
</ul>
<h3>Practice problems</h3>
${bangDe(DE, 'en')}
<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Open a blank file and a timer. Solve LC 121 again, speaking all six steps out loud (record yourself on your phone).</li>
<li>Listen to the recording: count the seconds of silence longer than 30. Write the number in your log.</li>
<li>Do LC 125 the same way; in step 1 ask yourself at least three clarifying questions and write them down.</li>
</ol>
<p><strong>Done when:</strong> both accepted, a recording exists, and you have your "silence count" — the number you will push down over the next weeks.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">clarifying question</span><span class="v">A question that removes ambiguity before you design anything.</span></div>
  <div class="kv"><span class="k">brute force</span><span class="v">The simplest correct solution, usually trying everything.</span></div>
  <div class="kv"><span class="k">trace</span><span class="v">Running code by hand, writing variable values after each step.</span></div>
  <div class="kv"><span class="k">differential testing</span><span class="v">Comparing a fast solution with a slow trusted one on many inputs.</span></div>
  <div class="kv"><span class="k">follow-up</span><span class="v">The interviewer's variation after you solve the problem.</span></div>
  <div class="kv"><span class="k">acceptance criteria</span><span class="v">Concrete examples that define "done" for a task.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Six steps: clarify, examples, brute force, optimise, code, test.</li>
<li>Step 2's examples become step 6's tests; include one sneaky case.</li>
<li>Say the brute force and its complexity before optimising.</li>
<li>Optimise by finding repeated work and matching signals to a pattern.</li>
<li>Narrate decisions while coding; never go silent for long.</li>
<li>Trace, test edge cases, restate time and space.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — coding interview cheatsheet', 'Before, during and after the interview: a checklist', 'https://www.techinterviewhandbook.org/coding-interview-cheatsheet/')}
${nguon('📗', 'NeetCode roadmap', 'The pattern tree this course follows', 'https://neetcode.io/roadmap')}
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>"min và max" thay vì "min tới giờ".</strong></p><p>Đáp án sai phổ biến nhất của LC 121 là <code>max(prices) − min(prices)</code>. Nó sai đúng ở <code>[2, 4, 1, 3]</code> (trả 3, đáp án là 2) — vì thế bước 2 đòi một ví dụ "bẫy" trước khi code.</p></div>
<h3>Lỗi hay gặp</h3>
<ul>
<li>Bỏ bước 2 rồi tới bước 6 mới phát hiện mình hiểu sai đề.</li>
<li>Code bản vét cạn "cho có cái gì đó" khi nó rõ ràng quá chậm — nói ra, đừng code, trừ khi được yêu cầu.</li>
<li>Tối ưu mà không đọc ràng buộc (cố đạt O(n) khi O(n log n) là đủ và đơn giản hơn).</li>
<li>Test bằng câu "trông đúng rồi" thay vì chạy tay từng biến qua từng dòng.</li>
<li>Quên nhắc lại độ phức tạp cuối cùng.</li>
</ul>
<h3>Đề luyện</h3>
${bangDe(DE, 'vi')}
<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở một tệp trắng và đồng hồ bấm giờ. Giải lại LC 121, nói to đủ sáu bước (ghi âm bằng điện thoại).</li>
<li>Nghe lại bản ghi: đếm số lần im lặng dài hơn 30 giây. Ghi con số vào sổ.</li>
<li>Làm LC 125 theo cùng cách; ở bước 1 tự hỏi ít nhất ba câu làm rõ và ghi chúng ra.</li>
</ol>
<p><strong>Đạt khi:</strong> cả hai Accepted, có bản ghi âm, và có "số lần im lặng" — con số bạn sẽ đẩy xuống trong các tuần tới.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">clarifying question (câu hỏi làm rõ)</span><span class="v">Câu hỏi xoá chỗ mơ hồ trước khi thiết kế gì.</span></div>
  <div class="kv"><span class="k">brute force (vét cạn)</span><span class="v">Lời giải đúng đơn giản nhất, thường là thử mọi khả năng.</span></div>
  <div class="kv"><span class="k">trace (chạy tay)</span><span class="v">Chạy code bằng tay, ghi giá trị các biến sau mỗi bước.</span></div>
  <div class="kv"><span class="k">differential testing (kiểm thử đối chiếu)</span><span class="v">So lời giải nhanh với một lời giải chậm đáng tin trên nhiều đầu vào.</span></div>
  <div class="kv"><span class="k">follow-up (câu hỏi nối tiếp)</span><span class="v">Biến thể người phỏng vấn đưa ra sau khi bạn giải xong.</span></div>
  <div class="kv"><span class="k">acceptance criteria (tiêu chí chấp nhận)</span><span class="v">Các ví dụ cụ thể định nghĩa "xong" cho một việc.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Sáu bước: làm rõ, ví dụ, vét cạn, tối ưu, code, test.</li>
<li>Ví dụ ở bước 2 thành bộ test ở bước 6; có ít nhất một ca "bẫy".</li>
<li>Nói vét cạn và độ phức tạp của nó trước khi tối ưu.</li>
<li>Tối ưu bằng cách tìm phần việc lặp và khớp dấu hiệu với mẫu bài.</li>
<li>Vừa code vừa thuật lại quyết định; không im lặng lâu.</li>
<li>Chạy tay, test ca biên, nhắc lại thời gian và bộ nhớ.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — coding interview cheatsheet', 'Bảng kiểm trước, trong và sau buổi phỏng vấn (tiếng Anh)', 'https://www.techinterviewhandbook.org/coding-interview-cheatsheet/')}
${nguon('📗', 'NeetCode roadmap', 'Cây mẫu bài mà khoá này đi theo', 'https://neetcode.io/roadmap')}
</div>
`,
};
