/** 10.3 — Tự test code của mình. Mọi mã/output đọc từ ../ma/ch10/b3 (chạy thật bằng _chay.mjs, Node 26 + Java 21 + JUnit 5.12.2, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, gap, baiNay, doc } from '../_chung.mjs';
import { vetCuaSo } from '../ma/ch10/b3/cua-so.vet.mjs';

/* Bảng vết: chạy THẬT bản lỗi / bản đúng, tô cửa sổ đang xét; ô đỏ = cửa sổ hợp lệ mà vòng lặp bỏ sót. */
function veBang(nums, k, loi) {
  return bangVet(['step', 'nums (window)', 'loop check', 'sum', 'best'],
    vetCuaSo(nums, k, { loi }).map((h, i) => {
      let o;
      if (h.tu !== null) o = oMang(nums, { tu: h.tu, den: h.den });
      else if (h.s <= nums.length - k) {
        const to = {};
        for (let j = h.s; j < h.s + k; j++) to[j] = 'x';
        o = oMang(nums, { to });
      } else o = oMang(nums, { to: Object.fromEntries(nums.map((_, j) => [j, 'mo'])) });
      return [String(i), o, h.dk, h.sum === null ? '—' : String(h.sum), `<strong>${h.best}</strong>`];
    }));
}
const BANG_THUONG = veBang([2, 1, 5, 1, 3, 2], 3, true);
const BANG_BIEN_LOI = veBang([1, 2, 3], 2, true);
const BANG_BIEN_DUNG = veBang([1, 2, 3], 2, false);

/* Số liệu đọc từ output thật (đổi mã ⇒ chữ tự khớp). */
const DC = doc('ch10/b3/doi-chieu.ts.out');
const LOI = DC.match(/buggy: (\d+) of (\d+)/);
const DAU = DC.match(/first failure -> seed (\d+): nums=(\[[^\]]*\]) k=(\d+) fast=(-?\d+) brute=(-?\d+)/);
const NHO = DC.match(/smallest failing input: seed (\d+): nums=(\[[^\]]*\]) k=(\d+) buggy=(-?\d+) brute=(-?\d+)/);
const PT = (Number(LOI[1]) / Number(LOI[2]) * 100).toFixed(0);
const DO = doc('ch10/b3/doi-chieu-do.ts.out').split('\n').filter((l) => l.includes('|')).slice(1).map((l) => l.split('|').map((s) => s.trim()));
const tg = (tests, cot) => parseFloat(DO.find((r) => r[0] === tests)[cot]);
const vi = (x) => String(x).replace('.', ',');
const T4 = tg('10,000', 1), T6 = tg('1,000,000', 1), T4L = tg('10,000', 2);

const BIEN = [
  ['Array', 'Mảng', 'empty · one element · two elements · all equal · already sorted / reversed · negatives and zeros · duplicates · the answer at index 0 or at the last index',
    'rỗng · một phần tử · hai phần tử · toàn giống nhau · đã sắp xếp / sắp ngược · có số âm và số 0 · phần tử trùng · đáp án nằm ở chỉ số 0 hoặc chỉ số cuối',
    'Loops run zero times; the initial value (0, −∞, nums[0]) is wrong; <code>&lt;</code> vs <code>&lt;=</code> decides ties; the last element is never visited.',
    'Vòng lặp chạy 0 lần; giá trị khởi tạo (0, −∞, nums[0]) sai; <code>&lt;</code> hay <code>&lt;=</code> quyết định chuyện hoà; phần tử cuối không bao giờ được thăm.'],
  ['String', 'Chuỗi', 'empty "" · one character · all the same character · upper/lower case · spaces at the ends or only spaces · punctuation · Unicode: accents, emoji',
    'rỗng "" · một ký tự · toàn một ký tự · hoa/thường · khoảng trắng ở hai đầu hoặc chỉ toàn khoảng trắng · dấu câu · Unicode: chữ có dấu, emoji',
    'Palindrome and anagram code assume a–z; <code>length</code> counts UTF-16 units, not letters (output below).',
    'Code palindrome, anagram ngầm giả định chỉ có a–z; <code>length</code> đếm đơn vị UTF-16, không đếm chữ (output bên dưới).'],
  ['Tree', 'Cây', 'null root · a single node · a "stick" (every node has only a left child = a linked list) · a full/perfect tree · duplicate values in a BST',
    'gốc null · một nút · cây "que" (nút nào cũng chỉ có con trái = một danh sách liên kết) · cây đầy đủ · giá trị trùng trong BST',
    'Recursion depth = height: a stick of 10⁴ nodes can overflow the stack (lesson 5.2); a null child that the code dereferences.',
    'Độ sâu đệ quy = chiều cao: cây que 10⁴ nút có thể làm tràn stack (bài 5.2); con null bị code truy cập thẳng.'],
  ['Graph', 'Đồ thị', 'one vertex · no edges · disconnected parts · a cycle · a self-loop or a repeated edge · the start equals the target',
    'một đỉnh · không có cạnh · nhiều thành phần rời nhau · có chu trình · khuyên (cạnh tự nối) hoặc cạnh lặp · đỉnh xuất phát trùng đích',
    'BFS/DFS from one start misses other components; no visited set ⇒ infinite loop on a cycle; counting a repeated edge twice.',
    'BFS/DFS từ một đỉnh bỏ sót thành phần khác; quên tập visited ⇒ lặp vô hạn trên chu trình; đếm cạnh lặp hai lần.'],
  ['Number', 'Số', '0 · negative · 1 and −1 · INT_MIN / INT_MAX · results that overflow 32 bits · division by zero · floating point (0.1 + 0.2)',
    '0 · số âm · 1 và −1 · INT_MIN / INT_MAX · kết quả tràn 32 bit · chia cho 0 · số thực (0,1 + 0,2)',
    'Java <code>int</code> wraps silently; <code>Math.abs(Integer.MIN_VALUE)</code> stays negative; <code>%</code> of a negative number is negative; JS does not throw on <code>/ 0</code>.',
    '<code>int</code> của Java tràn lặng lẽ; <code>Math.abs(Integer.MIN_VALUE)</code> vẫn âm; <code>%</code> của số âm ra số âm; JS không ném lỗi khi <code>/ 0</code>.'],
];
const bangBien = (lang) => {
  const en = lang === 'en';
  return `<table>\n<thead><tr><th>${en ? 'Data type' : 'Kiểu dữ liệu'}</th><th>${en ? 'Edge cases to pick from' : 'Ca biên để chọn'}</th><th>${en ? 'Why they break code' : 'Vì sao chúng làm vỡ code'}</th></tr></thead>\n<tbody>\n` +
    BIEN.map((r) => `<tr><td><strong>${en ? r[0] : r[1]}</strong></td><td>${en ? r[2] : r[3]}</td><td>${en ? r[4] : r[5]}</td></tr>`).join('\n') + '\n</tbody></table>';
};

const DE = [
  [lc(643, 'maximum-average-subarray-i', 'Maximum Average Subarray I', 'Easy'), 'This lesson’s problem with averages. Test: k = n, all negative, best window last.', 'Đề của bài này, tính trung bình. Test: k = n, toàn số âm, cửa sổ tốt nhất ở cuối.'],
  [lc(704, 'binary-search', 'Binary Search', 'Easy'), 'Target at index 0, at the last index, absent, one-element array: the four cases that expose lo/hi bugs.', 'Target ở chỉ số 0, ở cuối, không có, mảng một phần tử: bốn ca lộ lỗi lo/hi.'],
  [lc(35, 'search-insert-position', 'Search Insert Position', 'Easy'), 'Insert before everything and after everything — the answer can be n.', 'Chèn trước tất cả và sau tất cả — đáp án có thể là n.'],
  [lc(125, 'valid-palindrome', 'Valid Palindrome', 'Easy'), 'Empty string, only punctuation, mixed case: the string row of the checklist.', 'Chuỗi rỗng, chỉ dấu câu, hoa thường lẫn lộn: đúng hàng "chuỗi" của bảng kiểm.'],
  [lc(69, 'sqrtx', 'Sqrt(x)', 'Easy'), 'x = 0, 1, and 2³¹ − 1: mid · mid overflows int in Java.', 'x = 0, 1 và 2³¹ − 1: mid · mid tràn int trong Java.'],
  [lc(7, 'reverse-integer', 'Reverse Integer', 'Medium'), 'The whole problem is the overflow row: detect it before it happens.', 'Cả đề là hàng "tràn số": phải phát hiện trước khi tràn.'],
  [lc(8, 'string-to-integer-atoi', 'String to Integer (atoi)', 'Medium'), 'Leading spaces, a lone sign, digits then letters, clamp to 32 bits — a checklist in one problem.', 'Khoảng trắng đầu, dấu đứng một mình, số rồi chữ, kẹp về 32 bit — cả bảng kiểm trong một đề.'],
  [lc(2, 'add-two-numbers', 'Add Two Numbers', 'Medium'), 'Different lengths and a carry left over at the very end (5 + 5).', 'Hai danh sách dài khác nhau và số nhớ còn dư ở cuối (5 + 5).'],
  [lc(65, 'valid-number', 'Valid Number', 'Hard'), 'Write the test list FIRST ("1e", ".", "-.5", "+E3"), then the code.', 'Viết danh sách test TRƯỚC ("1e", ".", "-.5", "+E3"), rồi mới code.'],
];

