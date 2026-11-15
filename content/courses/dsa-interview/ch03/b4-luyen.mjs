/** 3.4 — Bộ luyện 3: 8 đề stack / queue / danh sách liên kết, có lời giải từng bước. Mã/output đọc từ ../ma/ch03 (chạy thật). */
import { maHai, ketQua, lc, nguon, gap, baiNay } from '../_chung.mjs';

const D = {
  l1: lc(1047, 'remove-all-adjacent-duplicates-in-string', 'Remove All Adjacent Duplicates In String', 'Easy'),
  l2: lc(234, 'palindrome-linked-list', 'Palindrome Linked List', 'Easy'),
  l3: lc(71, 'simplify-path', 'Simplify Path', 'Medium'),
  l4: lc(2, 'add-two-numbers', 'Add Two Numbers', 'Medium'),
  l5: lc(853, 'car-fleet', 'Car Fleet', 'Medium'),
  l6: lc(138, 'copy-list-with-random-pointer', 'Copy List with Random Pointer', 'Medium'),
  l7: lc(1438, 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit', 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit', 'Medium'),
  l8: lc(25, 'reverse-nodes-in-k-group', 'Reverse Nodes in k-Group', 'Hard'),
};

export default {
  title: '3.4 — Practice set 3: eight stack, queue and linked-list problems|||3.4 — Bộ luyện 3: tám đề stack, queue và danh sách liên kết',
  slug: 'dsa-3-4-luyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám đề từ dễ tới khó phủ cả chương — stack làm chuỗi kết quả, đường dẫn và path traversal, cộng số trên danh sách, car fleet, sao chép con trỏ ngẫu nhiên, hai deque đơn điệu, đảo theo nhóm k — mỗi đề có gợi ý gập và lời giải TS + Java chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Practice set 3: eight stack, queue and linked-list problems</h2>
<p class="lead">Eight problems, easy to hard, that mix the chapter's patterns on purpose — in a real interview nobody tells you "this is a monotonic deque problem". For each one: read the problem, decide the pattern <em>before</em> opening any hint, set a timer, and talk out loud as if someone were listening. Open the hints only when you are stuck for more than five minutes; open the solution only after you have submitted something.</p>
<table>
<thead><tr><th>#</th><th>Problem</th><th>Pattern</th><th>Target time</th></tr></thead>
<tbody>
<tr><td>1</td><td>${D.l1}</td><td>stack as the answer</td><td>15′</td></tr>
<tr><td>2</td><td>${D.l2}</td><td>middle + reverse + compare</td><td>15′</td></tr>
<tr><td>3</td><td>${D.l3}</td><td>stack of names</td><td>25′</td></tr>
<tr><td>4</td><td>${D.l4}</td><td>dummy node + carry</td><td>25′</td></tr>
<tr><td>5</td><td>${D.l5}</td><td>sort + monotonic stack</td><td>25′</td></tr>
<tr><td>6</td><td>${D.l6}</td><td>map old → new</td><td>25′</td></tr>
<tr><td>7</td><td>${D.l7}</td><td>sliding window + two monotonic deques</td><td>25′</td></tr>
<tr><td>8</td><td>${D.l8}</td><td>dummy + block reversal</td><td>40′</td></tr>
</tbody></table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read + restate</span><span class="lz-d">2 min, write the signature</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Name the pattern</span><span class="lz-d">before any hint</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Code, out loud</span><span class="lz-d">timer running</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Test edge cases</span><span class="lz-d">then submit on LeetCode</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Log it</span><span class="lz-d">signal → pattern → mistake</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Bộ luyện 3: tám đề stack, queue và danh sách liên kết</h2>
<p class="lead">Tám đề, từ dễ tới khó, cố ý trộn các mẫu của chương — khi phỏng vấn thật, không ai bảo bạn "đây là đề deque đơn điệu". Với mỗi đề: đọc đề, quyết định mẫu <em>trước khi</em> mở bất kỳ gợi ý nào, bấm giờ, và nói to như đang có người nghe. Chỉ mở gợi ý khi bí quá năm phút; chỉ mở lời giải sau khi bạn đã nộp một bản nào đó.</p>
<table>
<thead><tr><th>#</th><th>Đề</th><th>Mẫu</th><th>Thời gian mục tiêu</th></tr></thead>
<tbody>
<tr><td>1</td><td>${D.l1}</td><td>stack chính là đáp án</td><td>15′</td></tr>
<tr><td>2</td><td>${D.l2}</td><td>tìm giữa + đảo + so</td><td>15′</td></tr>
<tr><td>3</td><td>${D.l3}</td><td>stack các tên thư mục</td><td>25′</td></tr>
<tr><td>4</td><td>${D.l4}</td><td>nút giả + số nhớ</td><td>25′</td></tr>
<tr><td>5</td><td>${D.l5}</td><td>sắp xếp + monotonic stack</td><td>25′</td></tr>
<tr><td>6</td><td>${D.l6}</td><td>map cũ → mới</td><td>25′</td></tr>
<tr><td>7</td><td>${D.l7}</td><td>cửa sổ trượt + hai deque đơn điệu</td><td>25′</td></tr>
<tr><td>8</td><td>${D.l8}</td><td>nút giả + đảo từng khối</td><td>40′</td></tr>
</tbody></table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc + diễn đạt lại</span><span class="lz-d">2 phút, viết chữ ký hàm</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Gọi tên mẫu</span><span class="lz-d">trước mọi gợi ý</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Code, nói to</span><span class="lz-d">đồng hồ đang chạy</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Test ca biên</span><span class="lz-d">rồi nộp LeetCode</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Ghi sổ</span><span class="lz-d">dấu hiệu → mẫu → lỗi đã mắc</span></div>
</div>
<p>Khung 6 bước cho mọi đề ở <a href="${baiNay('dsa-0-2-khung')}">bài 0.2</a>; ôn lại mẫu nào thì về <a href="${baiNay('dsa-3-1-stack')}">3.1 stack</a>, <a href="${baiNay('dsa-3-2-queue')}">3.2 queue</a>, <a href="${baiNay('dsa-3-3-linked-list')}">3.3 danh sách liên kết</a>.</p>
</div>

<div class="ml-en">
<h3>1. ${D.l1}</h3>
<p><strong>Problem.</strong> Repeatedly delete two adjacent equal letters until none are left; return the final string (it is unique). <code>"abbaca"</code> → delete "bb" → <code>"aaca"</code> → delete "aa" → <code>"ca"</code>.</p>
<p><strong>Recognising the pattern.</strong> A deletion can create a new adjacent pair from letters that were not neighbours before ("abba"). "The letter just before me, after all earlier deletions" is the top of a stack.</p>
${gap('💡 Hint 1', '<p>Simulating "find a pair, delete it, start again" is O(n²). Can you process each letter once, left to right?</p>')}
${gap('💡 Hint 2', '<p>Keep the letters that survived so far. When the next letter equals the last survivor, both vanish.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> The stack holds the current result. For each letter: if it equals the top, pop (the pair cancels); otherwise push. At the end, the stack read bottom to top is the answer. <strong>Complexity:</strong> O(n) time, O(n) space. In Java a <code>StringBuilder</code> is the stack: <code>append</code> = push, <code>deleteCharAt(len − 1)</code> = pop. <strong>Edge cases tried:</strong> "aaaa" → "" (pairs cancel completely), "aaa" → "a" (an odd run leaves one), "abc" → unchanged.</p>')}
</div>
<div class="ml-vi">
<h3>1. ${D.l1}</h3>
<p><strong>Đề.</strong> Lặp lại việc xoá hai chữ cái liền kề giống nhau cho tới khi không còn cặp nào; trả về chuỗi cuối cùng (nó là duy nhất). <code>"abbaca"</code> → xoá "bb" → <code>"aaca"</code> → xoá "aa" → <code>"ca"</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Một lần xoá có thể tạo ra cặp liền kề mới từ hai chữ trước đó không đứng cạnh nhau ("abba"). "Chữ đứng ngay trước tôi, sau mọi lần xoá trước đó" chính là đỉnh của một stack.</p>
${gap('💡 Gợi ý 1', '<p>Mô phỏng "tìm một cặp, xoá, làm lại từ đầu" là O(n²). Có thể xử lý mỗi chữ đúng một lần, từ trái sang phải không?</p>')}
${gap('💡 Gợi ý 2', '<p>Giữ lại các chữ đã sống sót tới giờ. Khi chữ tiếp theo bằng chữ sống sót cuối cùng, cả hai cùng biến mất.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Stack chứa kết quả hiện tại. Với mỗi chữ: bằng đỉnh thì pop (cặp triệt tiêu); không thì push. Cuối cùng, đọc stack từ đáy lên đỉnh là đáp án. <strong>Độ phức tạp:</strong> O(n) thời gian, O(n) bộ nhớ. Trong Java một <code>StringBuilder</code> chính là stack: <code>append</code> = push, <code>deleteCharAt(len − 1)</code> = pop. <strong>Ca biên đã thử:</strong> "aaaa" → "" (các cặp triệt tiêu hết), "aaa" → "a" (dãy lẻ còn lại một chữ), "abc" → giữ nguyên.</p>')}
</div>
${maHai('ch03/l1-remove-adjacent.ts', 'ch03/L1RemoveAdjacent.java', { vung: 'giai' })}
${ketQua('ch03/l1-remove-adjacent.ts')}

<div class="ml-en">
<h3>2. ${D.l2}</h3>
<p><strong>Problem.</strong> Is a singly linked list a palindrome (reads the same both ways)? <code>1→2→2→1</code> yes, <code>1→2</code> no. Follow-up: O(n) time and O(1) extra memory.</p>
<p><strong>Recognising the pattern.</strong> Comparing first with last needs to walk backwards, which a singly linked list cannot do — unless you reverse the second half. That is two moves from this chapter and lesson 2.3: find the middle, reverse.</p>
${gap('💡 Hint 1', '<p>The easy version copies the values into an array and uses two pointers: O(n) memory. Which half would you need to walk backwards?</p>')}
${gap('💡 Hint 2', '<p>Fast/slow pointers stop <code>slow</code> at the end of the first half. Reverse everything after it, then walk both halves together.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> (1) <code>while (fast.next &amp;&amp; fast.next.next)</code> stops slow at the end of the first half (for odd length, the middle node belongs to the first half and is never compared — correct, it equals itself). (2) Reverse <code>slow.next</code>. (3) Compare the second half against the head node by node; the second half is shorter or equal, so loop on it. (4) <strong>Reverse it back</strong> and reattach — the function should not leave the caller’s list mutated; the output shows each list is intact after the check. <strong>Complexity:</strong> O(n) time, O(1) space. <strong>Edge cases tried:</strong> odd length (1→2→3→2→1), length 2 (1→2), a single node.</p>')}
</div>
<div class="ml-vi">
<h3>2. ${D.l2}</h3>
<p><strong>Đề.</strong> Một danh sách liên kết đơn có phải palindrome (đọc xuôi ngược như nhau) không? <code>1→2→2→1</code> có, <code>1→2</code> không. Câu nối tiếp: O(n) thời gian và O(1) bộ nhớ phụ.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> So phần tử đầu với phần tử cuối cần đi lùi, mà danh sách đơn thì không đi lùi được — trừ khi bạn đảo nửa sau. Đó là hai nước của chương này và bài 2.3: tìm giữa, đảo.</p>
${gap('💡 Gợi ý 1', '<p>Bản dễ là chép giá trị ra mảng rồi dùng hai con trỏ: O(n) bộ nhớ. Bạn cần đi lùi trên nửa nào?</p>')}
${gap('💡 Gợi ý 2', '<p>Con trỏ nhanh/chậm cho <code>slow</code> dừng ở cuối nửa đầu. Đảo mọi thứ sau nó, rồi đi song song hai nửa.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> (1) <code>while (fast.next &amp;&amp; fast.next.next)</code> cho slow dừng ở cuối nửa đầu (độ dài lẻ thì nút giữa thuộc nửa đầu và không bao giờ bị so — đúng, nó bằng chính nó). (2) Đảo <code>slow.next</code>. (3) So nửa sau với head từng nút; nửa sau ngắn hơn hoặc bằng, nên lặp theo nó. (4) <strong>Đảo trả lại</strong> và nối vào — hàm không nên để danh sách của người gọi bị biến dạng; output cho thấy mỗi danh sách còn nguyên sau khi kiểm. <strong>Độ phức tạp:</strong> O(n) thời gian, O(1) bộ nhớ. <strong>Ca biên đã thử:</strong> độ dài lẻ (1→2→3→2→1), độ dài 2 (1→2), một nút.</p>')}
</div>
${maHai('ch03/l2-palindrome-list.ts', 'ch03/L2PalindromeList.java', { vung: 'giai' })}
${ketQua('ch03/l2-palindrome-list.ts')}

<div class="ml-en">
<h3>3. ${D.l3}</h3>
<p><strong>Problem.</strong> Turn an absolute Unix path into its canonical form: <code>.</code> means "this folder", <code>..</code> means "the parent", several slashes count as one, no trailing slash, and <code>...</code> is an ordinary name. <code>"/a/./b/../../c/"</code> → <code>"/c"</code>.</p>
<p><strong>Recognising the pattern.</strong> <code>..</code> undoes the most recent folder you entered — "most recent" again means a stack.</p>
${gap('💡 Hint 1', '<p>Split on "/" and look at the pieces one by one. Which pieces change nothing?</p>')}
${gap('💡 Hint 2', '<p>Empty pieces and "." are skipped; ".." pops (if anything is there); every other piece is pushed. Join with "/" at the end.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Splitting <code>"/home//foo/"</code> gives <code>["", "home", "", "foo", ""]</code> — the empty strings are exactly the repeated and trailing slashes, so skipping them handles both. ".." on an empty stack does nothing: you cannot go above the root. <strong>Complexity:</strong> O(n) time and space. In Java, use the deque from the left end (<code>offerLast</code>/<code>pollLast</code>) so <code>String.join</code> keeps the folders in order — with <code>push</code> they would come out reversed (the trap from lesson 3.1). <strong>Edge cases tried:</strong> "/../" → "/", "/.../a/../b" → "/.../b".</p>')}
</div>
<div class="ml-vi">
<h3>3. ${D.l3}</h3>
<p><strong>Đề.</strong> Đưa một đường dẫn Unix tuyệt đối về dạng chuẩn: <code>.</code> nghĩa là "thư mục này", <code>..</code> nghĩa là "thư mục cha", nhiều dấu gạch chéo liền nhau tính là một, không có gạch chéo ở cuối, và <code>...</code> là một cái tên bình thường. <code>"/a/./b/../../c/"</code> → <code>"/c"</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> <code>..</code> hoàn tác thư mục bạn VỪA vào gần nhất — "gần nhất" lần nữa nghĩa là stack.</p>
${gap('💡 Gợi ý 1', '<p>Tách theo "/" và xem từng mảnh. Mảnh nào không làm thay đổi gì?</p>')}
${gap('💡 Gợi ý 2', '<p>Mảnh rỗng và "." thì bỏ qua; ".." thì pop (nếu còn gì để pop); mọi mảnh khác thì push. Cuối cùng nối bằng "/".</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Tách <code>"/home//foo/"</code> được <code>["", "home", "", "foo", ""]</code> — các chuỗi rỗng chính là các gạch chéo lặp và gạch chéo cuối, nên bỏ qua chúng là xử lý được cả hai. ".." trên stack rỗng thì không làm gì: không thể đi cao hơn thư mục gốc. <strong>Độ phức tạp:</strong> O(n) thời gian và bộ nhớ. Trong Java, dùng deque từ đầu bên trái (<code>offerLast</code>/<code>pollLast</code>) để <code>String.join</code> giữ đúng thứ tự thư mục — dùng <code>push</code> thì chúng ra ngược (cái bẫy ở bài 3.1). <strong>Ca biên đã thử:</strong> "/../" → "/", "/.../a/../b" → "/.../b".</p>')}
</div>
${maHai('ch03/l3-simplify-path.ts', 'ch03/L3SimplifyPath.java', { vung: 'giai' })}
${ketQua('ch03/l3-simplify-path.ts')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap (and an attack) — normalising is not the same as being safe.</strong></p><p>Look at the last line: <code>/uploads/../../etc/passwd</code> normalises to <code>/etc/passwd</code>. That is <strong>path traversal</strong>, one of the oldest web attacks: a server that serves files from <code>uploads/</code> by joining a user-supplied name ends up reading the system's password file. Normalising the path is step one; step two is checking that the result still starts with the allowed folder (in Node: <code>path.resolve(root, name)</code> then <code>startsWith(root + path.sep)</code>), or better, never building file paths from user input at all — this website stores uploads under generated keys in object storage for exactly that reason.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy (và một kiểu tấn công) — chuẩn hoá không có nghĩa là an toàn.</strong></p><p>Nhìn dòng cuối: <code>/uploads/../../etc/passwd</code> chuẩn hoá thành <code>/etc/passwd</code>. Đó là <strong>path traversal</strong> (duyệt ngược thư mục), một trong những kiểu tấn công web lâu đời nhất: máy chủ phục vụ tệp từ <code>uploads/</code> bằng cách nối tên tệp người dùng gửi lên, cuối cùng lại đọc tệp mật khẩu của hệ thống. Chuẩn hoá đường dẫn là bước một; bước hai là kiểm kết quả vẫn bắt đầu bằng thư mục được phép (trong Node: <code>path.resolve(root, name)</code> rồi <code>startsWith(root + path.sep)</code>), hoặc tốt hơn, đừng bao giờ dựng đường dẫn tệp từ dữ liệu người dùng — trang này lưu tệp tải lên dưới các khoá tự sinh trong kho đối tượng chính vì lý do đó.</p></div>
</div>

<div class="ml-en">
<h3>4. ${D.l4}</h3>
<p><strong>Problem.</strong> Two non-negative integers are stored as linked lists of digits in <em>reverse</em> order (<code>2→4→3</code> is 342). Return their sum in the same format: 342 + 465 = 807 → <code>7→0→8</code>.</p>
<p><strong>Recognising the pattern.</strong> Reverse order means the ones digit comes first — exactly the order of grade-school addition. You build a new list whose head is unknown until the first digit is computed: a dummy node.</p>
${gap('💡 Hint 1', '<p>Converting to numbers fails: the lists can have 100 digits, far beyond a 64-bit integer (and beyond exact JavaScript numbers at 2⁵³).</p>')}
${gap('💡 Hint 2', '<p>Add digit by digit with a carry. When should the loop stop? Think about 5 + 5.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Loop <code>while (a || b || carry)</code>: a missing digit counts as 0, the new digit is <code>sum % 10</code>, the carry is <code>sum / 10</code> (integer). The <code>|| carry</code> is what produces the extra node in 5 + 5 = 10 → <code>0→1</code>, and the lists of different lengths (9999999 + 9999) are handled because each side is advanced only if it exists. <strong>Complexity:</strong> O(max(m, n)) time, O(1) extra besides the output. <strong>Edge cases tried:</strong> 0 + 0, different lengths with a long carry chain, a final carry.</p>')}
</div>
<div class="ml-vi">
<h3>4. ${D.l4}</h3>
<p><strong>Đề.</strong> Hai số nguyên không âm được lưu thành danh sách liên kết các chữ số theo thứ tự <em>ngược</em> (<code>2→4→3</code> là 342). Trả về tổng của chúng theo cùng định dạng: 342 + 465 = 807 → <code>7→0→8</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Thứ tự ngược nghĩa là chữ số hàng đơn vị đứng đầu — đúng thứ tự cộng tay ở tiểu học. Bạn dựng một danh sách mới mà head chưa biết cho tới khi tính xong chữ số đầu: nút giả.</p>
${gap('💡 Gợi ý 1', '<p>Đổi ra số rồi cộng sẽ hỏng: danh sách có thể dài 100 chữ số, vượt xa số nguyên 64-bit (và vượt giới hạn số chính xác 2⁵³ của JavaScript).</p>')}
${gap('💡 Gợi ý 2', '<p>Cộng từng chữ số kèm số nhớ. Vòng lặp nên dừng khi nào? Nghĩ tới 5 + 5.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Lặp <code>while (a || b || carry)</code>: chữ số thiếu tính là 0, chữ số mới là <code>sum % 10</code>, số nhớ là <code>sum / 10</code> (chia nguyên). Phần <code>|| carry</code> chính là thứ sinh thêm nút trong 5 + 5 = 10 → <code>0→1</code>, còn hai danh sách dài khác nhau (9999999 + 9999) được xử lý vì mỗi bên chỉ bước tiếp khi còn tồn tại. <strong>Độ phức tạp:</strong> O(max(m, n)) thời gian, O(1) bộ nhớ phụ ngoài phần kết quả. <strong>Ca biên đã thử:</strong> 0 + 0, độ dài khác nhau kèm chuỗi nhớ dài, số nhớ ở cuối.</p>')}
</div>
${maHai('ch03/l5-add-two.ts', 'ch03/L5AddTwo.java', { vung: 'giai' })}
${ketQua('ch03/l5-add-two.ts')}

<div class="ml-en">
<h3>5. ${D.l5}</h3>
<p><strong>Problem.</strong> Cars on a one-lane road drive toward <code>target</code>; car i starts at <code>position[i]</code> with <code>speed[i]</code>. A car cannot pass the one ahead: when it catches up, they drive together as one <em>fleet</em> at the slower speed. How many fleets arrive? Example: target 12, positions [10, 8, 0, 5, 3], speeds [2, 4, 1, 1, 3] → 3.</p>
<p><strong>Recognising the pattern.</strong> What matters for each car is its arrival time if it drove alone, <code>(target − position) / speed</code>. Process cars from the one closest to the target backwards: a car that would arrive no later than the fleet in front of it joins that fleet. "Compare with the fleet just ahead" = the top of a stack of arrival times, kept strictly increasing.</p>
${gap('💡 Hint 1', '<p>Simulating time step by step is slow and full of floating-point traps. What single number per car decides whether it catches the car ahead?</p>')}
${gap('💡 Hint 2', '<p>Sort by position, closest to the target first. Walk the cars and keep only the arrival time of the last fleet.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> In the example the times are: position 10 → 1, 8 → 1, 5 → 7, 3 → 3, 0 → 12. Closest first: 1 (new fleet), 1 (≤ 1, joins), 7 (new fleet), 3 (≤ 7, joins), 12 (new fleet) → 3 fleets. Because only the top of the stack is ever compared, the Java version keeps just <code>lastTime</code> and a counter — a monotonic stack that degenerated into one variable. <strong>Complexity:</strong> O(n log n) for the sort, O(n) for the scan. In Java the comparator is <code>Double.compare</code>, never <code>(int) (b − a)</code> on doubles (it truncates 0.5 to 0 and calls them equal). <strong>Edge cases tried:</strong> a single car; all cars merging into one fleet; a car that catches up exactly at the target (counts as the same fleet — hence ≤).</p>')}
</div>
<div class="ml-vi">
<h3>5. ${D.l5}</h3>
<p><strong>Đề.</strong> Các ô tô trên đường một làn chạy về <code>target</code>; xe i xuất phát ở <code>position[i]</code> với vận tốc <code>speed[i]</code>. Xe không được vượt xe phía trước: khi đuổi kịp, chúng chạy chung thành một <em>đoàn</em> (fleet) với vận tốc của xe chậm hơn. Có bao nhiêu đoàn về đích? Ví dụ: target 12, vị trí [10, 8, 0, 5, 3], vận tốc [2, 4, 1, 1, 3] → 3.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Thứ quan trọng với mỗi xe là thời điểm nó về đích nếu chạy một mình, <code>(target − position) / speed</code>. Xét các xe từ chiếc gần đích nhất lùi về sau: xe nào về không muộn hơn đoàn phía trước nó thì nhập vào đoàn đó. "So với đoàn ngay phía trước" = đỉnh của một stack các thời điểm về đích, giữ tăng hẳn.</p>
${gap('💡 Gợi ý 1', '<p>Mô phỏng theo từng bước thời gian thì chậm và đầy bẫy số thực. Con số DUY NHẤT nào của mỗi xe quyết định nó có đuổi kịp xe trước không?</p>')}
${gap('💡 Gợi ý 2', '<p>Sắp xếp theo vị trí, xe gần đích nhất trước. Đi qua các xe và chỉ giữ thời điểm về đích của đoàn cuối cùng.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Trong ví dụ, thời gian là: vị trí 10 → 1, 8 → 1, 5 → 7, 3 → 3, 0 → 12. Gần đích trước: 1 (đoàn mới), 1 (≤ 1, nhập đoàn), 7 (đoàn mới), 3 (≤ 7, nhập đoàn), 12 (đoàn mới) → 3 đoàn. Vì chỉ bao giờ so với đỉnh stack, bản Java chỉ giữ <code>lastTime</code> và một biến đếm — một monotonic stack đã thoái hoá thành một biến. <strong>Độ phức tạp:</strong> O(n log n) cho sắp xếp, O(n) cho lượt quét. Trong Java comparator là <code>Double.compare</code>, đừng bao giờ <code>(int) (b − a)</code> trên số thực (nó cắt 0,5 thành 0 và coi là bằng nhau). <strong>Ca biên đã thử:</strong> một xe; mọi xe nhập thành một đoàn; xe đuổi kịp đúng tại đích (tính là cùng đoàn — vì thế mới là ≤).</p>')}
</div>
${maHai('ch03/l4-car-fleet.ts', 'ch03/L4CarFleet.java', { vung: 'giai' })}
${ketQua('ch03/l4-car-fleet.ts')}

<div class="ml-en">
<h3>6. ${D.l6}</h3>
<p><strong>Problem.</strong> Each node has <code>next</code> and also <code>random</code>, which points to any node of the list or to null. Return a <strong>deep copy</strong>: brand-new nodes whose <code>next</code> and <code>random</code> point to new nodes only.</p>
<p><strong>Recognising the pattern.</strong> When you copy node A, its <code>random</code> may point to a node you have not copied yet. You need "for this old node, where is its copy?" — a hash map, the tool of lesson 1.1, applied to node identities.</p>
${gap('💡 Hint 1', '<p>Do it in two passes. What can you create in the first pass without knowing any pointers?</p>')}
${gap('💡 Hint 2', '<p>Pass 1: a map old node → new node with the same value. Pass 2: copy.next = map(old.next), copy.random = map(old.random).</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> After pass 1 every copy exists, so pass 2 can wire any pointer, forwards or backwards. The program prints the structure of both lists as [value, index of random] and then checks that <em>no</em> pointer of the copy leads back into the original — the bug that a shallow copy (<code>c.random = p.random</code>) would have. <strong>Complexity:</strong> O(n) time, O(n) map. Follow-up for O(1) extra: interleave copies (A→A′→B→B′…), set <code>A′.random = A.random.next</code>, then unzip the two lists. In Java, <code>map.get(null)</code> returns null, so the null pointers need no special case; and a map keyed by nodes relies on identity, which is correct because the node class does not override <code>equals</code>. <strong>Edge cases tried:</strong> random pointing backwards, forwards, to the head, and to null.</p>')}
</div>
<div class="ml-vi">
<h3>6. ${D.l6}</h3>
<p><strong>Đề.</strong> Mỗi nút có <code>next</code> và thêm <code>random</code>, trỏ tới một nút bất kỳ của danh sách hoặc null. Trả về một <strong>bản sao sâu</strong> (deep copy): các nút hoàn toàn mới mà <code>next</code> và <code>random</code> chỉ trỏ tới nút mới.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Khi chép nút A, <code>random</code> của nó có thể trỏ tới một nút bạn chưa chép. Bạn cần câu trả lời cho "nút cũ này thì bản sao của nó ở đâu?" — một hash map, công cụ của bài 1.1, áp lên danh tính của các nút.</p>
${gap('💡 Gợi ý 1', '<p>Làm hai lượt. Lượt đầu tạo được gì mà không cần biết con trỏ nào?</p>')}
${gap('💡 Gợi ý 2', '<p>Lượt 1: map nút cũ → nút mới cùng giá trị. Lượt 2: copy.next = map(old.next), copy.random = map(old.random).</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Sau lượt 1 mọi bản sao đã tồn tại, nên lượt 2 nối được bất kỳ con trỏ nào, xuôi hay ngược. Chương trình in cấu trúc của cả hai danh sách dạng [giá trị, chỉ số của random] rồi kiểm rằng <em>không</em> con trỏ nào của bản sao dẫn ngược về bản gốc — lỗi mà một bản sao nông (<code>c.random = p.random</code>) sẽ mắc. <strong>Độ phức tạp:</strong> O(n) thời gian, O(n) cho map. Câu nối tiếp để chỉ tốn O(1): chèn bản sao xen kẽ (A→A′→B→B′…), gán <code>A′.random = A.random.next</code>, rồi tách hai danh sách ra. Trong Java, <code>map.get(null)</code> trả null nên các con trỏ null không cần xử lý riêng; và map dùng nút làm khoá dựa vào danh tính (identity), đúng vì lớp nút không ghi đè <code>equals</code>. <strong>Ca biên đã thử:</strong> random trỏ lùi, trỏ tới, trỏ về head, và trỏ null.</p>')}
</div>
${maHai('ch03/l7-copy-random.ts', 'ch03/L7CopyRandom.java', { vung: 'giai' })}
${ketQua('ch03/l7-copy-random.ts')}

<div class="ml-en">
<h3>7. ${D.l7}</h3>
<p><strong>Problem.</strong> Find the length of the longest contiguous subarray in which the difference between any two elements is at most <code>limit</code>. <code>[10, 1, 2, 4, 7, 2]</code>, limit 5 → 4 (the subarray <code>[2, 4, 7, 2]</code>, max − min = 5).</p>
<p><strong>Recognising the pattern.</strong> "Longest contiguous subarray satisfying a condition that gets worse as it grows" is the variable sliding window of lesson 2.2. The condition is <code>max − min ≤ limit</code>, so you need the window max and the window min at every step — two monotonic deques from lesson 3.2.</p>
${gap('💡 Hint 1', '<p>Extend the right end one step at a time. When the window becomes invalid, move the left end. What do you need to know about the window to test validity in O(1)?</p>')}
${gap('💡 Hint 2', '<p>A decreasing deque gives the max at its front; an increasing deque gives the min. When the left element leaves, remove it from a deque only if it is that deque’s front.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> For each right end r: push <code>nums[r]</code> into both deques (popping smaller values from the back of the max-deque and larger values from the back of the min-deque); while <code>front(max) − front(min) &gt; limit</code>, the left element leaves — if it equals a front, drop that front — and <code>left++</code>; record <code>r − left + 1</code>. Storing <em>values</em> works here because we compare the leaving value with the front, and equal values are kept (pop only strictly smaller/larger). <strong>Complexity:</strong> O(n) time (each value enters and leaves each deque once), O(n) space. Java detail: <code>mx.peekFirst() == nums[left]</code> compares <code>Integer</code> with <code>int</code>, which unboxes and is safe — two <code>Integer</code>s with <code>==</code> would be the trap of lesson 1.1. <strong>Edge cases tried:</strong> limit 0 (only equal runs, answer 3), a window that must shrink by several steps at once.</p>')}
</div>
<div class="ml-vi">
<h3>7. ${D.l7}</h3>
<p><strong>Đề.</strong> Tìm độ dài đoạn con liên tiếp dài nhất mà hiệu giữa hai phần tử bất kỳ không vượt quá <code>limit</code>. <code>[10, 1, 2, 4, 7, 2]</code>, limit 5 → 4 (đoạn <code>[2, 4, 7, 2]</code>, max − min = 5).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Đoạn con liên tiếp dài nhất thoả một điều kiện càng dài càng khó thoả" là cửa sổ trượt co giãn của bài 2.2. Điều kiện là <code>max − min ≤ limit</code>, nên ở mỗi bước cần biết max và min của cửa sổ — hai deque đơn điệu của bài 3.2.</p>
${gap('💡 Gợi ý 1', '<p>Mở rộng đầu phải từng bước. Khi cửa sổ hết hợp lệ, dời đầu trái. Cần biết gì về cửa sổ để kiểm hợp lệ trong O(1)?</p>')}
${gap('💡 Gợi ý 2', '<p>Deque giảm dần cho max ở đầu; deque tăng dần cho min. Khi phần tử bên trái rời đi, chỉ gỡ nó khỏi deque nếu nó đang là đầu của deque đó.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Với mỗi đầu phải r: đưa <code>nums[r]</code> vào cả hai deque (pop các giá trị nhỏ hơn khỏi cuối deque max và các giá trị lớn hơn khỏi cuối deque min); chừng nào <code>đầu(max) − đầu(min) &gt; limit</code> thì phần tử bên trái rời đi — nếu nó bằng đầu deque nào thì bỏ đầu đó — và <code>left++</code>; ghi nhận <code>r − left + 1</code>. Lưu <em>giá trị</em> ở đây vẫn đúng vì ta so giá trị rời đi với đầu deque, và các giá trị bằng nhau được giữ lại (chỉ pop khi nhỏ/lớn hơn hẳn). <strong>Độ phức tạp:</strong> O(n) thời gian (mỗi giá trị vào và ra mỗi deque một lần), O(n) bộ nhớ. Chi tiết Java: <code>mx.peekFirst() == nums[left]</code> so <code>Integer</code> với <code>int</code>, sẽ mở hộp nên an toàn — hai <code>Integer</code> so bằng <code>==</code> mới là cái bẫy của bài 1.1. <strong>Ca biên đã thử:</strong> limit 0 (chỉ các dãy bằng nhau, đáp án 3), cửa sổ phải co nhiều bước một lúc.</p>')}
</div>
${maHai('ch03/l6-longest-limit.ts', 'ch03/L6LongestLimit.java', { vung: 'giai' })}
${ketQua('ch03/l6-longest-limit.ts')}

<div class="ml-en">
<h3>8. ${D.l8}</h3>
<p><strong>Problem.</strong> Reverse the nodes of a linked list k at a time; if the last group has fewer than k nodes, leave it as it is. <code>1→2→3→4→5</code>, k = 2 → <code>2→1→4→3→5</code>; k = 3 → <code>3→2→1→4→5</code>. Only pointers may change, O(1) extra memory.</p>
<p><strong>Recognising the pattern.</strong> It is lesson 3.3's reversal applied block by block, plus reconnecting each block to what is before and after it. The head changes ⇒ dummy node.</p>
${gap('💡 Hint 1', '<p>Keep a pointer <code>before</code> to the node just before the current block (start: the dummy). How do you know a full block of k exists?</p>')}
${gap('💡 Hint 2', '<p>Walk k steps from <code>before</code> to find <code>kth</code>; if you fall off, stop. Reverse the block with <code>prev</code> starting at <code>kth.next</code> (not null) so the block’s new tail already points to the next block.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> For each block: (1) find <code>kth</code>, or stop; (2) remember <code>after = kth.next</code> and <code>first = before.next</code>; (3) reverse the block, with <code>prev</code> initialised to <code>after</code> — this one choice connects the block’s new tail to the rest of the list for free; (4) <code>before.next = kth</code> (the new head of the block), and <code>before = first</code> (the old first is now the block’s tail, i.e. the node before the next block). Draw two blocks on paper before coding; nearly every bug here is a pointer assigned one step too early. <strong>Complexity:</strong> O(n) time — each node is visited twice (counting, reversing) — and O(1) space. <strong>Edge cases tried:</strong> k = 1 (unchanged), a length that is a multiple of k (no tail left), a short tail (left as is).</p>')}
</div>
<div class="ml-vi">
<h3>8. ${D.l8}</h3>
<p><strong>Đề.</strong> Đảo các nút của danh sách liên kết theo từng nhóm k; nếu nhóm cuối có ít hơn k nút thì để nguyên. <code>1→2→3→4→5</code>, k = 2 → <code>2→1→4→3→5</code>; k = 3 → <code>3→2→1→4→5</code>. Chỉ được đổi con trỏ, bộ nhớ phụ O(1).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Đó là phép đảo của bài 3.3 áp từng khối, cộng việc nối mỗi khối với phần đứng trước và sau nó. Head thay đổi ⇒ nút giả.</p>
${gap('💡 Gợi ý 1', '<p>Giữ một con trỏ <code>before</code> tới nút ngay trước khối hiện tại (ban đầu: nút giả). Làm sao biết còn đủ một khối k nút?</p>')}
${gap('💡 Gợi ý 2', '<p>Đi k bước từ <code>before</code> để tìm <code>kth</code>; rơi khỏi cuối thì dừng. Đảo khối với <code>prev</code> khởi tạo bằng <code>kth.next</code> (không phải null) để đuôi mới của khối đã trỏ sẵn tới khối kế tiếp.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Với mỗi khối: (1) tìm <code>kth</code>, không có thì dừng; (2) nhớ <code>after = kth.next</code> và <code>first = before.next</code>; (3) đảo khối, với <code>prev</code> khởi tạo bằng <code>after</code> — chỉ một lựa chọn này đã nối đuôi mới của khối với phần còn lại mà không tốn thêm dòng nào; (4) <code>before.next = kth</code> (head mới của khối), và <code>before = first</code> (nút đầu cũ giờ là đuôi của khối, tức nút đứng trước khối sau). Vẽ hai khối ra giấy trước khi code; gần như mọi lỗi ở đây là một con trỏ được gán sớm một bước. <strong>Độ phức tạp:</strong> O(n) thời gian — mỗi nút được ghé hai lần (đếm, đảo) — và O(1) bộ nhớ. <strong>Ca biên đã thử:</strong> k = 1 (giữ nguyên), độ dài là bội của k (không còn đuôi), đuôi ngắn (để nguyên).</p>')}
</div>
${maHai('ch03/l8-reverse-k.ts', 'ch03/L8ReverseK.java', { vung: 'giai' })}
${ketQua('ch03/l8-reverse-k.ts')}

<div class="ml-en">
<h3>🧪 Practice (60–90 min, split over two days)</h3>
<div class="callout ok"><ol>
<li>Day 1: problems 1–4 with a timer, talking out loud. Submit each on LeetCode before opening its solution.</li>
<li>Day 2: problems 5–8. For 8, draw the pointers of two blocks on paper first and photograph the drawing into your notebook.</li>
<li>For every problem, write one line: <em>signal → pattern → the mistake I made (or almost made)</em>.</li>
<li>Three days later, redo the two problems that took you the longest, without notes.</li>
</ol>
<p><strong>Done when:</strong> eight accepted submissions, eight notebook lines, and the two redone problems solved within their target time.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">canonical path</span><span class="v">A path with no ".", "..", repeated or trailing slashes.</span></div>
  <div class="kv"><span class="k">path traversal</span><span class="v">Using ".." in user input to reach files outside the allowed folder.</span></div>
  <div class="kv"><span class="k">carry</span><span class="v">The digit moved to the next position in addition.</span></div>
  <div class="kv"><span class="k">fleet</span><span class="v">Cars that drive together because the faster one caught up.</span></div>
  <div class="kv"><span class="k">deep copy / shallow copy</span><span class="v">New objects all the way down / new outer object sharing inner references.</span></div>
  <div class="kv"><span class="k">object identity</span><span class="v">Comparing references, not contents — what a map keyed by nodes uses.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>"Undo the most recent" in any disguise (adjacent pairs, "..") is a stack.</li>
<li>Arrival-time thinking turns a simulation into sort + monotonic stack.</li>
<li>Pointer-copy problems need a map from old identity to new object.</li>
<li>Window max/min problems combine Chapter 2's window with 3.2's deques.</li>
<li>Hard list problems are block-by-block versions of the easy reversal, plus a dummy node.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Linked List &amp; Stack', 'The standard practice order; compare it with the order of this set', 'https://neetcode.io/roadmap')}
${nguon('🔐', 'OWASP — Path Traversal', 'How the attack works and how to defend against it', 'https://owasp.org/www-community/attacks/Path_Traversal')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (60–90 phút, chia hai ngày)</h3>
<div class="callout ok"><ol>
<li>Ngày 1: đề 1–4, bấm giờ, nói to. Nộp từng đề lên LeetCode trước khi mở lời giải của nó.</li>
<li>Ngày 2: đề 5–8. Với đề 8, vẽ con trỏ của hai khối ra giấy trước rồi chụp hình vẽ vào sổ.</li>
<li>Mỗi đề ghi một dòng: <em>dấu hiệu → mẫu → lỗi tôi đã mắc (hoặc suýt mắc)</em>.</li>
<li>Ba ngày sau, làm lại hai đề tốn thời gian nhất, không nhìn ghi chú.</li>
</ol>
<p><strong>Đạt khi:</strong> tám lượt nộp Accepted, tám dòng trong sổ, và hai đề làm lại xong trong thời gian mục tiêu.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">canonical path (đường dẫn chuẩn)</span><span class="v">Đường dẫn không còn ".", "..", gạch chéo lặp hay gạch chéo cuối.</span></div>
  <div class="kv"><span class="k">path traversal (duyệt ngược thư mục)</span><span class="v">Dùng ".." trong dữ liệu người dùng để với tới tệp ngoài thư mục được phép.</span></div>
  <div class="kv"><span class="k">carry (số nhớ)</span><span class="v">Chữ số được chuyển sang hàng kế tiếp khi cộng.</span></div>
  <div class="kv"><span class="k">fleet (đoàn xe)</span><span class="v">Các xe chạy chung vì xe nhanh đã đuổi kịp xe chậm.</span></div>
  <div class="kv"><span class="k">deep copy / shallow copy (sao chép sâu / nông)</span><span class="v">Đối tượng mới tới tận cùng / chỉ vỏ ngoài mới, bên trong dùng chung tham chiếu.</span></div>
  <div class="kv"><span class="k">object identity (danh tính đối tượng)</span><span class="v">So tham chiếu chứ không so nội dung — thứ map dùng khi khoá là nút.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>"Hoàn tác thứ gần nhất" dưới mọi lớp vỏ (cặp liền kề, "..") là stack.</li>
<li>Nghĩ theo thời điểm về đích biến một bài mô phỏng thành sắp xếp + monotonic stack.</li>
<li>Bài sao chép con trỏ cần một map từ danh tính cũ tới đối tượng mới.</li>
<li>Bài max/min của cửa sổ ghép cửa sổ của Chương 2 với deque của bài 3.2.</li>
<li>Đề danh sách khó là phiên bản theo-từng-khối của phép đảo dễ, cộng một nút giả.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Linked List &amp; Stack', 'Thứ tự luyện chuẩn; so với thứ tự của bộ đề này', 'https://neetcode.io/roadmap')}
${nguon('🔐', 'OWASP — Path Traversal', 'Kiểu tấn công vận hành thế nào và cách phòng', 'https://owasp.org/www-community/attacks/Path_Traversal')}
</div>
`,
};
