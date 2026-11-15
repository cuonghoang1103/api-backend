/** 11.4 (slug ★ dsa-11-5-thu-3) — Phỏng vấn thử 3 (Medium + Hard): LC 695 + LC 1235. Mã/output: ../ma/ch11/b5 (chạy thật bằng _chay.mjs). */
import { ma, maHai, ketQua, bangVet, lc, bangDe, moPhong, nguon, hoiThoai, lienKet } from '../_chung.mjs';
import { THE, bangChamDiem, nguongKetLuan, bienBan, bangHoiDap, bangGoiY } from './_rieng.mjs';
import { vetLichViec } from '../ma/ch11/b5/jobs.vet.mjs';

const S = [8, 9, 13, 10], EN = [10, 12, 15, 14], P = [3, 5, 4, 6];
const VET = vetLichViec(S, EN, P);
const BANG_VIEC = bangVet(['i (by end)', 'job: start–end, profit', 'j = jobs ending ≤ start', 'skip = dp[i−1]', 'take = profit + dp[j]', 'dp[0..i]'],
  VET.map((h) => [
    String(h.i),
    `#${h.job}: ${h.s}–${h.e}, ${h.p}`,
    String(h.j),
    String(h.bo),
    String(h.lay),
    `<code>[${h.dp.join(', ')}]</code>`,
  ]));

const RIENG = {
  en: [
    'asks whether the grid may be modified, and whether a job ending at X is compatible with one starting at X.',
    'problem 2: states the take/skip recurrence before coding, and names binary search as the speed-up without hints.',
    'flood fill with marking on push (no double count); DP with a correct upper-bound search (<code>&gt;</code> not <code>&gt;=</code>).',
    'traces touching jobs (end = start) and an all-overlapping set; raises recursion depth for large grids unprompted.',
  ],
  vi: [
    'hỏi có được sửa lưới không, và việc kết thúc lúc X có ghép được với việc bắt đầu lúc X không.',
    'đề 2: nói công thức lấy/bỏ trước khi code, và tự gọi tên tìm nhị phân là cách tăng tốc không cần gợi ý.',
    'loang có đánh dấu lúc push (không đếm trùng); DP với phép tìm cận trên đúng (<code>&gt;</code> chứ không phải <code>&gt;=</code>).',
    'chạy tay các việc nối đuôi (kết thúc = bắt đầu) và một tập việc chồng hết lên nhau; tự nêu chuyện độ sâu đệ quy với lưới lớn.',
  ],
};

const DE = [
  [lc(695, 'max-area-of-island', 'Max Area of Island', 'Medium'), 'Problem 1. Flood fill each island once; count while you fill.', 'Đề 1. Loang mỗi đảo một lần; đếm trong lúc loang.'],
  [lc(1235, 'maximum-profit-in-job-scheduling', 'Maximum Profit in Job Scheduling', 'Hard'), 'Problem 2. Sort by end; take or skip; binary search for the last compatible job.', 'Đề 2. Sắp theo giờ kết thúc; lấy hay bỏ; tìm nhị phân việc cuối còn hợp.'],
  [lc(692, 'top-k-frequent-words', 'Top K Frequent Words', 'Medium'), 'Spare problem: a count map + a heap or sort with a two-key comparator.', 'Đề dự phòng: map đếm + heap hoặc sắp xếp với comparator hai khoá.'],
  [lc(1751, 'maximum-number-of-events-that-can-be-attended-ii', 'Maximum Number of Events That Can Be Attended II', 'Hard'), 'Problem 2 with "at most k jobs": add a dimension to the DP.', 'Đề 2 với "tối đa k việc": thêm một chiều cho DP.'],
  [lc(2008, 'maximum-earnings-from-taxi', 'Maximum Earnings From Taxi', 'Medium'), 'Same weighted scheduling, a different costume.', 'Cùng xếp lịch có trọng số, khác vỏ.'],
  [lc(1020, 'number-of-enclaves', 'Number of Enclaves', 'Medium'), 'Flood fill from the border first — a twist on problem 1.', 'Loang từ biên trước — một biến tấu của đề 1.'],
];