const SWT_BVA = '/academy/courses/software-testing/learn?lessonSlug=swt301-blackbox-bva-template';
const SWT_UTC = '/academy/courses/software-testing/learn?lessonSlug=swt301-lab2-template-worked';
const SWT_JUNIT = '/academy/courses/software-testing/learn?lessonSlug=swt301-junit-hands-on';

export default {
  title: '10.3 — Testing your own code before you say "done"|||10.3 — Tự test code của mình trước khi nói "xong"',
  slug: 'dsa-10-3-test',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Quy trình 5 phút cuối buổi (đọc lại, chạy tay bằng bảng vết, hai ca biên, độ phức tạp), bảng kiểm ca biên theo kiểu dữ liệu, kiểm thử đối chiếu với vét cạn + sinh ngẫu nhiên có seed, và unit test thật bằng node:test và JUnit.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Testing your own code before you say "done"</h2>
<p class="lead">Testing is one of the four axes on the interviewer's sheet (lesson 0.8) — a whole quarter of the score — and it is the axis candidates throw away most easily, by typing the last bracket and saying "done". Section 0 promised you one habit: <strong>trace one normal example and two edge cases before you say you are finished.</strong> This lesson turns that promise into a five-minute routine, shows on real runs why the normal example alone is not enough, gives you a checklist of edge cases per data type, and then goes one step further than a whiteboard can: differential testing with a random generator, and real unit tests in <code>node:test</code> and JUnit — the same tools this website runs before every merge.</p>

<h3>The everyday picture: the delivery rider at the counter</h3>
<p>A food delivery rider picks up an order of five dishes. A careless rider glances at the bag and leaves. A good one does two things in ten seconds: counts the dishes against the receipt (the normal case), then looks for the <em>unusual</em> lines — "no onions", "extra rice", "drink without ice" — because that is where the mistakes hide. The customer never complains that the normal dish was right; they complain about the onions. Your code is the same: the normal example usually passes; the empty array, the last window, the negative numbers are the onions.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Tự test code của mình trước khi nói "xong"</h2>
<p class="lead">Kiểm thử (testing) là một trong bốn trục trên phiếu chấm của người phỏng vấn (bài 0.8) — trọn một phần tư số điểm — và là trục ứng viên vứt đi dễ nhất: gõ xong dấu ngoặc cuối rồi nói "xong ạ". Mục 0 đã hứa với bạn một thói quen: <strong>chạy tay một ví dụ thường và hai trường hợp biên trước khi nói xong.</strong> Bài này biến lời hứa đó thành một quy trình 5 phút, cho bạn thấy bằng lần chạy thật vì sao chỉ ví dụ thường là KHÔNG đủ, đưa bạn bảng kiểm ca biên theo từng kiểu dữ liệu, rồi đi xa hơn cái bảng trắng một bước: kiểm thử đối chiếu với bộ sinh ngẫu nhiên, và unit test thật bằng <code>node:test</code> và JUnit — đúng những công cụ chính trang web này chạy trước mỗi lần gộp code.</p>

<h3>Hình dung đời thường: anh shipper ở quầy lấy hàng</h3>
<p>Một anh shipper nhận đơn năm món. Người ẩu liếc cái túi rồi chạy. Người cẩn thận làm hai việc trong mười giây: đếm món theo hoá đơn (trường hợp bình thường), rồi dò những dòng <em>bất thường</em> — "không hành", "thêm cơm", "nước không đá" — vì lỗi nằm ở đó. Khách chẳng bao giờ khen món thường đúng; khách phàn nàn chuyện hành. Code của bạn cũng vậy: ví dụ thường gần như luôn qua; mảng rỗng, cửa sổ cuối cùng, toàn số âm mới là "hành".</p>
</div>

<div class="ml-en">
<h3>The five-minute closing routine</h3>
<p>Run it every time, in this order, out loud. It fits in the last five minutes of a 45-minute round (lesson 0.2, step 6) and it scores even when it finds nothing.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Re-read what you WROTE (30″)</span><span class="lz-d">Line by line, reading the code literally — not what you meant. Look at every loop bound (<code>&lt;</code> or <code>&lt;=</code>), every initial value, every index <code>i − 1</code> / <code>i + k</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trace the normal example (1–2′)</span><span class="lz-d">Write the variables as columns and update them line by line — a state table, like the ones in every lesson of this course. Compare with the answer you computed by hand in step 2 of the framework.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Two edge cases (1–2′)</span><span class="lz-d">Pick them from the checklist below — the ones that hit YOUR loops and YOUR initial values. Tiny inputs: two or three elements are enough.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Fix out loud</span><span class="lz-d">"I found a bug: …". Fix it, then re-run the case that failed. Finding your own bug scores higher than never having it.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Restate the complexity (15″)</span><span class="lz-d">"O(n) time, O(1) extra space." The last sentence the interviewer hears.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Quy trình 5 phút cuối buổi</h3>
<p>Làm mọi lần, đúng thứ tự này, nói thành tiếng. Nó vừa khít 5 phút cuối của buổi 45 phút (bài 0.2, bước 6) và nó ghi điểm kể cả khi không tìm ra lỗi nào.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc lại cái mình ĐÃ VIẾT (30″)</span><span class="lz-d">Từng dòng, đọc code theo đúng chữ trên màn hình — không đọc theo ý mình định viết. Soi mọi cận vòng lặp (<code>&lt;</code> hay <code>&lt;=</code>), mọi giá trị khởi tạo, mọi chỉ số kiểu <code>i − 1</code> / <code>i + k</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chạy tay ví dụ thường (1–2′)</span><span class="lz-d">Mỗi biến một cột, cập nhật theo từng dòng code — tức một bảng vết (trace table), như bảng ở mọi bài của khoá này. So với đáp án bạn tính tay ở bước 2 của khung 6 bước.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hai ca biên (1–2′)</span><span class="lz-d">Chọn từ bảng kiểm bên dưới — những ca chạm đúng vòng lặp và giá trị khởi tạo CỦA BẠN. Đầu vào thật nhỏ: hai ba phần tử là đủ.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Sửa thành tiếng</span><span class="lz-d">"I found a bug: …" (em tìm ra một lỗi: …). Sửa, rồi chạy lại đúng ca vừa hỏng. Tự tìm ra lỗi của mình được điểm cao hơn là… chưa từng có lỗi.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Nhắc lại độ phức tạp (15″)</span><span class="lz-d">"O(n) time, O(1) extra space." Câu cuối cùng người phỏng vấn nghe.</span></div>
</div>
<p>Vì sao phải nói thành tiếng? Vì người phỏng vấn chỉ chấm được thứ họ nghe và thấy. Một ứng viên lặng lẽ nhìn code 2 phút rồi nói "chắc đúng" và một ứng viên đọc to "s bằng 1, điều kiện 1 nhỏ hơn 1 sai, vòng dừng — khoan, cửa sổ bắt đầu ở 1 chưa được xét" là hai ứng viên khác hẳn nhau trên phiếu chấm, kể cả khi code cuối cùng giống hệt.</p>
</div>

<div class="ml-en">
<h3>Worked example: the normal example lies</h3>
<p><strong>Problem (in our words).</strong> Given an integer array <code>nums</code> and an integer <code>k</code> with 1 ≤ k ≤ n, return the largest sum of <code>k</code> consecutive elements. Example: <code>[2, 1, 5, 1, 3, 2]</code>, k = 3 → the windows sum to 8, 7, 9, 6, so the answer is <strong>9</strong>. It is the fixed-size sliding window of lesson 2.2 (LC 643 asks for the average instead of the sum).</p>
<p>Here is a first version, typed quickly under pressure. Read it once and decide whether it is correct before you scroll on.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: ví dụ thường "nói dối"</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho mảng số nguyên <code>nums</code> và số nguyên <code>k</code> với 1 ≤ k ≤ n, trả về tổng lớn nhất của <code>k</code> phần tử liên tiếp. Ví dụ: <code>[2, 1, 5, 1, 3, 2]</code>, k = 3 → các cửa sổ có tổng 8, 7, 9, 6, nên đáp án là <strong>9</strong>. Đây là cửa sổ trượt kích thước cố định của bài 2.2 (LC 643 hỏi trung bình thay vì tổng).</p>
<p>Dưới đây là bản đầu tiên, gõ vội dưới áp lực. Đọc một lần và tự quyết nó đúng hay sai trước khi kéo xuống.</p>
</div>
${maHai('ch10/b3/cua-so.ts', 'ch10/b3/CuaSo.java', { vung: 'loi' })}
<div class="ml-en">
<p><strong>Step 2 of the routine — trace the normal example.</strong> The table below is produced by running exactly this buggy loop. Green = the window being summed; the "loop check" column is the <code>for</code> condition evaluated before each step.</p>
</div>
<div class="ml-vi">
<p><strong>Bước 2 của quy trình — chạy tay ví dụ thường.</strong> Bảng dưới sinh ra bằng cách chạy đúng vòng lặp có lỗi này. Ô xanh lá = cửa sổ đang cộng; cột "loop check" là điều kiện của <code>for</code> được kiểm trước mỗi bước.</p>
</div>
${BANG_THUONG}
<div class="ml-en">
<p>It returns <strong>9</strong> — correct. Most candidates stop here. But look at the last row, in red: the check <code>3 &lt; 3</code> is false, so the window starting at index 3 (<code>[1, 3, 2]</code>, sum 6) was <em>never summed</em>. The answer is right only because the best window happened not to be the last one. The normal example did not test the bug; it walked around it.</p>
<p><strong>Step 3 — an edge case aimed at the loop bound.</strong> "The answer is at the last possible position" is a row of the array checklist. Smallest input with that property: <code>[1, 2, 3]</code>, k = 2. By hand: windows 3 and 5, answer 5.</p>
</div>
<div class="ml-vi">
<p>Nó trả về <strong>9</strong> — đúng. Phần lớn ứng viên dừng ở đây. Nhưng nhìn dòng cuối, ô đỏ: điều kiện <code>3 &lt; 3</code> sai, nên cửa sổ bắt đầu ở chỉ số 3 (<code>[1, 3, 2]</code>, tổng 6) <em>chưa bao giờ được cộng</em>. Đáp án đúng chỉ vì cửa sổ tốt nhất tình cờ không nằm ở cuối. Ví dụ thường không hề test cái lỗi; nó đi vòng qua cái lỗi.</p>
<p><strong>Bước 3 — một ca biên nhắm thẳng vào cận vòng lặp.</strong> "Đáp án nằm ở vị trí cuối cùng có thể" là một dòng trong bảng kiểm mảng. Đầu vào nhỏ nhất có tính chất đó: <code>[1, 2, 3]</code>, k = 2. Tính tay: hai cửa sổ có tổng 3 và 5, đáp án 5.</p>
</div>
${BANG_BIEN_LOI}
<div class="ml-en">
<p>Two rows. The loop does not run even once: <code>1 &lt; 1</code> is false, the window <code>[2, 3]</code> is skipped, and the function returns <strong>3</strong>. This is the moment to say: <em>"I found a bug: my loop stops one window early. The last valid start is n − k, so the condition must be s &lt;= n − k."</em> A reliable way to get loop bounds right is to <strong>name the last valid value</strong> before writing the condition: starts go from 0 to n − k inclusive, so <code>&lt;=</code>. If you prefer <code>&lt;</code>, write <code>s &lt; n − k + 1</code> — same thing, and the "+1" makes the inclusive end visible.</p>
</div>
<div class="ml-vi">
<p>Hai dòng. Vòng lặp không chạy lần nào: <code>1 &lt; 1</code> sai, cửa sổ <code>[2, 3]</code> bị bỏ qua, và hàm trả về <strong>3</strong>. Đây là lúc nói: <em>"I found a bug: my loop stops one window early. The last valid start is n − k, so the condition must be s &lt;= n − k."</em> (Em tìm ra một lỗi: vòng lặp dừng sớm một cửa sổ. Điểm bắt đầu hợp lệ cuối cùng là n − k, nên điều kiện phải là s &lt;= n − k.) Một cách chắc tay để viết đúng cận vòng lặp là <strong>gọi tên giá trị hợp lệ cuối cùng</strong> trước khi viết điều kiện: điểm bắt đầu đi từ 0 tới n − k, tính cả hai đầu, nên dùng <code>&lt;=</code>. Thích <code>&lt;</code> thì viết <code>s &lt; n − k + 1</code> — y như nhau, và cái "+1" làm lộ rõ đầu cuối được tính.</p>
</div>
${BANG_BIEN_DUNG}
<div class="ml-en">
<p>After the fix the same edge case visits the window starting at 1 and returns 5. Now the second edge case, aimed at the <em>initial value</em>: "every window is negative". If you had written <code>best = 0</code> (a very common habit), <code>[-3, -1, -2]</code> with k = 2 would return 0, a sum that no window has. Our version starts <code>best</code> from the first window, so it is safe — but the buggy loop fails this case too, for the loop-bound reason. Here are the fixed solution, a brute force to compare against, and all six cases in both languages:</p>
</div>
<div class="ml-vi">
<p>Sau khi sửa, cùng ca biên đó đã thăm cửa sổ bắt đầu ở 1 và trả về 5. Giờ ca biên thứ hai, nhắm vào <em>giá trị khởi tạo</em>: "mọi cửa sổ đều âm". Nếu bạn viết <code>best = 0</code> (thói quen rất phổ biến), <code>[-3, -1, -2]</code> với k = 2 sẽ trả về 0 — một tổng không cửa sổ nào có. Bản của ta khởi tạo <code>best</code> bằng cửa sổ đầu tiên nên an toàn — nhưng vòng lặp có lỗi vẫn hỏng ca này, vì đúng lý do cận vòng lặp. Đây là lời giải đã sửa, một bản vét cạn để đối chiếu, và cả sáu ca bằng hai ngôn ngữ:</p>
</div>
${maHai('ch10/b3/cua-so.ts', 'ch10/b3/CuaSo.java', { vung: 'dung' })}
${maHai('ch10/b3/cua-so.ts', 'ch10/b3/CuaSo.java', { vung: 'brute' })}
${ketQua('ch10/b3/cua-so.ts')}
${ketQua('ch10/b3/CuaSo.java')}
<div class="ml-en">
<p>Read the verdict column: the buggy version survives four of six cases — the normal example, one element, k = n, all equal — and fails exactly the two edge cases chosen on purpose. Notice <em>why</em> "k = n" and "one element" pass: there is only one window, so skipping "the last" costs nothing. A bug that only appears when there are at least two windows <strong>and</strong> the best is the last one is invisible to random guessing and obvious to a targeted edge case. Complexity of the fixed version: O(n) time (each element enters and leaves the window once), O(1) extra space; the brute force is O(n·k).</p>
${moPhong('ch10/b3/cua-so.sim.js', 'en', 'Fixed window: the buggy loop skips the last window', 'Watch s &lt; n − k stop one step early on [1, 2, 3, 4], then s &lt;= n − k reach the window [3, 4]. Edit the array and k.')}
</div>
<div class="ml-vi">
<p>Đọc cột kết luận: bản lỗi sống sót 4/6 ca — ví dụ thường, một phần tử, k = n, toàn giống nhau — và hỏng đúng hai ca biên được chọn có chủ đích. Để ý <em>vì sao</em> "k = n" và "một phần tử" qua: chỉ có một cửa sổ, nên bỏ sót "cửa sổ cuối" chẳng mất gì. Một lỗi chỉ hiện ra khi có ít nhất hai cửa sổ <strong>và</strong> cửa sổ tốt nhất nằm cuối thì đoán mò sẽ không thấy, còn ca biên nhắm đúng chỗ thì thấy ngay. Độ phức tạp bản đã sửa: O(n) thời gian (mỗi phần tử vào và ra khỏi cửa sổ đúng một lần), O(1) bộ nhớ phụ; bản vét cạn là O(n·k).</p>
${moPhong('ch10/b3/cua-so.sim.js', 'vi', 'Cửa sổ cố định: vòng lặp lỗi bỏ sót cửa sổ cuối', 'Xem s &lt; n − k dừng sớm một bước trên [1, 2, 3, 4], rồi s &lt;= n − k với tới cửa sổ [3, 4]. Sửa mảng và k để thử.')}
</div>

<div class="ml-en">
<h3>The edge-case checklist, by data type</h3>
<p>You will not test every row — there is no time. Read the row of your input type and pick the two cases that touch <em>your</em> code: a loop that might run zero times, an initial value, a strict comparison, an index at the end, a multiplication that might overflow.</p>
${bangBien('en')}
<p>The number and string rows hide the most surprises because the language decides the answer, not the algorithm. These lines are printed by real runs, not claimed:</p>
</div>
<div class="ml-vi">
<h3>Bảng kiểm ca biên theo kiểu dữ liệu</h3>
<p>Bạn sẽ không test hết mọi dòng — không có thời gian. Đọc dòng ứng với kiểu đầu vào của đề, chọn hai ca chạm vào code <em>của bạn</em>: một vòng lặp có thể chạy 0 lần, một giá trị khởi tạo, một phép so sánh nghiêm ngặt, một chỉ số ở cuối mảng, một phép nhân có thể tràn.</p>
${bangBien('vi')}
<p>Hai dòng "số" và "chuỗi" giấu nhiều bất ngờ nhất, vì ở đó NGÔN NGỮ quyết định đáp án chứ không phải thuật toán. Những dòng dưới đây in ra từ lần chạy thật, không phải lời kể:</p>
${csd('csd201-bst', 'vi', '4.4 Cây nhị phân tìm kiếm (BST)', '<p>Ở CSD201 bạn đã thấy: chèn một dãy ĐÃ SẮP XẾP vào BST cho ra cây lệch hẳn một bên, chiều cao n, mọi thao tác thành O(n). <strong>Ở đây dùng đúng điều đó làm ca biên:</strong> cây "que" là đầu vào nên thử cho mọi hàm đệ quy trên cây — nó vừa phá độ phức tạp, vừa có thể làm tràn ngăn xếp gọi hàm.</p>')}
</div>
${maHai('ch10/b3/bien-so-chuoi.ts', 'ch10/b3/BienSoChuoi.java', { vung: 'bien' })}
${ketQua('ch10/b3/bien-so-chuoi.ts')}
${ketQua('ch10/b3/BienSoChuoi.java')}
<div class="ml-en">
<p>Five facts to keep: (1) an emoji has <code>length</code> 2 in both JavaScript and Java, so reversing a string by code units produces two broken halves; (2) two strings that look identical can differ (a precomposed "Á" versus "A" plus a combining accent) — normalise before comparing user input; (3) Java <code>int</code> overflows silently, and <code>Math.abs(Integer.MIN_VALUE)</code> is still negative — widen to <code>long</code> <em>before</em> the operation; (4) <code>-7 % 2</code> is <code>-1</code> in both languages, so "is odd" written as <code>x % 2 == 1</code> is false for negative odd numbers; (5) <code>Math.max()</code> of an empty list is <code>-Infinity</code> in JS and division by zero does not throw — an empty input can sneak through without any error and print a nonsense answer.</p>
</div>
<div class="ml-vi">
<p>Năm điều cần nhớ: (1) một emoji có <code>length</code> bằng 2 ở cả JavaScript lẫn Java, nên đảo chuỗi theo đơn vị mã (code unit) sinh ra hai nửa vỡ; (2) hai chuỗi trông y hệt có thể khác nhau ("Á" dựng sẵn so với "A" cộng dấu sắc rời — chuyện thường gặp với tiếng Việt gõ từ các bộ gõ khác nhau) — chuẩn hoá (normalize) trước khi so dữ liệu người dùng nhập; (3) <code>int</code> của Java tràn lặng lẽ, và <code>Math.abs(Integer.MIN_VALUE)</code> vẫn âm — ép lên <code>long</code> <em>trước</em> khi tính; (4) <code>-7 % 2</code> ra <code>-1</code> ở cả hai ngôn ngữ, nên "là số lẻ" viết thành <code>x % 2 == 1</code> sẽ sai với số lẻ âm; (5) <code>Math.max()</code> của danh sách rỗng là <code>-Infinity</code> trong JS và chia cho 0 không ném lỗi — một đầu vào rỗng có thể lọt qua mà không báo gì, rồi in ra một đáp án vô nghĩa.</p>
</div>

<div class="ml-en">
<h3>Beyond the whiteboard: differential testing</h3>
<p>Tracing by hand checks a handful of inputs. When you have a computer — in an online assessment (lesson 10.4), in a take-home, at work — you can check thousands. The idea, already met in lesson 0.2, is <strong>differential testing</strong>: write a second solution that is slow but obviously correct (the brute force, the <em>oracle</em>), generate many small random inputs, and stop at the first input where the two disagree. You do not need to know the right answer for any input in advance — the oracle knows it.</p>
<p>Three design decisions make the harness useful rather than noisy:</p>
<ul>
<li><strong>Small n (1–6 here) and small values (−5…5).</strong> Small arrays make the failing input traceable by hand in a minute; small values make ties, zeros, negatives and duplicates happen often — exactly the checklist rows. Random values in ±10⁹ almost never produce a tie.</li>
<li><strong>A seeded generator.</strong> Each test is built from its own seed, so "seed 2 fails" can be re-run tomorrow, in another language, on another machine. <code>Math.random()</code> cannot do that. We use <strong>Park–Miller</strong>: <code>x = x · 48271 mod (2³¹ − 1)</code>. Every product stays below 2⁵³, so a JavaScript number computes it exactly and TypeScript and Java build <em>identical</em> inputs. (The other textbook generator, <code>x · 1103515245 + 12345</code>, exceeds 2⁵³ and silently loses digits in JS — chapter 1 hit exactly that: two languages, two different "random" arrays.)</li>
<li><strong>Report the smallest failure.</strong> This is <em>shrinking</em>: among all failing inputs, show the shortest. A two-element failing array is a gift; a 40-element one is a riddle.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Vượt khỏi bảng trắng: kiểm thử đối chiếu</h3>
<p>Chạy tay chỉ kiểm được vài đầu vào. Khi có máy tính trong tay — bài OA (bài 10.4), bài take-home, lúc đi làm — bạn kiểm được hàng nghìn. Ý tưởng, đã gặp ở bài 0.2, là <strong>differential testing (kiểm thử đối chiếu)</strong>: viết thêm một lời giải chậm nhưng hiển nhiên đúng (bản vét cạn, đóng vai <em>oracle</em> — "trọng tài"), sinh thật nhiều đầu vào ngẫu nhiên nhỏ, và dừng ở đầu vào đầu tiên mà hai bản cãi nhau. Bạn không cần biết trước đáp án đúng của đầu vào nào — trọng tài biết.</p>
<p>Ba quyết định thiết kế làm bộ kiểm (harness) có ích thay vì gây nhiễu:</p>
<ul>
<li><strong>n nhỏ (ở đây 1–6) và giá trị nhỏ (−5…5).</strong> Mảng nhỏ thì đầu vào hỏng chạy tay được trong một phút; giá trị nhỏ thì hoà, số 0, số âm, phần tử trùng xảy ra thường xuyên — đúng các dòng của bảng kiểm. Giá trị ngẫu nhiên trong ±10⁹ gần như không bao giờ tạo ra một ca hoà.</li>
<li><strong>Bộ sinh có seed (hạt giống).</strong> Mỗi test dựng từ seed riêng của nó, nên "seed 2 hỏng" chạy lại được ngày mai, bằng ngôn ngữ khác, trên máy khác. <code>Math.random()</code> không làm được điều đó. Ta dùng <strong>Park–Miller</strong>: <code>x = x · 48271 mod (2³¹ − 1)</code>. Mọi tích đều nhỏ hơn 2⁵³ nên số thực của JavaScript tính chính xác, và TypeScript với Java dựng ra đầu vào <em>giống hệt nhau</em>. (Bộ sinh "sách giáo khoa" còn lại, <code>x · 1103515245 + 12345</code>, vượt 2⁵³ và lặng lẽ mất chữ số trong JS — Chương 1 đã dính đúng chuyện đó: hai ngôn ngữ, hai mảng "ngẫu nhiên" khác nhau.)</li>
<li><strong>Báo đầu vào hỏng NHỎ NHẤT.</strong> Đây là <em>shrinking (thu nhỏ)</em>: trong mọi đầu vào hỏng, chỉ ra cái ngắn nhất. Một mảng hai phần tử bị hỏng là món quà; một mảng 40 phần tử là câu đố.</li>
</ul>
</div>
${maHai('ch10/b3/doi-chieu.ts', 'ch10/b3/DoiChieu.java', { vung: 'harness' })}
${ma('ch10/b3/doi-chieu.ts', { vung: 'shrink', nhan: 'TypeScript — shrinking' })}
${ketQua('ch10/b3/doi-chieu.ts')}
${ketQua('ch10/b3/DoiChieu.java')}
<div class="ml-en">
<p>Read it like a test log. The buggy version disagrees with the brute force on <strong>${LOI[1]} of ${LOI[2]}</strong> random inputs (about ${PT} %). The first failure is already at <strong>seed ${DAU[1]}</strong>: <code>${DAU[2]}</code>, k = ${DAU[3]} — windows −4 and 0, the best is the last, the buggy loop returns ${DAU[4]}. The smallest failing input is seed ${NHO[1]}: <code>${NHO[2]}</code>, k = ${NHO[3]} — two elements, the bug in its purest form, traceable in ten seconds. The fixed version agrees on all ${LOI[2]}. Both languages print the same seeds and the same arrays: that is Park–Miller doing its job.</p>
<p>And it is cheap. The fixed solution plus the brute force on ten thousand small random inputs takes about ${T4} ms; a million at this size takes about ${T6} ms; with arrays up to 100 elements, ten thousand tests take about ${T4L} ms (the O(n·k) oracle dominates):</p>
</div>
<div class="ml-vi">
<p>Đọc như đọc log test. Bản lỗi cãi nhau với vét cạn ở <strong>${LOI[1]} trên ${LOI[2]}</strong> đầu vào ngẫu nhiên (khoảng ${PT} %). Lần hỏng đầu tiên đã ở <strong>seed ${DAU[1]}</strong>: <code>${DAU[2]}</code>, k = ${DAU[3]} — hai cửa sổ có tổng −4 và 0, tốt nhất là cửa sổ cuối, vòng lặp lỗi trả ${DAU[4]}. Đầu vào hỏng nhỏ nhất là seed ${NHO[1]}: <code>${NHO[2]}</code>, k = ${NHO[3]} — hai phần tử, cái lỗi ở dạng tinh khiết nhất, chạy tay mười giây là thấy. Bản đã sửa khớp cả ${LOI[2]}. Hai ngôn ngữ in cùng seed và cùng mảng: Park–Miller làm đúng việc của nó.</p>
<p>Và nó rẻ. Bản đúng cộng bản vét cạn trên mười nghìn đầu vào nhỏ ngẫu nhiên mất khoảng ${vi(T4)} ms; một triệu đầu vào cỡ này mất khoảng ${vi(T6)} ms; với mảng tới 100 phần tử, mười nghìn test mất khoảng ${vi(T4L)} ms (bản vét cạn O(n·k) chiếm phần lớn):</p>
</div>
${ketQua('ch10/b3/doi-chieu-do.ts')}
<div class="ml-en">
<p>The times grow ten-fold per row, as linear work should. Practical consequence for an OA: if you have a correct brute force and ten spare minutes, twenty lines of harness will run thousands of cases in milliseconds and catch the off-by-one that the three visible sample tests never show.</p>
</div>
<div class="ml-vi">
<p>Thời gian tăng mười lần mỗi dòng, đúng như một khối việc tuyến tính. Hệ quả thực tế cho bài OA: nếu bạn có sẵn bản vét cạn đúng và còn mười phút, hai mươi dòng harness chạy hàng nghìn ca trong vài mili-giây và bắt được cái lỗi lệch một mà ba test mẫu hiện trên đề không bao giờ lộ ra.</p>
</div>

<div class="ml-en">
<h3>Unit tests: the same edge cases, written down forever</h3>
<p>Tracing is for the interview; at work the edge cases you found go into a <strong>unit test</strong> — a small function that calls your code with a known input and <em>asserts</em> the known output, run automatically on every change. Three kinds, so you can name them precisely when asked:</p>
<ul>
<li><strong>Unit test (example-based):</strong> you know the expected answer for a specific input. Six cases below.</li>
<li><strong>Differential test:</strong> you do not know the answer; you compare two implementations (the harness above).</li>
<li><strong>Property-based test:</strong> you state a property that must hold for every input (for example "the result is at least the sum of every window, and equals one of them") and a library generates and shrinks inputs for you — fast-check for TypeScript, jqwik for Java. Same idea as our harness, industrial strength.</li>
</ul>
<p>Node has a test runner built in since version 18 — no library to install. The same six cases as before:</p>
</div>
<div class="ml-vi">
<h3>Unit test: chính các ca biên đó, viết xuống vĩnh viễn</h3>
<p>Chạy tay là cho buổi phỏng vấn; khi đi làm, các ca biên bạn tìm được đi vào <strong>unit test (kiểm thử đơn vị)</strong> — một hàm nhỏ gọi code của bạn với đầu vào biết trước và <em>khẳng định (assert)</em> đầu ra biết trước, chạy tự động sau mỗi lần sửa. Có ba loại, để bạn gọi tên chính xác khi bị hỏi:</p>
<ul>
<li><strong>Unit test dựa trên ví dụ (example-based):</strong> bạn biết đáp án mong đợi của một đầu vào cụ thể. Sáu ca bên dưới.</li>
<li><strong>Differential test (kiểm thử đối chiếu):</strong> bạn không biết đáp án; bạn so hai cài đặt với nhau (harness ở trên).</li>
<li><strong>Property-based test (kiểm thử theo tính chất):</strong> bạn phát biểu một tính chất phải đúng với MỌI đầu vào (vd "kết quả lớn hơn hoặc bằng tổng mọi cửa sổ, và bằng tổng của một cửa sổ nào đó") rồi thư viện tự sinh và tự thu nhỏ đầu vào — fast-check cho TypeScript, jqwik cho Java. Cùng ý tưởng với harness của ta, ở cấp độ công nghiệp.</li>
</ul>
<p>Node có sẵn bộ chạy test từ bản 18 — không phải cài thư viện. Đúng sáu ca lúc nãy:</p>
</div>
${ma('ch10/b3/cua-so.test.ts', { vung: 'tests', nhan: 'TypeScript — node:test' })}
${ketQua('ch10/b3/chay-node-test.ts', { lenh: '$ npx tsx chay-node-test.ts   # runs node --test twice: fixed, then BAN=loi (buggy)' })}
<div class="ml-en">
<p>Green against the fixed version (6 of 6, exit code 0). Against the buggy version the same file turns red on exactly two tests and prints <code>expected: 5 / actual: 3</code> — the line a CI log would show you. Exit code 1 is what makes a pipeline refuse to merge. The Java world's equivalent is JUnit 5; the tests below were compiled and run for real against JUnit 5.12.2 (the runner script builds the class path from the local Maven cache; in IntelliJ or Eclipse you just click the green arrow):</p>
</div>
<div class="ml-vi">
<p>Xanh với bản đã sửa (6/6, exit code 0). Với bản lỗi, cùng tệp đó đỏ đúng hai test và in <code>expected: 5 / actual: 3</code> — đúng dòng mà log CI sẽ cho bạn xem. Exit code 1 chính là thứ làm pipeline từ chối gộp code. Bên Java tương đương là JUnit 5; các test dưới đây đã được biên dịch và chạy thật với JUnit 5.12.2 (script chạy dựng class path từ bộ đệm Maven trên máy; trong IntelliJ hay Eclipse bạn chỉ cần bấm mũi tên xanh):</p>
</div>
${ma('ch10/b3/CuaSoTest.java', { vung: 'tests', nhan: 'Java — JUnit 5' })}
${ketQua('ch10/b3/chay-junit.ts', { lenh: '$ npx tsx chay-junit.ts   # javac + java -Dban=dung, then -Dban=loi' })}
<div class="ml-en">
<p>Same verdict in a different dialect: <code>expected: &lt;5&gt; but was: &lt;3&gt;</code>. Note the test names — each one says <em>which edge</em> it guards. When a test turns red six months later, its name is the first thing the next developer reads.</p>
</div>
<div class="ml-vi">
<p>Cùng kết luận, khác "giọng": <code>expected: &lt;5&gt; but was: &lt;3&gt;</code>. Để ý tên test — mỗi tên nói nó canh <em>ca biên nào</em>. Khi một test đỏ lên sáu tháng sau, tên của nó là thứ đầu tiên người tiếp theo đọc.</p>
<div class="callout"><p><strong>🎓 Nối với SWT301 (Kiểm thử phần mềm)</strong></p>
<p>Bảng kiểm ca biên ở trên chính là <strong>phân tích giá trị biên (BVA — Boundary Value Analysis)</strong> của SWT301, áp vào code thuật toán: thử ngay tại biên (k = n, mảng một phần tử) và ngay cạnh biên (cửa sổ cuối cùng). Trong mẫu Unit Test Case của FPT (sheet Report 5.1), mỗi cột UTCID là một ca test có Precondition, Input, Expected Output, và được đánh loại <strong>N</strong> (Normal — thường), <strong>A</strong> (Abnormal — bất thường) hay <strong>B</strong> (Boundary — biên). Sáu test ở trên điền vào đó được ngay: 1 ca N (ví dụ thường) và 5 ca B. Ca A sẽ là k = 0 hay k &gt; n — đề cấm, nên lời giải phải hỏi rõ (bước 1) hoặc ném lỗi.</p>
<p><a href="${SWT_BVA}" target="_blank" rel="noopener">SWT301 4.3 — Phân tích giá trị biên (BVA) →</a> · <a href="${SWT_UTC}" target="_blank" rel="noopener">L2.8 — Template Unit Test Case →</a> · <a href="${SWT_JUNIT}" target="_blank" rel="noopener">8.5 — Thực hành JUnit →</a></p></div>
</div>

<div class="ml-en">
<h3>Where this lives in real systems: this website's own tests</h3>
<ul>
<li><strong>CI refuses red code.</strong> The repository behind this course runs <code>npm test</code> in its GitHub Actions workflow (<code>.github/workflows/ci-lint.yml</code>, step "Unit tests — money math + payment signature (required)"): the same <code>node:test</code> runner you just saw, over about two hundred test files. A comment in that step records a classic: one test signs a JWT and needs a <code>JWT_SECRET</code>; developers' machines had it in their <code>.env</code>, CI did not, so the test was green locally and red in CI until the variable was added to the step. "Works on my machine" is an edge case too — the environment.</li>
<li><strong>Floating point, caught by a test.</strong> <code>src/services/finance/money.test.ts</code> opens with the test <em>"sum is decimal-safe — 0.1 + 0.2 === 0.3 (no float drift)"</em> — the very line our number checklist printed as <code>false</code> — and checks HALF_UP rounding right at the boundary: <code>round2('2.345')</code> must be <code>'2.35'</code>. Money code is where the "number" row of the checklist costs real money.</li>
<li><strong>The attacker's edge case, as a test.</strong> <code>src/utils/crypto.test.ts</code> has <em>"tampering with one byte is detected"</em>: it flips a single bit of a ciphertext and asserts that decryption throws. That is an edge case chosen by thinking like an attacker — the smallest possible change.</li>
<li><strong>Refactoring with an oracle.</strong> When you rewrite slow code to make it fast, keep the old version as the oracle and run a differential test between them before deleting it. It is the safest refactoring technique there is.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Nó sống ở đâu trong hệ thống thật: test của chính trang web này</h3>
<ul>
<li><strong>CI từ chối code đỏ.</strong> Kho mã phía sau khoá học này chạy <code>npm test</code> trong workflow GitHub Actions (<code>.github/workflows/ci-lint.yml</code>, bước "Unit tests — money math + payment signature (required)"): đúng bộ chạy <code>node:test</code> bạn vừa thấy, trên khoảng hai trăm tệp test. Một chú thích ở bước đó ghi lại một chuyện kinh điển: có test ký JWT nên cần biến <code>JWT_SECRET</code>; máy lập trình viên có biến đó trong <code>.env</code>, máy CI thì không, nên test xanh ở máy mình và đỏ trên CI cho tới khi biến được thêm vào bước chạy. "Máy em chạy được mà" cũng là một ca biên — ca biên về môi trường.</li>
<li><strong>Số thực, bị test bắt.</strong> <code>src/services/finance/money.test.ts</code> mở đầu bằng test <em>"sum is decimal-safe — 0.1 + 0.2 === 0.3 (no float drift)"</em> — đúng dòng mà bảng kiểm số của ta in ra <code>false</code> — và kiểm làm tròn HALF_UP ngay tại biên: <code>round2('2.345')</code> phải ra <code>'2.35'</code>. Code tiền bạc là nơi dòng "số" của bảng kiểm tốn tiền thật.</li>
<li><strong>Ca biên của kẻ tấn công, viết thành test.</strong> <code>src/utils/crypto.test.ts</code> có test <em>"tampering with one byte is detected"</em>: lật đúng một bit của bản mã rồi khẳng định việc giải mã phải ném lỗi. Đó là ca biên chọn bằng cách nghĩ như kẻ tấn công — thay đổi nhỏ nhất có thể.</li>
<li><strong>Tái cấu trúc (refactor) có trọng tài.</strong> Khi viết lại một đoạn code chậm cho nhanh hơn, giữ bản cũ làm trọng tài và chạy kiểm thử đối chiếu giữa hai bản trước khi xoá bản cũ. Đó là kỹ thuật refactor an toàn nhất hiện có.</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: fuzzing is random testing with a motive</h3>
<p>Attackers run the same harness you just wrote, with a different goal: a <strong>fuzzer</strong> throws millions of malformed inputs at a program and records every crash, because a crash on a weird input is often a security hole. The most famous edge case of the decade is Heartbleed (CVE-2014-0160): OpenSSL's heartbeat message carries a "payload length" field, and the server trusted it — send a tiny payload that <em>claims</em> to be 64 KB long, and the server copies back up to 64 KB of whatever sat next to it in memory, including private keys and passwords. A one-line missing check on the case "declared length &gt; actual length". It was found independently by Neel Mehta of Google Security and by engineers at Codenomicon while improving their own automated security-testing tool. Google's response was OSS-Fuzz (2016), a free service that fuzzes open-source projects around the clock; by August 2023 it had helped find and fix over 10,000 vulnerabilities and 36,000 bugs across 1,000 projects.</p>
<p>The defence is the same habit at every scale: never trust a length, an index or a count that comes from outside; check it against what you actually have; and fuzz your parsers before someone else does.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: fuzzing là test ngẫu nhiên có động cơ</h3>
<p>Kẻ tấn công chạy đúng cái harness bạn vừa viết, với mục đích khác: một <strong>fuzzer (công cụ ném dữ liệu bậy)</strong> bắn hàng triệu đầu vào dị dạng vào chương trình và ghi lại mọi lần sập, vì sập trên một đầu vào lạ thường là một lỗ hổng bảo mật. Ca biên nổi tiếng nhất thập kỷ là Heartbleed (CVE-2014-0160): gói tin heartbeat của OpenSSL mang một trường "độ dài dữ liệu", và máy chủ tin luôn con số đó — gửi một gói dữ liệu tí hon nhưng <em>khai</em> là dài 64 KB, máy chủ sẽ chép trả lại tới 64 KB bất cứ thứ gì nằm cạnh nó trong bộ nhớ, kể cả khoá bí mật và mật khẩu. Thiếu đúng một dòng kiểm tra cho ca "độ dài khai báo &gt; độ dài thật". Lỗi được Neel Mehta (Google Security) và các kỹ sư Codenomicon tìm ra độc lập — nhóm Codenomicon tìm thấy trong lúc cải tiến chính công cụ kiểm thử bảo mật tự động của họ. Google đáp lại bằng OSS-Fuzz (2016), dịch vụ miễn phí chạy fuzzing cho các dự án mã nguồn mở suốt ngày đêm; tới tháng 8/2023 nó đã giúp tìm và sửa hơn 10.000 lỗ hổng và 36.000 lỗi trên 1.000 dự án.</p>
<p>Cách phòng là cùng một thói quen ở mọi quy mô: không bao giờ tin một độ dài, một chỉ số hay một số lượng đến từ bên ngoài; so nó với thứ bạn thật sự có; và fuzz bộ phân tích dữ liệu (parser) của mình trước khi người khác làm hộ.</p>
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Testing only the example from the problem statement.</strong></p><p>The run above shows it: the buggy loop returns the correct 9 on the statement's example. Samples are written to explain the problem, not to break your code. The hidden tests of an OA are where the edge cases live.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Tracing what you meant instead of what you wrote.</strong></p><p>Your head reads <code>s &lt; n − k</code> as "up to the last window" because that is what you intended. Trace with numbers, not with intentions: write "s = 1, is 1 &lt; 1? no" — the bug cannot hide from arithmetic.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Unreproducible random tests.</strong></p><p><code>Math.random()</code> in a test finds a bug once and then never again. Always derive inputs from a printed seed; and use a generator that gives the same numbers in every language you compare (Park–Miller, not <code>* 1103515245 + 12345</code> in JS).</p></div>
<h3>Common mistakes</h3>
<ul>
<li>Saying "done" without running anything, or "it looks right" instead of tracing variables.</li>
<li>Choosing edge cases at random instead of aiming them at your loop bounds and initial values.</li>
<li>Testing a big input by hand — use two or three elements; big inputs belong to the computer.</li>
<li>Finding a bug and fixing it silently — say "I found a bug", fix, and re-run the failing case.</li>
<li>Initialising a maximum with 0 (or a minimum with 0) when all values may be negative.</li>
<li>Forgetting to restate the complexity after the fix.</li>
</ul>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Chỉ test ví dụ trong đề.</strong></p><p>Lần chạy ở trên cho thấy rõ: vòng lặp lỗi trả đúng 9 với ví dụ của đề. Ví dụ mẫu được viết để GIẢI THÍCH đề, không phải để phá code của bạn. Bộ test ẩn của bài OA mới là chỗ các ca biên sống.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Chạy tay theo ý mình định viết, không theo cái mình đã viết.</strong></p><p>Đầu bạn đọc <code>s &lt; n − k</code> thành "tới cửa sổ cuối" vì bạn định viết thế. Chạy tay bằng con số, không bằng ý định: ghi ra "s = 1, 1 &lt; 1? không" — lỗi không trốn được phép tính.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Test ngẫu nhiên không lặp lại được.</strong></p><p><code>Math.random()</code> trong test tìm ra lỗi một lần rồi không bao giờ thấy lại. Luôn sinh đầu vào từ một seed được in ra; và dùng bộ sinh cho cùng dãy số ở mọi ngôn ngữ bạn đem so (Park–Miller, không dùng <code>* 1103515245 + 12345</code> trong JS).</p></div>
<h3>Lỗi hay gặp</h3>
<ul>
<li>Nói "xong" mà không chạy gì, hoặc nói "trông đúng rồi" thay vì chạy từng biến.</li>
<li>Chọn ca biên ngẫu hứng thay vì nhắm vào cận vòng lặp và giá trị khởi tạo của chính mình.</li>
<li>Chạy tay một đầu vào to — hai ba phần tử là đủ; đầu vào to là việc của máy.</li>
<li>Tìm ra lỗi rồi lặng lẽ sửa — hãy nói "em tìm ra lỗi", sửa, rồi chạy lại đúng ca vừa hỏng.</li>
<li>Khởi tạo giá trị lớn nhất bằng 0 (hay nhỏ nhất bằng 0) khi mọi giá trị đều có thể âm.</li>
<li>Quên nhắc lại độ phức tạp sau khi sửa.</li>
</ul>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: the bug you find yourself</h3>
${hoiThoai([
  ['C', 'That is the code. Before I say I’m done, let me trace it with the example: [2, 1, 5, 1, 3, 2], k = 3.'],
  ['N', 'Announce the test. The interviewer now knows the silence that follows is work, not panic.'],
  ['C', 'First window sums to 8, best 8. s = 1: sum 7, best stays 8. s = 2: sum 9, best 9. s = 3: is 3 less than 3? No, the loop stops. Returns 9, which matches.'],
  ['C', 'Now an edge case aimed at the loop bound — the best window is the last one: [1, 2, 3], k = 2. Expected 5. First window is 3. s = 1: is 1 less than 1? No… so it returns 3.'],
  ['C', 'I found a bug: my loop stops one window early. The last valid start is n minus k, so the condition must be s less than or equal to n minus k. Let me fix that and re-run the same case: s = 1, 1 ≤ 1, sum 5, best 5. Correct.'],
  ['N', 'Name the bug, give the reason, fix, re-run the case that failed. This sequence scores on the testing axis even though the first version was wrong.'],
  ['C', 'Second edge case, for the initial value: all negative, [-3, -1, -2], k = 2. best starts at the first window, -4, then -3. Returns -3. If I had started best at zero it would have returned zero.'],
  ['C', 'So: O(n) time, each element enters and leaves the window once, and O(1) extra space.'],
  ['I', 'Good. How would you test this in production?'],
  ['C', 'Unit tests for exactly these cases — the example, the last window, all negative, k equal to n, one element — running in CI. Then a differential test: a brute-force version that sums every window, compared on thousands of small random arrays from a fixed seed, so any failure is reproducible.'],
  ['I', 'And if k is zero or bigger than the array?'],
  ['C', 'The constraints say 1 ≤ k ≤ n, so I’d confirm that’s guaranteed. If it’s user input, I’d validate at the boundary and throw a clear error rather than return a sum of nothing.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to khi phỏng vấn: cái lỗi bạn tự tìm ra</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc lòng.</p>
${hoiThoai([
  ['C', 'Code xong rồi ạ. Trước khi nói xong, em chạy tay với ví dụ: [2, 1, 5, 1, 3, 2], k = 3. <em>("Before I say I’m done, let me trace it with the example.")</em>'],
  ['N', 'Báo trước là mình đang test. Người phỏng vấn biết khoảng lặng sau đó là đang làm việc, không phải đang hoảng.'],
  ['C', 'Cửa sổ đầu tổng 8, best 8. s = 1: tổng 7, best vẫn 8. s = 2: tổng 9, best 9. s = 3: 3 nhỏ hơn 3? Không, vòng dừng. Trả 9, khớp.'],
  ['C', 'Giờ một ca biên nhắm vào cận vòng lặp — cửa sổ tốt nhất nằm cuối: [1, 2, 3], k = 2. Mong đợi 5. Cửa sổ đầu là 3. s = 1: 1 nhỏ hơn 1? Không… vậy nó trả 3. <em>("Now an edge case aimed at the loop bound.")</em>'],
  ['C', 'Em tìm ra lỗi: vòng lặp dừng sớm một cửa sổ. Điểm bắt đầu hợp lệ cuối cùng là n trừ k, nên điều kiện phải là s nhỏ hơn hoặc bằng n trừ k. Em sửa rồi chạy lại đúng ca này: s = 1, 1 ≤ 1, tổng 5, best 5. Đúng. <em>("I found a bug: my loop stops one window early… Let me fix that and re-run the same case.")</em>'],
  ['N', 'Gọi tên lỗi, nói lý do, sửa, chạy lại đúng ca hỏng. Chuỗi này ghi điểm trục kiểm thử dù bản đầu tiên sai.'],
  ['C', 'Ca biên thứ hai, cho giá trị khởi tạo: toàn số âm, [-3, -1, -2], k = 2. best bắt đầu bằng cửa sổ đầu, −4, rồi −3. Trả −3. Nếu em khởi tạo best bằng 0 thì nó đã trả 0.'],
  ['C', 'Vậy: O(n) thời gian, mỗi phần tử vào và ra cửa sổ một lần, và O(1) bộ nhớ phụ. <em>("O(n) time and O(1) extra space.")</em>'],
  ['I', 'Tốt. Nếu đưa lên production thì em test thế nào?'],
  ['C', 'Unit test đúng các ca này — ví dụ của đề, cửa sổ cuối, toàn số âm, k bằng n, một phần tử — chạy trong CI. Thêm một bài kiểm thử đối chiếu: bản vét cạn cộng từng cửa sổ, so trên hàng nghìn mảng nhỏ ngẫu nhiên sinh từ seed cố định, để lỗi nào cũng chạy lại được. <em>("…a differential test against a brute force, with a fixed seed so failures are reproducible.")</em>'],
  ['I', 'Còn nếu k bằng 0 hoặc lớn hơn độ dài mảng?'],
  ['C', 'Ràng buộc ghi 1 ≤ k ≤ n, em xin xác nhận là được đảm bảo. Nếu là dữ liệu người dùng nhập thì em kiểm ngay ở cửa vào và ném lỗi rõ ràng, chứ không trả về tổng của… không gì cả.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Practice problems — every one is an edge-case problem</h3>
${bangDe(DE, 'en')}
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Copy the buggy <code>maxWindow</code> into your language. On paper, trace <code>[1, 2, 3]</code>, k = 2 as a state table <em>before</em> running it. Say the "I found a bug" sentence out loud.</li>
<li>Write the six tests in <code>node:test</code> (or JUnit). Run them against the buggy version (expect exactly 2 red), fix, run again (6 green).</li>
<li>Write a differential harness for ${lc(704, 'binary-search', 'Binary Search', 'Easy')} against a linear scan, with Park–Miller seeds, n from 1 to 6. Plant a bug (<code>while (lo &lt; hi)</code> with a closed interval) and write down the first failing seed and the smallest failing input.</li>
<li>Submit ${lc(8, 'string-to-integer-atoi', 'String to Integer (atoi)', 'Medium')} after writing its test list first; count how many of your own tests the first submission would have failed.</li>
</ol>
<p><strong>Done when:</strong> one hand-written state table that shows the bug, a red-then-green test run, a harness that prints a failing seed for the planted bug and 0 failures after the fix, and LC 8 accepted.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">edge case</span><span class="v">An unusual input at the limits (empty, one element, last position, all negative, overflow) where careless code breaks.</span></div>
  <div class="kv"><span class="k">trace / dry run</span><span class="v">Running code by hand, writing the variables after every step.</span></div>
  <div class="kv"><span class="k">off-by-one error</span><span class="v">A loop or index that goes one step too far or stops one step too early.</span></div>
  <div class="kv"><span class="k">differential testing</span><span class="v">Comparing a fast implementation with a trusted slow one (the oracle) on many inputs.</span></div>
  <div class="kv"><span class="k">seed</span><span class="v">The starting value of a pseudo-random generator; the same seed gives the same inputs, so failures are reproducible.</span></div>
  <div class="kv"><span class="k">shrinking</span><span class="v">Reducing a failing input to the smallest one that still fails.</span></div>
  <div class="kv"><span class="k">unit test / assertion</span><span class="v">A small automatic check: call the code with a known input, assert the known output.</span></div>
  <div class="kv"><span class="k">fuzzing</span><span class="v">Throwing huge numbers of random or malformed inputs at a program to find crashes and vulnerabilities.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Close every solution with the five-minute routine: re-read, trace the example, two edge cases, fix out loud, restate the complexity.</li>
<li>The normal example often passes buggy code — the measured buggy loop returned the right 9.</li>
<li>Aim edge cases at your own loop bounds and initial values; pick them from the per-type checklist.</li>
<li>Name the last valid value before writing a loop condition (starts 0 … n − k ⇒ <code>&lt;=</code>).</li>
<li>With a computer, differential testing with small seeded random inputs finds off-by-ones in milliseconds (${LOI[1]} of ${LOI[2]} here, smallest failure has two elements).</li>
<li>At work, edge cases become unit tests (<code>node:test</code>, JUnit) that CI runs before every merge.</li>
</ul>
${nguon('📗', 'Node.js — Test runner (node:test)', 'The built-in test runner: test(), assertions, reporters such as TAP', 'https://nodejs.org/api/test.html')}
${nguon('📙', 'JUnit 5', 'The standard Java testing framework: @Test, assertEquals, display names', 'https://junit.org/junit5/')}
${nguon('🔐', 'OSS-Fuzz', 'Google’s continuous fuzzing for open source, launched after Heartbleed; the 10,000-vulnerability figure', 'https://google.github.io/oss-fuzz/')}
</div>
<div class="ml-vi">
<h3>Đề luyện — đề nào cũng là đề ca biên</h3>
${bangDe(DE, 'vi')}
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chép hàm <code>maxWindow</code> có lỗi sang ngôn ngữ của bạn. Trên giấy, chạy tay <code>[1, 2, 3]</code>, k = 2 thành bảng vết <em>trước khi</em> chạy máy. Nói to câu "I found a bug…".</li>
<li>Viết sáu test bằng <code>node:test</code> (hoặc JUnit). Chạy với bản lỗi (phải đỏ đúng 2), sửa, chạy lại (xanh cả 6).</li>
<li>Viết harness đối chiếu cho ${lc(704, 'binary-search', 'Binary Search', 'Easy')} với tìm tuyến tính, seed Park–Miller, n từ 1 tới 6. Cài một lỗi (<code>while (lo &lt; hi)</code> với khoảng đóng) rồi ghi lại seed hỏng đầu tiên và đầu vào hỏng nhỏ nhất.</li>
<li>Nộp ${lc(8, 'string-to-integer-atoi', 'String to Integer (atoi)', 'Medium')} sau khi viết danh sách test TRƯỚC; đếm xem lần nộp đầu tiên đã có thể trượt bao nhiêu test của chính bạn.</li>
</ol>
<p><strong>Đạt khi:</strong> có một bảng vết tự viết cho thấy lỗi, một lần chạy test đỏ rồi xanh, một harness in ra seed hỏng của lỗi cài sẵn và 0 lần hỏng sau khi sửa, và LC 8 Accepted.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">edge case (trường hợp biên / ca biên)</span><span class="v">Đầu vào bất thường ở rìa (rỗng, một phần tử, vị trí cuối, toàn âm, tràn số) nơi code cẩu thả vỡ.</span></div>
  <div class="kv"><span class="k">trace / dry run (chạy tay)</span><span class="v">Chạy code bằng tay, ghi giá trị các biến sau mỗi bước.</span></div>
  <div class="kv"><span class="k">off-by-one error (lỗi lệch một)</span><span class="v">Vòng lặp hay chỉ số đi quá một bước hoặc dừng sớm một bước.</span></div>
  <div class="kv"><span class="k">differential testing (kiểm thử đối chiếu)</span><span class="v">So một cài đặt nhanh với một cài đặt chậm đáng tin (trọng tài — oracle) trên nhiều đầu vào.</span></div>
  <div class="kv"><span class="k">seed (hạt giống)</span><span class="v">Giá trị khởi đầu của bộ sinh giả ngẫu nhiên; cùng seed cho cùng đầu vào, nên lỗi chạy lại được.</span></div>
  <div class="kv"><span class="k">shrinking (thu nhỏ)</span><span class="v">Rút một đầu vào hỏng về đầu vào nhỏ nhất vẫn còn hỏng.</span></div>
  <div class="kv"><span class="k">unit test / assertion (kiểm thử đơn vị / khẳng định)</span><span class="v">Phép kiểm tự động nhỏ: gọi code với đầu vào biết trước, khẳng định đầu ra biết trước.</span></div>
  <div class="kv"><span class="k">fuzzing (kiểm thử bằng dữ liệu bậy)</span><span class="v">Bắn lượng khổng lồ đầu vào ngẫu nhiên hoặc dị dạng vào chương trình để tìm chỗ sập và lỗ hổng.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Khép mọi lời giải bằng quy trình 5 phút: đọc lại, chạy tay ví dụ, hai ca biên, sửa thành tiếng, nhắc lại độ phức tạp.</li>
<li>Ví dụ thường hay để code lỗi lọt qua — vòng lặp lỗi đo được vẫn trả đúng 9.</li>
<li>Nhắm ca biên vào cận vòng lặp và giá trị khởi tạo của chính mình; chọn từ bảng kiểm theo kiểu dữ liệu.</li>
<li>Gọi tên giá trị hợp lệ cuối cùng trước khi viết điều kiện vòng lặp (điểm bắt đầu 0 … n − k ⇒ <code>&lt;=</code>).</li>
<li>Có máy trong tay thì kiểm thử đối chiếu với đầu vào ngẫu nhiên nhỏ có seed bắt lỗi lệch một trong vài mili-giây (ở đây ${LOI[1]}/${LOI[2]} ca hỏng, ca hỏng nhỏ nhất chỉ hai phần tử).</li>
<li>Khi đi làm, ca biên thành unit test (<code>node:test</code>, JUnit) mà CI chạy trước mỗi lần gộp code.</li>
</ul>
${nguon('📗', 'Node.js — Test runner (node:test)', 'Bộ chạy test có sẵn của Node: test(), assert, các reporter như TAP (tiếng Anh)', 'https://nodejs.org/api/test.html')}
${nguon('📙', 'JUnit 5', 'Khung test chuẩn của Java: @Test, assertEquals, tên hiển thị (tiếng Anh)', 'https://junit.org/junit5/')}
${nguon('🔐', 'OSS-Fuzz', 'Dịch vụ fuzzing liên tục của Google cho mã nguồn mở, ra đời sau Heartbleed; con số 10.000 lỗ hổng', 'https://google.github.io/oss-fuzz/')}
</div>
`,
};
