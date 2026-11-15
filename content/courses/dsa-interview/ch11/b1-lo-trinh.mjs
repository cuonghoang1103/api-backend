/** 11.1 — Lộ trình 6 tuần từng ngày (+ bản 4 tuần nén), ôn cách quãng, sổ lỗi, mốc kiểm, lịch học kỳ, tuần CV. Dữ liệu + lịch ôn: ../ma/ch11/b1. */
import { ma, maHai, ketQua, lc, nguon, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { THE, bangLoTrinh } from './_rieng.mjs';
import { A, B, thongKe } from '../ma/ch11/b1/lo-trinh.vet.mjs';

const TB = thongKe(B), TA = thongKe(A);
const so = (x) => String(x);

export default {
  title: '11.1 — The 6-week plan day by day (and 4 weeks): spaced review, error log, checkpoints|||11.1 — Lộ trình 6 tuần từng ngày (và bản 4 tuần): ôn cách quãng, sổ lỗi, mốc kiểm',
  slug: 'dsa-11-1-lo-trinh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảng 42 ngày (và bản 28 ngày kịp hạn OJT giữa tháng 12): bài học, hai đề LeetCode mỗi ngày, lịch ôn 1·3·7·14 ngày tự tính, ngày phỏng vấn thử, tuần chuẩn bị CV; cách ôn cho đúng, sổ lỗi, mốc kiểm tiến độ và cách xếp với lịch thi ở FPT.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>The 6-week plan, day by day (and the 4-week version)</h2>
<p class="lead">Lesson 0.9 gave you two plans in one paragraph each: Plan A, four weeks, to be ready for an application deadline in mid-December; Plan B, six weeks, to cover everything. This lesson turns both into a calendar you can follow without deciding anything each evening: which lesson, which two LeetCode problems, which old problems to re-solve (computed, not guessed), when the mock interviews are, and when to work on your CV. It also explains <em>how</em> to review so that reviewing actually works, how to keep the error log, the checkpoints that tell you whether you are on track, and how to fit all of it around exams at FPT.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Lộ trình 6 tuần, từng ngày (và bản 4 tuần)</h2>
<p class="lead">Bài 0.9 đưa bạn hai lộ trình, mỗi cái một đoạn: lộ trình A, bốn tuần, để kịp hạn nộp hồ sơ giữa tháng 12; lộ trình B, sáu tuần, để phủ hết. Bài này biến cả hai thành một cuốn lịch bạn theo được mà tối nào cũng không phải tự quyết: học bài nào, hai đề LeetCode nào, đề cũ nào phải giải lại (tính bằng máy, không đoán), buổi phỏng vấn thử vào ngày nào, và khi nào làm CV. Bài cũng giải thích ôn <em>thế nào</em> thì việc ôn mới thật sự có tác dụng, cách giữ sổ lỗi, các mốc kiểm cho biết bạn có đang đúng tiến độ không, và cách xếp tất cả quanh lịch thi ở FPT.</p>
</div>

<div class="ml-en">
<h3>The everyday picture: a couch-to-5K running plan</h3>
<p>Running plans for beginners all look alike: three runs a week, each a little harder than the last, a rest day between them, and a written schedule so you never stand at the door wondering how far to go today. Nobody becomes a runner by running as far as they can on the first Saturday; they become one by following a plan that is slightly uncomfortable every day and never crushing. Interview preparation works the same way. A plan written in advance removes the daily decision ("what should I study?"), which is where most people lose an hour, and the rest days and review days are part of the training, not a break from it.</p>
</div>
<div class="ml-vi">
<h3>Hình dung đời thường: giáo án tập chạy từ số 0 tới 5 km</h3>
<p>Các giáo án tập chạy cho người mới đều na ná nhau: mỗi tuần ba buổi, buổi sau nhỉnh hơn buổi trước một chút, giữa hai buổi có ngày nghỉ, và có lịch viết sẵn để bạn không bao giờ phải đứng ở cửa băn khoăn hôm nay chạy bao xa. Không ai thành người chạy bộ bằng cách chạy hết sức vào thứ Bảy đầu tiên; họ thành người chạy bộ nhờ theo một giáo án ngày nào cũng hơi khó chịu một chút mà không bao giờ quá sức. Luyện phỏng vấn cũng vậy. Một lộ trình viết sẵn xoá đi quyết định hằng ngày ("hôm nay học gì?") — chính chỗ người ta mất cả tiếng đồng hồ — còn ngày nghỉ và ngày ôn là một phần của việc tập, không phải giờ giải lao.</p>
</div>

<div class="ml-en">
<h3>How the plan is built</h3>
<div class="lz-flow">
${THE('1', 'Patterns in dependency order', 'Hashing → two pointers → stack/queue → binary search → trees → heaps/intervals → graphs → backtracking → DP. Each chapter uses tools from the previous ones (trees use stacks and queues; Dijkstra uses a heap; DP reuses binary search).')}
${THE('2', 'One lesson + two problems a day', 'The 90-minute session of lesson 0.9: 10′ review, 20′ lesson, 25′ + 25′ problems, 10′ log. The first problem of the day is the "anchor" — the one that goes on the review ladder.')}
${THE('3', 'Sunday is a review day', 'No new lesson: the chapter quiz, three problems from the error log, and the weekly checkpoint.')}
${THE('4', 'Chapter 10 before the mocks', 'Talking, clean code, testing and OA format come right before the mock interviews, so the mocks practise them.')}
${THE('5', 'Week 4 is CV week', 'The application deadline is mid-December, so the week before it adds 30 minutes a day of CV/GitHub work — in both plans.')}
</div>
</div>
<div class="ml-vi">
<h3>Lộ trình được dựng thế nào</h3>
<div class="lz-flow">
${THE('1', 'Các mẫu theo thứ tự phụ thuộc', 'Băm → hai con trỏ → stack/queue → tìm nhị phân → cây → heap/khoảng → đồ thị → quay lui → quy hoạch động. Mỗi chương dùng công cụ của các chương trước (cây dùng stack và queue; Dijkstra dùng heap; DP dùng lại tìm nhị phân).')}
${THE('2', 'Mỗi ngày một bài + hai đề', 'Buổi 90 phút của bài 0.9: 10′ ôn, 20′ học, 25′ + 25′ hai đề, 10′ ghi sổ. Đề thứ nhất trong ngày là "đề neo" — đề được đưa lên thang ôn.')}
${THE('3', 'Chủ nhật là ngày ôn', 'Không học bài mới: quiz chương, ba đề trong sổ lỗi, và mốc kiểm của tuần.')}
${THE('4', 'Chương 10 đứng trước các buổi thử', 'Cách nói, code sạch, tự test và định dạng OA nằm ngay trước các buổi phỏng vấn thử, để buổi thử luyện đúng những thứ đó.')}
${THE('5', 'Tuần 4 là tuần CV', 'Hạn hồ sơ là giữa tháng 12, nên tuần ngay trước đó thêm 30 phút mỗi ngày cho CV/GitHub — ở cả hai lộ trình.')}
</div>
</div>

<div class="ml-en">
<h3>Spaced review: why re-solving beats re-reading</h3>
<p>In the 1880s Hermann Ebbinghaus measured how fast he forgot lists of nonsense syllables and found what is now called the <strong>forgetting curve</strong>: most of what you learn is lost within days unless you retrieve it again, and each successful retrieval makes the next forgetting slower. Two practical consequences, both confirmed many times since: <em>spacing</em> (reviewing at growing intervals) beats cramming, and <em>retrieval</em> (producing the answer from memory) beats re-reading the answer, which only feels like learning because the text looks familiar.</p>
<p>So in this course "review" means one specific thing: <strong>open a blank file and re-solve the problem without looking</strong>, saying the pattern, the idea and the complexity. Rules for the review slot:</p>
<ul>
<li><strong>+1 day review:</strong> 3 minutes — say the solution out loud and write only the key lines (the loop and the one subtle condition).</li>
<li><strong>+3, +7, +14 day reviews:</strong> full re-solve, capped at 10 minutes. Pass = correct code, both complexities, without peeking.</li>
<li><strong>Fail</strong> = peeked, or over 10 minutes, or a bug you did not catch yourself ⇒ the problem goes back to +1 day, and a line goes into the error log.</li>
<li>After passing +14 the problem "graduates" to a monthly list.</li>
</ul>
<p>The ladder for one problem, with dates, as a program you can run with your own problems:</p>
</div>
<div class="ml-vi">
<h3>Ôn cách quãng: vì sao giải lại thắng đọc lại</h3>
<p>Thập niên 1880, Hermann Ebbinghaus đo tốc độ chính ông quên những danh sách âm tiết vô nghĩa và tìm ra thứ ngày nay gọi là <strong>đường cong quên</strong> (forgetting curve): phần lớn điều bạn học mất đi trong vài ngày nếu không gợi lại, và mỗi lần gợi lại thành công làm lần quên tiếp theo chậm hơn. Hai hệ quả thực tế, đã được kiểm chứng rất nhiều lần về sau: <em>giãn cách</em> (ôn ở những khoảng tăng dần — spacing) thắng học dồn, và <em>gợi lại</em> (tự tạo ra câu trả lời từ trí nhớ — retrieval) thắng đọc lại lời giải, việc chỉ <em>có cảm giác</em> như đang học vì chữ trông quen mắt.</p>
<p>Vì vậy trong khoá này "ôn" có đúng một nghĩa: <strong>mở một tệp trống và giải lại đề mà không nhìn</strong>, nói ra mẫu, ý tưởng và độ phức tạp. Luật của khung giờ ôn:</p>
<ul>
<li><strong>Lần ôn +1 ngày:</strong> 3 phút — nói to lời giải và chỉ viết những dòng then chốt (vòng lặp và đúng một điều kiện tinh tế).</li>
<li><strong>Lần ôn +3, +7, +14 ngày:</strong> giải lại trọn vẹn, tối đa 10 phút. Đạt = code đúng, đủ hai độ phức tạp, không nhìn.</li>
<li><strong>Trượt</strong> = đã nhìn, hoặc quá 10 phút, hoặc có lỗi mà bạn không tự bắt được ⇒ đề quay về +1 ngày, và thêm một dòng vào sổ lỗi.</li>
<li>Qua được mốc +14 thì đề "tốt nghiệp" sang danh sách ôn hằng tháng.</li>
</ul>
<p>Thang ôn của một đề, có ngày tháng, viết thành một chương trình bạn chạy được với đề của chính mình:</p>
</div>
${maHai('ch11/b1/lich-on.ts', 'ch11/b1/PvLichOn.java', { vung: 'lich' })}
${ketQua('ch11/b1/lich-on.ts')}
<div class="ml-en">
<p>Read the second problem: LC 33 was solved on 1 December (day 16 of Plan B), passed the +1 review, <em>failed</em> the +3 review on 5 December — so the next review is 6 December, one day later, and the ladder restarts from the bottom. It graduates on 30 December instead of 26 December (1 + 3 + 7 + 14 = 25 days after 1 December). The failure costs only four days, but it adds two extra reviews in exactly the week the problem was shaky — which is the point: what you are weak on comes back more often, what you know well stops taking your time.</p>
</div>
<div class="ml-vi">
<p>Đọc đề thứ hai: LC 33 giải được ngày 1/12 (ngày 16 của lộ trình B), qua lần ôn +1, <em>trượt</em> lần ôn +3 vào 5/12 — nên lần ôn kế tiếp là 6/12, sau một ngày, và thang ôn chạy lại từ bậc dưới cùng. Nó tốt nghiệp ngày 30/12 thay vì 26/12 (1 + 3 + 7 + 14 = 25 ngày sau 1/12). Lần trượt chỉ làm chậm bốn ngày, nhưng thêm hai lượt ôn đúng vào tuần đề đó còn lung lay — đó chính là ý đồ: chỗ bạn yếu quay lại thường xuyên hơn, chỗ bạn đã vững thì thôi chiếm thời gian của bạn.</p>
</div>

<div class="ml-en">
<h3>Where this lives in real systems — including this website</h3>
<p>Flashcard apps schedule reviews with the same idea. The classic algorithm is <strong>SM-2</strong> (SuperMemo, 1987): after each review you grade your recall from 0 to 5; the interval goes 1 day → 6 days → previous interval × an "ease" factor that rises when recall is easy and falls when it is hard; a grade below 3 resets to 1 day. Anki uses a descendant of it (newer versions also offer a different scheduler, FSRS). This repository has its own copy: <code>src/services/srs/sm2.ts › scheduleSm2</code>, used by the interview drill (<code>src/services/interview/drill.service.ts</code>) and mirrored in the language-learning flashcards. The program below uses exactly that formula to compare SM-2 with the fixed 1 · 3 · 7 · 14 ladder:</p>
</div>
<div class="ml-vi">
<h3>Nó sống ở đâu trong hệ thống thật — kể cả trang web này</h3>
<p>Các ứng dụng thẻ nhớ (flashcard) xếp lịch ôn bằng cùng ý tưởng. Thuật toán kinh điển là <strong>SM-2</strong> (SuperMemo, 1987): sau mỗi lần ôn bạn tự chấm mức nhớ từ 0 tới 5; khoảng ôn đi 1 ngày → 6 ngày → khoảng trước × một hệ số "dễ" (ease) tăng khi nhớ dễ và giảm khi nhớ khó; chấm dưới 3 thì về lại 1 ngày. Anki dùng một hậu duệ của nó (bản mới còn có thêm một bộ xếp lịch khác, FSRS). Repo này có bản riêng: <code>src/services/srs/sm2.ts › scheduleSm2</code>, dùng cho phần luyện phỏng vấn (<code>src/services/interview/drill.service.ts</code>) và có bản tương tự trong thẻ nhớ học ngoại ngữ. Chương trình dưới đây dùng đúng công thức đó để so SM-2 với thang cố định 1 · 3 · 7 · 14:</p>
</div>
${ma('ch11/b1/sm2.ts', { vung: 'sm2', nhan: 'TypeScript — the formula of src/services/srs/sm2.ts' })}
${ketQua('ch11/b1/sm2.ts')}
<div class="ml-en">
<p>With easy recall SM-2 spaces reviews out to 16 and then 45 days — great for a vocabulary you keep for years, too slow for six weeks: the third review would land after your interviews. With one failure it drops back to 1 day and rebuilds, exactly like our ladder. The fixed ladder finishes in 25 days, so every anchor of days 1–17 completes it inside Plan B, and the later ones are still mid-ladder — reviewed within the last week — when the interviews come. That is the only reason this course uses a fixed ladder: the horizon is short. After the internship season, an SM-2 app is the better tool.</p>
</div>
<div class="ml-vi">
<p>Khi nhớ dễ, SM-2 giãn lần ôn ra 16 rồi 45 ngày — tuyệt vời cho vốn từ vựng bạn giữ nhiều năm, nhưng quá chậm cho sáu tuần: lần ôn thứ ba rơi vào sau ngày phỏng vấn. Khi trượt một lần, nó về lại 1 ngày rồi dựng lại, y như thang của ta. Thang cố định xong trong 25 ngày, nên mọi đề neo của ngày 1–17 đều đi hết thang ngay trong lộ trình B, còn các đề neo sau đó vẫn đang giữa thang — vừa được ôn trong tuần gần nhất — đúng lúc buổi phỏng vấn tới. Đó là lý do duy nhất khoá này dùng thang cố định: chân trời thời gian ngắn. Qua mùa thực tập, một ứng dụng SM-2 là công cụ tốt hơn.</p>
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap: "reviewing" by reading your old solution.</strong></p><p>It takes two minutes, it feels productive, and it measures nothing: recognising a solution and producing one are different skills, and the interview tests the second. The same goes for watching a solution video again. If you cannot re-solve it in 10 minutes from a blank file, the review failed — log it and put it back on +1 day. Two other traps: cramming six hours on Sunday instead of 90 minutes a day (the spacing is the effect), and changing plans every week (the plan's value is that you stop deciding).</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy: "ôn" bằng cách đọc lại lời giải cũ.</strong></p><p>Mất hai phút, có cảm giác năng suất, và không đo được gì cả: nhận ra một lời giải và tự viết ra một lời giải là hai kỹ năng khác nhau, và buổi phỏng vấn kiểm tra kỹ năng thứ hai. Xem lại video lời giải cũng vậy. Nếu không giải lại được trong 10 phút từ tệp trống thì lần ôn đó trượt — ghi sổ và đưa về +1 ngày. Hai bẫy khác: dồn sáu tiếng vào Chủ nhật thay vì 90 phút mỗi ngày (chính sự giãn cách mới tạo ra hiệu quả), và đổi lộ trình mỗi tuần (giá trị của lộ trình nằm ở chỗ bạn thôi phải tự quyết).</p></div>
</div>

<div class="ml-en">
<h2>Plan B — 42 days</h2>
<p>Day 1 is Monday 16 November 2026; shift the dates if you start later. The "Review" column is computed by running the ladder on the anchors (the first problem of each study day). Over the six weeks: <strong>${so(TB.ngayHoc)} study days, ${so(TB.deMoi)} new problems, ${so(TB.tongOn)} reviews, at most ${so(TB.toiDa)} reviews on any one day</strong> — on the heaviest days that is one 3-minute +1 review and three re-solves of at most 10 minutes, about half an hour, so the review slot grows from 10 to about 30 minutes in weeks 3–6 and the lesson slot shrinks to match. Two lessons on one day means: read the signals, the main worked example and the state table of each; leave the variants for Sunday.</p>
${bangLoTrinh(B, 'en')}
<p>Days 29–31 (Chapter 10) come before the first mock on day 32, as lesson 0.9 recommends. Mocks are three to six days apart so each session report has time to change something. If a company invites you to a real interview before day 32, move mock 1 to two or three days before it and swap the study days.</p>
</div>
<div class="ml-vi">
<h2>Lộ trình B — 42 ngày</h2>
<p>Ngày 1 là thứ Hai 16/11/2026; bắt đầu muộn hơn thì dời ngày tương ứng. Cột "Ôn" được tính bằng cách chạy thang ôn trên các đề neo (đề đầu tiên của mỗi ngày học). Trong sáu tuần: <strong>${so(TB.ngayHoc)} ngày học, ${so(TB.deMoi)} đề mới, ${so(TB.tongOn)} lượt ôn, nhiều nhất ${so(TB.toiDa)} lượt ôn trong một ngày</strong> — ngày nặng nhất là một lượt ôn +1 mất 3 phút và ba lượt giải lại tối đa 10 phút mỗi lượt, khoảng nửa tiếng, nên khung ôn nở từ 10 lên khoảng 30 phút ở tuần 3–6 và khung học co lại tương ứng. Ngày có hai bài nghĩa là: đọc phần dấu hiệu, ví dụ giải mẫu chính và bảng vết của từng bài; để phần biến thể sang Chủ nhật.</p>
${bangLoTrinh(B, 'vi')}
<p>Ngày 29–31 (Chương 10) đứng trước buổi thử đầu tiên ở ngày 32, đúng như bài 0.9 khuyên. Các buổi thử cách nhau ba tới sáu ngày để mỗi biên bản có thời gian làm thay đổi một điều gì đó. Nếu có công ty mời phỏng vấn thật trước ngày 32, dời buổi thử 1 lên trước buổi thật hai ba ngày và đổi chỗ các ngày học.</p>
</div>

<div class="ml-en">
<h2>Plan A — 28 days, compressed</h2>
<p>Same rules, same start date, ending on the application weekend. <strong>${so(TA.ngayHoc)} study days, ${so(TA.deMoi)} new problems, ${so(TA.tongOn)} reviews (at most ${so(TA.toiDa)} a day)</strong>, two mocks in week 4. What it skips, as 0.9 said: Chapter 8 (backtracking), most of Chapter 9 (2-D DP, greedy), lesson 1.4 (bits), 5.4 (trie), 6.2 (two heaps), 7.4 (Dijkstra) and the practice sets. Do them after you submit, using days 29–42 of Plan B; mock 3 (lesson 11.4) goes in that period too.</p>
${bangLoTrinh(A, 'en')}
</div>
<div class="ml-vi">
<h2>Lộ trình A — 28 ngày, bản nén</h2>
<p>Cùng luật, cùng ngày bắt đầu, kết thúc đúng cuối tuần nộp hồ sơ. <strong>${so(TA.ngayHoc)} ngày học, ${so(TA.deMoi)} đề mới, ${so(TA.tongOn)} lượt ôn (nhiều nhất ${so(TA.toiDa)} lượt một ngày)</strong>, hai buổi thử trong tuần 4. Những gì tạm bỏ, đúng như 0.9 đã nói: Chương 8 (quay lui), phần lớn Chương 9 (DP hai chiều, tham lam), bài 1.4 (bit), 5.4 (trie), 6.2 (hai heap), 7.4 (Dijkstra) và các bộ luyện. Làm chúng sau khi nộp, theo ngày 29–42 của lộ trình B; buổi thử 3 (bài 11.4) cũng nằm trong khoảng đó.</p>
${bangLoTrinh(A, 'vi')}
</div>

<div class="ml-en">
<h3>The error log</h3>
<p>Five columns, as in lesson 0.9: <em>date · problem · pattern · what went wrong · next review date</em>. One line per problem where something went wrong — not per problem solved. The "what went wrong" column must be specific enough to act on: "binary search wrong" is useless, "used <code>hi = mid − 1</code> with a half-open range" is a lesson. Illustrative rows (a composite student):</p>
<table>
<thead><tr><th>Date</th><th>Problem</th><th>Pattern</th><th>What went wrong</th><th>Next review</th></tr></thead>
<tbody>
<tr><td>23/11</td><td>LC 3</td><td>sliding window</td><td>moved <code>left</code> to <code>last[c] + 1</code> without <code>max</code> — left went backwards on "abba"</td><td>24/11</td></tr>
<tr><td>01/12</td><td>LC 33</td><td>binary search, rotated</td><td>compared with <code>nums[hi]</code> on a half-open range (index out of bounds)</td><td>02/12</td></tr>
<tr><td>04/12</td><td>LC 543</td><td>tree, return to parent</td><td>returned the diameter instead of the height</td><td>05/12</td></tr>
<tr><td>06/12</td><td>(mock 0)</td><td>testing</td><td>traced only the given example; missed the empty input</td><td>re-read 10.3</td></tr>
</tbody></table>
<p>Every Sunday, count the patterns column. If one pattern appears three times in two weeks, that chapter's main lesson is your next Sunday.</p>
</div>
<div class="ml-vi">
<h3>Sổ lỗi</h3>
<p>Năm cột, như bài 0.9: <em>ngày · đề · mẫu · sai ở đâu · ngày ôn tiếp</em>. Mỗi đề <em>có chuyện</em> một dòng — không phải mỗi đề đã giải một dòng. Cột "sai ở đâu" phải đủ cụ thể để hành động được: "sai tìm nhị phân" là vô dụng, "dùng <code>hi = mid − 1</code> với khoảng nửa mở" mới là một bài học. Các dòng minh hoạ (một sinh viên ghép từ nhiều người):</p>
<table>
<thead><tr><th>Ngày</th><th>Đề</th><th>Mẫu</th><th>Sai ở đâu</th><th>Ôn tiếp</th></tr></thead>
<tbody>
<tr><td>23/11</td><td>LC 3</td><td>cửa sổ trượt</td><td>dời <code>left</code> tới <code>last[c] + 1</code> mà không có <code>max</code> — left lùi lại với "abba"</td><td>24/11</td></tr>
<tr><td>01/12</td><td>LC 33</td><td>nhị phân, mảng xoay</td><td>so với <code>nums[hi]</code> trên khoảng nửa mở (vượt chỉ số mảng)</td><td>02/12</td></tr>
<tr><td>04/12</td><td>LC 543</td><td>cây, trả gì cho cha</td><td>trả về đường kính thay vì chiều cao</td><td>05/12</td></tr>
<tr><td>06/12</td><td>(thử khởi động)</td><td>kiểm thử</td><td>chỉ chạy tay ví dụ của đề; sót đầu vào rỗng</td><td>đọc lại 10.3</td></tr>
</tbody></table>
<p>Mỗi Chủ nhật, đếm cột mẫu. Mẫu nào xuất hiện ba lần trong hai tuần thì bài chính của chương đó là việc của Chủ nhật tới.</p>
</div>

<div class="ml-en">
<h3>Checkpoints: are you on track?</h3>
<table>
<thead><tr><th>End of</th><th>Checkpoint (measured, not felt)</th><th>If you miss it</th></tr></thead>
<tbody>
<tr><td>Week 1</td><td>An Easy hash-map problem in ≤ 15′, said out loud; quizzes 0.3 and 1.6 ≥ 7/10</td><td>Redo 1.1's practice; do not start Chapter 3 before this passes</td></tr>
<tr><td>Week 2</td><td>A Medium two-pointer or window problem from cold in ≤ 25′ (e.g. ${lc(15, '3sum', '3Sum', 'Medium')} or ${lc(3, 'longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters', 'Medium')} without looking first); LC 20 in ≤ 10′</td><td>Sunday: Chapter 2's practice set, two more Mediums with a timer</td></tr>
<tr><td>Week 3</td><td>The binary-search template from memory, correct first time; a Medium tree problem ≤ 25′; the 20′ warm-up mock done</td><td>Re-solve 4.1's three variants on paper before moving on</td></tr>
<tr><td>Week 4</td><td><strong>Application submitted.</strong> One Medium heap or interval problem ≤ 25′</td><td>The deadline does not move: submit with what you have, keep training</td></tr>
<tr><td>Week 5</td><td>Mock 1 at "Lean hire" or better; an OA-style input read correctly first time</td><td>Fix the lowest axis with its lesson before mock 2</td></tr>
<tr><td>Week 6</td><td>Mocks 2 and 3 at "Hire"; final exam 11.6 ≥ 18/24</td><td>One more mock with the spare problems; review the exam's wrong answers' lessons</td></tr>
</tbody></table>
<p>Missing a checkpoint is information, not failure. The rule is only: do not pile new chapters on a pattern you cannot yet do — use the Sunday to close the gap, and if needed shift the plan by one day rather than skip reviews or mocks.</p>
</div>
<div class="ml-vi">
<h3>Mốc kiểm: bạn có đang đúng tiến độ?</h3>
<table>
<thead><tr><th>Cuối</th><th>Mốc kiểm (đo được, không phải cảm giác)</th><th>Nếu chưa đạt</th></tr></thead>
<tbody>
<tr><td>Tuần 1</td><td>Một đề Easy hash map ≤ 15′, nói to; quiz 0.3 và 1.6 ≥ 7/10</td><td>Làm lại phần thực hành của 1.1; chưa đạt thì chưa sang Chương 3</td></tr>
<tr><td>Tuần 2</td><td>Một đề Medium hai con trỏ hay cửa sổ làm "nguội" ≤ 25′ (vd ${lc(15, '3sum', '3Sum', 'Medium')} hoặc ${lc(3, 'longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters', 'Medium')} mà không xem lại trước); LC 20 ≤ 10′</td><td>Chủ nhật: bộ luyện Chương 2, thêm hai đề Medium có bấm giờ</td></tr>
<tr><td>Tuần 3</td><td>Khuôn tìm nhị phân viết từ trí nhớ, đúng ngay lần đầu; một đề Medium về cây ≤ 25′; đã làm buổi thử khởi động 20′</td><td>Giải lại ba biến thể của 4.1 trên giấy rồi mới đi tiếp</td></tr>
<tr><td>Tuần 4</td><td><strong>Đã nộp hồ sơ.</strong> Một đề Medium heap hoặc khoảng ≤ 25′</td><td>Hạn không dời: nộp với những gì đang có, cứ tiếp tục luyện</td></tr>
<tr><td>Tuần 5</td><td>Buổi thử 1 đạt "Lean hire" trở lên; một đề kiểu OA đọc input đúng ngay lần đầu</td><td>Sửa trục thấp nhất bằng bài chữa của nó trước buổi thử 2</td></tr>
<tr><td>Tuần 6</td><td>Buổi thử 2 và 3 đạt "Hire"; bài thi cuối khoá 11.6 ≥ 18/24</td><td>Thêm một buổi thử bằng các đề dự phòng; ôn các bài ứng với câu làm sai</td></tr>
</tbody></table>
<p>Trượt một mốc là thông tin, không phải thất bại. Luật chỉ có một: đừng chồng chương mới lên một mẫu bạn chưa làm được — dùng Chủ nhật để lấp chỗ hổng, và nếu cần thì dời cả lộ trình một ngày chứ không bỏ lượt ôn hay buổi thử.</p>
</div>

<div class="ml-en">
<h3>Fitting it around the FPT semester</h3>
<p>The plan assumes 90 minutes a day. Exam weeks, assignment deadlines and project demos break that, and the worst response is to drop everything for a week (the review ladder collapses) or to keep the full plan and sleep four hours (exam and interview both suffer). Use three gears:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Normal day</span><span class="v">90′: review, lesson, two problems, log.</span></div>
  <div class="kv"><span class="k">Maintenance day (exam week, a deadline tomorrow)</span><span class="v">30–45′: the reviews of the day + one new problem (the anchor). The lesson of that day moves to the next Sunday or to a buffer day at the end.</span></div>
  <div class="kv"><span class="k">Exam day (FE, PE) or demo day</span><span class="v">10′ or nothing: only the +1 review, said out loud on the bus. Never a new problem.</span></div>
</div>
<p>Check your exam schedule on FAP before you start and mark exam days in the calendar on day 1. The Fall final exams usually fall in the second half of November, so for many students <strong>week 1 of this plan is an exam week</strong>: run it in maintenance gear, use both Saturday and Sunday of week 1 to catch up the lessons (they are short in week 1), and Plan A still reaches the application weekend. What you must never trade for interview practice is the semester itself — a failed subject delays OJT far more than one weaker interview.</p>
</div>
<div class="ml-vi">
<h3>Xếp lộ trình quanh học kỳ ở FPT</h3>
<p>Lộ trình giả định 90 phút mỗi ngày. Tuần thi, hạn nộp assignment và buổi demo đồ án phá vỡ điều đó, và cách phản ứng tệ nhất là bỏ hết một tuần (thang ôn sụp đổ) hoặc giữ nguyên lộ trình rồi ngủ bốn tiếng (cả bài thi lẫn buổi phỏng vấn cùng chịu thiệt). Dùng ba "số":</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ngày thường</span><span class="v">90′: ôn, học, hai đề, ghi sổ.</span></div>
  <div class="kv"><span class="k">Ngày bảo trì (tuần thi, mai là hạn nộp bài)</span><span class="v">30–45′: các lượt ôn của ngày + một đề mới (đề neo). Bài học của hôm đó dời sang Chủ nhật kế tiếp hoặc một ngày đệm ở cuối.</span></div>
  <div class="kv"><span class="k">Ngày thi (FE, PE) hoặc ngày demo</span><span class="v">10′ hoặc không gì cả: chỉ lượt ôn +1, nói to trên xe buýt. Không bao giờ đề mới.</span></div>
</div>
<p>Xem lịch thi trên FAP trước khi bắt đầu và đánh dấu các ngày thi vào lịch ngay ngày 1. Kỳ Fall thường thi cuối kỳ vào nửa sau tháng 11, nên với nhiều bạn <strong>tuần 1 của lộ trình này là tuần thi</strong>: chạy nó ở "số bảo trì", dùng cả thứ Bảy lẫn Chủ nhật tuần 1 để bù bài học (các bài tuần 1 ngắn), và lộ trình A vẫn tới kịp cuối tuần nộp hồ sơ. Thứ bạn không bao giờ được đổi lấy giờ luyện phỏng vấn là chính học kỳ — trượt một môn làm OJT chậm lại nhiều hơn hẳn một buổi phỏng vấn kém.</p>
</div>

<div class="ml-en">
<h3>CV week: the six evenings before the deadline</h3>
<p>Week 4 adds 30 minutes a day, in this order: (1) a one-page draft; (2) project bullets with your role, one decision and a number; (3) GitHub — three pinned repositories with READMEs that say what, how to run, and what you did; (4) a classmate reads the CV for 30 seconds and tells you what they remember; (5) LinkedIn and the school's internship portal profile; (6) the final PDF, a sensible file name, every link clicked. How to show this course on a CV: not as "solved 300 LeetCode problems" in the headline — real projects matter more for an intern — but a single honest line under skills, and optionally a public repository of your solutions organised by pattern, with a README that shows your error-log summary, is evidence of a working habit. Only claim what is true; interviewers check.</p>
</div>
<div class="ml-vi">
<h3>Tuần CV: sáu buổi tối trước hạn nộp</h3>
<p>Tuần 4 thêm 30 phút mỗi ngày, theo thứ tự: (1) bản nháp một trang; (2) gạch đầu dòng dự án có vai trò của bạn, một quyết định và một con số; (3) GitHub — ghim ba repo có README nói rõ làm gì, chạy thế nào, bạn làm phần nào; (4) nhờ một bạn đọc CV trong 30 giây rồi kể lại họ nhớ gì; (5) LinkedIn và hồ sơ trên cổng thực tập của trường; (6) bản PDF cuối, tên tệp tử tế, bấm thử từng link. Ghi khoá này vào CV thế nào: đừng để "giải 300 đề LeetCode" làm tiêu điểm — với thực tập sinh, dự án thật quan trọng hơn — mà là một dòng trung thực ở mục kỹ năng, và nếu muốn, một repo công khai chứa lời giải xếp theo mẫu, README tóm tắt sổ lỗi của bạn, là bằng chứng của một thói quen làm việc. Chỉ ghi điều có thật; người phỏng vấn sẽ hỏi.</p>
${lienKet({ khoa: 'interview-prep', bai: 'pv-1-1-cv', title: 'Interview Prep 1.1 — CV kỹ thuật một trang', sub: 'Cấu trúc, gạch đầu dòng có số liệu, ATS — buổi tối số 1', cta: 'Mở' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-1-2-du-an-cv', title: 'Interview Prep 1.2 — Viết dự án trong CV', sub: 'Vai trò, quyết định, vấn đề, kết quả — buổi tối số 2', cta: 'Mở' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-1-3-github', title: 'Interview Prep 1.3 — GitHub và portfolio', sub: 'Repo ghim, README, lịch sử commit sạch — buổi tối số 3', cta: 'Mở' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-1-5-lab-cv', title: 'Interview Prep 1.5 — Lab: viết, may đo và kiểm thử CV', sub: 'Phép thử 30 giây và bản cuối — buổi tối số 4 và 6', cta: 'Mở' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-1-4-linkedin', title: 'Interview Prep 1.4 — LinkedIn cho sinh viên', sub: 'Hồ sơ để nhà tuyển dụng tìm thấy — buổi tối số 5', cta: 'Mở' })}
</div>

<div class="ml-en">
<h3>🎤 "How did you prepare for this interview?"</h3>
<p>Interviewers ask it, especially for interns, because it shows how you learn. Your plan is a good answer — if you say it concretely.</p>
${hoiThoai([
  ['I', 'Before we start: how did you prepare for this interview?'],
  ['C', 'I followed a six-week plan organised by pattern rather than by problem: hashing, two pointers, stacks, binary search, trees, heaps, graphs, backtracking and DP, about an hour and a half a day.'],
  ['N', 'Structure first, numbers second. "By pattern rather than by problem" tells them you are not memorising.'],
  ['C', 'Every problem I got wrong went into an error log, and I re-solved the important ones after one, three, seven and fourteen days from a blank file. I also did three timed mock interviews with classmates and scored them on communication, problem solving, code and testing.'],
  ['I', 'What did the mocks show you?'],
  ['C', 'That my weakest part was testing. I used to stop after the given example. Now I always trace two edge cases I choose on purpose before I say I’m done.'],
  ['N', 'A real weakness with the fix you applied. It is also a promise they will watch you keep in the next 40 minutes — so keep it.'],
  ['I', 'Which topic do you still find hardest?'],
  ['C', 'Two-dimensional DP. I can solve the standard ones, but defining the state for a new problem still takes me longer, so I say the state, the transition and the base case out loud before coding.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 "Bạn đã chuẩn bị cho buổi phỏng vấn này thế nào?"</h3>
<p>Người phỏng vấn hay hỏi câu này, nhất là với thực tập sinh, vì nó cho thấy bạn học như thế nào. Lộ trình của bạn là một câu trả lời tốt — nếu bạn nói cụ thể.</p>
${hoiThoai([
  ['I', 'Trước khi bắt đầu: bạn đã chuẩn bị cho buổi phỏng vấn này thế nào?'],
  ['C', 'Em theo một lộ trình sáu tuần xếp theo mẫu bài chứ không theo từng đề: băm, hai con trỏ, stack, tìm nhị phân, cây, heap, đồ thị, quay lui và quy hoạch động, mỗi ngày khoảng một tiếng rưỡi. <em>("organised by pattern rather than by problem")</em>'],
  ['N', 'Cấu trúc trước, con số sau. "Theo mẫu chứ không theo đề" cho họ biết bạn không học thuộc.'],
  ['C', 'Đề nào em làm sai đều vào sổ lỗi, và những đề quan trọng em giải lại từ tệp trống sau một, ba, bảy và mười bốn ngày. Em cũng làm ba buổi phỏng vấn thử có bấm giờ với bạn cùng lớp, chấm theo giao tiếp, giải quyết vấn đề, code và kiểm thử. <em>("I re-solved them after one, three, seven and fourteen days from a blank file")</em>'],
  ['I', 'Các buổi thử cho bạn thấy điều gì?'],
  ['C', 'Rằng phần yếu nhất của em là kiểm thử. Trước em hay dừng sau ví dụ của đề. Giờ em luôn chạy tay hai ca biên em cố ý chọn trước khi nói xong. <em>("I always trace two edge cases I choose on purpose before I say I’m done.")</em>'],
  ['N', 'Một điểm yếu thật kèm cách bạn đã sửa. Nó cũng là một lời hứa họ sẽ quan sát bạn giữ trong 40 phút tới — nên hãy giữ.'],
  ['I', 'Chủ đề nào bạn vẫn thấy khó nhất?'],
  ['C', 'Quy hoạch động hai chiều. Đề chuẩn thì em giải được, nhưng định nghĩa trạng thái cho một đề mới vẫn làm em mất thời gian hơn, nên em nói trạng thái, phép chuyển và ca cơ sở thành tiếng trước khi code. <em>("I say the state, the transition and the base case out loud before coding.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes with a study plan</h3>
<ul>
<li>Starting with the hardest chapter "to get it over with" — DP before hashing has no tools to stand on.</li>
<li>Counting problems instead of patterns: 30 sliding-window problems and no trees.</li>
<li>Skipping reviews because new problems feel more productive.</li>
<li>No buffer for exams — one exam week and the plan is "behind" forever, so it is abandoned.</li>
<li>Booking the first mock "when I'm ready" — you are never ready; book it on the calendar date.</li>
<li>Leaving the CV for the night before the deadline.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp với một lộ trình học</h3>
<ul>
<li>Bắt đầu bằng chương khó nhất "cho xong" — DP trước băm thì chẳng có công cụ nào để đứng lên.</li>
<li>Đếm số đề thay vì số mẫu: 30 đề cửa sổ trượt và không đề cây nào.</li>
<li>Bỏ lượt ôn vì đề mới "có cảm giác năng suất hơn".</li>
<li>Không chừa đệm cho tuần thi — một tuần thi là lộ trình "trễ" mãi mãi, rồi bị bỏ.</li>
<li>Hẹn buổi thử đầu tiên "khi nào sẵn sàng" — không bao giờ sẵn sàng cả; hẹn đúng ngày trong lịch.</li>
<li>Để CV tới đêm trước hạn nộp.</li>
</ul>
</div>

<div class="ml-en">
<h3>🧪 Practice (30 min, today)</h3>
<div class="callout ok"><ol>
<li>Choose Plan A or B. Copy its table into your calendar (one event per day with the lesson and the two problems).</li>
<li>Mark your exam days from FAP and set those days to maintenance or exam gear.</li>
<li>Create the error log with the five columns.</li>
<li>Run <code>lich-on.ts</code> (or the Java version) with your first anchor problem and today's date; put the four review dates in the calendar.</li>
<li>Book the three mock dates with a classmate (days 32, 38, 41 in Plan B; 23 and 25 in Plan A) and the 20-minute warm-up on the Sunday of week 3 (day 21 in Plan B, day 14 in Plan A).</li>
</ol>
<p><strong>Done when:</strong> 28 or 42 calendar events exist, exam days are marked, the error log exists, one review ladder is in the calendar, and three mock dates are agreed with a person.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">spaced repetition</span><span class="v">Reviewing at growing intervals so that memory lasts.</span></div>
  <div class="kv"><span class="k">retrieval practice</span><span class="v">Producing the answer from memory instead of re-reading it.</span></div>
  <div class="kv"><span class="k">forgetting curve</span><span class="v">How quickly memory fades without retrieval (Ebbinghaus).</span></div>
  <div class="kv"><span class="k">anchor problem</span><span class="v">The day's first problem; the one that goes on the review ladder.</span></div>
  <div class="kv"><span class="k">SM-2</span><span class="v">The classic flashcard scheduler: 1 → 6 days → interval × ease.</span></div>
  <div class="kv"><span class="k">checkpoint</span><span class="v">A measured weekly target that tells you whether to move on.</span></div>
  <div class="kv"><span class="k">maintenance gear</span><span class="v">A 30–45′ day that keeps reviews alive during exams.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>A written day-by-day plan removes the daily decision; follow it, do not redesign it weekly.</li>
<li>Review = re-solve from a blank file in ≤ 10′ at +1, +3, +7, +14 days; a fail resets to +1.</li>
<li>Plan B: ${so(TB.ngayHoc)} study days, ${so(TB.deMoi)} new problems, ${so(TB.tongOn)} computed reviews, three mocks after Chapter 10.</li>
<li>Plan A: 28 days to the application weekend; the skipped chapters come after.</li>
<li>Checkpoints are measured; missing one means closing the gap on Sunday, not skipping ahead.</li>
<li>Exams win: use maintenance and exam gears; week 4 adds 30′ a day for the CV.</li>
</ul>
${nguon('📘', 'Wikipedia — Spaced repetition', 'The research behind spacing and retrieval, Leitner boxes and SM-2', 'https://en.wikipedia.org/wiki/Spaced_repetition')}
${nguon('📘', 'Wikipedia — Forgetting curve', 'Ebbinghaus’s measurements and what they mean for reviewing', 'https://en.wikipedia.org/wiki/Forgetting_curve')}
${nguon('📗', 'Grind 75 — a customisable study plan', 'A public pattern-ordered list to continue with after this course', 'https://www.techinterviewhandbook.org/grind75/')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (30 phút, ngay hôm nay)</h3>
<div class="callout ok"><ol>
<li>Chọn lộ trình A hoặc B. Chép bảng của nó vào lịch (mỗi ngày một sự kiện, ghi bài học và hai đề).</li>
<li>Đánh dấu các ngày thi lấy từ FAP và đặt những ngày đó sang "số bảo trì" hoặc "số ngày thi".</li>
<li>Tạo sổ lỗi năm cột.</li>
<li>Chạy <code>lich-on.ts</code> (hoặc bản Java) với đề neo đầu tiên của bạn và ngày hôm nay; đưa bốn ngày ôn vào lịch.</li>
<li>Hẹn ba ngày phỏng vấn thử với một bạn cùng lớp (ngày 32, 38, 41 ở lộ trình B; 23 và 25 ở lộ trình A) và buổi khởi động 20 phút vào Chủ nhật tuần 3 (ngày 21 ở lộ trình B, ngày 14 ở lộ trình A).</li>
</ol>
<p><strong>Đạt khi:</strong> lịch có đủ 28 hoặc 42 sự kiện, đã đánh dấu ngày thi, sổ lỗi đã có, một thang ôn đã nằm trong lịch, và ba ngày phỏng vấn thử đã chốt với một người thật.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">spaced repetition (ôn cách quãng)</span><span class="v">Ôn lại sau những khoảng tăng dần để nhớ lâu.</span></div>
  <div class="kv"><span class="k">retrieval practice (luyện gợi lại)</span><span class="v">Tự tạo ra câu trả lời từ trí nhớ thay vì đọc lại nó.</span></div>
  <div class="kv"><span class="k">forgetting curve (đường cong quên)</span><span class="v">Trí nhớ phai nhanh thế nào nếu không gợi lại (Ebbinghaus).</span></div>
  <div class="kv"><span class="k">anchor problem (đề neo)</span><span class="v">Đề đầu tiên trong ngày; đề được đưa lên thang ôn.</span></div>
  <div class="kv"><span class="k">SM-2</span><span class="v">Bộ xếp lịch thẻ nhớ kinh điển: 1 → 6 ngày → khoảng × hệ số dễ.</span></div>
  <div class="kv"><span class="k">checkpoint (mốc kiểm)</span><span class="v">Mục tiêu hằng tuần đo được, cho biết có nên đi tiếp không.</span></div>
  <div class="kv"><span class="k">maintenance gear (số bảo trì)</span><span class="v">Ngày 30–45′ giữ các lượt ôn sống trong tuần thi.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lộ trình viết sẵn từng ngày xoá quyết định hằng ngày; cứ theo nó, đừng thiết kế lại mỗi tuần.</li>
<li>Ôn = giải lại từ tệp trống trong ≤ 10′ ở +1, +3, +7, +14 ngày; trượt thì về +1.</li>
<li>Lộ trình B: ${so(TB.ngayHoc)} ngày học, ${so(TB.deMoi)} đề mới, ${so(TB.tongOn)} lượt ôn tự tính, ba buổi thử sau Chương 10.</li>
<li>Lộ trình A: 28 ngày tới cuối tuần nộp hồ sơ; các chương tạm bỏ học sau.</li>
<li>Mốc kiểm phải đo được; trượt mốc thì lấp chỗ hổng vào Chủ nhật, không nhảy cóc.</li>
<li>Học kỳ được ưu tiên: dùng số bảo trì và số ngày thi; tuần 4 thêm 30′ mỗi ngày cho CV.</li>
</ul>
${nguon('📘', 'Wikipedia — Spaced repetition', 'Nghiên cứu về giãn cách và gợi lại, hộp Leitner và SM-2 (tiếng Anh)', 'https://en.wikipedia.org/wiki/Spaced_repetition')}
${nguon('📘', 'Wikipedia — Forgetting curve', 'Các phép đo của Ebbinghaus và ý nghĩa cho việc ôn (tiếng Anh)', 'https://en.wikipedia.org/wiki/Forgetting_curve')}
${nguon('📗', 'Grind 75 — lộ trình tuỳ chỉnh', 'Danh sách công khai xếp theo mẫu để học tiếp sau khoá này', 'https://www.techinterviewhandbook.org/grind75/')}
</div>
`,
};