export default {
  title: '11.4 — Mock interview 3 (Medium + Hard): the dress rehearsal|||11.4 — Phỏng vấn thử 3 (Medium + Hard): buổi tổng duyệt',
  slug: 'dsa-11-5-thu-3',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Buổi tổng duyệt trong điều kiện gần thật nhất (online, người lạ, tiếng Anh) với Max Area of Island và đề Hard Maximum Profit in Job Scheduling: chiến lược lấy điểm từng phần với đề Hard, kịch bản người phỏng vấn, độ sâu đệ quy đo thật, O(n²) vs O(n log n) đo thật, lời giải TS + Java.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4 · Mock set 3</span>
<h2>Mock interview 3 (Medium + Hard): the dress rehearsal</h2>
<p class="lead">The last set is the closest you can get to the real thing before the real thing: on a video call, with an interviewer you do not know well, in English if your targets are foreign, with a Medium you should finish and a Hard you probably will not finish perfectly. That last part is deliberate. Real rounds sometimes include a problem the interviewer does not expect you to solve completely; what they score is how far you get, how you get there, and whether you can make an honest, working partial solution. This lesson teaches that strategy and gives you a Hard to practise it on.</p>
<div class="callout warn"><p><strong>Candidate: stop at "⛔ Interviewer only".</strong> Read the setup, the Hard-problem strategy, the timeline and the rubric.</p></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4 · Bộ thử 3</span>
<h2>Phỏng vấn thử 3 (Medium + Hard): buổi tổng duyệt</h2>
<p class="lead">Bộ cuối là thứ gần với buổi thật nhất mà bạn có được trước buổi thật: qua cuộc gọi video, với một người phỏng vấn bạn không thân, bằng tiếng Anh nếu công ty bạn nhắm là nước ngoài, với một đề Medium bạn nên làm xong và một đề Hard có lẽ bạn sẽ không làm hoàn hảo. Phần cuối là cố ý. Vòng thật đôi khi có một đề mà người phỏng vấn không chờ bạn giải trọn; thứ họ chấm là bạn đi được bao xa, đi bằng cách nào, và có dựng được một lời giải dở dang nhưng trung thực, chạy được hay không. Bài này dạy chiến lược đó và đưa bạn một đề Hard để tập.</p>
<div class="callout warn"><p><strong>Ứng viên: dừng ở "⛔ Chỉ người phỏng vấn đọc".</strong> Đọc phần dựng buổi, chiến lược với đề Hard, dòng thời gian và phiếu chấm.</p></div>
</div>

<div class="ml-en">
<h3>The everyday picture: the dress rehearsal</h3>
<p>Theatre groups do one rehearsal in full costume, with lights and sound, straight through without stopping, a few days before opening night. Nothing new is learned there. Its only job is to surface the problems that appear only under real conditions: a costume change that takes 40 seconds instead of 20, a microphone that cuts out. An interview has its own "costume" problems that a mock with your best friend in the library never shows: the video call lags, screen sharing shows the wrong window, your English disappears when someone you do not know is watching. Mock 3 is the dress rehearsal: same rubric, real conditions.</p>
</div>
<div class="ml-vi">
<h3>Hình dung đời thường: buổi tổng duyệt</h3>
<p>Các đoàn kịch có một buổi diễn đủ trang phục, đủ đèn và âm thanh, chạy liền một mạch không dừng, vài ngày trước đêm công diễn. Ở buổi đó chẳng học thêm gì mới. Việc duy nhất của nó là làm lộ ra những trục trặc chỉ xuất hiện trong điều kiện thật: một lần thay trang phục mất 40 giây thay vì 20, một chiếc micro chập chờn. Buổi phỏng vấn cũng có những trục trặc "trang phục" riêng mà buổi thử với bạn thân trong thư viện không bao giờ cho thấy: cuộc gọi video bị giật, chia sẻ màn hình nhầm cửa sổ, tiếng Anh của bạn biến mất khi có người lạ đang nhìn. Buổi thử 3 là buổi tổng duyệt: cùng phiếu chấm, điều kiện thật.</p>
</div>

<div class="ml-en">
<h3>Setup: real conditions</h3>
<ul>
<li><strong>A different interviewer</strong> — someone from another class, a senior who has done OJT, or a club member. Unfamiliar faces change how you speak.</li>
<li><strong>A video call</strong> (Google Meet, Zoom, Teams — whichever the company uses), camera on, screen shared, the candidate at home or in an empty room. Test the share 10 minutes before: share the editor window, not the whole screen with your chat notifications.</li>
<li><strong>English</strong> for foreign targets; the interviewer reads the script in English.</li>
<li><strong>Your interview-day checklist</strong> (lesson 11.5) — use this session to test it: charger plugged in, phone on silent, backup hotspot, water, paper and pen.</li>
<li>AI assistants off, timer with the interviewer, recording only with consent.</li>
</ul>
<h3>Strategy for a Hard problem: climb the partial-credit ladder</h3>
<p>On a Hard, the worst outcome is 25 minutes of silent searching for the perfect idea and nothing on the screen. The best realistic outcome is a ladder where each rung is a working, explained solution:</p>
<div class="lz-flow">
${THE('Rung 1', 'Brute force, said aloud (1–2′)', 'Correct, slow, with its complexity. It proves you understood the problem and gives the interviewer something to score.')}
${THE('Rung 2', 'A correct polynomial solution (coded)', 'Often a DP that is O(n²): correct, accepted for small inputs, and the base for rung 3. If time is short, code THIS and say so.')}
${THE('Rung 3', 'Name the bottleneck', '"The inner loop searches for the last compatible job — that search is over a sorted array." Naming it earns most of the credit even before you code it.')}
${THE('Rung 4', 'The optimal solution', 'Replace the bottleneck (binary search, heap, monotonic stack). If you run out of time, point at the one line that changes.')}
</div>
<p>Say the plan out loud at the start: <em>"I'll get a correct O(n²) version first, then see if the inner search can be faster."</em> Interviewers rate that as strong problem solving, because it is exactly how engineers handle hard problems at work.</p>
</div>
<div class="ml-vi">
<h3>Dựng buổi: điều kiện thật</h3>
<ul>
<li><strong>Một người phỏng vấn khác</strong> — bạn lớp khác, một anh chị khoá trên đã đi OJT, hoặc một thành viên câu lạc bộ. Gương mặt lạ làm đổi cách bạn nói.</li>
<li><strong>Cuộc gọi video</strong> (Google Meet, Zoom, Teams — công ty dùng gì thì dùng nấy), bật camera, chia sẻ màn hình, ứng viên ngồi ở nhà hoặc phòng trống. Thử chia sẻ 10 phút trước: chia sẻ ĐÚNG cửa sổ trình soạn, không phải cả màn hình kèm thông báo chat.</li>
<li><strong>Tiếng Anh</strong> với công ty nước ngoài; người phỏng vấn đọc kịch bản bằng tiếng Anh.</li>
<li><strong>Checklist ngày phỏng vấn</strong> (bài 11.5) — dùng buổi này để thử nó: cắm sạc, điện thoại im lặng, có 4G dự phòng, nước uống, giấy bút.</li>
<li>Tắt trợ lý AI, đồng hồ ở phía người phỏng vấn, chỉ ghi hình khi cả hai đồng ý.</li>
</ul>
<h3>Chiến lược với đề Hard: leo thang điểm từng phần</h3>
<p>Với đề Hard, kết cục tệ nhất là 25 phút im lặng đi tìm ý tưởng hoàn hảo và trên màn hình không có gì. Kết cục tốt nhất mà thực tế là một cái thang, mỗi bậc là một lời giải chạy được và đã giải thích:</p>
<div class="lz-flow">
${THE('Bậc 1', 'Vét cạn, nói thành lời (1–2′)', 'Đúng, chậm, kèm độ phức tạp. Nó chứng tỏ bạn hiểu đề và cho người phỏng vấn thứ để chấm.')}
${THE('Bậc 2', 'Một lời giải đa thức đúng (có code)', 'Thường là một DP O(n²): đúng, qua được đầu vào nhỏ, và là nền cho bậc 3. Thiếu giờ thì code BẢN NÀY và nói rõ như vậy.')}
${THE('Bậc 3', 'Gọi tên nút thắt cổ chai', '"Vòng trong đang tìm việc cuối cùng còn hợp — phép tìm đó chạy trên một mảng đã sắp." Gọi được tên là đã lấy phần lớn số điểm, kể cả trước khi code.')}
${THE('Bậc 4', 'Lời giải tối ưu', 'Thay nút thắt (tìm nhị phân, heap, ngăn xếp đơn điệu). Hết giờ thì chỉ vào đúng một dòng sẽ đổi.')}
</div>
<p>Nói kế hoạch thành tiếng ngay từ đầu: <em>"Em sẽ làm một bản O(n²) đúng trước, rồi xem phép tìm bên trong có nhanh hơn được không." ("I'll get a correct O(n²) version first, then see if the inner search can be faster.")</em> Người phỏng vấn chấm cách đó là giải quyết vấn đề tốt, vì đó chính là cách kỹ sư xử lý bài khó khi đi làm.</p>
</div>

<div class="ml-en">
<h3>The 45 minutes</h3>
<div class="lz-flow">
${THE('0–2′', 'Opening', 'On camera. One-line intro, the format, "think out loud".')}
${THE('2–17′', 'Problem 1 (Medium)', 'Target 15 minutes — you have done this pattern before; speed is part of the score.')}
${THE('17–42′', 'Problem 2 (Hard)', '25 minutes. A working O(n²) by 32′ is a good session; O(n log n) by 42′ is a strong one.')}
${THE('42–45′', 'Questions', 'One real question — about the team or the work, in English.')}
${THE('+15′', 'Debrief', 'Rubric, verdict, and a three-session comparison.')}
</div>
<h3>The rubric</h3>
${bangChamDiem('en', RIENG)}
${nguongKetLuan('en')}
<p>For this set only: on problem 2, a correct O(n²) solution with the bottleneck named counts as "working code" for the verdict rule. A Hard is graded on the ladder, not on all-or-nothing.</p>
</div>
<div class="ml-vi">
<h3>Dòng thời gian 45 phút</h3>
<div class="lz-flow">
${THE('0–2′', 'Mở đầu', 'Bật camera. Giới thiệu một câu, nói thể thức, "nghĩ thành tiếng".')}
${THE('2–17′', 'Đề 1 (Medium)', 'Mục tiêu 15 phút — bạn đã gặp mẫu này rồi; tốc độ là một phần của điểm.')}
${THE('17–42′', 'Đề 2 (Hard)', '25 phút. Có bản O(n²) chạy được trước phút 32 là buổi tốt; O(n log n) trước phút 42 là buổi mạnh.')}
${THE('42–45′', 'Hỏi ngược', 'Một câu hỏi thật — về đội hoặc công việc, bằng tiếng Anh.')}
${THE('+15′', 'Rút kinh nghiệm', 'Phiếu chấm, kết luận, và bảng so ba buổi.')}
</div>
<h3>Phiếu chấm</h3>
${bangChamDiem('vi', RIENG)}
${nguongKetLuan('vi')}
<p>Riêng bộ này: ở đề 2, một lời giải O(n²) đúng kèm đã gọi tên nút thắt được tính là "code chạy được" trong luật kết luận. Đề Hard được chấm theo cái thang, không theo kiểu được ăn cả ngã về không.</p>
</div>

<div class="ml-en">
<h2>⛔ Interviewer only</h2>
<p>The three rules again — no typing in their code, no nodding at wrong ideas, hints only at the written minutes. For the Hard problem, one more: if at minute 30 they are still searching for the optimal idea with nothing coded, say <em>"Would you like to code what you have first?"</em> — it is the realistic nudge a kind interviewer gives, and it costs nothing on the rubric.</p>
<h3>Opening</h3>
<p><em>"Hi, I'm [name], nice to meet you. We'll do two problems in about 40 minutes, then you can ask me anything. Please talk me through your thinking. Can you see my screen / can I see yours? Great, let's start."</em></p>
<h3>Problem 1 — the satellite map (LC 695, Medium, 15′)</h3>
<p><strong>Say this:</strong> <em>"A satellite image of a coastline is a grid of 0s and 1s — 1 is land, 0 is water. Two land cells belong to the same island if they touch horizontally or vertically. Return the area, in cells, of the largest island, or 0 if there is no land."</em> Example when asked: <code>[[1,1,0],[1,0,0],[0,0,1]]</code> → 3.</p>
${bangHoiDap('en', [
  ['How big can the grid be?', 'Up to 50 × 50. (Later: what if it were 1000 × 1000?)'],
  ['Do diagonals count?', 'No, only up, down, left, right.'],
  ['May I modify the grid?', 'I would prefer you did not — other code reads it. (A good candidate then copies it or uses a visited array.)'],
  ['Can it be empty?', 'At least 1 × 1.'],
  ['Area or the cells?', 'Just the area.'],
])}
${bangGoiY('en', [
  ['minute 4 and no traversal idea', '"From one land cell, how would you reach every cell of the same island?"', 'Problem solving max 3'],
  ['minute 8, the traversal counts some cells twice or loops', '"How do you make sure each cell is counted once?"', 'max 3'],
  ['minute 11 and no code', '"Scan every cell; when you find unvisited land, flood it, counting as you go, and keep the maximum."', 'max 2'],
])}
<p><strong>Follow-ups:</strong> (a) <em>"Now the image is 1000 × 1000 and all land."</em> — recursive DFS goes a million calls deep and crashes; use an explicit stack or BFS. (b) <em>"Count the islands instead"</em> — LC 200, same scan. (c) <em>"Diagonals connect too"</em> — eight directions, same code. (d) <em>"Land appears one cell at a time and you report the island count after each"</em> — union-find (lesson 7.4).</p>
<p><strong>Watch for:</strong> marking visited <em>before</em> exploring neighbours; bounds checks before reading the grid; asking whether mutation is allowed.</p>

<h3>Problem 2 — the freelance calendar (LC 1235, Hard, 25′)</h3>
<p><strong>Say this:</strong> <em>"You are a freelancer with n job offers. Each job has a start time, an end time and a payment. You can't work on two jobs that overlap — but if one job ends at time X you can start another at exactly X. Choose jobs to maximise the total payment."</em> Example when asked: jobs (8–10, 3), (9–12, 5), (13–15, 4), (10–14, 6) → 9.</p>
${bangHoiDap('en', [
  ['How many jobs, what ranges?', 'Up to 50,000 jobs; times between 1 and 10⁹ with start &lt; end; payment 1 to 10,000.'],
  ['Are the jobs sorted?', 'No, any order.'],
  ['Job ending at X and one starting at X — compatible?', 'Yes, compatible.'],
  ['Can I skip every job?', 'Yes; the answer is then 0, but every payment is positive.'],
  ['Return the total or the jobs?', 'The total. (Follow-up: the jobs.)'],
])}
${bangGoiY('en', [
  ['minute 8 and no structure beyond "try subsets"', '"Sort by end time. Look at the last job in that order: what are the only two possibilities for it?"', 'Problem solving max 3'],
  ['minute 14, they have take/skip but not how to find the previous compatible job', '"If you take job i, the previous job must end by its start. How can you find the last such job quickly in a list sorted by end?"', 'max 3'],
  ['minute 19 and no code', '"dp[i] = max(dp[i−1], profit + dp[j]) where j = number of jobs ending at or before this start — binary search on the sorted end times."', 'max 2'],
])}
<p><strong>Follow-ups:</strong> (a) <em>"Return the chosen jobs"</em> — walk back through dp: if dp[i] = dp[i−1] the job was skipped, otherwise it was taken and you jump to j. (b) <em>"Payments up to 10⁹?"</em> — the total can reach 5·10¹³: use <code>long</code> in Java; TypeScript numbers are exact up to 2⁵³. (c) <em>"All payments equal?"</em> — it becomes classic interval scheduling, solved greedily by earliest end (lessons 6.3, 9.5). (d) <em>"At most k jobs?"</em> — add a dimension: dp[i][c] (LC 1751).</p>
<p><strong>Watch for:</strong> the binary search's boundary (<code>end &lt;= start</code> is compatible, so find the first end <em>strictly greater</em> than start); sorting by end, not by start, for this recurrence; the comparator in Java (<code>Integer.compare</code>, not subtraction); stating O(n log n) time and O(n) memory.</p>
<h3>Spare problem</h3>
<p>${lc(692, 'top-k-frequent-words', 'Top K Frequent Words', 'Medium')}: <em>"Return the k most frequent words; ties broken alphabetically."</em> The two-key comparator (count descending, word ascending) is the whole difficulty.</p>
</div>
<div class="ml-vi">
<h2>⛔ Chỉ người phỏng vấn đọc</h2>
<p>Lại ba luật — không gõ vào code của ứng viên, không gật đầu với ý sai, chỉ gợi ý đúng phút đã ghi. Với đề Hard, thêm một luật: nếu tới phút 30 ứng viên vẫn đang tìm ý tối ưu mà chưa code gì, hãy nói <em>"Would you like to code what you have first?"</em> ("Bạn có muốn code những gì đang có trước không?") — đó là cú hích thực tế mà một người phỏng vấn tử tế sẽ đưa, và không trừ gì trên phiếu chấm.</p>
<h3>Mở đầu</h3>
<p><em>"Hi, I'm [name], nice to meet you. We'll do two problems in about 40 minutes, then you can ask me anything. Please talk me through your thinking. Can you see my screen / can I see yours? Great, let's start."</em></p>
<h3>Đề 1 — bản đồ vệ tinh (LC 695, Medium, 15′)</h3>
<p><strong>Nói nguyên văn:</strong> <em>"Ảnh vệ tinh một vùng bờ biển là một lưới số 0 và 1 — 1 là đất, 0 là nước. Hai ô đất thuộc cùng một đảo nếu chạm nhau theo chiều ngang hoặc dọc. Trả về diện tích (tính bằng số ô) của hòn đảo lớn nhất, hoặc 0 nếu không có đất."</em> Ví dụ khi được hỏi: <code>[[1,1,0],[1,0,0],[0,0,1]]</code> → 3.</p>
${bangHoiDap('vi', [
  ['Lưới lớn tối đa bao nhiêu?', 'Tối đa 50 × 50. (Lát nữa: nếu là 1000 × 1000 thì sao?)'],
  ['Chéo có tính là chạm không?', 'Không, chỉ trên, dưới, trái, phải.'],
  ['Em được sửa lưới không?', 'Mình muốn bạn không sửa — code khác còn đọc nó. (Ứng viên tốt sẽ chép lưới ra hoặc dùng mảng visited.)'],
  ['Lưới có thể rỗng không?', 'Ít nhất 1 × 1.'],
  ['Trả diện tích hay danh sách ô?', 'Chỉ diện tích.'],
])}
${bangGoiY('vi', [
  ['phút 4 mà chưa có ý duyệt', '"Từ một ô đất, làm sao bạn đi tới mọi ô của cùng hòn đảo?"', 'Giải quyết vấn đề tối đa 3'],
  ['phút 8, cách duyệt đếm trùng ô hoặc lặp vô hạn', '"Làm sao chắc mỗi ô chỉ được đếm một lần?"', 'tối đa 3'],
  ['phút 11 mà chưa có code', '"Quét mọi ô; gặp đất chưa thăm thì loang ra, vừa loang vừa đếm, và giữ giá trị lớn nhất."', 'tối đa 2'],
])}
<p><strong>Câu hỏi nối tiếp:</strong> (a) <em>"Giờ ảnh là 1000 × 1000 và toàn đất."</em> — DFS đệ quy sâu tới một triệu lời gọi và sập; dùng ngăn xếp tường minh hoặc BFS. (b) <em>"Đếm số đảo thay vì diện tích"</em> — LC 200, cùng cách quét. (c) <em>"Chéo cũng tính là nối"</em> — tám hướng, code y hệt. (d) <em>"Đất xuất hiện từng ô một và phải báo số đảo sau mỗi lần"</em> — union-find (bài 7.4).</p>
<p><strong>Để ý:</strong> đánh dấu đã thăm <em>trước khi</em> đi sang ô kề; kiểm biên trước khi đọc lưới; có hỏi được sửa lưới không.</p>

<h3>Đề 2 — lịch làm freelance (LC 1235, Hard, 25′)</h3>
<p><strong>Nói nguyên văn:</strong> <em>"Bạn làm freelance và có n lời mời việc. Mỗi việc có giờ bắt đầu, giờ kết thúc và tiền công. Bạn không làm được hai việc chồng giờ — nhưng nếu một việc kết thúc lúc X thì bạn bắt đầu được việc khác đúng lúc X. Chọn việc để tổng tiền công lớn nhất."</em> Ví dụ khi được hỏi: các việc (8–10, 3), (9–12, 5), (13–15, 4), (10–14, 6) → 9.</p>
${bangHoiDap('vi', [
  ['Bao nhiêu việc, giá trị trong khoảng nào?', 'Tối đa 50.000 việc; thời điểm từ 1 tới 10⁹, bắt đầu &lt; kết thúc; tiền công 1 tới 10.000.'],
  ['Các việc đã sắp xếp chưa?', 'Chưa, thứ tự bất kỳ.'],
  ['Việc kết thúc lúc X và việc bắt đầu lúc X — có ghép được không?', 'Được, ghép được.'],
  ['Bỏ hết mọi việc được không?', 'Được; khi đó đáp án là 0, nhưng mọi tiền công đều dương.'],
  ['Trả tổng tiền hay danh sách việc?', 'Tổng tiền. (Câu nối tiếp: danh sách việc.)'],
])}
${bangGoiY('vi', [
  ['phút 8 mà chưa có cấu trúc nào ngoài "thử các tập con"', '"Sắp theo giờ kết thúc. Nhìn việc cuối cùng theo thứ tự đó: nó chỉ có đúng hai khả năng nào?"', 'Giải quyết vấn đề tối đa 3'],
  ['phút 14, đã có lấy/bỏ nhưng chưa biết tìm việc trước đó còn hợp', '"Nếu lấy việc i, việc trước đó phải kết thúc trước lúc nó bắt đầu. Trong danh sách đã sắp theo giờ kết thúc, tìm nhanh việc cuối cùng như vậy thế nào?"', 'tối đa 3'],
  ['phút 19 mà chưa có code', '"dp[i] = max(dp[i−1], tiền công + dp[j]) với j = số việc kết thúc trước hoặc đúng lúc bắt đầu — tìm nhị phân trên mảng giờ kết thúc đã sắp."', 'tối đa 2'],
])}
<p><strong>Câu hỏi nối tiếp:</strong> (a) <em>"Trả về các việc đã chọn"</em> — đi ngược qua dp: nếu dp[i] = dp[i−1] thì việc bị bỏ, không thì nó được lấy và nhảy về j. (b) <em>"Tiền công tới 10⁹?"</em> — tổng có thể tới 5·10¹³: Java dùng <code>long</code>; số TypeScript chính xác tới 2⁵³. (c) <em>"Mọi tiền công bằng nhau?"</em> — thành bài xếp lịch khoảng kinh điển, giải tham lam theo giờ kết thúc sớm nhất (bài 6.3, 9.5). (d) <em>"Tối đa k việc?"</em> — thêm một chiều: dp[i][c] (LC 1751).</p>
<p><strong>Để ý:</strong> biên của phép tìm nhị phân (<code>end &lt;= start</code> là ghép được, nên tìm giờ kết thúc đầu tiên <em>lớn hơn hẳn</em> giờ bắt đầu); sắp theo giờ kết thúc chứ không theo giờ bắt đầu cho công thức này; comparator trong Java (<code>Integer.compare</code>, không phải phép trừ); có nói O(n log n) thời gian, O(n) bộ nhớ.</p>
<h3>Đề dự phòng</h3>
<p>${lc(692, 'top-k-frequent-words', 'Top K Frequent Words', 'Medium')}: <em>"Trả về k từ xuất hiện nhiều nhất; hoà thì theo thứ tự bảng chữ cái."</em> Comparator hai khoá (số lần giảm dần, từ tăng dần) là toàn bộ cái khó.</p>
</div>

<div class="ml-en">
<h2>After the session: reference solutions</h2>
<h3>Problem 1 — Max Area of Island</h3>
<p><strong>Brute force:</strong> for every land cell, run a fresh flood fill and take the largest — correct but O((RC)²) because big islands are refilled from each of their cells. <strong>Fix:</strong> mark cells as visited the first time any fill reaches them; then each cell is processed once overall, O(R·C) time. The recursive version is the shortest to write and safe at LeetCode's 50 × 50; the explicit-stack version is what you switch to when the follow-up makes the grid big.</p>
</div>
<div class="ml-vi">
<h2>Sau buổi thử: lời giải tham khảo</h2>
<h3>Đề 1 — Max Area of Island</h3>
<p><strong>Vét cạn:</strong> với mỗi ô đất, chạy một lần loang mới rồi lấy lớn nhất — đúng nhưng O((RC)²) vì đảo lớn bị loang lại từ từng ô của nó. <strong>Sửa:</strong> đánh dấu đã thăm ngay lần đầu có lượt loang nào chạm tới ô; khi đó mỗi ô chỉ được xử lý một lần trên cả bài, O(R·C) thời gian. Bản đệ quy ngắn nhất để viết và an toàn ở giới hạn 50 × 50 của LeetCode; bản ngăn xếp tường minh là thứ bạn chuyển sang khi câu nối tiếp làm lưới to ra.</p>
${lienKet({ bai: 'dsa-7-2-bfs-dfs', title: '7.2 — BFS và DFS: đếm đảo, lan truyền nhiều nguồn', sub: 'Number of Islands và khuôn duyệt lưới 4 hướng mà đề này dùng lại', cta: 'Ôn lại' })}
</div>
${maHai('ch11/b5/island.ts', 'ch11/b5/PvIsland.java', { vung: 'dfs-de-quy' })}
${maHai('ch11/b5/island.ts', 'ch11/b5/PvIsland.java', { vung: 'dfs-ngan-xep' })}
${ketQua('ch11/b5/island.ts')}
${ketQua('ch11/b5/PvIsland.java')}
<div class="ml-en">
<p>The cases: two islands of 4 and 5 (answer 5); no land (0); a single cell; a checkerboard where diagonals do not connect (every island is 1); a ring with a hole (8 — the water in the middle is not part of anything); and a full 50 × 50 grid (2,500), which both versions handle. The simulation shows the explicit-stack fill on the first grid:</p>
${moPhong('ch11/b5/island.sim.js', 'en', 'Max Area of Island — flood fill with a stack', 'Each land cell lights up once; the log shows every island size.')}
</div>
<div class="ml-vi">
<p>Các ca: hai đảo 4 và 5 ô (đáp án 5); không có đất (0); một ô duy nhất; bàn cờ mà chéo không tính là nối (mỗi đảo 1 ô); một vòng có lỗ ở giữa (8 — phần nước ở giữa không thuộc đảo nào); và lưới đầy 50 × 50 (2.500), cả hai bản đều xử lý được. Mô phỏng cho thấy lượt loang bằng ngăn xếp trên lưới đầu tiên:</p>
${moPhong('ch11/b5/island.sim.js', 'vi', 'Max Area of Island — loang bằng ngăn xếp', 'Mỗi ô đất sáng lên đúng một lần; log in kích thước từng đảo.')}
</div>
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap (and follow-up a): recursion depth is the island's size, not the grid's side.</strong></p><p>On an all-land grid, recursive DFS can go one call deeper for almost every cell. The same recursive code, run on bigger all-land grids:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy (và câu nối tiếp a): độ sâu đệ quy bằng kích thước đảo, không phải cạnh lưới.</strong></p><p>Trên lưới toàn đất, DFS đệ quy có thể sâu thêm một tầng cho gần như mỗi ô. Cùng đoạn code đệ quy đó, chạy trên các lưới toàn đất lớn dần:</p></div>
</div>
${ketQua('ch11/b5/island-sau.ts')}
${ketQua('ch11/b5/PvIslandSau.java')}
<div class="ml-en">
<p>At 50 × 50 the recursion reaches depth 2,500 and survives. Node gives up already at 100 × 100 (where the depth would reach 10,000) with <code>RangeError: Maximum call stack size exceeded</code>; Java with a 1 MB thread stack survives 100 × 100 but throws <code>StackOverflowError</code> at 300 × 300. The explicit stack handles a million cells in both. A 1000 × 1000 image is small for a real photo, so the follow-up answer is not "increase the stack" but "do not recurse on input-sized depth".</p>
</div>
<div class="ml-vi">
<p>Ở 50 × 50 đệ quy sâu tới 2.500 tầng và vẫn sống. Node bỏ cuộc ngay ở 100 × 100 (nơi độ sâu lẽ ra lên tới 10.000) với <code>RangeError: Maximum call stack size exceeded</code>; Java với stack luồng 1 MB sống qua 100 × 100 nhưng ném <code>StackOverflowError</code> ở 300 × 300. Ngăn xếp tường minh xử lý một triệu ô ở cả hai ngôn ngữ. Ảnh 1000 × 1000 còn là nhỏ so với một tấm ảnh thật, nên câu trả lời cho câu nối tiếp không phải "nới stack ra" mà là "đừng đệ quy với độ sâu cỡ đầu vào".</p>
${lienKet({ bai: 'dsa-5-2-de-quy', title: '5.2 — Đệ quy trên cây (bẫy độ sâu đo thật)', sub: 'Cùng hiện tượng trên cây lệch: độ sâu tối đa của Node và Java', cta: 'Ôn lại' })}
</div>

<div class="ml-en">
<h3>Problem 2 — Maximum Profit in Job Scheduling, rung by rung</h3>
<p><strong>Rung 1 — brute force:</strong> try all 2ⁿ subsets, keep those without overlaps, take the best — the test program uses exactly this (for n ≤ 10) to check the real solution. <strong>Rung 2 — the recurrence:</strong> sort the jobs by end time. Let dp[i] be the best total using only the first i jobs of that order. The i-th job is either skipped (dp[i−1]) or taken; if taken, the jobs before it that can stay are exactly those ending by its start, which — because of the sort — form a prefix of length j. So <code>dp[i] = max(dp[i−1], profit + dp[j])</code>. Finding j by scanning backwards is O(n) per job: O(n²) overall, correct. <strong>Rung 3 — the bottleneck:</strong> the end times are sorted, so "how many end by this start?" is an upper-bound binary search (Chapter 4). <strong>Rung 4:</strong> O(n log n) time (the sort and n searches), O(n) memory.</p>
</div>
<div class="ml-vi">
<h3>Đề 2 — Maximum Profit in Job Scheduling, từng bậc thang</h3>
<p><strong>Bậc 1 — vét cạn:</strong> thử cả 2ⁿ tập con, giữ những tập không chồng giờ, lấy tốt nhất — chương trình test dùng đúng cách này (với n ≤ 10) để đối chiếu lời giải thật. <strong>Bậc 2 — công thức truy hồi:</strong> sắp các việc theo giờ kết thúc. Gọi dp[i] là tổng tốt nhất khi chỉ dùng i việc đầu tiên theo thứ tự đó. Việc thứ i hoặc bị bỏ (dp[i−1]), hoặc được lấy; nếu lấy, các việc phía trước được giữ lại chính là những việc kết thúc trước lúc nó bắt đầu — mà nhờ đã sắp xếp, chúng tạo thành một đoạn đầu dài j. Vậy <code>dp[i] = max(dp[i−1], tiền công + dp[j])</code>. Tìm j bằng cách quét lùi tốn O(n) mỗi việc: O(n²) cả bài, đúng. <strong>Bậc 3 — nút thắt:</strong> các giờ kết thúc đã sắp, nên "bao nhiêu việc kết thúc kịp trước giờ bắt đầu này?" là một phép tìm nhị phân cận trên (Chương 4). <strong>Bậc 4:</strong> O(n log n) thời gian (phép sắp và n lần tìm), O(n) bộ nhớ.</p>
${lienKet({ bai: 'dsa-4-1-co-ban', title: '4.1 — Một khuôn tìm nhị phân cho mọi biến thể', sub: 'Phép "tìm vị trí đầu tiên có end > start" ở đây chính là khuôn firstTrue', cta: 'Ôn lại' })}
</div>
${maHai('ch11/b5/jobs.ts', 'ch11/b5/PvJobs.java', { vung: 'dp-nhi-phan' })}
<div class="ml-en">
<p>The DP table for the example (8–10, 3), (9–12, 5), (13–15, 4), (10–14, 6), produced by running the algorithm. The jobs are processed in end order: #0, #1, #3, #2.</p>
</div>
<div class="ml-vi">
<p>Bảng DP cho ví dụ (8–10, 3), (9–12, 5), (13–15, 4), (10–14, 6), sinh ra bằng cách chạy thuật toán thật. Các việc được xử lý theo thứ tự giờ kết thúc: #0, #1, #3, #2.</p>
</div>
${BANG_VIEC}
<div class="ml-en">
<p>Row 3 is the interesting one: job #3 starts at 10, and exactly one job (#0, ending at 10) ends by then — touching is compatible — so j = 1 and taking it gives 6 + dp[1] = 9. Row 4: job #2 starts at 13; two jobs end by 13 (#0 at 10, #1 at 12), so take = 4 + dp[2] = 9 — a tie, and dp stays 9. There are two different optimal plans (#0 + #3 and #1 + #2), a good reason to ask "which jobs?" only as a follow-up.</p>
<h3>Follow-up (a): the chosen jobs, and a 300-case cross-check</h3>
</div>
<div class="ml-vi">
<p>Dòng 3 là dòng đáng xem: việc #3 bắt đầu lúc 10, và đúng một việc (#0, kết thúc lúc 10) kết thúc kịp — nối đuôi là ghép được — nên j = 1 và lấy nó được 6 + dp[1] = 9. Dòng 4: việc #2 bắt đầu lúc 13; hai việc kết thúc kịp trước 13 (#0 lúc 10, #1 lúc 12), nên lấy = 4 + dp[2] = 9 — hoà, dp giữ nguyên 9. Có hai kế hoạch tối ưu khác nhau (#0 + #3 và #1 + #2), một lý do tốt để câu "chọn những việc nào?" chỉ nên là câu nối tiếp.</p>
<h3>Nối tiếp (a): danh sách việc được chọn, và 300 ca đối chiếu</h3>
</div>
${maHai('ch11/b5/jobs.ts', 'ch11/b5/PvJobs.java', { vung: 'truy-vet' })}
${ketQua('ch11/b5/jobs.ts')}
${ketQua('ch11/b5/PvJobs.java')}
<div class="ml-en">
<p>Edge cases: one job; three jobs with identical times (only the best can be taken: 9); a chain of touching jobs 1–2, 2–3, 3–4 (all three: 3 — this is the case that breaks a <code>&gt;=</code> in the binary search); and a case where a cheap early job enables an expensive late one (10 + 100). The last line is the real safety net: <strong>300/300</strong> random inputs match the exponential brute force in both languages.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: <code>&gt;=</code> instead of <code>&gt;</code> in the search.</strong></p><p>With <code>ends[mid] &gt;= start</code> you find the first job ending <em>at or after</em> the start, so a job ending exactly at the start is treated as overlapping. The examples with gaps still pass; the chain 1–2, 2–3, 3–4 returns 2 instead of 3. Ask the clarifying question, then test exactly that case.</p></div>
</div>
<div class="ml-vi">
<p>Các ca biên: một việc; ba việc trùng giờ hoàn toàn (chỉ lấy được việc tốt nhất: 9); chuỗi việc nối đuôi 1–2, 2–3, 3–4 (lấy cả ba: 3 — đây là ca làm sập một dấu <code>&gt;=</code> trong phép tìm nhị phân); và một ca mà việc rẻ đầu ngày mở đường cho việc đắt cuối ngày (10 + 100). Dòng cuối là lưới an toàn thật: <strong>300/300</strong> đầu vào ngẫu nhiên khớp với vét cạn hàm mũ ở cả hai ngôn ngữ.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: <code>&gt;=</code> thay cho <code>&gt;</code> trong phép tìm.</strong></p><p>Với <code>ends[mid] &gt;= start</code> bạn tìm việc đầu tiên kết thúc <em>đúng lúc hoặc sau</em> giờ bắt đầu, nên việc kết thúc đúng lúc bắt đầu bị coi là chồng giờ. Các ví dụ có khoảng trống vẫn qua; chuỗi 1–2, 2–3, 3–4 trả về 2 thay vì 3. Hỏi câu làm rõ, rồi test đúng ca đó.</p></div>
</div>

<div class="ml-en">
<h3>Why rung 3 matters: O(n²) versus O(n log n), measured</h3>
<p>Same DP, same random jobs (long jobs that overlap a lot, so the backward scan really walks far), the only difference being how j is found:</p>
</div>
<div class="ml-vi">
<h3>Vì sao bậc 3 quan trọng: O(n²) so với O(n log n), đo thật</h3>
<p>Cùng DP, cùng bộ việc ngẫu nhiên (việc dài, chồng nhau nhiều, nên phép quét lùi thật sự phải đi xa), khác nhau duy nhất ở cách tìm j:</p>
</div>
${ma('ch11/b5/jobs-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch11/b5/jobs-do.ts')}
${ketQua('ch11/b5/PvJobsDo.java')}
<div class="ml-en">
<p>Read the Node line from 10,000 to 50,000: the input grew 5× and the linear scan grew about 30× (19.7 → 649.3 ms) — n² predicts 25×. The binary-search version handles LeetCode's maximum of 50,000 in under 20 ms and a million jobs in under a second; most of that is the sort. Java's constants are smaller but the shape is the same. So at LeetCode's limit the O(n²) version is borderline (it would likely pass in Java and time out in slower runtimes) — exactly the situation where rung 2 is a good interview answer and rung 4 is the accepted one.</p>
</div>
<div class="ml-vi">
<p>Đọc dòng Node từ 10.000 lên 50.000: đầu vào tăng 5 lần còn bản quét lùi tăng khoảng 30 lần (19,7 → 649,3 ms) — n² dự đoán 25 lần. Bản tìm nhị phân xử lý mức tối đa 50.000 của LeetCode dưới 20 ms và một triệu việc dưới một giây; phần lớn thời gian đó là phép sắp xếp. Hằng số của Java nhỏ hơn nhưng hình dạng y hệt. Vậy ở giới hạn của LeetCode, bản O(n²) nằm sát ranh giới (nhiều khả năng qua ở Java và quá giờ ở môi trường chậm hơn) — đúng tình huống mà bậc 2 là câu trả lời phỏng vấn tốt, còn bậc 4 là câu trả lời được chấp nhận.</p>
</div>

<div class="ml-en">
<h3>🎤 Problem 2 on the ladder: a sample exchange</h3>
${hoiThoai([
  ['I', 'You have n jobs with start, end and payment. No overlaps, but end at X and start at X is fine. Maximise the total.'],
  ['C', 'Up to how many jobs, and are they sorted? And just to confirm: one ends at 10, another starts at 10 — I can take both?'],
  ['I', 'Fifty thousand, unsorted, and yes, both.'],
  ['C', 'Brute force is every subset, two to the n — too slow. My plan: get a correct O(n²) first, then see if the inner part can be faster. If I sort by end time, the last job is either skipped, giving the best of the first n − 1, or taken, giving its payment plus the best of the jobs that end by its start. Because of the sort those form a prefix.'],
  ['N', 'Ladder announced, recurrence stated with the reason the prefix exists. This is most of the problem-solving score.'],
  ['C', 'Finding that prefix by scanning back is O(n) per job, O(n²) total. But the end times are sorted, so it is an upper-bound binary search — O(n log n) overall. I’ll code the binary search directly.'],
  ['I', 'Go ahead.'],
  ['C', '(coding) I sort indices, not the arrays, so the three arrays stay aligned… In the search I look for the first end strictly greater than the start — strictly, because ending at the start is compatible.'],
  ['N', 'The one subtle decision, said at the moment it is typed.'],
  ['C', 'Test: touching jobs 1–2, 2–3, 3–4 with payment 1 each should give 3. The second job starts at 2; ends are [2, 3, 4]; first end greater than 2 is at index 1, so j = 1 and dp becomes 2. Third gives 3. Good.'],
  ['I', 'What if payments go up to a billion?'],
  ['C', 'Fifty thousand times a billion overflows a 32-bit int, so in Java I’d make dp a long array. In TypeScript numbers are exact up to two to the fifty-three, which is enough.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Đề 2 theo cái thang: một đoạn hội thoại mẫu</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Có n việc với giờ bắt đầu, giờ kết thúc, tiền công. Không được chồng giờ, nhưng kết thúc lúc X và bắt đầu lúc X thì được. Tối đa tổng tiền.'],
  ['C', 'Tối đa bao nhiêu việc, và đã sắp xếp chưa ạ? Em xác nhận lại: một việc kết thúc lúc 10, việc khác bắt đầu lúc 10 — em lấy được cả hai ạ? <em>("Just to confirm: one ends at 10, another starts at 10 — I can take both?")</em>'],
  ['I', 'Năm mươi nghìn, chưa sắp, và đúng, cả hai.'],
  ['C', 'Vét cạn là mọi tập con, hai mũ n — quá chậm. Kế hoạch của em: làm một bản O(n²) đúng trước, rồi xem phần bên trong có nhanh hơn được không. Nếu sắp theo giờ kết thúc, việc cuối cùng hoặc bị bỏ, khi đó là tốt nhất của n − 1 việc đầu, hoặc được lấy, khi đó là tiền công của nó cộng tốt nhất của những việc kết thúc kịp trước giờ nó bắt đầu. Nhờ đã sắp, những việc đó là một đoạn đầu. <em>("My plan: get a correct O(n²) first, then see if the inner part can be faster.")</em>'],
  ['N', 'Tuyên bố cái thang, nói công thức truy hồi kèm lý do tồn tại đoạn đầu. Đây là phần lớn điểm giải quyết vấn đề.'],
  ['C', 'Tìm đoạn đầu đó bằng quét lùi là O(n) mỗi việc, O(n²) cả bài. Nhưng giờ kết thúc đã sắp, nên đó là tìm nhị phân cận trên — O(n log n) cả bài. Em code thẳng bản tìm nhị phân. <em>("it is an upper-bound binary search")</em>'],
  ['I', 'Làm đi.'],
  ['C', '(vừa code vừa nói) Em sắp mảng chỉ số chứ không sắp ba mảng, để ba mảng vẫn khớp nhau… Trong phép tìm em tìm giờ kết thúc đầu tiên LỚN HƠN HẲN giờ bắt đầu — lớn hơn hẳn, vì kết thúc đúng lúc bắt đầu là ghép được. <em>("strictly greater, because ending at the start is compatible")</em>'],
  ['N', 'Đúng một quyết định tinh tế, nói ra ngay lúc gõ nó.'],
  ['C', 'Test: chuỗi nối đuôi 1–2, 2–3, 3–4 mỗi việc 1 đồng phải ra 3. Việc thứ hai bắt đầu lúc 2; các giờ kết thúc [2, 3, 4]; giờ kết thúc đầu tiên lớn hơn 2 ở chỉ số 1, nên j = 1 và dp thành 2. Việc thứ ba cho 3. Đúng.'],
  ['I', 'Nếu tiền công tới một tỉ thì sao?'],
  ['C', 'Năm mươi nghìn nhân một tỉ là tràn int 32 bit, nên trong Java em đổi dp sang mảng long. Trong TypeScript số chính xác tới hai mũ năm mươi ba, đủ dùng. <em>("overflows a 32-bit int, so in Java I’d make dp a long array")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>The session report, and the three-session comparison</h3>
${bienBan('en', 3)}
<p>Then put the three verdicts side by side. A typical healthy curve is No hire → Lean hire → Hire, with the weakest axis moving each time. If the same axis is still at 2 after three sessions, it is not a knowledge problem; it is a habit, and the fix is volume: ten short solo sessions this week where you do only that one thing (for testing: trace two edge cases on every problem you solve, even Easy ones).</p>
</div>
<div class="ml-vi">
<h3>Biên bản sau buổi thử, và bảng so ba buổi</h3>
${bienBan('vi', 3)}
<p>Rồi đặt ba kết luận cạnh nhau. Một đường cong lành mạnh thường gặp là No hire → Lean hire → Hire, với trục yếu nhất nhích lên mỗi lần. Nếu sau ba buổi vẫn cùng một trục đứng ở 2, đó không còn là chuyện kiến thức; đó là thói quen, và cách chữa là số lượng: tuần này mười buổi tự luyện ngắn chỉ làm đúng một việc đó (với kiểm thử: chạy tay hai ca biên ở MỌI đề bạn giải, kể cả đề Easy).</p>
</div>

<div class="ml-en">
<h3>Where these patterns live in real systems</h3>
<ul>
<li><strong>Flood fill is the paint-bucket tool</strong> in every image editor, the "reveal empty area" click in Minesweeper, and connected-component labelling in image processing (counting cells in a microscope image, finding regions on a map). Real images are millions of pixels — which is why production implementations are iterative, often scanline-based.</li>
<li><strong>Weighted interval scheduling</strong> is how a single shared resource is allocated to requests that have value: one GPU server and many training jobs, one lecture hall and many events, ad slots in a broadcast. When all values are equal it becomes the greedy "earliest end first" of lesson 6.3.</li>
</ul>
<h3>🕵️ The attacker's view: depth as a denial-of-service</h3>
<p>The recursion-depth crash above is not only an interview curiosity. Any recursive code whose depth is controlled by input is a way to crash a server with one request. A real example: <strong>CVE-2020-36518</strong> in jackson-databind, the JSON library most Java web applications use — a request with deeply nested JSON arrays made the parser recurse until <code>StackOverflowError</code>. The fix was a nesting-depth limit. Defences you can name: limit request size and nesting depth at the edge, prefer iterative algorithms on input-sized structures, and treat "how deep can this recurse?" as a code-review question.</p>
</div>
<div class="ml-vi">
<h3>Các mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Loang (flood fill) chính là công cụ "thùng sơn"</strong> trong mọi trình sửa ảnh, cú bấm "mở vùng trống" trong trò Dò mìn, và gán nhãn thành phần liên thông trong xử lý ảnh (đếm tế bào trong ảnh hiển vi, tìm vùng trên bản đồ). Ảnh thật có hàng triệu điểm ảnh — vì vậy các bản cài đặt thật đều dùng vòng lặp, thường theo từng dòng quét (scanline).</li>
<li><strong>Xếp lịch khoảng có trọng số</strong> (weighted interval scheduling) là cách cấp một tài nguyên dùng chung cho các yêu cầu có giá trị: một máy chủ GPU và nhiều lượt huấn luyện, một hội trường và nhiều sự kiện, các khung quảng cáo trên sóng. Khi mọi giá trị bằng nhau, nó trở thành tham lam "kết thúc sớm nhất trước" của bài 6.3.</li>
</ul>
${lienKet({ bai: 'dsa-6-3-khoang', title: '6.3 — Bài toán khoảng', sub: 'Phiên bản không trọng số: gộp, xếp lịch, đếm số phòng', cta: 'Ôn lại' })}
<h3>🕵️ Góc kẻ xấu: độ sâu như một cách tấn công từ chối dịch vụ</h3>
<p>Cú sập vì độ sâu đệ quy ở trên không chỉ là chuyện phỏng vấn. Bất kỳ đoạn code đệ quy nào có độ sâu do đầu vào quyết định đều là một cách làm sập máy chủ chỉ bằng một request. Ví dụ có thật: <strong>CVE-2020-36518</strong> trong jackson-databind, thư viện JSON mà đa số ứng dụng web Java dùng — một request chứa mảng JSON lồng nhau thật sâu làm bộ phân tích đệ quy tới khi <code>StackOverflowError</code>. Cách sửa là đặt trần độ sâu lồng nhau. Cách phòng có thể kể ra: giới hạn kích thước request và độ sâu lồng ngay ở cửa vào, ưu tiên thuật toán vòng lặp cho cấu trúc cỡ đầu vào, và coi "cái này đệ quy sâu được tới đâu?" là một câu hỏi khi review code.</p>
</div>

<div class="ml-en">
<h3>Common mistakes in this set</h3>
<ul>
<li>Marking a cell visited when it is popped instead of when it is pushed — the same cell enters the stack several times and the area is over-counted.</li>
<li>Mutating the caller's grid after being asked not to.</li>
<li>Sorting by start time and then writing the end-time recurrence (or sorting the three arrays separately, so payments no longer match their jobs).</li>
<li><code>&gt;=</code> in the upper-bound search — touching jobs become "overlapping".</li>
<li>Java comparator <code>(a, b) -&gt; end[a] - end[b]</code>: fine at 10⁹ by luck here, but a habit that overflows with negative or larger values; use <code>Integer.compare</code>.</li>
<li>Spending 25 minutes on the Hard without coding anything — always code rung 2 when rung 4 is not coming.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp ở bộ này</h3>
<ul>
<li>Đánh dấu đã thăm lúc pop thay vì lúc push — cùng một ô vào ngăn xếp nhiều lần và diện tích bị đếm dư.</li>
<li>Sửa lưới của người gọi dù đã được dặn không sửa.</li>
<li>Sắp theo giờ bắt đầu rồi lại viết công thức theo giờ kết thúc (hoặc sắp ba mảng riêng rẽ, khiến tiền công không còn khớp với việc của nó).</li>
<li><code>&gt;=</code> trong phép tìm cận trên — việc nối đuôi bị coi là "chồng giờ".</li>
<li>Comparator Java <code>(a, b) -&gt; end[a] - end[b]</code>: ở đây may mà không tràn với 10⁹, nhưng là thói quen sẽ tràn khi có số âm hoặc lớn hơn; dùng <code>Integer.compare</code>.</li>
<li>Tiêu cả 25 phút cho đề Hard mà không code gì — khi bậc 4 chưa tới thì luôn code bậc 2.</li>
</ul>
</div>

<div class="ml-en">
<h3>Problems of this set and its follow-ups</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề của bộ này và các đề nối tiếp</h3>
${bangDe(DE, 'vi')}
<p>Sau buổi thử, nộp LC 695 và LC 1235; tuần sau làm LC 2008 (cùng mẫu, khác vỏ) để kiểm xem bạn nhận ra được mà không cần nhớ đề.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (one session, 75 min)</h3>
<div class="callout ok"><ol>
<li>Find an interviewer you do not know well and book a video call. Send them this page with "read only from ⛔ to 'After the session'".</li>
<li>Ten minutes before: run the interview-day checklist from lesson 11.5 (share the right window, phone silent, charger, water, paper).</li>
<li>Run the 45 minutes on camera. On problem 2, announce the ladder before anything else.</li>
<li>Debrief: rubric, verdict, and the three-session comparison table.</li>
<li>Write down which rung you reached on the Hard and at which minute; code the missing rungs tomorrow without looking.</li>
</ol>
<p><strong>Done when:</strong> a rubric with evidence, a verdict, the three-session comparison, the rung reached with its minute, and both problems accepted on LeetCode afterwards.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">dress rehearsal</span><span class="v">A full run under real conditions before the real event.</span></div>
  <div class="kv"><span class="k">partial credit</span><span class="v">Points for a correct but slower solution and a named bottleneck on a hard problem.</span></div>
  <div class="kv"><span class="k">flood fill</span><span class="v">Visiting every cell connected to a start cell; the paint-bucket tool.</span></div>
  <div class="kv"><span class="k">explicit stack</span><span class="v">A stack you manage yourself instead of the call stack; no depth limit.</span></div>
  <div class="kv"><span class="k">weighted interval scheduling</span><span class="v">Choosing non-overlapping intervals to maximise total value.</span></div>
  <div class="kv"><span class="k">upper bound (search)</span><span class="v">The first position whose value is strictly greater than a key.</span></div>
  <div class="kv"><span class="k">traceback</span><span class="v">Walking back through a DP table to recover the choices, not just the value.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Rehearse under real conditions once: video call, stranger, English, your day-of checklist.</li>
<li>On a Hard, climb the ladder: brute force → correct polynomial (coded) → name the bottleneck → optimal.</li>
<li>Islands: mark when pushed; recursion depth is the island's size — iterative for big inputs.</li>
<li>Job scheduling: sort by end, dp[i] = max(skip, profit + dp[j]), j by upper-bound search with <code>&gt;</code>.</li>
<li>Measured: the O(n²) scan is ~25–30× slower for 5× more jobs; binary search handles a million.</li>
<li>Input-controlled recursion depth is a real denial-of-service bug (CVE-2020-36518).</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — coding interview rubrics', 'How interviewers score, including partial solutions', 'https://www.techinterviewhandbook.org/coding-interview-rubrics/')}
${nguon('🔐', 'NVD — CVE-2020-36518', 'jackson-databind: StackOverflowError via deeply nested JSON', 'https://nvd.nist.gov/vuln/detail/CVE-2020-36518')}
${nguon('📘', 'Wikipedia — Flood fill', 'Recursive, stack-based and scanline implementations', 'https://en.wikipedia.org/wiki/Flood_fill')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (một buổi, 75 phút)</h3>
<div class="callout ok"><ol>
<li>Tìm một người phỏng vấn bạn không thân và hẹn một cuộc gọi video. Gửi họ trang này kèm "chỉ đọc từ ⛔ tới 'Sau buổi thử'".</li>
<li>Mười phút trước giờ: chạy checklist ngày phỏng vấn của bài 11.5 (chia sẻ đúng cửa sổ, điện thoại im lặng, sạc, nước, giấy).</li>
<li>Chạy 45 phút có bật camera. Ở đề 2, tuyên bố cái thang trước mọi thứ khác.</li>
<li>Rút kinh nghiệm: phiếu chấm, kết luận, và bảng so ba buổi.</li>
<li>Ghi lại bạn tới bậc nào của đề Hard và ở phút nào; ngày mai code nốt các bậc còn thiếu mà không nhìn lời giải.</li>
</ol>
<p><strong>Đạt khi:</strong> phiếu chấm có bằng chứng, có kết luận, có bảng so ba buổi, có bậc thang đã tới kèm phút, và cả hai đề Accepted trên LeetCode sau buổi thử.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">dress rehearsal (tổng duyệt)</span><span class="v">Một lượt chạy trọn vẹn trong điều kiện thật trước sự kiện thật.</span></div>
  <div class="kv"><span class="k">partial credit (điểm từng phần)</span><span class="v">Điểm cho một lời giải đúng nhưng chậm hơn và một nút thắt đã được gọi tên, ở đề khó.</span></div>
  <div class="kv"><span class="k">flood fill (loang)</span><span class="v">Đi qua mọi ô nối với một ô xuất phát; chính là công cụ thùng sơn.</span></div>
  <div class="kv"><span class="k">explicit stack (ngăn xếp tường minh)</span><span class="v">Ngăn xếp bạn tự quản lý thay cho call stack; không bị giới hạn độ sâu.</span></div>
  <div class="kv"><span class="k">weighted interval scheduling (xếp lịch khoảng có trọng số)</span><span class="v">Chọn các khoảng không chồng nhau để tổng giá trị lớn nhất.</span></div>
  <div class="kv"><span class="k">upper bound (cận trên — trong tìm kiếm)</span><span class="v">Vị trí đầu tiên có giá trị lớn hơn hẳn một khoá.</span></div>
  <div class="kv"><span class="k">traceback (truy vết)</span><span class="v">Đi ngược qua bảng DP để lấy lại các lựa chọn, không chỉ giá trị.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Diễn tập trong điều kiện thật một lần: gọi video, người lạ, tiếng Anh, checklist ngày phỏng vấn của bạn.</li>
<li>Với đề Hard, leo thang: vét cạn → lời giải đa thức đúng (có code) → gọi tên nút thắt → tối ưu.</li>
<li>Đảo: đánh dấu lúc push; độ sâu đệ quy bằng kích thước đảo — đầu vào lớn thì dùng vòng lặp.</li>
<li>Xếp lịch việc: sắp theo giờ kết thúc, dp[i] = max(bỏ, tiền công + dp[j]), j tìm cận trên với <code>&gt;</code>.</li>
<li>Đo thật: bản quét O(n²) chậm thêm ~25–30 lần khi số việc tăng 5 lần; tìm nhị phân xử lý một triệu việc.</li>
<li>Độ sâu đệ quy do đầu vào quyết định là một lỗi từ chối dịch vụ có thật (CVE-2020-36518).</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — phiếu chấm phỏng vấn coding', 'Người phỏng vấn chấm thế nào, kể cả lời giải dở dang (tiếng Anh)', 'https://www.techinterviewhandbook.org/coding-interview-rubrics/')}
${nguon('🔐', 'NVD — CVE-2020-36518', 'jackson-databind: StackOverflowError vì JSON lồng quá sâu', 'https://nvd.nist.gov/vuln/detail/CVE-2020-36518')}
${nguon('📘', 'Wikipedia — Flood fill', 'Cài đặt đệ quy, bằng ngăn xếp và theo dòng quét', 'https://en.wikipedia.org/wiki/Flood_fill')}
</div>
`,
};
