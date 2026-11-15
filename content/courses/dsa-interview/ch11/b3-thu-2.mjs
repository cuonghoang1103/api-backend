/** 11.3 — Phỏng vấn thử 2 (Medium + Medium): LC 1423 + LC 979. Mọi mã/output đọc từ ../ma/ch11/b3 (chạy thật bằng _chay.mjs). */
import { maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { THE, bangChamDiem, nguongKetLuan, bienBan, bangHoiDap, bangGoiY } from './_rieng.mjs';
import { vetBocThe } from '../ma/ch11/b3/cards.vet.mjs';
import { vetTienDu } from '../ma/ch11/b3/coins.vet.mjs';

const THE_DIEM = [1, 79, 80, 1, 1, 1, 200, 1];
const BANG_THE = bangVet(['moved', 'cards (held = green)', 'gave back', 'took', 'sum', 'best'],
  vetBocThe(THE_DIEM, 3).map((h) => [
    String(h.r),
    oMang(THE_DIEM, { to: Object.fromEntries(h.cam.map((i) => [i, h.lay === i ? 'r' : 'cs'])), chiSo: true }),
    h.tra === null ? '—' : `#${h.tra} (${THE_DIEM[h.tra]})`,
    h.lay === null ? '—' : `#${h.lay} (${THE_DIEM[h.lay]})`,
    String(h.sum),
    String(h.best),
  ]));

const CAY = [0, 0, 0, 0, 0, 0, 7];
const VET_CAY = vetTienDu(CAY);
const HINH_CAY = `<div class="out" style="text-align:center">${oMang(['A:0'])}<br>${oMang(['B:0', 'C:0'])}<br>${oMang(['D:0', 'E:0', 'F:0', 'G:7'], { to: { 3: 'ok' } })}</div>`;
const BANG_CAY = bangVet(['post-order', 'node:coins', 'parent', 'excess(left)', 'excess(right)', 'returns coins + l + r − 1', 'moves so far'],
  VET_CAY.map((h, i) => [String(i + 1), `${h.ten}:${h.v}`, h.cha, String(h.l), String(h.r), `<strong>${h.e}</strong>`, String(h.moves)]));

const RIENG = {
  en: [
    'asks "exactly k?" and "can points be negative?" for problem 1, and how the tree is given for problem 2.',
    'reaches "i from the left, k − i from the right" and "each subtree returns its excess" without hints.',
    'problem 1 with no off-by-one in <code>cards[n − i]</code> / <code>cards[k − i]</code>; problem 2 with a clean post-order helper.',
    'tests k = n and the greedy counterexample for problem 1; a single node and a chain for problem 2.',
  ],
  vi: [
    'đề 1 hỏi "đúng k thẻ?" và "điểm có âm không?", đề 2 hỏi cây được cho dưới dạng gì.',
    'tự tới "i thẻ bên trái, k − i thẻ bên phải" và "mỗi cây con trả về tiền dư của nó" không cần gợi ý.',
    'đề 1 không lệch một ở <code>cards[n − i]</code> / <code>cards[k − i]</code>; đề 2 có hàm hậu thứ tự gọn.',
    'đề 1 test k = n và phản ví dụ của tham lam; đề 2 test cây một nút và cây dạng chuỗi.',
  ],
};

const DE = [
  [lc(1423, 'maximum-points-you-can-obtain-from-cards', 'Maximum Points You Can Obtain from Cards', 'Medium'), 'Problem 1. k + 1 splits; slide one card from left to right; or the complement window.', 'Đề 1. k + 1 cách chia; trượt một thẻ từ trái sang phải; hoặc cửa sổ phần bù.'],
  [lc(979, 'distribute-coins-in-binary-tree', 'Distribute Coins in Binary Tree', 'Medium'), 'Problem 2. Post-order; each subtree returns coins − nodes.', 'Đề 2. Hậu thứ tự; mỗi cây con trả về số xu − số nút.'],
  [lc(658, 'find-k-closest-elements', 'Find K Closest Elements', 'Medium'), 'Spare problem: binary search on the start of a window of size k (Chapter 4).', 'Đề dự phòng: tìm nhị phân trên điểm bắt đầu của cửa sổ dài k (Chương 4).'],
  [lc(1658, 'minimum-operations-to-reduce-x-to-zero', 'Minimum Operations to Reduce X to Zero', 'Medium'), 'Same "take from both ends" idea; the complement is a window with a fixed SUM.', 'Cùng ý "lấy từ hai đầu"; phần bù là cửa sổ có TỔNG cố định.'],
  [lc(2385, 'amount-of-time-for-binary-tree-to-be-infected', 'Amount of Time for Binary Tree to Be Infected', 'Medium'), 'Another "what does the subtree return to its parent" problem.', 'Thêm một đề "cây con trả gì cho cha".'],
  [lc(124, 'binary-tree-maximum-path-sum', 'Binary Tree Maximum Path Sum', 'Hard'), 'The same return-vs-global split as problem 2, at Hard level (lesson 5.2).', 'Cùng cách tách "giá trị trả về" và "biến toàn cục" như đề 2, ở mức Hard (bài 5.2).'],
];

export default {
  title: '11.3 — Mock interview 2 (Medium + Medium): cards from both ends, coins in a tree|||11.3 — Phỏng vấn thử 2 (Medium + Medium): thẻ hai đầu, xu trong cây',
  slug: 'dsa-11-3-thu-2',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Buổi thử thứ hai, hai đề Medium mới (Maximum Points from Cards, Distribute Coins in Binary Tree): chọn MỘT hành vi để sửa từ buổi 1, kịch bản người phỏng vấn, ba gợi ý theo bậc, câu hỏi nối tiếp, phản ví dụ tham lam đo thật, lời giải TS + Java và biên bản.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3 · Mock set 2</span>
<h2>Mock interview 2 (Medium + Medium)</h2>
<p class="lead">Two Mediums in 45 minutes is the shape of most real internship rounds. This set adds one rule to lesson 11.2: before you start, you choose <strong>one</strong> behaviour from your first session report to fix, tell the interviewer, and they score that behaviour separately. One problem is about arrays (a two-ends trick that greedy gets wrong), the other about trees (the "what does the function return to its parent?" question from Chapter 5). Same rubric, same verdict rules, same split: the candidate stops at "⛔ Interviewer only".</p>
<div class="callout warn"><p><strong>Candidate: stop at "⛔ Interviewer only".</strong> Read the setup, the timeline and the rubric; do not read the problems.</p></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3 · Bộ thử 2</span>
<h2>Phỏng vấn thử 2 (Medium + Medium)</h2>
<p class="lead">Hai đề Medium trong 45 phút là hình dạng của phần lớn vòng phỏng vấn thực tập thật. Bộ này thêm một luật so với bài 11.2: trước khi bắt đầu, bạn chọn <strong>một</strong> hành vi trong biên bản buổi 1 để sửa, nói cho người phỏng vấn biết, và họ chấm riêng hành vi đó. Một đề về mảng (mẹo lấy từ hai đầu mà tham lam làm sai), đề kia về cây (câu hỏi "hàm trả gì cho cha?" của Chương 5). Cùng phiếu chấm, cùng luật kết luận, cùng cách chia: ứng viên dừng ở "⛔ Chỉ người phỏng vấn đọc".</p>
<div class="callout warn"><p><strong>Ứng viên: dừng ở "⛔ Chỉ người phỏng vấn đọc".</strong> Đọc phần dựng buổi, dòng thời gian và phiếu chấm; không đọc đề.</p></div>
</div>

<div class="ml-en">
<h3>The everyday picture: the second lap of the driving test course</h3>
<p>At the driving test yard, nobody's second practice lap is "drive the course again and hope". The instructor says: "Last lap you stalled on the hill start. This lap, only think about the hill start." Everything else you drive as usual, but one manoeuvre gets your full attention and their full scrutiny. Deliberate practice works that way: improvement comes from attacking one specific weakness with feedback, not from repeating the whole thing. Your session report from mock 1 tells you which manoeuvre it is.</p>
<p>So before this session, open the report from 11.2 and pick the mistake that cost the most (usually the lowest axis). Turn it into a sentence the interviewer can check: <em>"I will trace two edge cases I choose on purpose before I say done"</em>, <em>"I will say the brute force with its complexity before anything else"</em>, <em>"I will not stay silent for more than 60 seconds"</em>. The interviewer writes it at the top of their notes and records every time it happened or did not.</p>
</div>
<div class="ml-vi">
<h3>Hình dung đời thường: vòng sa hình thứ hai</h3>
<p>Ở bãi sa hình thi bằng lái, chẳng ai chạy vòng tập thứ hai theo kiểu "chạy lại cả bài rồi cầu may". Thầy dạy lái nói: "Vòng trước em chết máy ở bài khởi hành ngang dốc. Vòng này chỉ nghĩ tới bài ngang dốc thôi." Mọi bài khác bạn vẫn chạy bình thường, nhưng một bài nhận toàn bộ sự chú ý của bạn và toàn bộ con mắt của thầy. Luyện tập có chủ đích (deliberate practice) là vậy: tiến bộ đến từ việc tấn công đúng một điểm yếu cụ thể có người góp ý, không đến từ việc lặp lại cả bài. Biên bản buổi thử 1 cho bạn biết đó là "bài thi" nào.</p>
<p>Vì vậy trước buổi này, mở biên bản của bài 11.2 và chọn lỗi gây mất điểm nhiều nhất (thường là trục thấp nhất). Biến nó thành một câu người phỏng vấn kiểm được: <em>"Em sẽ chạy tay hai ca biên do em cố ý chọn trước khi nói xong"</em>, <em>"Em sẽ nói vét cạn kèm độ phức tạp trước mọi thứ khác"</em>, <em>"Em sẽ không im lặng quá 60 giây"</em>. Người phỏng vấn ghi câu đó lên đầu trang ghi chú và đánh dấu mỗi lần nó xảy ra hay không xảy ra.</p>
</div>

<div class="ml-en">
<h3>Setup: what changes from mock 1</h3>
<ul>
<li><strong>Swap roles if you can.</strong> If you were the candidate in 11.2, ideally your partner is the candidate in 11.2 with you as interviewer first, then you take this set. Sitting on the other side once makes you hear your own silences.</li>
<li><strong>English, if the company is foreign.</strong> Run the whole session in English this time — opening, clarifications, hints. The interviewer may answer in Vietnamese if the candidate asks for a word, but notes it.</li>
<li><strong>No run button for problem 2.</strong> Many live rounds let you run code, but a tree problem forces you to build the input by hand, which wastes minutes. Trace by hand instead — that is the testing axis.</li>
<li>Same editor rules, AI assistants off, timer with the interviewer, recording only with consent.</li>
</ul>
<h3>The 45 minutes</h3>
</div>
<div class="ml-vi">
<h3>Dựng buổi: khác gì so với buổi 1</h3>
<ul>
<li><strong>Đổi vai nếu được.</strong> Nếu ở 11.2 bạn là ứng viên, tốt nhất hôm nay bạn làm người phỏng vấn cho bạn kia làm bộ 11.2 trước, rồi mới tới lượt bạn làm bộ này. Ngồi phía bên kia bàn một lần là bạn sẽ "nghe thấy" những lúc mình im lặng.</li>
<li><strong>Tiếng Anh, nếu công ty là nước ngoài.</strong> Lần này chạy cả buổi bằng tiếng Anh — câu mở đầu, hỏi làm rõ, gợi ý. Người phỏng vấn được trả lời bằng tiếng Việt nếu ứng viên hỏi nghĩa một từ, nhưng ghi lại.</li>
<li><strong>Đề 2 không dùng nút chạy.</strong> Nhiều vòng thật cho chạy code, nhưng đề cây buộc bạn phải tự dựng đầu vào bằng tay, rất tốn phút. Thay vào đó chạy tay — đó chính là trục kiểm thử.</li>
<li>Giữ nguyên luật trình soạn, tắt trợ lý AI, đồng hồ ở phía người phỏng vấn, chỉ ghi hình khi cả hai đồng ý.</li>
</ul>
<h3>Dòng thời gian 45 phút</h3>
</div>
<div class="ml-en"><div class="lz-flow">
${THE('0–2′', 'Opening + the one fix', 'Opening line, then the candidate states the one behaviour they are fixing today.')}
${THE('2–22′', 'Problem 1 (Medium)', 'Target 20 minutes. Move on at 22′ even if unfinished.')}
${THE('22–42′', 'Problem 2 (Medium)', 'Target 20 minutes. Hints only at the minutes in the table.')}
${THE('42–45′', 'Questions', 'One real question from the candidate.')}
${THE('+15′', 'Debrief', 'Facts with minutes, the rubric, and a yes/no on the one fix.')}
</div></div>
<div class="ml-vi"><div class="lz-flow">
${THE('0–2′', 'Mở đầu + một điều sửa', 'Câu mở đầu, rồi ứng viên nói một hành vi hôm nay mình sửa.')}
${THE('2–22′', 'Đề 1 (Medium)', 'Mục tiêu 20 phút. Phút 22 chuyển đề kể cả khi chưa xong.')}
${THE('22–42′', 'Đề 2 (Medium)', 'Mục tiêu 20 phút. Gợi ý chỉ ở đúng phút trong bảng.')}
${THE('42–45′', 'Hỏi ngược', 'Một câu hỏi thật từ ứng viên.')}
${THE('+15′', 'Rút kinh nghiệm', 'Sự việc kèm phút, phiếu chấm, và có/không cho "một điều sửa".')}
</div></div>

<div class="ml-en">
<h3>The rubric</h3>
<p>Identical axes and levels to 11.2 (so you can compare sessions), with this set's "what a 4 looks like" under each axis. Add one line under the table: <em>"The one fix: achieved / partly / not achieved, evidence: …"</em>.</p>
${bangChamDiem('en', RIENG)}
${nguongKetLuan('en')}
</div>
<div class="ml-vi">
<h3>Phiếu chấm</h3>
<p>Cùng trục và cùng mức như 11.2 (để so giữa các buổi), cộng dòng "mức 4 trông thế nào" của bộ này dưới mỗi trục. Thêm một dòng dưới bảng: <em>"Một điều sửa: đạt / đạt một phần / chưa đạt, bằng chứng: …"</em>.</p>
${bangChamDiem('vi', RIENG)}
${nguongKetLuan('vi')}
</div>

<div class="ml-en">
<h2>⛔ Interviewer only</h2>
<p>Same three rules as in 11.2: do not type into their code, do not nod at a wrong idea, give hints only at the written minutes. One more for this set: in problem 1, if the candidate proposes "always take the bigger end", do not say it is wrong — say <em>"Try it on <code>[1, 100, 1, 1, 1, 2]</code> with k = 2."</em> Finding the counterexample themselves is worth more than being told.</p>
<h3>Opening</h3>
<p><em>"Hi again. Same format as last time: two problems, about 20 minutes each, think out loud. Before we start — what is the one thing you're working on today?"</em> Write the answer at the top of your notes.</p>
<h3>Problem 1 — cards on a table (LC 1423, Medium, 20′)</h3>
<p><strong>Say this:</strong> <em>"Cards are laid out in a row, each with a number of points. You must take exactly k cards. Each time you take one, it has to be from the left end or the right end of the row that is left. What is the maximum total you can get?"</em> Example when asked: <code>[1, 2, 3, 4, 5, 6, 1], k = 3 → 12</code> (take the three on the right).</p>
${bangHoiDap('en', [
  ['How many cards, how big?', 'Up to 100,000 cards, each worth 1 to 10,000 points.'],
  ['Exactly k, or at most k?', 'Exactly k, and 1 ≤ k ≤ number of cards.'],
  ['Can points be negative or zero?', 'Not in this version, all ≥ 1. (Follow-up later.)'],
  ['Return the cards or the total?', 'Just the total.'],
  ['Can I take all cards from one side?', 'Yes, any mix of left and right.'],
])}
${bangGoiY('en', [
  ['minute 6, they are exploring recursion / choices without a plan', '"After you are done, say you took i cards from the left. How many from the right?"', 'Problem solving max 3'],
  ['minute 11, they know there are k + 1 splits but recompute each sum from scratch', '"Going from split i to split i + 1, which single card changes?"', 'max 3'],
  ['minute 15 and no code', '"Start with all k from the left. Then k times: give back the last left card and take the next card from the right; keep the best sum."', 'max 2'],
])}
<p><strong>Follow-ups:</strong> (a) <em>"Why not always take the bigger end?"</em> — they should produce or accept a counterexample (<code>[1, 100, 1, 1, 1, 2]</code>, k = 2: greedy 3, best 101) and say why: a small card can hide a big one behind it. (b) <em>"Another way to see it?"</em> — the cards you leave are one contiguous block of n − k cards, so maximise the taken sum by minimising that block with a fixed-size sliding window (Chapter 2). (c) <em>"If points could be negative?"</em> — both versions still work: neither assumed positive numbers. (d) <em>"Complexity?"</em> — O(k) for the slide (after nothing), O(n) for the window view; O(1) extra memory.</p>
<p><strong>Watch for:</strong> the index of the card given back (<code>k − i</code>) and the card taken (<code>n − i</code>); whether they test k = n (must return the total); whether "exactly k" was asked.</p>

<h3>Problem 2 — water bottles in an org chart (LC 979, Medium, 20′)</h3>
<p><strong>Say this:</strong> <em>"A company's org chart is a binary tree of n departments. Altogether there are exactly n water bottles, but some departments have several and some have none. In one move you carry one bottle across one edge — from a department to its parent or to one of its children. What is the minimum number of moves so that every department has exactly one bottle?"</em> Example when asked: root with 0, left child with 3, right child with 0 → 3 moves (two bottles up to the root, one of them on down to the right child).</p>
${bangHoiDap('en', [
  ['How is the tree given?', 'As a standard TreeNode root with val = number of bottles.'],
  ['Is the total always exactly n?', 'Yes, guaranteed. (Follow-up later.)'],
  ['How many nodes?', 'Between 1 and 100.'],
  ['Can bottles move down as well as up?', 'Both directions, one edge per move.'],
  ['Return the moves or the plan?', 'Just the number of moves.'],
])}
${bangGoiY('en', [
  ['minute 6, they try to simulate moves one bottle at a time', '"Look at a leaf with 0 bottles. Which edge must its bottle cross?"', 'Problem solving max 3'],
  ['minute 11, they see leaves but not general subtrees', '"For any subtree, how many bottles must cross the edge between it and its parent?"', 'max 3'],
  ['minute 15 and no code', '"Write a helper that returns (bottles − nodes) of a subtree. Add the absolute values at every edge."', 'max 2'],
])}
<p><strong>Follow-ups:</strong> (a) <em>"Why is it minimal?"</em> — the bottles crossing an edge are forced by the imbalance on each side; we never move more than that. (b) <em>"The total might not be n?"</em> — count first and return −1 (or throw) if it differs. (c) <em>"A skewed tree with 100,000 nodes?"</em> — recursion depth equals the height; switch to an iterative post-order or raise the stack. (d) <em>"Each department needs t bottles instead of 1?"</em> — return bottles − t, same code.</p>
<p><strong>Watch for:</strong> whether they can say in one sentence what the helper returns <em>before</em> coding it (the Chapter 5 question); negative excess handled with <code>Math.abs</code>; a single-node tree (0 moves).</p>
<h3>Spare problem</h3>
<p>${lc(658, 'find-k-closest-elements', 'Find K Closest Elements', 'Medium')}: <em>"Sorted array, a target x and k: return the k values closest to x, in sorted order."</em> Expected path: two pointers shrinking from both ends (O(n)) → binary search on the start of the window (O(log n + k)).</p>
</div>
<div class="ml-vi">
<h2>⛔ Chỉ người phỏng vấn đọc</h2>
<p>Ba luật như 11.2: không gõ vào code của ứng viên, không gật đầu với ý sai, chỉ gợi ý đúng phút đã ghi. Thêm một luật cho bộ này: ở đề 1, nếu ứng viên đề xuất "luôn lấy đầu nào lớn hơn", đừng nói nó sai — hãy nói <em>"Thử với <code>[1, 100, 1, 1, 1, 2]</code>, k = 2 xem."</em> Tự tìm ra phản ví dụ đáng giá hơn được bảo.</p>
<h3>Mở đầu</h3>
<p><em>"Hi again. Same format as last time: two problems, about 20 minutes each, think out loud. Before we start — what is the one thing you're working on today?"</em> — <em>"Chào bạn, như lần trước nhé: hai đề, mỗi đề khoảng 20 phút, nghĩ thành tiếng. Trước khi bắt đầu — hôm nay bạn đang sửa điều gì?"</em> Ghi câu trả lời lên đầu trang ghi chú.</p>
<h3>Đề 1 — những lá thẻ trên bàn (LC 1423, Medium, 20′)</h3>
<p><strong>Nói nguyên văn:</strong> <em>"Các lá thẻ xếp thành một hàng, mỗi lá có một số điểm. Bạn phải lấy đúng k lá. Mỗi lần lấy, lá đó phải ở đầu trái hoặc đầu phải của hàng còn lại. Tổng điểm lớn nhất bạn có thể đạt là bao nhiêu?"</em> Ví dụ khi được hỏi: <code>[1, 2, 3, 4, 5, 6, 1], k = 3 → 12</code> (lấy ba lá bên phải).</p>
${bangHoiDap('vi', [
  ['Bao nhiêu thẻ, điểm lớn cỡ nào?', 'Tối đa 100.000 thẻ, mỗi thẻ 1 tới 10.000 điểm.'],
  ['Đúng k hay tối đa k?', 'Đúng k, và 1 ≤ k ≤ số thẻ.'],
  ['Điểm có âm hoặc bằng 0 không?', 'Bản này thì không, đều ≥ 1. (Câu nối tiếp sẽ hỏi.)'],
  ['Trả về các lá thẻ hay tổng?', 'Chỉ tổng.'],
  ['Lấy hết từ một phía được không?', 'Được, trộn trái phải kiểu gì cũng được.'],
])}
${bangGoiY('vi', [
  ['phút 6, đang mò đệ quy / các lựa chọn mà chưa có kế hoạch', '"Lấy xong rồi, giả sử bạn đã lấy i lá bên trái. Bên phải lấy mấy lá?"', 'Giải quyết vấn đề tối đa 3'],
  ['phút 11, biết có k + 1 cách chia nhưng tính lại từng tổng từ đầu', '"Đi từ cách chia i sang cách chia i + 1 thì đúng một lá nào thay đổi?"', 'tối đa 3'],
  ['phút 15 mà chưa có code', '"Bắt đầu với cả k lá bên trái. Rồi k lần: trả lại lá trái cuối cùng, lấy lá kế tiếp bên phải; giữ tổng tốt nhất."', 'tối đa 2'],
])}
<p><strong>Câu hỏi nối tiếp:</strong> (a) <em>"Sao không luôn lấy đầu lớn hơn?"</em> — ứng viên nên đưa ra hoặc chấp nhận phản ví dụ (<code>[1, 100, 1, 1, 1, 2]</code>, k = 2: tham lam được 3, tốt nhất 101) và nói vì sao: một lá nhỏ có thể che một lá lớn nằm ngay sau nó. (b) <em>"Còn cách nhìn nào khác?"</em> — những lá bị BỎ LẠI là một khối liền n − k lá, nên tối đa phần lấy = tối thiểu khối đó bằng cửa sổ trượt cố định (Chương 2). (c) <em>"Nếu điểm có thể âm?"</em> — cả hai bản vẫn đúng: không bản nào giả định số dương. (d) <em>"Độ phức tạp?"</em> — O(k) cho bản trượt, O(n) cho bản cửa sổ; O(1) bộ nhớ phụ.</p>
<p><strong>Để ý:</strong> chỉ số lá trả lại (<code>k − i</code>) và lá lấy vào (<code>n − i</code>); có test k = n không (phải trả về tổng tất cả); có hỏi "đúng k" không.</p>

<h3>Đề 2 — bình nước trong sơ đồ tổ chức (LC 979, Medium, 20′)</h3>
<p><strong>Nói nguyên văn:</strong> <em>"Sơ đồ tổ chức của một công ty là một cây nhị phân gồm n phòng ban. Cả công ty có đúng n bình nước, nhưng có phòng có nhiều bình, có phòng không có bình nào. Một lượt là mang một bình qua một cạnh — từ một phòng lên phòng cha hoặc xuống một phòng con. Cần ít nhất bao nhiêu lượt để mọi phòng có đúng một bình?"</em> Ví dụ khi được hỏi: gốc có 0, con trái có 3, con phải có 0 → 3 lượt (hai bình lên gốc, một trong hai đi tiếp xuống con phải).</p>
${bangHoiDap('vi', [
  ['Cây được cho dạng gì?', 'Một gốc TreeNode chuẩn, val = số bình.'],
  ['Tổng luôn đúng bằng n chứ?', 'Đúng, đảm bảo. (Câu nối tiếp sẽ hỏi.)'],
  ['Bao nhiêu nút?', 'Từ 1 tới 100.'],
  ['Bình đi xuống được không, hay chỉ đi lên?', 'Cả hai chiều, mỗi lượt một cạnh.'],
  ['Trả về số lượt hay kế hoạch chuyển?', 'Chỉ số lượt.'],
])}
${bangGoiY('vi', [
  ['phút 6, đang mô phỏng chuyển từng bình một', '"Nhìn một lá có 0 bình. Bình của nó bắt buộc phải đi qua cạnh nào?"', 'Giải quyết vấn đề tối đa 3'],
  ['phút 11, hiểu với lá nhưng chưa khái quát cho cây con', '"Với một cây con bất kỳ, bao nhiêu bình phải đi qua cạnh nối nó với cha?"', 'tối đa 3'],
  ['phút 15 mà chưa có code', '"Viết hàm phụ trả về (số bình − số phòng) của một cây con. Cộng trị tuyệt đối ở mỗi cạnh."', 'tối đa 2'],
])}
<p><strong>Câu hỏi nối tiếp:</strong> (a) <em>"Vì sao là ít nhất?"</em> — số bình đi qua một cạnh bị ép bởi độ lệch ở hai phía; ta không bao giờ chuyển nhiều hơn mức đó. (b) <em>"Tổng có thể khác n?"</em> — đếm trước, khác thì trả −1 (hoặc ném lỗi). (c) <em>"Cây lệch hẳn một phía với 100.000 nút?"</em> — độ sâu đệ quy bằng chiều cao; đổi sang hậu thứ tự dùng ngăn xếp tường minh hoặc nới stack. (d) <em>"Mỗi phòng cần t bình thay vì 1?"</em> — trả về số bình − t, code y hệt.</p>
<p><strong>Để ý:</strong> ứng viên có nói được trong một câu hàm phụ trả về gì <em>trước khi</em> code không (câu hỏi của Chương 5); tiền dư âm có được xử lý bằng <code>Math.abs</code> không; cây một nút (0 lượt).</p>
<h3>Đề dự phòng</h3>
<p>${lc(658, 'find-k-closest-elements', 'Find K Closest Elements', 'Medium')}: <em>"Mảng đã sắp xếp, một giá trị x và k: trả về k giá trị gần x nhất, theo thứ tự tăng."</em> Hướng mong đợi: hai con trỏ co từ hai đầu (O(n)) → tìm nhị phân trên điểm bắt đầu của cửa sổ (O(log n + k)).</p>
</div>

<div class="ml-en">
<h2>After the session: reference solutions</h2>
<h3>Problem 1 — Maximum Points from Cards</h3>
<p><strong>Brute force:</strong> at each of the k steps choose left or right — 2ᵏ sequences, O(2ᵏ). <strong>The observation that kills it:</strong> the order does not matter, only <em>how many</em> came from each side. If i came from the left, then k − i came from the right, so there are only k + 1 possible results. <strong>Computing them fast:</strong> start with the first k cards (i = k). Moving to i = k − 1 gives back card k − 1 and takes card n − 1; in general step i gives back card <code>k − i</code> and takes card <code>n − i</code>. Each step is O(1), so the whole thing is O(k) after the first sum, O(1) memory.</p>
</div>
<div class="ml-vi">
<h2>Sau buổi thử: lời giải tham khảo</h2>
<h3>Đề 1 — Maximum Points from Cards</h3>
<p><strong>Vét cạn:</strong> ở mỗi bước trong k bước chọn trái hoặc phải — 2ᵏ dãy lựa chọn, O(2ᵏ). <strong>Quan sát giết chết vét cạn:</strong> thứ tự không quan trọng, chỉ quan trọng lấy <em>bao nhiêu</em> lá mỗi bên. Lấy i lá bên trái thì bên phải là k − i, nên chỉ có k + 1 kết quả có thể. <strong>Tính chúng nhanh:</strong> bắt đầu với k lá đầu tiên (i = k). Sang i = k − 1 là trả lại lá k − 1 và lấy lá n − 1; tổng quát, bước thứ i trả lại lá <code>k − i</code> và lấy lá <code>n − i</code>. Mỗi bước O(1), nên cả bài là O(k) sau tổng đầu tiên, bộ nhớ O(1).</p>
</div>
${maHai('ch11/b3/cards.ts', 'ch11/b3/PvCards.java', { vung: 'truot' })}
<div class="ml-en">
<p>The trace on <code>[1, 79, 80, 1, 1, 1, 200, 1]</code>, k = 3 (indices under the numbers). Green = cards held; orange = the card just taken from the right. Generated by running the algorithm:</p>
</div>
<div class="ml-vi">
<p>Bảng vết trên <code>[1, 79, 80, 1, 1, 1, 200, 1]</code>, k = 3 (chỉ số nằm dưới mỗi số). Xanh lá = thẻ đang cầm; cam = thẻ vừa lấy từ bên phải. Sinh ra bằng cách chạy thuật toán thật:</p>
</div>
${BANG_THE}
<div class="ml-en">
<p>Four sums instead of eight choice sequences: 160 → 81 → 202 → 202. The jump at step 2 is the point of the problem: the 200 is reachable only by giving up both 79 and 80, which a "bigger end first" rule never does.</p>
${moPhong('ch11/b3/cards.sim.js', 'en', 'Cards from both ends — slide one card at a time', 'k + 1 sums, each one card different from the previous; edit the cards and k.')}
</div>
<div class="ml-vi">
<p>Bốn tổng thay vì tám dãy lựa chọn: 160 → 81 → 202 → 202. Cú nhảy ở bước 2 chính là điểm mấu chốt của đề: lá 200 chỉ với tới được khi chịu bỏ cả 79 lẫn 80, điều mà luật "đầu nào lớn lấy trước" không bao giờ làm.</p>
${moPhong('ch11/b3/cards.sim.js', 'vi', 'Lấy thẻ từ hai đầu — trượt từng lá một', 'k + 1 tổng, mỗi tổng khác tổng trước đúng một lá; sửa dãy thẻ và k.')}
</div>
<div class="ml-en">
<h3>Follow-ups (a) and (b) in code: the greedy trap and the complement window</h3>
<p>The complement view: the n − k cards you do <em>not</em> take are always one contiguous block, so <em>maximum taken = total − minimum block sum</em>, a fixed-size window from Chapter 2. And the greedy rule, kept on purpose so you can watch it fail. The program also checks both correct versions against the brute force on 300 random inputs, and counts how often greedy is wrong:</p>
</div>
<div class="ml-vi">
<h3>Nối tiếp (a) và (b) bằng code: bẫy tham lam và cửa sổ phần bù</h3>
<p>Góc nhìn phần bù: n − k lá bạn <em>không</em> lấy luôn là một khối liền, nên <em>tối đa phần lấy = tổng − tổng nhỏ nhất của một khối</em>, đúng cửa sổ cố định của Chương 2. Còn luật tham lam được giữ lại có chủ ý để bạn xem nó sai. Chương trình còn đối chiếu cả hai bản đúng với vét cạn trên 300 đầu vào ngẫu nhiên, và đếm số lần tham lam sai:</p>
</div>
${maHai('ch11/b3/cards.ts', 'ch11/b3/PvCards.java', { vung: 'cua-so-bo-lai' })}
${maHai('ch11/b3/cards.ts', 'ch11/b3/PvCards.java', { vung: 'tham-lam-sai' })}
${ketQua('ch11/b3/cards.ts')}
${ketQua('ch11/b3/PvCards.java')}
<div class="ml-en">
<p>Read the run: greedy is right on four of the seven fixed cases and wrong on three — 6 vs 12, 160 vs 202, 3 vs 101 — and on <strong>60 of 300</strong> random inputs. A rule that passes the example in the statement and fails one input in five is exactly the bug that survives an interview if you do not test on purpose. The edge cases: k = n (<code>[9,7,7,9,7,7,9]</code>, k = 7 → the total, 55, where the window has length 0 — that is why <code>maxScoreWindow</code> returns early), a single card, all cards equal.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: "take the bigger end" passes the first example.</strong></p><p>On <code>[1, 2, 3, 4, 5, 6, 1]</code>, k = 3, greedy gets 6 — wrong already, but many candidates try it on a different example where it happens to work, see the right answer and start coding. Always try your greedy rule on a case built to break it: a small value hiding a large one (Chapter 9.5's lesson in two numbers).</p></div>
</div>
<div class="ml-vi">
<p>Đọc lần chạy: tham lam đúng bốn trên bảy ca cố định và sai ba — 6 so với 12, 160 so với 202, 3 so với 101 — và sai <strong>60 trên 300</strong> đầu vào ngẫu nhiên. Một luật qua được ví dụ trong đề nhưng sai một trên năm đầu vào chính là kiểu lỗi sống sót qua buổi phỏng vấn nếu bạn không test có chủ ý. Các ca biên: k = n (<code>[9,7,7,9,7,7,9]</code>, k = 7 → tổng tất cả, 55, khi cửa sổ dài 0 — vì vậy <code>maxScoreWindow</code> trả về sớm), một lá thẻ, mọi lá bằng nhau.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: "lấy đầu lớn hơn" có vẻ qua ví dụ đầu tiên.</strong></p><p>Với <code>[1, 2, 3, 4, 5, 6, 1]</code>, k = 3, tham lam được 6 — đã sai rồi, nhưng nhiều ứng viên thử nó trên một ví dụ KHÁC mà tình cờ đúng, thấy ra đáp án đúng, rồi bắt đầu code. Luôn thử luật tham lam trên một ca được dựng ra để phá nó: một giá trị nhỏ che một giá trị lớn (bài học của 9.5 gói trong hai con số).</p></div>
${lienKet({ bai: 'dsa-9-5-greedy', title: '9.5 — Tham lam: khi nào đúng, khi nào sai', sub: 'Cách tự tìm phản ví dụ bằng đối chiếu ngẫu nhiên, như chương trình ở trên', cta: 'Ôn lại' })}
</div>

<div class="ml-en">
<h3>Problem 2 — Distribute Coins in Binary Tree</h3>
<p><strong>Brute force:</strong> simulate moving bottles, or search over move sequences — no clean bound, and the honest thing to say is "I'd rather find what each edge must carry". <strong>Key observation:</strong> cut any edge between a node and its parent. The subtree below has some number of bottles <em>c</em> and some number of departments <em>m</em>. Every one of the |c − m| extra (or missing) bottles must cross that edge, and nothing else needs to. So the answer is the sum, over all edges, of |bottles − nodes| of the subtree under the edge. <strong>Chapter 5's question:</strong> what does the helper return to its parent? <em>The subtree's excess, bottles − nodes</em> — positive means it sends bottles up, negative means it needs some sent down. The parent adds |excess(left)| + |excess(right)| to the total and returns its own excess, <code>val + left + right − 1</code>. One post-order pass: O(n) time, O(h) stack.</p>
</div>
<div class="ml-vi">
<h3>Đề 2 — Distribute Coins in Binary Tree</h3>
<p><strong>Vét cạn:</strong> mô phỏng chuyển bình, hoặc tìm trên các dãy nước đi — không có cận rõ ràng, và câu nên nói thẳng là "em muốn tìm xem mỗi cạnh bắt buộc phải chở bao nhiêu". <strong>Quan sát then chốt:</strong> cắt một cạnh bất kỳ giữa một nút và cha nó. Cây con bên dưới có <em>c</em> bình và <em>m</em> phòng. Từng bình trong |c − m| bình thừa (hoặc thiếu) bắt buộc phải đi qua cạnh đó, và không cần gì khác đi qua. Nên đáp án là tổng, trên mọi cạnh, của |số bình − số phòng| của cây con dưới cạnh. <strong>Câu hỏi của Chương 5:</strong> hàm phụ trả gì cho cha? <em>Tiền dư (excess) của cây con, số bình − số phòng</em> — dương là gửi bình lên, âm là cần gửi bình xuống. Nút cha cộng |dư(trái)| + |dư(phải)| vào tổng và trả về tiền dư của chính nó, <code>val + trái + phải − 1</code>. Một lượt hậu thứ tự (post-order): O(n) thời gian, O(h) stack.</p>
${lienKet({ bai: 'dsa-5-2-de-quy', title: '5.2 — Đệ quy trên cây: "hàm trả gì cho cha?"', sub: 'Khuôn tách "giá trị trả về" và "biến toàn cục" mà đề này dùng', cta: 'Ôn lại' })}
</div>
${maHai('ch11/b3/coins.ts', 'ch11/b3/PvCoins.java', { vung: 'tien-du' })}
<div class="ml-en">
<p>The tree <code>[0, 0, 0, 0, 0, 0, 7]</code> — every bottle starts at the bottom-right leaf G — and the post-order trace produced by running the helper (each row is one node finishing):</p>
</div>
<div class="ml-vi">
<p>Cây <code>[0, 0, 0, 0, 0, 0, 7]</code> — mọi bình bắt đầu ở lá dưới cùng bên phải G — và bảng vết hậu thứ tự sinh ra bằng cách chạy hàm phụ thật (mỗi dòng là một nút vừa xong):</p>
</div>
${HINH_CAY}
${BANG_CAY}
<div class="ml-en">
<p>Read it from the bottom: G returns +6 (seven bottles, keeps one, six must go up); F returns −1 (needs one). C adds |−1| + |6| = 7 moves for its two child edges and returns −1 + 6 + 0 − 1 = 4. On the left, D and E each need one, so B returns −3 and costs 2 moves. The root adds |−3| + |4| = 7 and returns 0 — the check that the total was exactly n. Total ${VET_CAY[VET_CAY.length - 1].moves} moves.</p>
</div>
<div class="ml-vi">
<p>Đọc từ dưới lên: G trả về +6 (bảy bình, giữ một, sáu bình phải đi lên); F trả về −1 (thiếu một). C cộng |−1| + |6| = 7 lượt cho hai cạnh con và trả về −1 + 6 + 0 − 1 = 4. Bên trái, D và E mỗi phòng thiếu một, nên B trả về −3 và tốn 2 lượt. Gốc cộng |−3| + |4| = 7 và trả về 0 — chính là phép kiểm tổng đúng bằng n. Tổng cộng ${VET_CAY[VET_CAY.length - 1].moves} lượt.</p>
</div>
${maHai('ch11/b3/coins.ts', 'ch11/b3/PvCoins.java', { vung: 'kiem-tong' })}
${ketQua('ch11/b3/coins.ts')}
${ketQua('ch11/b3/PvCoins.java')}
<div class="ml-en">
<p>Edge cases in the run: a single node (0 moves); <code>[0, 0, null, 3]</code>, a chain where bottles travel two edges; <code>[5, 0, null, 0, null, 0, null, 0]</code>, a five-node chain where everything flows down from the root (4 + 3 + 2 + 1 = 10). The follow-up block shows the guard: <code>[2, 0, 0]</code> has 2 bottles for 3 nodes ⇒ −1. Without the guard the formula would still print a number — a wrong one — so the guard is the testing axis in action.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: returning the moves instead of the excess.</strong></p><p>The most common wrong helper returns "moves in my subtree" to the parent. Then the parent cannot know how many bottles cross its own edge, and candidates start adding a second traversal to count bottles and nodes — O(n²) on a chain. The fix is to separate the two things: the <em>return value</em> is what the parent needs (excess); the <em>answer</em> accumulates in a variable outside (moves). Say it in one sentence before coding.</p></div>
</div>
<div class="ml-vi">
<p>Các ca biên trong lần chạy: cây một nút (0 lượt); <code>[0, 0, null, 3]</code>, một chuỗi mà bình phải đi hai cạnh; <code>[5, 0, null, 0, null, 0, null, 0]</code>, chuỗi năm nút mà mọi thứ chảy xuống từ gốc (4 + 3 + 2 + 1 = 10). Khối nối tiếp cho thấy phép chặn: <code>[2, 0, 0]</code> có 2 bình cho 3 nút ⇒ −1. Thiếu phép chặn, công thức vẫn in ra một con số — một con số sai — nên phép chặn chính là trục kiểm thử đang làm việc.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: trả về số lượt thay vì tiền dư.</strong></p><p>Hàm phụ sai phổ biến nhất trả về "số lượt trong cây con của tôi" cho cha. Khi đó cha không biết bao nhiêu bình đi qua cạnh của chính nó, và ứng viên bắt đầu thêm một lượt duyệt thứ hai để đếm bình và đếm nút — thành O(n²) trên cây dạng chuỗi. Cách sửa là tách hai thứ ra: <em>giá trị trả về</em> là thứ cha cần (tiền dư); <em>đáp án</em> cộng dồn vào một biến bên ngoài (số lượt). Nói câu đó ra trước khi code.</p></div>
</div>

<div class="ml-en">
<h3>🎤 What problem 2 sounds like when it goes well</h3>
${hoiThoai([
  ['I', 'An org chart is a binary tree with n departments and n bottles in total, unevenly spread. One move carries one bottle across one edge. Minimum moves so everyone has exactly one?'],
  ['C', 'So bottles can move both up and down, one edge at a time, and the total is guaranteed to be n? And I just return the count?'],
  ['I', 'Yes to all three.'],
  ['C', 'Simulating moves seems messy. Let me look at one edge instead. If I cut the edge above a subtree, the subtree has some bottles and some nodes. The difference has to cross that edge — no more, no less. So the answer is the sum over edges of |bottles minus nodes| of the subtree below.'],
  ['N', 'The key move: change the question from "which moves?" to "what must cross this edge?". Say it before any code.'],
  ['C', 'For the code, my helper returns the excess of a subtree — bottles minus nodes — and I keep the total moves in an outer variable. Each node adds the absolute excess of both children, and returns its value plus both excesses minus one. Post-order, O(n) time, O(height) stack.'],
  ['I', 'Go ahead.'],
  ['C', '(coding) Null returns zero, so leaves need no special case… Let me trace root 0, left 3, right 0. Left returns 3 + 0 + 0 − 1 = 2, right returns −1. Root adds 2 + 1 = 3 moves and returns 0 + 2 − 1 − 1 = 0, which also confirms the total. Answer 3.'],
  ['N', 'Trace the example the interviewer gave, and point out the free sanity check: the root must return 0.'],
  ['I', 'What if the tree had a hundred thousand nodes in a single chain?'],
  ['C', 'Then recursion depth is a hundred thousand, which would overflow the default stack in Java or Node. I would do the post-order iteratively with an explicit stack, or process nodes in reverse BFS order so children come before parents.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Đề 2 nghe thế nào khi đi suôn sẻ</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Sơ đồ tổ chức là cây nhị phân n phòng, tổng n bình nước, chia không đều. Một lượt mang một bình qua một cạnh. Ít nhất bao nhiêu lượt để phòng nào cũng có đúng một bình?'],
  ['C', 'Vậy bình đi được cả lên lẫn xuống, mỗi lần một cạnh, và tổng đảm bảo bằng n ạ? Em chỉ trả về số lượt thôi đúng không? <em>("And I just return the count?")</em>'],
  ['I', 'Đúng cả ba.'],
  ['C', 'Mô phỏng từng lượt có vẻ rối. Em nhìn từng cạnh thay vì vậy. Nếu cắt cạnh phía trên một cây con, cây con có một số bình và một số phòng. Phần chênh lệch bắt buộc phải đi qua cạnh đó — không hơn không kém. Nên đáp án là tổng trên mọi cạnh của |số bình trừ số phòng| của cây con bên dưới. <em>("The difference has to cross that edge — no more, no less.")</em>'],
  ['N', 'Nước đi then chốt: đổi câu hỏi từ "chuyển thế nào?" sang "cái gì bắt buộc phải qua cạnh này?". Nói ra trước khi có dòng code nào.'],
  ['C', 'Về code, hàm phụ của em trả về tiền dư của cây con — số bình trừ số phòng — còn tổng số lượt em giữ ở một biến bên ngoài. Mỗi nút cộng trị tuyệt đối tiền dư của hai con, rồi trả về giá trị của nó cộng hai tiền dư trừ một. Hậu thứ tự, O(n) thời gian, O(chiều cao) stack.'],
  ['I', 'Làm đi.'],
  ['C', '(vừa code vừa nói) Nút rỗng trả về 0 nên lá không cần xử lý riêng… Em chạy tay gốc 0, trái 3, phải 0. Trái trả về 3 + 0 + 0 − 1 = 2, phải trả về −1. Gốc cộng 2 + 1 = 3 lượt và trả về 0 + 2 − 1 − 1 = 0, cũng xác nhận luôn tổng đúng. Đáp án 3. <em>("which also confirms the total")</em>'],
  ['N', 'Chạy tay đúng ví dụ người phỏng vấn đưa, và chỉ ra phép kiểm miễn phí: gốc phải trả về 0.'],
  ['I', 'Nếu cây có một trăm nghìn nút xếp thành một chuỗi thì sao?'],
  ['C', 'Khi đó độ sâu đệ quy là một trăm nghìn, tràn stack mặc định của Java hay Node. Em sẽ làm hậu thứ tự bằng ngăn xếp tường minh, hoặc xử lý các nút theo thứ tự BFS đảo ngược để con luôn được tính trước cha. <em>("process nodes in reverse BFS order")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>The session report</h3>
${bienBan('en', 2)}
<p>Add one line for the one fix: <em>"Fix chosen: trace two edge cases on purpose. Achieved on problem 1 (k = n and the greedy counterexample at 18′), not on problem 2 (said 'done' at 39′ without a trace)."</em> Then compare the four scores with mock 1. Two sessions give you a direction: an axis that went 2 → 3 is working; one that stayed at 2 needs its fixing chapter this week (10.1 for communication, 10.3 for testing, 0.2 for problem solving, 10.2 for code).</p>
</div>
<div class="ml-vi">
<h3>Biên bản sau buổi thử</h3>
${bienBan('vi', 2)}
<p>Thêm một dòng cho "một điều sửa": <em>"Điều chọn sửa: cố ý chạy tay hai ca biên. Đạt ở đề 1 (k = n và phản ví dụ tham lam ở phút 18), chưa đạt ở đề 2 (nói 'xong' ở phút 39 mà không chạy tay)."</em> Rồi so bốn điểm với buổi 1. Hai buổi cho bạn một hướng: trục nào đi từ 2 lên 3 là cách sửa đang hiệu quả; trục nào vẫn đứng ở 2 thì tuần này học bài chữa nó (10.1 cho giao tiếp, 10.3 cho kiểm thử, 0.2 cho giải quyết vấn đề, 10.2 cho code).</p>
${lienKet({ bai: 'dsa-10-3-test', title: '10.3 — Tự test code trước khi nói "xong"', sub: 'Bảng kiểm ca biên theo loại đầu vào, chạy tay theo đúng từng dòng', cta: 'Mở' })}
</div>

<div class="ml-en">
<h3>Where these patterns live in real systems</h3>
<ul>
<li><strong>Rebalancing along a tree.</strong> A retail chain's distribution network is a tree: central warehouse → regional warehouses → shops. Moving stock so every shop has its quota at minimum cost along the tree is exactly problem 2, and "how much must cross this link" is how planners size trucks per route.</li>
<li><strong>Trees stored as (id, parentId) rows.</strong> In this very repository, CT Work's document trash (<code>src/services/work/pageTrash.service.ts › sameDeletionSubtree</code>) restores a page together with its sub-pages: it grows a set of ids, pass after pass, until no new child is found. That is O(n × depth) — perfectly fine under the per-project page limit it enforces — and the interview-ready alternative is to build a children list once and DFS it in O(n), the same traversal as problem 2.</li>
<li><strong>"Optimise the complement".</strong> Problem 1's second view — maximise what you take by minimising what you leave — is a general trick: it is how "maximum subarray sum in a circular array" becomes "total minus minimum subarray", and how you reason about "keep the most data" as "evict the least".</li>
</ul>
</div>
<div class="ml-vi">
<h3>Các mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Cân bằng hàng dọc theo một cây.</strong> Mạng phân phối của một chuỗi bán lẻ là một cây: kho tổng → kho vùng → cửa hàng. Điều chuyển hàng để cửa hàng nào cũng đủ chỉ tiêu với chi phí thấp nhất dọc theo cây chính là đề 2, và "bao nhiêu hàng bắt buộc phải qua tuyến này" là cách người lập kế hoạch chọn cỡ xe cho từng tuyến.</li>
<li><strong>Cây lưu dạng dòng (id, parentId).</strong> Ngay trong repo này, thùng rác tài liệu của CT Work (<code>src/services/work/pageTrash.service.ts › sameDeletionSubtree</code>) khôi phục một trang cùng các trang con của nó: nó nới rộng một tập id hết lượt này tới lượt khác cho tới khi không tìm thêm được con nào. Cách đó là O(n × độ sâu) — hoàn toàn ổn dưới trần số trang mỗi dự án mà nó đặt ra — còn cách "chuẩn phỏng vấn" là dựng danh sách con một lần rồi DFS trong O(n), đúng phép duyệt của đề 2.</li>
<li><strong>"Tối ưu phần bù".</strong> Góc nhìn thứ hai của đề 1 — tối đa phần lấy bằng cách tối thiểu phần để lại — là một mẹo chung: đó là cách "tổng đoạn con lớn nhất trên mảng vòng" biến thành "tổng trừ đoạn con nhỏ nhất", và cách nghĩ "giữ được nhiều dữ liệu nhất" thành "loại bỏ ít nhất".</li>
</ul>
</div>

<div class="ml-en">
<h3>Common mistakes in this set</h3>
<ul>
<li>Coding the greedy "bigger end" because it worked on the one example you tried.</li>
<li>Off-by-one in the slide: <code>cards[k − i]</code> / <code>cards[n − i]</code> written as <code>k − i − 1</code> or <code>n − i − 1</code> — test i = 1 by hand.</li>
<li>For problem 2, returning moves instead of excess, or forgetting <code>Math.abs</code> so a subtree that needs bottles <em>subtracts</em> moves.</li>
<li>A global <code>moves</code> that is not reset between test cases (Java <code>static</code>) — the second test prints the sum of both.</li>
<li>Spending the first 5 minutes of problem 2 building a tree by hand to run it, instead of tracing.</li>
<li>Forgetting the one fix you announced — the interviewer is scoring it.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp ở bộ này</h3>
<ul>
<li>Code luật tham lam "đầu lớn hơn" vì nó đúng với đúng một ví dụ bạn đã thử.</li>
<li>Lệch một khi trượt: <code>cards[k − i]</code> / <code>cards[n − i]</code> viết thành <code>k − i − 1</code> hay <code>n − i − 1</code> — chạy tay i = 1.</li>
<li>Đề 2 trả về số lượt thay vì tiền dư, hoặc quên <code>Math.abs</code> nên một cây con đang thiếu bình lại <em>trừ bớt</em> số lượt.</li>
<li>Biến <code>moves</code> toàn cục không được đặt lại giữa các ca test (Java <code>static</code>) — ca thứ hai in ra tổng của cả hai.</li>
<li>Tiêu 5 phút đầu của đề 2 để dựng cây bằng tay cho chạy được, thay vì chạy tay.</li>
<li>Quên mất "một điều sửa" mình đã tuyên bố — người phỏng vấn đang chấm nó.</li>
</ul>
</div>

<div class="ml-en">
<h3>Problems of this set and its follow-ups</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề của bộ này và các đề nối tiếp</h3>
${bangDe(DE, 'vi')}
<p>Sau buổi thử, nộp LC 1423 và LC 979, rồi làm LC 1658 trong tuần — nó là "đề 1 đổi vỏ", phép thử tốt nhất xem bạn đã nắm mẹo phần bù chưa.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (one session, 60–75 min)</h3>
<div class="callout ok"><ol>
<li>Before booking: read your 11.2 report and write the one fix as a checkable sentence.</li>
<li>Run the 45 minutes, in English if your target companies are foreign. Interviewer: write the one fix at the top of your notes and tick each time it happens.</li>
<li>Debrief 15 minutes: rubric independently, compare, verdict, and achieved / partly / not for the one fix.</li>
<li>Put both problems on the review ladder; add LC 1658 to tomorrow's session.</li>
<li>Compare scores with mock 1 in a two-row table; pick the fixing lesson for the axis that did not move.</li>
</ol>
<p><strong>Done when:</strong> a rubric with evidence, a verdict, the one-fix line, the two-session comparison, and mock 3 (lesson 11.4) booked 3 days later.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">deliberate practice</span><span class="v">Practising one specific weakness with immediate feedback, instead of repeating everything.</span></div>
  <div class="kv"><span class="k">complement</span><span class="v">What you do NOT take; optimising it can be easier than optimising what you take.</span></div>
  <div class="kv"><span class="k">counterexample</span><span class="v">One input that breaks a rule; the fastest way to reject a greedy idea.</span></div>
  <div class="kv"><span class="k">post-order</span><span class="v">Children first, then the node — needed when the parent depends on the children's results.</span></div>
  <div class="kv"><span class="k">excess</span><span class="v">Here: bottles minus nodes of a subtree; what must cross the edge above it.</span></div>
  <div class="kv"><span class="k">accumulator</span><span class="v">A variable outside the recursion that collects the answer while the return value serves the parent.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Fix one behaviour per session, announced and scored separately.</li>
<li>Cards: only k + 1 splits matter; slide one card at a time — O(k); or minimise the block you leave.</li>
<li>Greedy "bigger end" fails one input in five here; break a greedy rule on purpose before trusting it.</li>
<li>Coins: what must cross an edge is |bottles − nodes| of the subtree; the helper returns excess, moves accumulate outside.</li>
<li>The root returning 0 is a free correctness check; a guard handles totals that are not n.</li>
<li>Two sessions give a direction: study the fixing lesson for the axis that did not move.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — during the coding interview', 'What to do minute by minute, including how to take hints', 'https://www.techinterviewhandbook.org/coding-interview-techniques/')}
${nguon('📙', 'NeetCode — trees roadmap', 'Tree problems in the standard order, with video solutions', 'https://neetcode.io/roadmap')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (một buổi, 60–75 phút)</h3>
<div class="callout ok"><ol>
<li>Trước khi hẹn: đọc biên bản 11.2 và viết "một điều sửa" thành một câu kiểm được.</li>
<li>Chạy 45 phút, bằng tiếng Anh nếu công ty bạn nhắm là nước ngoài. Người phỏng vấn: ghi "một điều sửa" lên đầu trang và đánh dấu mỗi lần nó xảy ra.</li>
<li>Rút kinh nghiệm 15 phút: chấm phiếu độc lập, so, kết luận, và đạt / một phần / chưa cho "một điều sửa".</li>
<li>Đưa cả hai đề lên thang ôn; thêm LC 1658 vào buổi luyện ngày mai.</li>
<li>So điểm với buổi 1 trong một bảng hai dòng; chọn bài chữa cho trục chưa nhúc nhích.</li>
</ol>
<p><strong>Đạt khi:</strong> phiếu chấm có bằng chứng, có kết luận, có dòng "một điều sửa", có bảng so hai buổi, và đã hẹn buổi thử 3 (bài 11.4) sau 3 ngày.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">deliberate practice (luyện tập có chủ đích)</span><span class="v">Luyện đúng một điểm yếu cụ thể và có góp ý ngay, thay vì lặp lại mọi thứ.</span></div>
  <div class="kv"><span class="k">complement (phần bù)</span><span class="v">Phần bạn KHÔNG lấy; tối ưu nó có khi dễ hơn tối ưu phần lấy.</span></div>
  <div class="kv"><span class="k">counterexample (phản ví dụ)</span><span class="v">Một đầu vào làm luật sai; cách nhanh nhất để gạt một ý tham lam.</span></div>
  <div class="kv"><span class="k">post-order (hậu thứ tự)</span><span class="v">Con trước, nút sau — cần khi cha phụ thuộc kết quả của các con.</span></div>
  <div class="kv"><span class="k">excess (tiền dư / phần dư)</span><span class="v">Ở đây: số bình − số nút của cây con; thứ phải đi qua cạnh phía trên nó.</span></div>
  <div class="kv"><span class="k">accumulator (biến cộng dồn)</span><span class="v">Biến ở ngoài đệ quy gom đáp án, trong khi giá trị trả về phục vụ nút cha.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi buổi sửa một hành vi, tuyên bố trước và được chấm riêng.</li>
<li>Thẻ: chỉ k + 1 cách chia có nghĩa; trượt từng lá — O(k); hoặc tối thiểu khối bị bỏ lại.</li>
<li>Tham lam "đầu lớn hơn" sai một trên năm đầu vào; cố ý phá luật tham lam trước khi tin nó.</li>
<li>Bình nước: cái phải qua một cạnh là |số bình − số nút| của cây con; hàm phụ trả về phần dư, số lượt cộng dồn bên ngoài.</li>
<li>Gốc trả về 0 là phép kiểm đúng miễn phí; một phép chặn xử lý tổng khác n.</li>
<li>Hai buổi cho một hướng: học bài chữa cho trục chưa tiến.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — trong lúc phỏng vấn coding', 'Làm gì theo từng phút, kể cả cách nhận gợi ý (tiếng Anh)', 'https://www.techinterviewhandbook.org/coding-interview-techniques/')}
${nguon('📙', 'NeetCode — lộ trình cây', 'Đề cây theo thứ tự chuẩn, có video lời giải', 'https://neetcode.io/roadmap')}
</div>
`,
};
