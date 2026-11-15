/** 11.2 — Phỏng vấn thử 1 (Easy + Medium): LC 169 + LC 1249. Mọi mã/output đọc từ ../ma/ch11/b2 (chạy thật bằng _chay.mjs). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, hoiThoai, gap, lienKet, baiNay } from '../_chung.mjs';
import { THE, bangChamDiem, nguongKetLuan, bienBan, bangHoiDap, bangGoiY } from './_rieng.mjs';
import { vetBauChon } from '../ma/ch11/b2/majority.vet.mjs';
import { vetXoaNgoac } from '../ma/ch11/b2/min-remove.vet.mjs';

const PHIEU = [2, 2, 1, 1, 1, 2, 2];
const BANG_BM = bangVet(['i', 'nums', 'x', 'candidate', 'count'],
  vetBauChon(PHIEU).map((h) => [
    String(h.i),
    oMang(PHIEU, { to: { [h.i]: h.doi ? 'r' : 'l' } }),
    String(h.x),
    h.doi ? `<strong>${h.candidate}</strong> ⟵ new` : String(h.candidate),
    String(h.count),
  ]));

const CHUOI = 'a)b(c))(';
const XN = vetXoaNgoac(CHUOI);
const BANG_NGOAC = bangVet(['i', 's', 'ch', 'action', 'stack of "(" indices', 'remove'],
  XN.hang.map((h) => [
    String(h.i),
    oMang([...CHUOI], { to: Object.fromEntries([[h.i, h.viec.startsWith('xoá') ? 'x' : 'l'], ...h.remove.filter((k) => k !== h.i).map((k) => [k, 'mo'])]) }),
    `<code>${h.ch}</code>`,
    h.viec.replace('giữ chữ', 'keep').replace('xoá', 'remove'),
    `[${h.stack.join(', ')}]`,
    `{${h.remove.join(', ')}}`,
  ]));

const RIENG = {
  en: [
    'asks whether a majority is guaranteed and whether "any valid string" is accepted for problem 2.',
    'offers count-map → sort → voting for problem 1 and explains why the cancelling argument works.',
    'problem 2 written with a StringBuilder / array join, no index bugs at the end of the string.',
    'traces <code>"))(("</code> and <code>"(a(b(c)d)"</code> on purpose — the leftover-"(" case.',
  ],
  vi: [
    'hỏi đề 1 có chắc chắn có phần tử đa số không, và đề 2 có chấp nhận "bất kỳ chuỗi hợp lệ nào" không.',
    'đề 1 nêu được đếm bằng map → sắp xếp → bỏ phiếu, và giải thích vì sao lập luận "triệt tiêu từng cặp" đúng.',
    'đề 2 dựng kết quả bằng StringBuilder / mảng rồi join, không lệch chỉ số ở cuối chuỗi.',
    'cố ý chạy tay <code>"))(("</code> và <code>"(a(b(c)d)"</code> — ca còn sót "(" chưa đóng.',
  ],
};

const DE = [
  [lc(169, 'majority-element', 'Majority Element', 'Easy'), 'Problem 1 of this set. Count, sort, or vote.', 'Đề 1 của bộ này. Đếm, sắp xếp, hoặc bỏ phiếu.'],
  [lc(1249, 'minimum-remove-to-make-valid-parentheses', 'Minimum Remove to Make Valid Parentheses', 'Medium'), 'Problem 2. A stack of indices, or two passes with a counter.', 'Đề 2. Ngăn xếp chỉ số, hoặc hai lượt với bộ đếm.'],
  [lc(290, 'word-pattern', 'Word Pattern', 'Easy'), 'Spare problem / 20′ warm-up mock in week 3: two maps, both directions.', 'Đề dự phòng / buổi thử khởi động 20′ ở tuần 3: hai map, hai chiều.'],
  [lc(229, 'majority-element-ii', 'Majority Element II', 'Medium'), 'Follow-up of problem 1: more than n/3 ⇒ at most two candidates.', 'Nối tiếp đề 1: hơn n/3 ⇒ tối đa hai ứng viên.'],
  [lc(921, 'minimum-add-to-make-parentheses-valid', 'Minimum Add to Make Parentheses Valid', 'Medium'), 'Follow-up of problem 2 that only counts — the two-pass counter without the string.', 'Nối tiếp đề 2 chỉ cần đếm — bộ đếm hai lượt mà không dựng chuỗi.'],
  [lc(301, 'remove-invalid-parentheses', 'Remove Invalid Parentheses', 'Hard'), '"Return ALL minimal answers" — BFS or backtracking (Chapter 8).', '"Trả về MỌI đáp án ít xoá nhất" — BFS hoặc quay lui (Chương 8).'],
];

export default {
  title: '11.2 — Mock interview 1 (Easy + Medium): script, rubric, solutions|||11.2 — Phỏng vấn thử 1 (Easy + Medium): kịch bản, phiếu chấm, lời giải',
  slug: 'dsa-11-2-thu-1',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Buổi phỏng vấn thử 45 phút đầu tiên với hai đề mới (Majority Element, Minimum Remove to Make Valid Parentheses): cách dựng buổi, kịch bản từng câu cho người phỏng vấn, ba gợi ý theo bậc, câu hỏi nối tiếp, phiếu chấm 4 trục, lời giải TS + Java chạy thật và mẫu biên bản ghi sổ lỗi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2 · Mock set 1</span>
<h2>Mock interview 1 (Easy + Medium)</h2>
<p class="lead">This is the first full rehearsal: 45 minutes, two problems you have not solved in this course, a classmate playing the interviewer with a word-for-word script, and a scoring sheet with the same four axes real interviewers use. The lesson is written for <strong>two readers</strong>. Both read the first part (how to run the session, the timeline, the rubric). Only the <em>interviewer</em> reads the script. The candidate reads the solutions only <em>after</em> the session — the point is to meet the problems cold.</p>
<div class="callout warn"><p><strong>Candidate: stop at the heading "⛔ Interviewer only".</strong> If you read the problems first, the mock measures your memory, not your interviewing — and you lose one of only three fresh sets.</p></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2 · Bộ thử 1</span>
<h2>Phỏng vấn thử 1 (Easy + Medium)</h2>
<p class="lead">Đây là buổi diễn tập trọn vẹn đầu tiên: 45 phút, hai đề bạn CHƯA giải trong khoá này, một bạn cùng lớp đóng vai người phỏng vấn theo kịch bản từng câu, và một phiếu chấm có đúng bốn trục mà người phỏng vấn thật dùng. Bài viết cho <strong>hai người đọc</strong>. Cả hai cùng đọc phần đầu (cách dựng buổi, dòng thời gian, phiếu chấm). Chỉ <em>người phỏng vấn</em> đọc kịch bản. Ứng viên chỉ đọc lời giải <em>sau</em> buổi thử — mục đích là gặp đề khi đầu còn "nguội".</p>
<div class="callout warn"><p><strong>Ứng viên: dừng đọc ở tiêu đề "⛔ Chỉ người phỏng vấn đọc".</strong> Đọc đề trước thì buổi thử chỉ đo trí nhớ của bạn, không đo cách bạn phỏng vấn — và bạn mất một trong ba bộ đề "còn mới".</p></div>
</div>

<div class="ml-en">
<h3>The everyday picture: the mock PE before the real PE</h3>
<p>Before a practical exam at FPT, the smart students do a mock PE: same room conditions, same time limit, a problem they have not seen, and someone else checking the output. They do not do it to learn new material — by then the material is learned. They do it to find out what breaks <em>under the clock</em>: they type slower than they thought, they forget to read the input format, they panic at minute 50. A mock interview is that mock PE for the coding round. Its job is to break things now, in a room with a friend, instead of in December with a stranger.</p>
<p>A <strong>mock interview</strong> (phỏng vấn thử) differs from practising alone in three ways: someone is listening (so silence costs points), someone controls the information (so you must <em>ask</em> instead of reading the constraints), and someone is scoring behaviour you cannot see yourself (how long you were silent, how many hints you needed).</p>
</div>
<div class="ml-vi">
<h3>Hình dung đời thường: thi thử PE trước khi thi PE thật</h3>
<p>Trước kỳ thi thực hành ở FPT, những bạn khôn ngoan làm một buổi thi thử: cùng điều kiện phòng, cùng giới hạn thời gian, một đề chưa thấy bao giờ, và có người khác chấm output. Họ không làm vậy để học kiến thức mới — tới lúc đó kiến thức đã học xong. Họ làm để biết cái gì vỡ <em>khi có đồng hồ</em>: gõ chậm hơn mình tưởng, quên đọc định dạng input, hoảng ở phút thứ 50. Phỏng vấn thử chính là buổi thi thử PE đó cho vòng coding. Việc của nó là làm vỡ mọi thứ BÂY GIỜ, trong một căn phòng với bạn mình, thay vì vào tháng 12 trước một người lạ.</p>
<p><strong>Mock interview</strong> (phỏng vấn thử) khác tự luyện một mình ở ba điểm: có người đang nghe (nên im lặng là mất điểm), có người nắm thông tin (nên bạn phải <em>hỏi</em> thay vì tự đọc ràng buộc), và có người chấm những hành vi bạn không tự thấy được (im lặng bao lâu, cần bao nhiêu gợi ý).</p>
</div>

<div class="ml-en">
<h3>Setting up the session (10 minutes, the day before)</h3>
<ul>
<li><strong>Editor.</strong> One shared editor both of you can see: VS Code Live Share, a CoderPad sandbox, or the LeetCode "Playground". If you are in the same room: one laptop, the interviewer sits beside you and does not touch the keyboard.</li>
<li><strong>Turn off every AI assistant</strong> — Copilot, CuongMini in the IDE, inline completions. Real live rounds forbid them and most proctored OAs detect them. Keep plain syntax highlighting and, if the real round allows running code, the run button.</li>
<li><strong>Language.</strong> The one you will interview in. If the company is foreign, run this set in English; if not, Vietnamese is fine, but read the opening line in English anyway.</li>
<li><strong>Timer</strong> visible to the interviewer only. The candidate should not be watching the clock — the interviewer announces "about 5 minutes left" once.</li>
<li><strong>Recording</strong> (phone screen recording or OBS) — only if both agree. Watching 5 minutes of your own silence teaches more than any article.</li>
<li><strong>Paper</strong> for the interviewer: this page's rubric and the minute-by-minute notes. Write <em>facts with minutes</em> ("14′: started coding, no question asked"), not opinions ("seemed nervous").</li>
</ul>
<h3>The 45 minutes</h3>
</div>
<div class="ml-vi">
<h3>Dựng buổi thử (10 phút, làm từ hôm trước)</h3>
<ul>
<li><strong>Trình soạn mã.</strong> Một trình soạn chung cả hai cùng nhìn thấy: VS Code Live Share, CoderPad sandbox, hoặc "Playground" của LeetCode. Nếu ngồi cùng phòng: một laptop, người phỏng vấn ngồi cạnh và không chạm vào bàn phím.</li>
<li><strong>Tắt mọi trợ lý AI</strong> — Copilot, CuongMini trong IDE, gợi ý tự hoàn thành dòng. Vòng phỏng vấn trực tiếp thật cấm chúng, và phần lớn bài OA có giám sát phát hiện được. Giữ tô màu cú pháp, và nút chạy thử nếu vòng thật cho phép chạy code.</li>
<li><strong>Ngôn ngữ.</strong> Đúng thứ bạn sẽ dùng khi phỏng vấn. Công ty nước ngoài thì chạy bộ này bằng tiếng Anh; công ty trong nước thì tiếng Việt cũng được, nhưng vẫn đọc câu mở đầu bằng tiếng Anh.</li>
<li><strong>Đồng hồ</strong> chỉ người phỏng vấn nhìn. Ứng viên không nên dán mắt vào đồng hồ — người phỏng vấn báo một lần "còn khoảng 5 phút".</li>
<li><strong>Ghi hình</strong> (quay màn hình điện thoại hoặc OBS) — chỉ khi cả hai đồng ý. Xem lại 5 phút im lặng của chính mình dạy nhiều hơn mọi bài viết.</li>
<li><strong>Giấy</strong> cho người phỏng vấn: phiếu chấm trong bài này và ghi chú theo phút. Ghi <em>sự việc kèm phút</em> ("14′: bắt đầu code, chưa hỏi câu nào"), không ghi cảm nhận ("có vẻ run").</li>
</ul>
<h3>Dòng thời gian 45 phút</h3>
</div>
<div class="ml-en"><div class="lz-flow">
${THE('0–2′', 'Opening', 'Interviewer introduces themselves in one sentence and says: two problems, think out loud, ask anything.')}
${THE('2–17′', 'Problem 1 (Easy)', 'Target: clarify → brute force → optimal → code → test in 15 minutes. At 17′ the interviewer moves on even if it is not finished.')}
${THE('17–42′', 'Problem 2 (Medium)', 'Target 25 minutes. Hints by the table below, never earlier than written.')}
${THE('42–45′', 'Questions', '"Do you have any questions for me?" — the candidate asks one real question (see 10.1).')}
${THE('+15′', 'Debrief', 'Interviewer reads the facts with minutes; both fill the rubric; the candidate writes the session report into the error log.')}
</div></div>
<div class="ml-vi"><div class="lz-flow">
${THE('0–2′', 'Mở đầu', 'Người phỏng vấn tự giới thiệu một câu rồi nói: hai đề, nghĩ thành tiếng, cứ hỏi bất cứ gì.')}
${THE('2–17′', 'Đề 1 (Easy)', 'Mục tiêu: hỏi làm rõ → vét cạn → tối ưu → code → test trong 15 phút. Tới phút 17 người phỏng vấn chuyển đề kể cả khi chưa xong.')}
${THE('17–42′', 'Đề 2 (Medium)', 'Mục tiêu 25 phút. Gợi ý theo đúng bảng bên dưới, không bao giờ sớm hơn mốc đã ghi.')}
${THE('42–45′', 'Hỏi ngược', '"Bạn có câu hỏi nào cho mình không?" — ứng viên hỏi một câu thật (xem 10.1).')}
${THE('+15′', 'Rút kinh nghiệm', 'Người phỏng vấn đọc các sự việc kèm phút; cả hai điền phiếu chấm; ứng viên ghi biên bản vào sổ lỗi.')}
</div></div>

<div class="ml-en">
<h3>The rubric: four axes, four levels, observable behaviour only</h3>
<p>These are the four axes from lesson 0.8. Each level describes something the interviewer can <em>see or hear</em>, so two different classmates scoring the same session should land within one point of each other. The italic line under each axis says what a 4 looks like on <em>this</em> set.</p>
${bangChamDiem('en', RIENG)}
<p>Then turn the four numbers into a verdict. The rule is deliberately strict about weak axes, because that is how hiring committees read a packet: one clear "no" on an axis is not averaged away by a 4 elsewhere.</p>
${nguongKetLuan('en')}
</div>
<div class="ml-vi">
<h3>Phiếu chấm: bốn trục, bốn mức, chỉ chấm hành vi quan sát được</h3>
<p>Đây là bốn trục của bài 0.8. Mỗi mức mô tả một điều người phỏng vấn <em>thấy hoặc nghe được</em>, nên hai bạn khác nhau chấm cùng một buổi sẽ lệch nhau không quá một điểm. Dòng in nghiêng dưới tên mỗi trục cho biết mức 4 trông thế nào ở <em>chính bộ đề này</em>.</p>
${bangChamDiem('vi', RIENG)}
<p>Rồi đổi bốn con số thành kết luận. Luật cố ý khắt khe với trục yếu, vì hội đồng tuyển dụng đọc hồ sơ đúng như vậy: một chữ "không" rõ ràng ở một trục không bị "trung bình cộng" xoá đi nhờ một điểm 4 ở trục khác.</p>
${nguongKetLuan('vi')}
</div>

<div class="ml-en">
<h2>⛔ Interviewer only</h2>
<p>From here to "After the session" is the interviewer's script. Read it once the evening before, then keep it open during the session. Three rules for the interviewer: (1) never type into the candidate's code; (2) never nod at a wrong idea — say "OK, walk me through an example" instead; (3) give hints only at the times in the table, and write down which ones you gave.</p>
<h3>Opening (read it out)</h3>
<p><em>"Hi, I'm [name]. Thanks for joining. We have about 45 minutes and two problems. Please think out loud — I'm more interested in how you get there than in the final answer. Feel free to ask me anything about the problems. Ready?"</em></p>
<h3>Problem 1 — the vote count (LC 169, Easy, 15′)</h3>
<p><strong>Say this:</strong> <em>"Our class elected a class monitor. Every ballot has the student ID of one candidate, and I give you all the ballots as an array of integers. It is guaranteed that one ID appears on more than half of the ballots. Return that ID."</em> Give the example <code>[2, 2, 1, 1, 1, 2, 2] → 2</code> only if asked for one, or after 1 minute of silence.</p>
${bangHoiDap('en', [
  ['How many ballots? Value range?', 'Up to 50,000 ballots. IDs fit in a 32-bit int, can be negative (old system used −1 for "abstain").'],
  ['Is a majority always there?', 'Yes, guaranteed. (Note whether they asked — it matters for the follow-up.)'],
  ['Can the array be empty?', 'No, at least one ballot.'],
  ['Can I modify the array / sort it?', 'Your choice — tell me the cost.'],
  ['Exactly more than half, or at least half?', 'Strictly more than half.'],
])}
${bangGoiY('en', [
  ['minute 5 and no working idea at all', '"What if you just counted how many times each ID appears?"', 'Problem solving max 2 on this problem'],
  ['minute 9, they have the map version, you asked "can you do it in O(1) extra memory?", no progress', '"Where must the majority element sit if the array were sorted?"', 'max 3'],
  ['minute 12, sorting is done, you asked for O(n) time and O(1) memory', '"Imagine every ballot for X cancels one ballot for someone else. What survives?"', 'max 3; a 4 needs no hint'],
])}
<p><strong>Follow-ups</strong> (ask one or two, only if time allows): (a) <em>"Now the majority is not guaranteed — what changes?"</em> Expected: Boyer–Moore still gives a candidate, so do a second pass to count it; without it <code>[1, 2, 3]</code> wrongly returns 3. (b) <em>"More than n/3 instead of n/2?"</em> Expected: at most two such values, keep two candidates and two counters (LC 229). (c) <em>"The ballots arrive as a stream that does not fit in memory?"</em> Expected: voting is a single pass with two variables — perfect for a stream; the verification pass needs a second read of the stream.</p>
<p><strong>Watch for:</strong> did they ask "guaranteed?"; did they say the brute force (count every value against every other, O(n²)) before the map; did they give space complexity for each version; did they test a single-element array.</p>

<h3>Problem 2 — the formula box (LC 1249, Medium, 25′)</h3>
<p><strong>Say this:</strong> <em>"A spreadsheet's formula box receives text with letters and parentheses, and users often type unbalanced parentheses. Remove the minimum number of parentheses so that the result is valid, and return the result. Letters stay. Valid means every ')' closes an earlier '(' and every '(' is closed."</em> Example to give when asked: <code>"a)b(c)d" → "ab(c)d"</code>.</p>
${bangHoiDap('en', [
  ['Which characters can appear?', 'Lowercase English letters, "(" and ")". No other brackets.'],
  ['Length?', 'Up to 100,000.'],
  ['If several answers are possible, which one?', 'Any valid answer with the minimum number of removals is accepted. (A strong candidate asks this.)'],
  ['Empty result allowed?', 'Yes — "))((" becomes the empty string.'],
  ['Return the string or the count?', 'The string.'],
])}
${bangGoiY('en', [
  ['minute 8 and no approach that decides which characters to remove', '"Scan left to right with a counter of open parentheses. When is a ")" definitely useless?"', 'Problem solving max 2 on this problem'],
  ['minute 14, they handle bad ")" but not leftover "("', '"After the scan, some "(" are still open. Which ones, and how would you remember their positions?"', 'max 3'],
  ['minute 20 and still no code', '"Keep a stack of indices of "(". Pop on ")". Mark unmatched ")" and whatever is left in the stack."', 'max 2'],
])}
<p><strong>Follow-ups:</strong> (a) <em>"Can you do it without the stack?"</em> — two passes with a counter: left-to-right drops bad ')', right-to-left drops the extra '(' (rightmost ones). (b) <em>"Your two versions return different strings for <code>(a(b(c)d)</code> — is one of them wrong?"</em> — no, both remove exactly one character; the problem accepts any. (c) <em>"Three bracket types?"</em> — a stack of (type, index) is now required; a counter cannot tell '(' from '['. (d) <em>"Return all minimal answers"</em> — that is LC 301 (Hard), BFS by number of removals.</p>
<p><strong>Watch for:</strong> string building cost in Java (<code>+=</code> in a loop is O(n²) — see below); off-by-one when rebuilding; whether they test the leftover-'(' case; whether they state O(n) time and O(n) space.</p>
<h3>Spare problem (if the candidate finishes early) — and the week-3 warm-up</h3>
<p>${lc(290, 'word-pattern', 'Word Pattern', 'Easy')}: <em>"Given a pattern like "abba" and a sentence like "dog cat cat dog", does the sentence follow the pattern?"</em> The trap is a one-direction map ("abba" vs "dog dog dog dog" passes a single map). Use it alone as the 20-minute warm-up mock on the Sunday of week 3 (lesson 11.1).</p>
</div>
<div class="ml-vi">
<h2>⛔ Chỉ người phỏng vấn đọc</h2>
<p>Từ đây tới mục "Sau buổi thử" là kịch bản của người phỏng vấn. Đọc một lần vào tối hôm trước, rồi mở sẵn trong lúc thử. Ba luật cho người phỏng vấn: (1) không bao giờ gõ vào code của ứng viên; (2) không gật đầu với ý sai — thay vào đó nói "OK, bạn chạy thử một ví dụ cho mình xem"; (3) chỉ gợi ý đúng mốc thời gian trong bảng, và ghi lại đã đưa gợi ý nào.</p>
<h3>Mở đầu (đọc to)</h3>
<p><em>"Hi, I'm [tên]. Thanks for joining. We have about 45 minutes and two problems. Please think out loud — I'm more interested in how you get there than in the final answer. Feel free to ask me anything about the problems. Ready?"</em> — bản tiếng Việt: <em>"Chào bạn, mình là [tên]. Mình có khoảng 45 phút và hai đề. Bạn nghĩ thành tiếng giúp mình nhé — mình quan tâm cách bạn đi tới đáp án hơn là đáp án cuối. Có gì chưa rõ về đề cứ hỏi. Bắt đầu nhé?"</em></p>
<h3>Đề 1 — đếm phiếu (LC 169, Easy, 15′)</h3>
<p><strong>Nói nguyên văn:</strong> <em>"Lớp mình vừa bầu lớp trưởng. Mỗi lá phiếu ghi mã số sinh viên của một ứng viên, mình đưa bạn tất cả lá phiếu dưới dạng một mảng số nguyên. Đảm bảo có một mã số xuất hiện trên HƠN một nửa số phiếu. Trả về mã số đó."</em> Chỉ đưa ví dụ <code>[2, 2, 1, 1, 1, 2, 2] → 2</code> khi được hỏi, hoặc sau 1 phút im lặng.</p>
${bangHoiDap('vi', [
  ['Bao nhiêu phiếu? Giá trị trong khoảng nào?', 'Tối đa 50.000 phiếu. Mã số vừa int 32 bit, có thể âm (hệ thống cũ dùng −1 cho "phiếu trắng").'],
  ['Có chắc luôn có người quá bán không?', 'Có, đảm bảo. (Ghi lại xem ứng viên có hỏi câu này không — nó quan trọng cho câu nối tiếp.)'],
  ['Mảng có thể rỗng không?', 'Không, ít nhất một phiếu.'],
  ['Em được sửa mảng / sắp xếp mảng không?', 'Tuỳ bạn — nói cho mình cái giá của nó.'],
  ['Hơn một nửa hay ít nhất một nửa?', 'Hơn hẳn một nửa.'],
])}
${bangGoiY('vi', [
  ['phút 5 mà chưa có ý tưởng chạy được nào', '"Nếu chỉ đếm mỗi mã số xuất hiện bao nhiêu lần thì sao?"', 'Giải quyết vấn đề tối đa 2 ở đề này'],
  ['phút 9, đã có bản map, bạn đã hỏi "làm với O(1) bộ nhớ phụ được không?" mà chưa tiến', '"Nếu mảng đã sắp xếp thì phần tử đa số chắc chắn nằm ở đâu?"', 'tối đa 3'],
  ['phút 12, xong bản sắp xếp, bạn đã đòi O(n) thời gian và O(1) bộ nhớ', '"Tưởng tượng mỗi phiếu cho X triệt tiêu một phiếu cho người khác. Cái gì còn sống sót?"', 'tối đa 3; điểm 4 đòi không cần gợi ý'],
])}
<p><strong>Câu hỏi nối tiếp</strong> (hỏi một hai câu, chỉ khi còn giờ): (a) <em>"Giờ không đảm bảo có người quá bán — đổi gì?"</em> Mong đợi: Boyer–Moore vẫn cho một ứng viên, nên cần lượt thứ hai đếm lại nó; thiếu lượt đó thì <code>[1, 2, 3]</code> trả sai ra 3. (b) <em>"Hơn n/3 thay vì n/2?"</em> Mong đợi: tối đa hai giá trị như vậy, giữ hai ứng viên và hai bộ đếm (LC 229). (c) <em>"Phiếu đến dạng luồng (stream) không chứa nổi trong bộ nhớ?"</em> Mong đợi: bỏ phiếu chỉ một lượt với hai biến — hợp hoàn hảo với luồng; lượt kiểm lại cần đọc luồng lần hai.</p>
<p><strong>Để ý:</strong> có hỏi "đảm bảo không?"; có nói vét cạn (đếm từng giá trị với mọi giá trị khác, O(n²)) trước bản map không; có nói độ phức tạp bộ nhớ cho từng bản không; có test mảng một phần tử không.</p>

<h3>Đề 2 — ô công thức (LC 1249, Medium, 25′)</h3>
<p><strong>Nói nguyên văn:</strong> <em>"Ô nhập công thức của một bảng tính nhận chuỗi gồm chữ cái và dấu ngoặc tròn, và người dùng hay gõ ngoặc lệch. Hãy xoá ít dấu ngoặc nhất để kết quả hợp lệ, rồi trả về kết quả. Chữ cái giữ nguyên. Hợp lệ nghĩa là mỗi ')' đóng một '(' đứng trước nó, và mọi '(' đều được đóng."</em> Ví dụ đưa khi được hỏi: <code>"a)b(c)d" → "ab(c)d"</code>.</p>
${bangHoiDap('vi', [
  ['Có những ký tự nào?', 'Chữ thường tiếng Anh, "(" và ")". Không có loại ngoặc khác.'],
  ['Độ dài?', 'Tối đa 100.000.'],
  ['Nếu có nhiều đáp án thì trả cái nào?', 'Chấp nhận bất kỳ chuỗi hợp lệ nào có số lần xoá ít nhất. (Ứng viên mạnh sẽ hỏi câu này.)'],
  ['Kết quả rỗng có được không?', 'Được — "))((" thành chuỗi rỗng.'],
  ['Trả về chuỗi hay số lần xoá?', 'Chuỗi.'],
])}
${bangGoiY('vi', [
  ['phút 8 mà chưa có cách quyết định xoá ký tự nào', '"Quét trái sang phải với một bộ đếm số ngoặc mở. Khi nào thì một dấu ")" chắc chắn vô dụng?"', 'Giải quyết vấn đề tối đa 2 ở đề này'],
  ['phút 14, xử lý được ")" thừa nhưng chưa xử lý "(" còn sót', '"Quét xong, vài dấu "(" vẫn còn mở. Là những dấu nào, và bạn nhớ vị trí của chúng bằng gì?"', 'tối đa 3'],
  ['phút 20 mà vẫn chưa có code', '"Giữ một ngăn xếp chỉ số của "(". Gặp ")" thì pop. Đánh dấu ")" không khớp và những gì còn lại trong ngăn xếp."', 'tối đa 2'],
])}
<p><strong>Câu hỏi nối tiếp:</strong> (a) <em>"Bỏ ngăn xếp đi được không?"</em> — hai lượt với bộ đếm: trái sang phải bỏ ')' thừa, phải sang trái bỏ '(' dư (những dấu bên phải nhất). (b) <em>"Hai bản của bạn trả về hai chuỗi khác nhau với <code>(a(b(c)d)</code> — có bản nào sai không?"</em> — không, cả hai đều xoá đúng một ký tự; đề chấp nhận bất kỳ. (c) <em>"Ba loại ngoặc?"</em> — giờ bắt buộc ngăn xếp (loại, chỉ số); bộ đếm không phân biệt được '(' với '['. (d) <em>"Trả về MỌI đáp án ít xoá nhất"</em> — đó là LC 301 (Hard), BFS theo số lần xoá.</p>
<p><strong>Để ý:</strong> chi phí dựng chuỗi trong Java (<code>+=</code> trong vòng lặp là O(n²) — xem bên dưới); lệch một khi dựng lại chuỗi; có test ca còn sót '(' không; có nói O(n) thời gian và O(n) bộ nhớ không.</p>
<h3>Đề dự phòng (nếu ứng viên xong sớm) — và buổi khởi động tuần 3</h3>
<p>${lc(290, 'word-pattern', 'Word Pattern', 'Easy')}: <em>"Cho mẫu như "abba" và câu như "dog cat cat dog", câu có theo đúng mẫu không?"</em> Bẫy là map một chiều ("abba" với "dog dog dog dog" lọt qua một map). Dùng riêng đề này làm buổi phỏng vấn thử khởi động 20 phút vào Chủ nhật tuần 3 (bài 11.1).</p>
</div>

<div class="ml-en">
<h2>After the session: reference solutions</h2>
<p>Candidate, you may read from here. Compare with what you did <em>in order</em>: did you say the same brute force, find the same waste, reach the same idea — and how many minutes later than the targets?</p>
<h3>Problem 1 — Majority Element: three answers, in the order to say them</h3>
<p><strong>Brute force (say it, do not code it):</strong> for each value, count how many times it appears by scanning the whole array — O(n²) time, O(1) memory. <strong>Waste:</strong> we re-count the same value many times. <strong>Answer 1 — a count map</strong> (Chapter 1): one pass, O(n) time, O(n) memory; return as soon as a count passes n/2. <strong>Answer 2 — sort</strong> (lesson 1.3): the majority occupies more than half the positions, so whatever the sorted array looks like, it covers the middle index <code>⌊n/2⌋</code>. O(n log n) time, O(1) extra if you may sort in place (we copy, so O(n)). <strong>Answer 3 — Boyer–Moore voting:</strong> O(n) time, O(1) memory.</p>
</div>
<div class="ml-vi">
<h2>Sau buổi thử: lời giải tham khảo</h2>
<p>Ứng viên, từ đây bạn được đọc. So với những gì mình đã làm <em>theo đúng thứ tự</em>: mình có nói cùng bản vét cạn, tìm ra cùng chỗ phí, tới cùng ý tưởng không — và chậm hơn mốc mục tiêu bao nhiêu phút?</p>
<h3>Đề 1 — Majority Element: ba câu trả lời, theo thứ tự nên nói</h3>
<p><strong>Vét cạn (nói ra, không code):</strong> với mỗi giá trị, quét cả mảng đếm nó xuất hiện mấy lần — O(n²) thời gian, O(1) bộ nhớ. <strong>Chỗ phí:</strong> cùng một giá trị bị đếm đi đếm lại. <strong>Trả lời 1 — map đếm</strong> (Chương 1): một lượt, O(n) thời gian, O(n) bộ nhớ; trả về ngay khi có số đếm vượt n/2. <strong>Trả lời 2 — sắp xếp</strong> (bài 1.3): phần tử đa số chiếm hơn nửa số vị trí, nên dù mảng đã sắp trông thế nào, nó luôn phủ lên chỉ số giữa <code>⌊n/2⌋</code>. O(n log n) thời gian, O(1) bộ nhớ phụ nếu được sắp tại chỗ (ở đây ta chép mảng nên là O(n)). <strong>Trả lời 3 — bỏ phiếu Boyer–Moore</strong> (Boyer–Moore voting): O(n) thời gian, O(1) bộ nhớ.</p>
</div>
${maHai('ch11/b2/majority.ts', 'ch11/b2/PvMajority.java', { vung: 'dem' })}
${maHai('ch11/b2/majority.ts', 'ch11/b2/PvMajority.java', { vung: 'sap-xep' })}
${maHai('ch11/b2/majority.ts', 'ch11/b2/PvMajority.java', { vung: 'bau-chon' })}
<div class="ml-en">
<h3>Why voting works — the cancelling argument, and the table that shows it</h3>
<p>Pair every ballot for the current candidate with one ballot against it and throw both away; that is what <code>count -= 1</code> does. A value that is on more than half the ballots cannot be fully paired off — there are not enough other ballots to cancel it — so it is still the candidate at the end. The counter is <em>not</em> "how many times the candidate appears"; it is "how many of its ballots are not yet cancelled". Orange marks the steps where a new candidate is taken (count was 0): i = 0, i = 4 and i = 6.</p>
</div>
<div class="ml-vi">
<h3>Vì sao bỏ phiếu đúng — lập luận triệt tiêu, và bảng cho thấy nó</h3>
<p>Ghép mỗi phiếu cho ứng viên hiện tại với một phiếu chống rồi bỏ cả hai đi; <code>count -= 1</code> làm đúng việc đó. Một giá trị có mặt trên hơn nửa số phiếu không thể bị ghép cặp hết — không đủ phiếu khác để triệt tiêu nó — nên cuối cùng nó vẫn là ứng viên. Bộ đếm <em>không phải</em> "ứng viên xuất hiện bao nhiêu lần"; nó là "còn bao nhiêu phiếu của ứng viên chưa bị triệt tiêu". Ô cam đánh dấu những bước nhận ứng viên mới (bộ đếm đang bằng 0): i = 0, i = 4 và i = 6.</p>
</div>
${BANG_BM}
<div class="ml-en">
<p>Seven steps, two variables. The two 1s at i = 2 and i = 3 cancel the two 2s, so the count is 0 after i = 3 and the 1 at i = 4 becomes the candidate — that is fine: the 2 at i = 5 cancels it, and the 2 at i = 6 takes the lead back for good. The argument to say out loud: <em>"everything thrown away comes in pairs of two different values, so the majority loses at most one ballot per pair; it owns more than half of all ballots, so it cannot run out — what is left at the end is the candidate."</em></p>
${moPhong('ch11/b2/majority.sim.js', 'en', 'Boyer–Moore voting — step by step', 'Watch the candidate change and the counter cancel ballots in pairs; edit the ballots and replay.')}
</div>
<div class="ml-vi">
<p>Bảy bước, hai biến. Hai số 1 ở i = 2 và i = 3 triệt tiêu hai số 2, nên sau i = 3 bộ đếm bằng 0 và số 1 ở i = 4 thành ứng viên — không sao cả: số 2 ở i = 5 triệt tiêu nó, và số 2 ở i = 6 giành lại vị trí dẫn đầu luôn. Lập luận nên nói to (đây là bất biến — invariant — của thuật toán): <em>"mọi thứ bị bỏ đi đều đi thành cặp hai giá trị khác nhau, nên mỗi cặp phần tử đa số mất tối đa một phiếu; nó sở hữu hơn nửa tổng số phiếu nên không thể bị tiêu hết — thứ còn lại cuối cùng chính là ứng viên."</em></p>
${moPhong('ch11/b2/majority.sim.js', 'vi', 'Bỏ phiếu Boyer–Moore — chạy từng bước', 'Xem ứng viên đổi và bộ đếm triệt tiêu phiếu theo cặp; sửa dãy phiếu rồi chạy lại.')}
</div>
<div class="ml-en">
<h3>Follow-up (a) in code: when the majority is not guaranteed</h3>
<p>The voting loop always returns <em>something</em>. On <code>[1, 2, 3]</code> it returns 3, which is nobody's majority. If the guarantee is removed, add the second pass — still O(n) time, O(1) memory:</p>
</div>
<div class="ml-vi">
<h3>Nối tiếp (a) bằng code: khi không đảm bảo có phần tử đa số</h3>
<p>Vòng bỏ phiếu luôn trả về <em>một cái gì đó</em>. Với <code>[1, 2, 3]</code> nó trả về 3, chẳng phải đa số của ai. Bỏ điều kiện đảm bảo đi thì thêm lượt thứ hai — vẫn O(n) thời gian, O(1) bộ nhớ:</p>
</div>
${maHai('ch11/b2/majority.ts', 'ch11/b2/PvMajority.java', { vung: 'kiem-lai' })}
${ketQua('ch11/b2/majority.ts')}
${ketQua('ch11/b2/PvMajority.java')}
<div class="ml-en">
<p>Edge cases in the run, and why each is there: <code>[7]</code> (one ballot — every version must return it); <code>[-1, -1, 5]</code> (negative IDs — a candidate initialised to 0 or −1 as "empty" would be a bug if you checked <code>candidate === -1</code>); <code>[4, 5, 4, 5, 4, 5, 5]</code> (the lead changes hands many times); ±10⁹ (no sums anywhere, so no overflow). In the second block, <code>[2, 2, 1, 1]</code> shows "exactly half is not a majority": the raw candidate 2 appears twice out of four, the check rejects it.</p>
</div>
<div class="ml-vi">
<p>Các ca biên trong lần chạy, và vì sao có mặt: <code>[7]</code> (một phiếu — bản nào cũng phải trả về nó); <code>[-1, -1, 5]</code> (mã số âm — nếu khởi tạo ứng viên bằng 0 hay −1 làm "rỗng" rồi kiểm <code>candidate === -1</code> là lỗi); <code>[4, 5, 4, 5, 4, 5, 5]</code> (vị trí dẫn đầu đổi tay nhiều lần); ±10⁹ (không có phép cộng nào nên không tràn số). Ở khối thứ hai, <code>[2, 2, 1, 1]</code> cho thấy "đúng một nửa không phải đa số": ứng viên thô 2 xuất hiện hai trên bốn lần, phép kiểm loại nó.</p>
</div>

<div class="ml-en">
<h3>Problem 2 — Minimum Remove to Make Valid Parentheses</h3>
<p><strong>Brute force:</strong> try removing every subset of parentheses, smallest subsets first, and return the first valid string — O(2ⁿ · n). Say it in one sentence; it shows you understand "minimum". <strong>Key observations:</strong> scanning left to right with a balance counter, a ')' that arrives when the balance is 0 can <em>never</em> be matched, so it must go. After the scan, every '(' still open must go too. Removing exactly those characters is minimal: each removed character was unmatched in every possible pairing. <strong>To know which '(' are left over</strong>, keep their indices on a stack (Chapter 3): push on '(', pop on ')'.</p>
</div>
<div class="ml-vi">
<h3>Đề 2 — Minimum Remove to Make Valid Parentheses</h3>
<p><strong>Vét cạn:</strong> thử xoá mọi tập con các dấu ngoặc, tập nhỏ trước, gặp chuỗi hợp lệ đầu tiên thì trả về — O(2ⁿ · n). Nói nó trong một câu; nó chứng tỏ bạn hiểu chữ "ít nhất". <strong>Quan sát then chốt:</strong> quét trái sang phải với bộ đếm cân bằng, một dấu ')' tới khi bộ đếm đang bằng 0 thì <em>không bao giờ</em> khớp được, nên phải xoá. Quét xong, mọi '(' còn mở cũng phải xoá. Xoá đúng những ký tự đó là ít nhất: mỗi ký tự bị xoá đều không khớp được trong mọi cách ghép. <strong>Để biết những '(' nào còn sót</strong>, giữ chỉ số của chúng trên một ngăn xếp (Chương 3): gặp '(' thì push, gặp ')' thì pop.</p>
</div>
${maHai('ch11/b2/min-remove.ts', 'ch11/b2/PvMinRemove.java', { vung: 'ngan-xep' })}
<div class="ml-en">
<p>The state after every character of <code>"a)b(c))("</code>, produced by running the algorithm. Blue = the character being read; red = marked for removal now; grey = marked earlier.</p>
</div>
<div class="ml-vi">
<p>Trạng thái sau từng ký tự của <code>"a)b(c))("</code>, sinh ra bằng cách chạy thuật toán thật. Xanh = ký tự đang đọc; đỏ = vừa bị đánh dấu xoá; xám = đã đánh dấu từ trước.</p>
</div>
${BANG_NGOAC}
<div class="ml-en">
<p>After the loop the stack still holds [${XN.conLai.join(', ')}], so index ${XN.conLai.join(', ')} joins the removal set: {${XN.remove.join(', ')}} ⇒ result <code>"${XN.out}"</code>. Three characters removed, and no valid string keeps more.</p>
<h3>Follow-up (a): two passes, no stack</h3>
<p>Pass 1, left to right, drops every ')' that arrives at balance 0 and counts how many '(' remain open. Pass 2, right to left, drops that many '(' — the <em>rightmost</em> ones, which is always safe because an unmatched '(' has no ')' after it that it could still use. Same O(n) time; the only extra memory is the output buffer.</p>
</div>
<div class="ml-vi">
<p>Hết vòng lặp, ngăn xếp vẫn còn [${XN.conLai.join(', ')}], nên chỉ số ${XN.conLai.join(', ')} vào tập phải xoá: {${XN.remove.join(', ')}} ⇒ kết quả <code>"${XN.out}"</code>. Xoá ba ký tự, và không chuỗi hợp lệ nào giữ được nhiều hơn.</p>
<h3>Nối tiếp (a): hai lượt, không ngăn xếp</h3>
<p>Lượt 1, trái sang phải, bỏ mọi ')' tới khi bộ đếm bằng 0 và đếm còn bao nhiêu '(' đang mở. Lượt 2, phải sang trái, bỏ đúng chừng ấy '(' — những dấu <em>bên phải nhất</em>; luôn an toàn vì một '(' không khớp thì không còn ')' nào phía sau để dùng. Vẫn O(n) thời gian; bộ nhớ thêm chỉ là bộ đệm kết quả.</p>
</div>
${maHai('ch11/b2/min-remove.ts', 'ch11/b2/PvMinRemove.java', { vung: 'hai-luot' })}
${ketQua('ch11/b2/min-remove.ts')}
${ketQua('ch11/b2/PvMinRemove.java')}
<div class="ml-en">
<p>Read the fourth line: for <code>"(a(b(c)d)"</code> the stack version removes the <em>leftmost</em> open '(' (index 0) and the two-pass version the <em>rightmost</em> (index 4). Different strings, both valid, both one removal — exactly why "is any valid answer accepted?" is a clarifying question worth asking. The test program checks this itself: <code>valid=true</code> for both and equal removal counts on every line, plus a 100,000-character input to make sure nothing is quadratic.</p>
</div>
<div class="ml-vi">
<p>Đọc dòng thứ tư: với <code>"(a(b(c)d)"</code>, bản ngăn xếp xoá dấu '(' mở <em>bên trái nhất</em> (chỉ số 0), bản hai lượt xoá dấu <em>bên phải nhất</em> (chỉ số 4). Hai chuỗi khác nhau, cả hai hợp lệ, cả hai xoá một ký tự — chính vì thế "có chấp nhận bất kỳ đáp án hợp lệ nào không?" là câu hỏi làm rõ đáng hỏi. Chương trình test tự kiểm điều đó: <code>valid=true</code> cho cả hai và số lần xoá bằng nhau ở mọi dòng, cộng một đầu vào 100.000 ký tự để chắc không có chỗ nào bậc hai.</p>
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap: building the answer with <code>String +=</code> in Java.</strong></p><p>Java strings are immutable: each <code>out += c</code> allocates a new string and copies everything so far. The last step of this problem is exactly that loop. Measured on this machine:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy: dựng đáp án bằng <code>String +=</code> trong Java.</strong></p><p>Chuỗi Java bất biến (immutable): mỗi lần <code>out += c</code> cấp phát chuỗi mới và chép lại toàn bộ phần đã có. Bước cuối của đề này đúng là vòng lặp đó. Đo trên máy này:</p></div>
</div>
${ma('ch11/b2/PvNoiChuoi.java', { vung: 'bay', nhan: 'Java' })}
${ketQua('ch11/b2/PvNoiChuoi.java')}
${ketQua('ch11/b2/noi-chuoi.ts')}
<div class="ml-en">
<p>Java: doubling n from 100,000 to 200,000 multiplies the <code>+=</code> time by about 3.5 (275.7 → 971.6 ms) — close to the ×4 of n² — while <code>StringBuilder</code> stays under 1 ms. At LeetCode's n = 10⁵ the slow version already costs about a quarter of a second for one string. Node does <em>not</em> have this trap: V8 builds concatenations as a "rope" (a tree of pieces) and flattens once, so <code>+=</code> is even faster than collecting into an array. Same algorithm, different language, different trap — which is why you must know the costs of the language you interview in.</p>
</div>
<div class="ml-vi">
<p>Java: tăng gấp đôi n từ 100.000 lên 200.000 làm thời gian <code>+=</code> tăng khoảng 3,5 lần (275,7 → 971,6 ms) — gần mức ×4 của n² — trong khi <code>StringBuilder</code> luôn dưới 1 ms. Với n = 10⁵ của LeetCode, bản chậm đã tốn khoảng một phần tư giây cho một chuỗi. Node <em>không</em> có bẫy này: V8 dựng phép nối thành "rope" (một cây các mẩu chuỗi) rồi làm phẳng một lần, nên <code>+=</code> còn nhanh hơn gom vào mảng. Cùng thuật toán, khác ngôn ngữ, khác bẫy — đó là lý do bạn phải biết chi phí của chính ngôn ngữ mình phỏng vấn.</p>
</div>

<div class="ml-en">
<h3>🎤 What problem 2 sounds like when it goes well</h3>
${hoiThoai([
  ['I', 'A formula box gets letters and parentheses, often unbalanced. Remove the minimum number of parentheses so it becomes valid, and return the string.'],
  ['C', 'Let me make sure I have it: letters stay, I only delete "(" or ")", and the result must be balanced. Are there other bracket types? And if several strings are possible with the same number of deletions, is any of them fine?'],
  ['N', 'Restate, then two clarifying questions. The second one decides how much freedom the solution has.'],
  ['I', 'Only round brackets, and yes, any valid answer with the minimum deletions.'],
  ['C', 'Brute force would try deleting every subset of brackets, smallest first — exponential. Better: if I scan left to right with a balance counter, a ")" that comes when the balance is zero can never be matched, so it has to go. At the end, whatever "(" are still open also have to go. I need their positions, so I’ll keep a stack of indices. That’s O(n) time and O(n) space. Shall I code it?'],
  ['N', 'Brute force in a sentence, the two observations, the data structure and why, both complexities, then ask.'],
  ['I', 'Sounds good.'],
  ['C', '(coding) I mark removals in a boolean array instead of deleting from the string as I go, because deleting shifts indices… At the end, everything left on the stack is marked too. Then I rebuild with a StringBuilder — plus-equals in a loop would be quadratic in Java.'],
  ['N', 'Narrate the decisions an interviewer would otherwise question: why mark instead of delete, why StringBuilder.'],
  ['C', 'Testing "a)b(c))(": index 1 is a ")" at balance zero, marked; 3 is pushed; 5 pops it; 6 is unmatched, marked; 7 is pushed and left over, marked. Result "ab(c)". And "))((" gives the empty string, which you said is allowed.'],
  ['I', 'Could you do it without the stack?'],
  ['C', 'Yes — two passes. Left to right I drop bad ")" and count the open ones; right to left I drop that many "(", the rightmost ones. It may return a different string, but you said any is accepted.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Đề 2 nghe thế nào khi đi suôn sẻ</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Ô công thức nhận chữ cái và dấu ngoặc, thường bị lệch. Xoá ít ngoặc nhất để nó hợp lệ, rồi trả về chuỗi.'],
  ['C', 'Em nhắc lại cho chắc: chữ cái giữ nguyên, em chỉ xoá "(" hoặc ")", kết quả phải cân bằng. Có loại ngoặc khác không ạ? Và nếu có nhiều chuỗi cùng số lần xoá thì chuỗi nào cũng được chứ ạ? <em>("If several answers are possible, is any of them fine?")</em>'],
  ['N', 'Nhắc lại đề, rồi hai câu hỏi làm rõ. Câu thứ hai quyết định lời giải được tự do tới đâu.'],
  ['I', 'Chỉ ngoặc tròn, và đúng, chuỗi hợp lệ nào xoá ít nhất cũng được.'],
  ['C', 'Vét cạn là thử xoá mọi tập con dấu ngoặc, tập nhỏ trước — hàm mũ. Tốt hơn: quét trái sang phải với bộ đếm cân bằng, dấu ")" nào tới khi bộ đếm bằng 0 thì không bao giờ khớp được, phải xoá. Cuối cùng, các "(" còn mở cũng phải xoá. Em cần vị trí của chúng nên giữ một ngăn xếp chỉ số. O(n) thời gian, O(n) bộ nhớ. Em code nhé ạ? <em>("That’s O(n) time and O(n) space. Shall I code it?")</em>'],
  ['N', 'Vét cạn trong một câu, hai quan sát, cấu trúc dữ liệu và lý do, cả hai độ phức tạp, rồi mới xin phép.'],
  ['I', 'Ổn, làm đi.'],
  ['C', '(vừa code vừa nói) Em đánh dấu cần xoá trong một mảng boolean chứ không xoá trực tiếp trên chuỗi, vì xoá sẽ làm dịch chỉ số… Cuối cùng những gì còn trên ngăn xếp cũng được đánh dấu. Rồi em dựng lại bằng StringBuilder — cộng chuỗi trong vòng lặp là bậc hai ở Java. <em>("plus-equals in a loop would be quadratic in Java")</em>'],
  ['N', 'Thuật lại đúng những quyết định mà người phỏng vấn lẽ ra sẽ hỏi: vì sao đánh dấu thay vì xoá, vì sao StringBuilder.'],
  ['C', 'Em test "a)b(c))(": chỉ số 1 là ")" khi bộ đếm bằng 0, đánh dấu; 3 được push; 5 pop nó; 6 không khớp, đánh dấu; 7 được push và còn sót, đánh dấu. Kết quả "ab(c)". Còn "))((" ra chuỗi rỗng, mà anh/chị nói là được.'],
  ['I', 'Bỏ ngăn xếp đi được không?'],
  ['C', 'Được ạ — hai lượt. Trái sang phải em bỏ ")" thừa và đếm số "(" còn mở; phải sang trái em bỏ đúng chừng ấy "(", những dấu bên phải nhất. Có thể ra chuỗi khác, nhưng anh/chị nói chuỗi nào cũng được. <em>("It may return a different string, but you said any is accepted.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>The session report: what goes into your error log</h3>
<p>Fill this within 15 minutes of the session, while the interviewer's minute notes are still in front of you. The last rows feed straight into the error log and the review ladder of lesson 11.1.</p>
${bienBan('en', 1)}
<p>An <strong>illustrative</strong> filled example (a composite, not a real person): <em>"Problem 1: brute force at 3′, map at 5′, sort at 8′, voting only after hint 3 at 12′, tests: example only. Problem 2: approach at 11′ after hint 1, code finished 31′, forgot the leftover '(' until the interviewer asked for <code>"(("</code>. Scores C3 · PS2 · T3 · Test 2 ⇒ No hire (two axes at 2). Error-log lines: '169 · voting · could not explain why it works · +1d'; '1249 · stack of indices · leftover "(" · +1d'; 'testing · traced only the given example · re-read 10.3'."</em> The verdict looks harsh for a decent session — that is the point. Two cheap fixes (trace an edge case on purpose; finish the stack logic) turn it into a Hire.</p>
</div>
<div class="ml-vi">
<h3>Biên bản sau buổi thử: thứ gì đi vào sổ lỗi</h3>
<p>Điền trong vòng 15 phút sau buổi thử, khi ghi chú theo phút của người phỏng vấn còn trước mặt. Mấy dòng cuối đi thẳng vào sổ lỗi và thang ôn của bài 11.1.</p>
${bienBan('vi', 1)}
<p>Một ví dụ điền sẵn để <strong>minh hoạ</strong> (ghép từ nhiều buổi, không phải một người thật): <em>"Đề 1: vét cạn phút 3, map phút 5, sắp xếp phút 8, bỏ phiếu chỉ sau gợi ý 3 ở phút 12, test: chỉ ví dụ của đề. Đề 2: ra hướng ở phút 11 sau gợi ý 1, code xong phút 31, quên '(' còn sót tới khi người phỏng vấn đưa <code>"(("</code>. Điểm GT3 · GQVĐ2 · Code3 · Test2 ⇒ No hire (hai trục bị 2). Dòng sổ lỗi: '169 · bỏ phiếu · không giải thích được vì sao đúng · +1 ngày'; '1249 · ngăn xếp chỉ số · sót "(" · +1 ngày'; 'test · chỉ chạy ví dụ của đề · đọc lại 10.3'."</em> Kết luận nghe khắt khe cho một buổi khá ổn — chính là ý đồ. Hai cách sửa rẻ (cố ý chạy tay một ca biên; làm xong phần ngăn xếp) là biến nó thành Hire.</p>
</div>

<div class="ml-en">
<h3>Where these patterns live in real systems</h3>
<ul>
<li><strong>Majority = quorum.</strong> Distributed databases and consensus protocols (Raft, used by etcd, which Kubernetes stores its state in) commit a write only when a <em>majority</em> of nodes acknowledge it. The reason is the same pigeonhole fact as in voting: two majorities of the same group always share at least one member, so two conflicting decisions cannot both win.</li>
<li><strong>Heavy hitters in a stream.</strong> Boyer–Moore generalises to the Misra–Gries algorithm: keep k − 1 counters to find every value that occurs more than n/k times in one pass — used to find the "top talkers" in network traffic or the most-requested URLs without storing every request.</li>
<li><strong>Bracket repair.</strong> Code editors and formula bars highlight the unmatched bracket with exactly the stack-of-indices technique; linters report the position of the first unmatched ')'.</li>
</ul>
<h3>🕵️ The attacker's view: majority voting assumes one honest ballot per voter</h3>
<p>The voting algorithm is correct only for the ballots it is given. If one person can submit many ballots, the "majority" is whoever has the most bots. That is the Sybil attack on online polls and review systems, and the "51 % attack" on proof-of-work blockchains, where whoever controls most of the hashing power can rewrite recent history (it has happened to smaller chains such as Ethereum Classic in 2019–2020). Defences are never in the counting code: one vote per verified identity, rate limits per account and per IP, and for blockchains, making the majority expensive to acquire.</p>
</div>
<div class="ml-vi">
<h3>Các mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Đa số = quorum (túc số).</strong> Các CSDL phân tán và giao thức đồng thuận (Raft — dùng trong etcd, nơi Kubernetes lưu toàn bộ trạng thái) chỉ chốt một lần ghi khi <em>đa số</em> nút xác nhận. Lý do là cùng một sự thật "chuồng bồ câu" như trong bỏ phiếu: hai nhóm đa số của cùng một tập luôn chung ít nhất một thành viên, nên hai quyết định mâu thuẫn không thể cùng thắng.</li>
<li><strong>"Heavy hitters" (giá trị xuất hiện dày) trong luồng dữ liệu.</strong> Boyer–Moore tổng quát lên thành thuật toán Misra–Gries: giữ k − 1 bộ đếm để tìm mọi giá trị xuất hiện hơn n/k lần chỉ trong một lượt — dùng để tìm "những máy nói nhiều nhất" trong lưu lượng mạng hay URL bị gọi nhiều nhất mà không phải lưu mọi request.</li>
<li><strong>Sửa ngoặc.</strong> Trình soạn code và thanh công thức tô dấu ngoặc lẻ bằng đúng kỹ thuật ngăn xếp chỉ số; linter báo vị trí của dấu ')' không khớp đầu tiên.</li>
</ul>
<h3>🕵️ Góc kẻ xấu: bỏ phiếu đa số giả định mỗi người một lá phiếu thật</h3>
<p>Thuật toán bỏ phiếu chỉ đúng với những lá phiếu nó nhận được. Nếu một người gửi được nhiều phiếu, "đa số" là ai có nhiều bot nhất. Đó là tấn công Sybil (một kẻ đội nhiều danh tính) vào bình chọn online và hệ thống đánh giá, và là "tấn công 51 %" vào blockchain proof-of-work, nơi ai nắm phần lớn sức băm có thể viết lại lịch sử gần đây (đã xảy ra với các chuỗi nhỏ như Ethereum Classic năm 2019–2020). Cách phòng không bao giờ nằm trong code đếm: mỗi danh tính đã xác minh một phiếu, giới hạn tần suất theo tài khoản và theo IP, và với blockchain thì làm cho việc nắm đa số trở nên cực đắt.</p>
</div>

<div class="ml-en">
<h3>Common mistakes in this set</h3>
<ul>
<li>Not asking "is a majority guaranteed?" — then being unable to answer the follow-up, because you never noticed the assumption.</li>
<li>Explaining voting as "the counter counts the majority" — it counts <em>uncancelled</em> ballots; the explanation is half the score on problem 1.</li>
<li>Deleting characters from the string while scanning it — indices shift and the next index read is wrong.</li>
<li>Forgetting the leftover '(' after the loop — passes <code>"a)b(c)d"</code>, fails <code>"(("</code>.</li>
<li><code>String +=</code> in a Java loop, or <code>s.substring</code> inside the loop — both quadratic.</li>
<li>Spending 25 minutes on problem 1: the interviewer moves on at 17′, and an unfinished problem 2 is worse than a slightly less elegant problem 1.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp ở bộ này</h3>
<ul>
<li>Không hỏi "có đảm bảo có đa số không?" — rồi bí ở câu nối tiếp, vì chưa từng để ý tới giả định đó.</li>
<li>Giải thích bỏ phiếu là "bộ đếm đếm phần tử đa số" — nó đếm số phiếu <em>chưa bị triệt tiêu</em>; phần giải thích chiếm nửa số điểm của đề 1.</li>
<li>Xoá ký tự khỏi chuỗi ngay trong lúc quét — chỉ số bị dịch và ký tự đọc tiếp theo bị sai.</li>
<li>Quên '(' còn sót sau vòng lặp — qua được <code>"a)b(c)d"</code>, trượt <code>"(("</code>.</li>
<li><code>String +=</code> trong vòng lặp Java, hoặc <code>s.substring</code> trong vòng lặp — đều bậc hai.</li>
<li>Tiêu 25 phút cho đề 1: người phỏng vấn chuyển đề ở phút 17, và một đề 2 bỏ dở tệ hơn một đề 1 kém thanh lịch một chút.</li>
</ul>
</div>

<div class="ml-en">
<h3>Problems of this set and its follow-ups</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề của bộ này và các đề nối tiếp</h3>
${bangDe(DE, 'vi')}
<p>Nộp LC 169 và LC 1249 trên LeetCode <em>sau</em> buổi thử (không phải trước). Nếu đề 1 cần gợi ý 3, đặt nó lên thang ôn +1 ngày ngay tối nay.</p>
${lienKet({ khoa: 'interview-prep', bai: 'pv-7-5-lab-mock-coding', title: 'Interview Prep 7.5 — Vòng coding thử có bấm giờ', sub: 'Thêm một bộ hai đề và phiếu chấm nếu bạn muốn buổi thử thứ tư', cta: 'Mở' })}
</div>

<div class="ml-en">
<h3>🧪 Practice (one session, 60–75 min)</h3>
<div class="callout ok"><ol>
<li>Book a 60-minute slot with a classmate. Send them this page's link and the instruction "read only from ⛔ to 'After the session'".</li>
<li>Run the 45 minutes exactly as scripted, with AI assistants off and the timer on the interviewer's side.</li>
<li>Debrief for 15 minutes: the interviewer reads the facts with minutes; you both fill the rubric independently, then compare (more than one point apart on an axis ⇒ discuss the evidence).</li>
<li>Fill the session report and put both problems on the review ladder (+1 day tomorrow).</li>
<li>Swap roles another day using lesson 11.3 — being the interviewer teaches you what silence feels like from the other side.</li>
</ol>
<p><strong>Done when:</strong> a filled rubric with evidence on all four axes, a verdict, three new error-log lines, both problems accepted on LeetCode afterwards, and the next mock booked.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mock interview</span><span class="v">A timed rehearsal with someone playing the interviewer from a script.</span></div>
  <div class="kv"><span class="k">rubric</span><span class="v">The scoring sheet: four axes, each with observable levels.</span></div>
  <div class="kv"><span class="k">debrief</span><span class="v">The short review right after the session, based on facts with timestamps.</span></div>
  <div class="kv"><span class="k">Boyer–Moore voting</span><span class="v">One-pass majority vote with a candidate and a counter; correct only if a majority exists.</span></div>
  <div class="kv"><span class="k">invariant</span><span class="v">A statement that stays true after every step; the core of "why is it correct?".</span></div>
  <div class="kv"><span class="k">quorum</span><span class="v">The majority of nodes a distributed system needs before it commits.</span></div>
  <div class="kv"><span class="k">Sybil attack</span><span class="v">One attacker using many fake identities to win a vote.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>A mock interview breaks your habits under the clock now, not in December.</li>
<li>The interviewer follows a script: fixed opening, fixed answers to clarifications, hints only at fixed minutes.</li>
<li>Score behaviour you can observe, on four axes; one weak axis is not averaged away.</li>
<li>Majority Element: map → sort → voting; the voting counter counts uncancelled ballots; verify if no guarantee.</li>
<li>Minimum Remove: drop ')' at balance 0, drop leftover '(' (stack of indices or two passes); any valid answer is accepted.</li>
<li>Know your language's costs: <code>String +=</code> is quadratic in Java, not in V8.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — mock interviews', 'Why and how to practise with a partner, and what interviewers note down', 'https://www.techinterviewhandbook.org/mock-interviews/')}
${nguon('📙', 'Java StringBuilder (Java SE 21 API)', 'The mutable sequence you should build strings with in loops', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StringBuilder.html')}
${nguon('📘', 'Raft consensus algorithm', 'The paper and visualisation: why a majority quorum makes decisions safe', 'https://raft.github.io/')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (một buổi, 60–75 phút)</h3>
<div class="callout ok"><ol>
<li>Hẹn một khung 60 phút với một bạn cùng lớp. Gửi bạn link trang này kèm lời dặn "chỉ đọc từ ⛔ tới 'Sau buổi thử'".</li>
<li>Chạy đúng 45 phút theo kịch bản, tắt trợ lý AI, đồng hồ ở phía người phỏng vấn.</li>
<li>Rút kinh nghiệm 15 phút: người phỏng vấn đọc các sự việc kèm phút; hai người chấm phiếu ĐỘC LẬP rồi so (lệch hơn một điểm ở trục nào ⇒ bàn lại bằng chứng).</li>
<li>Điền biên bản và đưa cả hai đề lên thang ôn (+1 ngày là tối mai).</li>
<li>Hôm khác đổi vai bằng bài 11.3 — làm người phỏng vấn dạy bạn biết im lặng trông thế nào từ phía bên kia bàn.</li>
</ol>
<p><strong>Đạt khi:</strong> phiếu chấm có bằng chứng cho đủ bốn trục, có kết luận, ba dòng mới trong sổ lỗi, cả hai đề Accepted trên LeetCode sau buổi thử, và đã hẹn buổi thử tiếp theo.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mock interview (phỏng vấn thử)</span><span class="v">Buổi diễn tập có bấm giờ, một người đóng vai người phỏng vấn theo kịch bản.</span></div>
  <div class="kv"><span class="k">rubric (phiếu chấm)</span><span class="v">Bảng tiêu chí: bốn trục, mỗi trục có các mức quan sát được.</span></div>
  <div class="kv"><span class="k">debrief (rút kinh nghiệm)</span><span class="v">Buổi nhìn lại ngắn ngay sau phỏng vấn thử, dựa trên sự việc kèm mốc thời gian.</span></div>
  <div class="kv"><span class="k">Boyer–Moore voting (bỏ phiếu Boyer–Moore)</span><span class="v">Tìm đa số trong một lượt với một ứng viên và một bộ đếm; chỉ đúng khi chắc chắn có đa số.</span></div>
  <div class="kv"><span class="k">invariant (bất biến)</span><span class="v">Mệnh đề luôn đúng sau mỗi bước; cốt lõi của câu trả lời "vì sao đúng?".</span></div>
  <div class="kv"><span class="k">quorum (túc số / đa số nút)</span><span class="v">Số nút tối thiểu (đa số) mà hệ phân tán cần trước khi chốt một quyết định.</span></div>
  <div class="kv"><span class="k">Sybil attack (tấn công đa danh tính)</span><span class="v">Một kẻ tấn công dùng nhiều danh tính giả để thắng một cuộc bỏ phiếu.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Phỏng vấn thử làm vỡ thói quen của bạn dưới áp lực đồng hồ ngay bây giờ, không phải vào tháng 12.</li>
<li>Người phỏng vấn theo kịch bản: câu mở đầu cố định, câu trả lời làm rõ cố định, gợi ý chỉ ở mốc phút cố định.</li>
<li>Chấm hành vi quan sát được trên bốn trục; một trục yếu không bị "trung bình cộng" xoá đi.</li>
<li>Majority Element: map → sắp xếp → bỏ phiếu; bộ đếm đếm phiếu chưa bị triệt tiêu; không đảm bảo thì kiểm lại.</li>
<li>Minimum Remove: bỏ ')' khi bộ đếm bằng 0, bỏ '(' còn sót (ngăn xếp chỉ số hoặc hai lượt); đáp án hợp lệ nào cũng được.</li>
<li>Biết chi phí của ngôn ngữ mình: <code>String +=</code> là bậc hai trong Java, không phải trong V8.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — phỏng vấn thử', 'Vì sao và cách luyện cùng bạn, người phỏng vấn ghi lại những gì (tiếng Anh)', 'https://www.techinterviewhandbook.org/mock-interviews/')}
${nguon('📙', 'Java StringBuilder (Java SE 21 API)', 'Chuỗi khả biến nên dùng để dựng chuỗi trong vòng lặp', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StringBuilder.html')}
${nguon('📘', 'Thuật toán đồng thuận Raft', 'Bài báo và hình minh hoạ: vì sao quorum đa số làm quyết định an toàn', 'https://raft.github.io/')}
</div>
`,
};
