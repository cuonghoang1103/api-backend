/** 3.1 — Stack và monotonic stack. Mọi mã/output đọc từ ../ma/ch03 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetNgoac } from '../ma/ch03/valid-parentheses.vet.mjs';
import { vetDaily } from '../ma/ch03/daily-temperatures.vet.mjs';
import { vetHistogram } from '../ma/ch03/histogram.vet.mjs';

/* Bảng vết 1 — Valid Parentheses trên đúng chuỗi của mô phỏng. */
const S = '{[()]}(';
const vn = vetNgoac(S);
const ky = S.split('');
const BANG_NGOAC = bangVet(['i', 's', 'stack before', 'action', 'stack after'],
  vn.hang.map((h) => [
    String(h.i),
    oMang(ky, { to: { [h.i]: h.ok ? 'l' : 'x' } }),
    `<code>${h.truoc || '∅'}</code>`,
    h.viec,
    `<code>${h.sau || '∅'}</code>`,
  ]).concat([['end', oMang(ky), `<code>${vn.hang[vn.hang.length - 1].sau || '∅'}</code>`, vn.kq ? 'empty ⇒ valid' : 'not empty ⇒ <strong>invalid</strong>', '']]));

/* Bảng vết 2 — Daily Temperatures (monotonic stack). */
const T = [73, 74, 75, 71, 69, 72, 76, 73];
const vd = vetDaily(T);
const BANG_DAILY = bangVet(['i', 'temperatures', 't[i]', 'stack before', 'popped (answer)', 'stack after', 'answer so far'],
  vd.map((h) => {
    const to = { [h.i]: 'l' };
    for (const j of h.bop) to[j] = 'ok';
    return [
      String(h.i),
      oMang(T, { to }),
      String(h.ti),
      `<code>[${h.truoc.join(', ')}]</code>`,
      h.bop.length ? h.bop.map((j) => `${j} → ${h.i} − ${j} = ${h.i - j}`).join('<br>') : '—',
      `<code>[${h.sau.join(', ')}]</code>`,
      `<code>[${h.ans.join(', ')}]</code>`,
    ];
  }));
const SO_POP = vd.reduce((s, h) => s + h.bop.length, 0);

/* Bảng vết 3 — Largest Rectangle in Histogram. */
const H = [2, 1, 5, 6, 2, 3];
const vh = vetHistogram(H);
const BANG_HIST = bangVet(['i', 'heights', 'h[i]', 'stack before', 'rectangles finished (height × width)', 'stack after', 'best'],
  vh.map((h) => [
    h.i === H.length ? `${h.i} (sentinel)` : String(h.i),
    oMang(H, { to: Object.fromEntries([...h.chot.map((c) => [c.j, 'x']), ...(h.i < H.length ? [[h.i, 'l']] : [])]) }),
    String(h.cur),
    `<code>[${h.truoc.join(', ')}]</code>`,
    h.chot.length ? h.chot.map((c) => `bar ${c.j}: ${c.cao} × ${c.rong} = ${c.dt}`).join('<br>') : '—',
    `<code>[${h.sau.join(', ')}]</code>`,
    String(h.best),
  ]));

const DE = [
  [lc(20, 'valid-parentheses', 'Valid Parentheses', 'Easy'), 'Every closer must match the most recent unmatched opener ⇒ stack of openers.', 'Mỗi dấu đóng phải khớp dấu mở GẦN NHẤT chưa đóng ⇒ stack các dấu mở.'],
  [lc(155, 'min-stack', 'Min Stack', 'Medium'), 'Store "min so far" next to each value; pop never needs a recompute.', 'Lưu "min tới đây" cạnh từng giá trị; pop không phải tính lại gì.'],
  [lc(150, 'evaluate-reverse-polish-notation', 'Evaluate Reverse Polish Notation', 'Medium'), 'Operands wait on a stack; an operator pops two. Mind the order and truncation.', 'Toán hạng chờ trên stack; gặp toán tử thì pop hai. Cẩn thận thứ tự và phép chia cắt về 0.'],
  [lc(394, 'decode-string', 'Decode String', 'Medium'), 'Nested brackets ⇒ push the unfinished outer state at "[", resume it at "]".', 'Ngoặc lồng nhau ⇒ cất trạng thái dở dang bên ngoài khi gặp "[", lấy lại khi gặp "]".'],
  [lc(739, 'daily-temperatures', 'Daily Temperatures', 'Medium'), '"Next warmer day" ⇒ monotonic decreasing stack of waiting indices.', '"Ngày ấm hơn kế tiếp" ⇒ stack giảm dần chứa chỉ số đang chờ.'],
  [lc(496, 'next-greater-element-i', 'Next Greater Element I', 'Easy'), 'Same stack over nums2, answers stored in a map for lookup.', 'Cùng stack đó chạy trên nums2, đáp án cất vào map để tra.'],
  [lc(503, 'next-greater-element-ii', 'Next Greater Element II', 'Medium'), 'Circular ⇒ walk 2n indices with i % n, push only in the first lap.', 'Mảng vòng ⇒ đi 2n bước với i % n, chỉ push ở vòng đầu.'],
  [lc(901, 'online-stock-span', 'Online Stock Span', 'Medium'), 'Streaming "previous greater" ⇒ stack of [price, span], absorb smaller days.', '"Lớn hơn phía trước" dạng luồng ⇒ stack [giá, span], nuốt các ngày nhỏ hơn.'],
  [lc(1472, 'design-browser-history', 'Design Browser History', 'Medium'), 'Back/Forward = two stacks; a new visit clears Forward.', 'Back/Forward = hai stack; truy cập trang mới thì xoá Forward.'],
  [lc(735, 'asteroid-collision', 'Asteroid Collision', 'Medium'), 'Only a right-mover on top can hit a new left-mover ⇒ resolve collisions on the stack.', 'Chỉ thiên thạch bay phải ở đỉnh mới va được thiên thạch bay trái mới đến ⇒ xử lý va chạm trên stack.'],
  [lc(84, 'largest-rectangle-in-histogram', 'Largest Rectangle in Histogram', 'Hard'), 'Increasing stack; a bar is finished when a lower bar arrives; sentinel 0 at the end.', 'Stack tăng dần; một cột "chốt sổ" khi gặp cột thấp hơn; thêm cột lính canh 0 ở cuối.'],
];

export default {
  title: '3.1 — Stacks: matching, undo and the monotonic stack|||3.1 — Stack: khớp ngoặc, hoàn tác và monotonic stack',
  slug: 'dsa-3-1-stack',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ngoặc hợp lệ, min stack, RPN, decode string rồi monotonic stack (daily temperatures, next greater, stock span, histogram) — kèm đo O(n²) vs O(n), tràn call stack thật và bẫy Stack/ArrayDeque của Java.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Stacks: matching, undo and the monotonic stack</h2>
<p class="lead">A stack answers one question better than anything else: <strong>"what is the most recent thing that is still unfinished?"</strong> An unclosed bracket, an operand waiting for its operator, a day still waiting for a warmer day, the page you were on before this one. Interviewers love stack problems because the code is short but the <em>invariant</em> (the rule the stack always obeys) must be exactly right — one wrong comparison and the answer is silently off. This lesson gives you the plain stack, then the monotonic stack, with every claim backed by code that was actually run.</p>

<h3>The everyday picture</h3>
<p>At the end of a lab session the students drop their exam papers on the lecturer's desk, one on top of another. When the lecturer starts marking, the first paper picked up is the <em>last</em> one handed in. Nobody digs a paper out of the middle; you only ever touch the top. That is a <strong>stack</strong>: <strong>LIFO</strong>, last in, first out. Your Ctrl+Z works the same way — it undoes the most recent change first, never one from the middle.</p>
<p>Formally a stack has three operations, all <strong>O(1)</strong>: <code>push(x)</code> puts x on top, <code>pop()</code> removes and returns the top, <code>peek()</code> (also called <code>top</code>) reads the top without removing it. In TypeScript a plain array is a perfect stack (<code>push</code>/<code>pop</code> at the end, <code>a[a.length - 1]</code> to peek). In Java, use <code>ArrayDeque</code> (<code>push</code>/<code>pop</code>/<code>peek</code>) — not the old <code>Stack</code> class; a trap later in this lesson shows why.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">push 1</span><span class="lz-d">[1]</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">push 2</span><span class="lz-d">[1, 2]</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">push 3</span><span class="lz-d">[1, 2, 3] — top is 3</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">pop → 3</span><span class="lz-d">[1, 2] — the last in leaves first</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Stack: khớp ngoặc, hoàn tác và monotonic stack</h2>
<p class="lead">Stack (ngăn xếp) trả lời một câu hỏi tốt hơn mọi cấu trúc khác: <strong>"thứ GẦN NHẤT mà vẫn còn dang dở là gì?"</strong> Một dấu ngoặc chưa đóng, một toán hạng đang chờ toán tử, một ngày đang chờ ngày ấm hơn, trang web bạn vừa ở trước trang này. Người phỏng vấn rất thích bài stack vì code ngắn nhưng <em>bất biến</em> (invariant — quy tắc stack luôn phải giữ) phải đúng tuyệt đối — sai một phép so sánh là đáp án lệch mà không báo lỗi gì. Bài này đi từ stack thường tới monotonic stack (ngăn xếp đơn điệu), và mọi khẳng định đều có mã đã chạy thật đứng sau.</p>

<h3>Hình dung đời thường</h3>
<p>Cuối buổi lab, sinh viên nộp bài kiểm tra lên bàn giảng viên, tờ sau đặt chồng lên tờ trước. Lúc chấm, tờ đầu tiên thầy cầm lên là tờ nộp <em>sau cùng</em>. Không ai rút một tờ ở giữa chồng; chỉ bao giờ đụng vào tờ trên cùng. Đó là <strong>stack</strong>: <strong>LIFO</strong> (last in, first out — vào sau, ra trước). Phím Ctrl+Z cũng vậy — nó hoàn tác thay đổi gần nhất trước, không bao giờ hoàn tác một thay đổi ở giữa.</p>
<p>Nói cho chuẩn, stack có ba thao tác, đều <strong>O(1)</strong>: <code>push(x)</code> (đẩy — đặt x lên đỉnh), <code>pop()</code> (lấy ra — gỡ và trả về phần tử đỉnh), <code>peek()</code> (nhìn trộm — còn gọi là <code>top</code>, đọc đỉnh mà không gỡ). Trong TypeScript, một mảng thường là stack hoàn hảo (<code>push</code>/<code>pop</code> ở cuối, <code>a[a.length - 1]</code> để nhìn đỉnh). Trong Java, dùng <code>ArrayDeque</code> (<code>push</code>/<code>pop</code>/<code>peek</code>) — đừng dùng lớp <code>Stack</code> cũ; một cái bẫy ở cuối bài cho thấy vì sao.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">push 1</span><span class="lz-d">[1]</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">push 2</span><span class="lz-d">[1, 2]</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">push 3</span><span class="lz-d">[1, 2, 3] — đỉnh là 3</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">pop → 3</span><span class="lz-d">[1, 2] — vào sau thì ra trước</span></div>
</div>
${csd('csd201-stack-queue', 'vi', '2.1 Ngăn xếp (LIFO) &amp; Hàng đợi (FIFO)', '<p>Ở CSD201 bạn đã cài đặt stack bằng mảng và bằng danh sách liên kết, và biết vì sao push/pop là O(1). Ôn nhanh một câu: stack chỉ cho chạm vào đỉnh, nên mọi thao tác chỉ đụng một ô. <strong>Ở đây đi sâu thêm:</strong> NHẬN RA lúc nào đề cần stack dù đề không hề nhắc chữ "stack", và monotonic stack — biến thể mà giáo trình thường không dạy nhưng phỏng vấn hỏi rất nhiều.</p>')}
${csd('csd201-stack-ung-dung', 'vi', '2.3 Ứng dụng ngăn xếp: dấu ngoặc, RPN, undo', '<p>Bài CSD201 đã giới thiệu ba ứng dụng kinh điển. Ở đây ta giải chúng thành lời giải phỏng vấn hoàn chỉnh (TS + Java), chỉ ra đúng những ca biên làm trượt ứng viên (chuỗi chỉ có dấu mở, phép chia số âm), và đo cái giá khi stack bị dùng sai chỗ — đệ quy quá sâu làm sập chương trình.</p>')}
</div>

<div class="ml-en">
<h3>Signals: when the answer is a stack</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">nesting / matching</span><span class="v">Brackets, HTML tags, "[" … "]" in an encoded string, folders and "..": the thing that closes is always the most recent thing that opened.</span></div>
  <div class="kv"><span class="k">"undo", "back", "previous state"</span><span class="v">You need to return to the state just before — a stack of states or of actions.</span></div>
  <div class="kv"><span class="k">expression evaluation</span><span class="v">Postfix (RPN), calculators, operator precedence: values wait until the operator that consumes them arrives.</span></div>
  <div class="kv"><span class="k">"next / previous greater (or smaller) element"</span><span class="v">Next warmer day, stock span, buildings with a view, histogram rectangles: a <strong>monotonic stack</strong>, O(n) instead of O(n²).</span></div>
  <div class="kv"><span class="k">recursion you must make iterative</span><span class="v">DFS on a deep tree, a recursive parser on hostile input: an explicit stack replaces the call stack (bottom of this lesson).</span></div>
  <div class="kv"><span class="k">n ≤ 10⁵ and the brute force scans to the right for every i</span><span class="v">That is O(n²) ≈ 10¹⁰ steps — too slow. If what you scan for is "the first element bigger/smaller than me", think monotonic stack.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào đáp án là stack</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">lồng nhau / khớp cặp</span><span class="v">Dấu ngoặc, thẻ HTML, "[" … "]" trong chuỗi mã hoá, thư mục và "..": thứ đóng lại luôn là thứ MỞ GẦN NHẤT.</span></div>
  <div class="kv"><span class="k">"hoàn tác", "quay lại", "trạng thái trước"</span><span class="v">Cần trở về đúng trạng thái liền trước — một stack các trạng thái hoặc các thao tác.</span></div>
  <div class="kv"><span class="k">tính biểu thức</span><span class="v">Ký pháp hậu tố (RPN — Reverse Polish Notation), máy tính bỏ túi, độ ưu tiên toán tử: giá trị phải CHỜ tới khi toán tử dùng nó xuất hiện.</span></div>
  <div class="kv"><span class="k">"phần tử lớn hơn (hoặc nhỏ hơn) kế tiếp / phía trước"</span><span class="v">Ngày ấm hơn kế tiếp, stock span (chuỗi ngày giá không cao hơn), toà nhà nhìn ra biển, hình chữ nhật trong biểu đồ cột: <strong>monotonic stack</strong>, O(n) thay vì O(n²).</span></div>
  <div class="kv"><span class="k">đệ quy phải đổi thành vòng lặp</span><span class="v">DFS trên cây rất sâu, bộ phân tích cú pháp đệ quy gặp đầu vào ác ý: một stack tự quản thay cho call stack (cuối bài).</span></div>
  <div class="kv"><span class="k">n ≤ 10⁵ mà vét cạn với mỗi i lại quét sang phải</span><span class="v">Đó là O(n²) ≈ 10¹⁰ bước — quá chậm. Nếu thứ bạn quét tìm là "phần tử đầu tiên lớn/nhỏ hơn tôi" ⇒ nghĩ ngay tới monotonic stack.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example 1: Valid Parentheses</h3>
<p><strong>Problem (in our words).</strong> A string contains only the six characters <code>( ) [ ] { }</code>. Decide whether it is "well formed": every opener is closed by the same type, and in the right order. <code>"{[()]}"</code> is valid; <code>"([)]"</code> is not, even though the counts match.</p>
<p><strong>Brute force, out loud.</strong> "Repeatedly delete any adjacent pair <code>()</code>, <code>[]</code> or <code>{}</code> until nothing changes; valid if the string becomes empty." Each pass is O(n) and there can be n/2 passes: O(n²). It works and it is worth one sentence — then improve it.</p>
<p><strong>The insight.</strong> When you read a closer, the only opener it may match is the most recent one that is still open. "Most recent still open" is exactly a stack top. So: push openers; on a closer, the top must be its partner (pop it), otherwise invalid. At the end the stack must be empty. One pass, O(n) time, O(n) memory in the worst case (<code>"(((((("</code>).</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu 1: Valid Parentheses</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một chuỗi chỉ gồm sáu ký tự <code>( ) [ ] { }</code>. Hỏi chuỗi có "hợp lệ" không: mỗi dấu mở được đóng bởi dấu cùng loại, và đúng thứ tự. <code>"{[()]}"</code> hợp lệ; <code>"([)]"</code> thì không, dù số lượng mỗi loại khớp nhau.</p>
<p><strong>Vét cạn, nói thành lời.</strong> "Lặp lại việc xoá mọi cặp liền kề <code>()</code>, <code>[]</code>, <code>{}</code> cho tới khi không xoá được nữa; chuỗi rỗng thì hợp lệ." Mỗi lượt O(n) và có thể cần tới n/2 lượt: O(n²). Chạy đúng, đáng nói một câu — rồi cải tiến.</p>
<p><strong>Ý chính.</strong> Khi đọc tới một dấu đóng, dấu mở DUY NHẤT nó được phép khớp là dấu mở gần nhất còn đang mở. "Gần nhất còn đang mở" chính xác là đỉnh của một stack. Vậy: gặp dấu mở thì push; gặp dấu đóng thì đỉnh phải là "bạn cặp" của nó (pop ra), không thì sai. Hết chuỗi, stack phải rỗng. Một lượt, O(n) thời gian, O(n) bộ nhớ trong trường hợp xấu nhất (<code>"(((((("</code>).</p>
</div>

${maHai('ch03/valid-parentheses.ts', 'ch03/ValidParentheses.java', { vung: 'giai' })}
${ketQua('ch03/valid-parentheses.ts')}
${ketQua('ch03/ValidParentheses.java')}

<div class="ml-en">
<p>Read the "buggy" column: it is a real variant people write, which forgets the last line and returns <code>true</code>. It passes six of the seven cases and fails only <code>"(("</code> — a string with nothing but openers. That is the edge case to say out loud in the interview. Two more details: the check <code>stack.length === 0</code> <em>before</em> popping handles <code>"]"</code> (in Java, <code>pop()</code> on an empty <code>ArrayDeque</code> throws, so the guard is mandatory); and the empty string is valid — ask the interviewer, but that is LeetCode's convention.</p>
<h3>Watch it run</h3>
<p>Input <code>"{[()]}("</code>. Blue = the character being read; the stack is written bottom → top. The table was produced by running the algorithm.</p>
</div>
<div class="ml-vi">
<p>Đọc cột "buggy": đó là một biến thể có thật mà nhiều người viết — quên dòng cuối và trả về <code>true</code>. Nó qua sáu trên bảy ca và chỉ sai ở <code>"(("</code> — chuỗi chỉ toàn dấu mở. Đó chính là ca biên phải nói to khi phỏng vấn. Thêm hai chi tiết: phép kiểm <code>stack.length === 0</code> <em>trước khi</em> pop xử lý ca <code>"]"</code> (trong Java, <code>pop()</code> trên <code>ArrayDeque</code> rỗng sẽ ném ngoại lệ, nên phép kiểm này là bắt buộc); và chuỗi rỗng được coi là hợp lệ — nên hỏi người phỏng vấn, nhưng LeetCode quy ước như vậy.</p>
<h3>Xem nó chạy</h3>
<p>Đầu vào <code>"{[()]}("</code>. Ô xanh dương = ký tự đang đọc; stack viết từ đáy → đỉnh. Bảng sinh ra bằng cách chạy thuật toán thật.</p>
</div>
${BANG_NGOAC}
<div class="ml-en">
<p>Steps 3–5 are the heart of it: <code>)</code> meets <code>(</code> on top, <code>]</code> meets <code>[</code>, <code>}</code> meets <code>{</code> — each closer pops exactly the opener that came last. After step 5 the stack is empty again, and the string so far (<code>"{[()]}"</code>) is valid. Then one more <code>(</code> arrives and is never closed: the last row is where the buggy version would have wrongly said "valid".</p>
${moPhong('ch03/ngoac.sim.js', 'en', 'Valid Parentheses — the stack, step by step', 'Opens /algorithms with this program: play, pause, step; edit S and run your own strings.')}
</div>
<div class="ml-vi">
<p>Các bước 3–5 là trái tim của bài: <code>)</code> gặp <code>(</code> ở đỉnh, <code>]</code> gặp <code>[</code>, <code>}</code> gặp <code>{</code> — mỗi dấu đóng pop đúng dấu mở đến sau cùng. Sau bước 5 stack rỗng trở lại, và phần chuỗi đã đọc (<code>"{[()]}"</code>) hợp lệ. Rồi thêm một <code>(</code> tới và không bao giờ được đóng: dòng cuối chính là chỗ bản lỗi sẽ kết luận sai là "hợp lệ".</p>
${moPhong('ch03/ngoac.sim.js', 'vi', 'Valid Parentheses — stack chạy từng bước', 'Mở trang /algorithms với đúng chương trình này: phát, dừng, đi từng bước; sửa S để thử chuỗi của bạn.')}
</div>

<div class="ml-en">
<h3>Pattern 2 — the stack remembers extra facts: Min Stack</h3>
<p>Design a stack that also returns its minimum in O(1). The tempting idea — keep one variable <code>min</code> — breaks on <code>pop</code>: if you pop the minimum, what is the new one? You would have to scan. The fix is to remember, <em>with every entry</em>, the minimum of everything at or below it. Popping then needs no work at all, because the answer for the stack below is already stored below. The general lesson is bigger than this problem: <strong>a stack entry can carry whatever summary of "everything beneath me" you need</strong> (min, max, sum, count).</p>
</div>
<div class="ml-vi">
<h3>Mẫu 2 — stack nhớ thêm thông tin: Min Stack</h3>
<p>Thiết kế một stack trả về giá trị nhỏ nhất của nó trong O(1). Ý tưởng dễ dãi — giữ một biến <code>min</code> — vỡ khi <code>pop</code>: lỡ pop đúng phần tử nhỏ nhất thì min mới là bao nhiêu? Bạn sẽ phải quét lại. Cách sửa: <em>với mỗi phần tử</em>, nhớ luôn giá trị nhỏ nhất của mọi thứ từ nó trở xuống đáy. Khi đó pop không phải làm gì, vì đáp án cho phần stack bên dưới đã nằm sẵn ở bên dưới. Bài học chung lớn hơn đề này: <strong>mỗi ô của stack có thể mang theo bất kỳ "tóm tắt mọi thứ bên dưới tôi" nào bạn cần</strong> (min, max, tổng, số lượng).</p>
</div>
${maHai('ch03/min-stack.ts', 'ch03/MinStack.java', { vung: 'giai' })}
${ketQua('ch03/min-stack.ts')}
<div class="ml-en">
<p>Notice the duplicate 3: after popping 1 the minimum is 3, after popping the second 3 the minimum is <em>still</em> 3 (from the first one). A version that keeps a separate "min stack" and only pushes when <code>x &lt; currentMin</code> (strictly) gets this wrong — it must push on <code>x &lt;= currentMin</code>. Storing pairs avoids the question entirely.</p>
</div>
<div class="ml-vi">
<p>Để ý số 3 bị lặp: sau khi pop số 1 thì min là 3, sau khi pop số 3 thứ hai min <em>vẫn</em> là 3 (của số 3 đầu tiên). Bản giữ một "stack min" riêng và chỉ push khi <code>x &lt; minHiệnTại</code> (nhỏ hơn hẳn) sẽ sai ở đúng chỗ này — phải push khi <code>x &lt;= minHiệnTại</code>. Lưu theo cặp thì khỏi phải nghĩ tới câu hỏi đó.</p>
</div>

<div class="ml-en">
<h3>Pattern 3 — work waiting on a stack: RPN and Decode String</h3>
<p><em>Evaluate Reverse Polish Notation</em>: in postfix notation <code>2 1 + 3 *</code> means (2 + 1) × 3. Numbers wait on the stack; an operator pops two, computes, pushes the result. Two details decide whether you pass: the <strong>order</strong> (the first pop is the <em>right</em> operand: for <code>13 5 /</code> you compute 13 / 5, not 5 / 13) and the <strong>rounding</strong> (division truncates toward zero).</p>
<p><em>Decode String</em>: <code>"3[a2[c]]"</code> → <code>"accaccacc"</code>. When you meet <code>[</code>, the outer work is not finished — save it (the text built so far and the repeat count) on stacks and start fresh. When you meet <code>]</code>, the inner part is complete: pop the outer state and glue. This "save the unfinished outer context, resume it later" is precisely what the CPU's call stack does for recursion — Decode String is recursion written by hand.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 3 — việc dở dang chờ trên stack: RPN và Decode String</h3>
<p><em>Evaluate Reverse Polish Notation</em> (tính biểu thức hậu tố): trong ký pháp hậu tố, <code>2 1 + 3 *</code> nghĩa là (2 + 1) × 3. Các số chờ trên stack; gặp toán tử thì pop hai số, tính, push kết quả. Hai chi tiết quyết định bạn qua hay trượt: <strong>thứ tự</strong> (lần pop đầu tiên là toán hạng <em>bên phải</em>: với <code>13 5 /</code> phải tính 13 / 5, không phải 5 / 13) và <strong>cách làm tròn</strong> (phép chia cắt về phía 0 — truncate toward zero).</p>
<p><em>Decode String</em> (giải mã chuỗi): <code>"3[a2[c]]"</code> → <code>"accaccacc"</code>. Gặp <code>[</code> nghĩa là phần việc bên ngoài chưa xong — cất nó (đoạn chữ đã dựng và số lần lặp) lên stack rồi bắt đầu lại từ trống. Gặp <code>]</code> nghĩa là phần bên trong đã xong: pop trạng thái bên ngoài ra và ghép vào. Kiểu "cất ngữ cảnh dở dang bên ngoài, lát nữa làm tiếp" này chính là việc call stack (ngăn xếp lời gọi) của máy làm cho đệ quy — Decode String là đệ quy viết bằng tay.</p>
</div>
${maHai('ch03/rpn-decode.ts', 'ch03/RpnDecode.java', { vung: 'rpn' })}
${maHai('ch03/rpn-decode.ts', 'ch03/RpnDecode.java', { vung: 'decode' })}
${ketQua('ch03/rpn-decode.ts')}
${ketQua('ch03/RpnDecode.java')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>Math.floor</code> is not "integer division" for negative numbers.</strong></p><p>Look at the fourth output line: <code>floor(-7/2) = -4</code> but <code>trunc(-7/2) = -3</code>. Java's <code>/</code> on ints truncates toward zero (−3), and LeetCode 150 asks for exactly that, so a TypeScript solution with <code>Math.floor</code> passes every test with positive numbers and fails on <code>["7","-2","/"]</code>. Use <code>Math.trunc</code> in JS; in Java remember that <code>Math.floorDiv</code> is the one that rounds down. The same mistake breaks "digit sum", "reverse integer" and modular arithmetic with negatives.</p></div>
<p>Decode String detail: <code>"10[x]"</code> — the count can have several digits, hence <code>k = k * 10 + digit</code>; reading one digit at a time and pushing it is the classic bug that turns 10 into 1 then 0.</p>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>Math.floor</code> KHÔNG phải "chia lấy phần nguyên" với số âm.</strong></p><p>Nhìn dòng output thứ tư: <code>floor(-7/2) = -4</code> nhưng <code>trunc(-7/2) = -3</code>. Phép <code>/</code> trên int của Java cắt về phía 0 (−3), và LeetCode 150 đòi đúng như vậy, nên lời giải TypeScript dùng <code>Math.floor</code> qua hết test với số dương rồi trượt ở <code>["7","-2","/"]</code>. Trong JS dùng <code>Math.trunc</code>; trong Java nhớ rằng <code>Math.floorDiv</code> mới là phép làm tròn xuống. Cùng lỗi này làm hỏng các bài "tổng chữ số", "đảo số nguyên" và phép lấy dư với số âm.</p></div>
<p>Chi tiết của Decode String: <code>"10[x]"</code> — số lần lặp có thể nhiều chữ số, nên mới có <code>k = k * 10 + chữSố</code>; đọc từng chữ số rồi push riêng là lỗi kinh điển biến 10 thành 1 rồi 0.</p>
</div>

<div class="ml-en">
<h3>Worked example 2: Daily Temperatures — the monotonic stack</h3>
<p><strong>Problem (in our words).</strong> <code>temps[i]</code> is the temperature on day i. For every day, how many days until a strictly warmer day? 0 if there is none. Example: <code>[73, 74, 75, 71, 69, 72, 76, 73]</code> → <code>[1, 1, 4, 2, 1, 1, 0, 0]</code>.</p>
<p><strong>Brute force.</strong> For each i, scan j = i+1, i+2, … until <code>temps[j] &gt; temps[i]</code>. Worst case — temperatures that only fall — every scan runs to the end: n(n−1)/2 comparisons, O(n²).</p>
<p><strong>Find the waste.</strong> Look at day 2 (75°). Days 3 (71°) and 4 (69°) are colder; they are still <em>waiting</em> for a warmer day too. When day 5 (72°) arrives, it answers day 4 and day 3 at once — but not day 2. So at every moment there is a group of "days still waiting", and their temperatures are <strong>decreasing</strong> (if a warmer day were behind a colder one, the colder one would already have been answered). A new day answers the waiting days from the most recent backwards, while it is warmer than them — most recent first: that is a stack.</p>
<p><strong>The invariant</strong>, say it in exactly these words in the interview: <em>"the stack holds indices of days that have not found a warmer day yet; their temperatures are strictly decreasing from bottom to top."</em> Before pushing day i, pop every day colder than day i — day i is their answer, <code>i − j</code>.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu 2: Daily Temperatures — monotonic stack</h3>
<p><strong>Đề (diễn đạt lại).</strong> <code>temps[i]</code> là nhiệt độ ngày i. Với mỗi ngày, còn bao nhiêu ngày nữa thì tới một ngày ấm hơn HẲN? Không có thì 0. Ví dụ: <code>[73, 74, 75, 71, 69, 72, 76, 73]</code> → <code>[1, 1, 4, 2, 1, 1, 0, 0]</code>.</p>
<p><strong>Vét cạn.</strong> Với mỗi i, quét j = i+1, i+2, … tới khi <code>temps[j] &gt; temps[i]</code>. Trường hợp xấu nhất — nhiệt độ chỉ giảm — lần quét nào cũng chạy tới cuối: n(n−1)/2 phép so sánh, O(n²).</p>
<p><strong>Tìm chỗ phí.</strong> Nhìn ngày 2 (75°). Ngày 3 (71°) và ngày 4 (69°) lạnh hơn; chúng cũng đang <em>chờ</em> ngày ấm hơn. Khi ngày 5 (72°) tới, nó trả lời một lúc cho cả ngày 4 lẫn ngày 3 — nhưng không cho ngày 2. Vậy ở mọi thời điểm có một nhóm "những ngày còn đang chờ", và nhiệt độ của họ <strong>giảm dần</strong> (nếu có một ngày ấm hơn đứng sau một ngày lạnh hơn thì ngày lạnh kia đã được trả lời rồi). Ngày mới trả lời những người đang chờ từ người gần nhất ngược về trước, chừng nào nó còn ấm hơn họ — gần nhất trước: đó là stack.</p>
<p><strong>Bất biến</strong> — khi phỏng vấn hãy nói đúng những chữ này: <em>"stack chứa chỉ số những ngày CHƯA tìm được ngày ấm hơn; nhiệt độ của chúng giảm hẳn từ đáy lên đỉnh."</em> Trước khi push ngày i, pop mọi ngày lạnh hơn ngày i — ngày i là đáp án của họ, <code>i − j</code>.</p>
</div>
${maHai('ch03/daily-temperatures.ts', 'ch03/DailyTemperatures.java', { vung: 'mono' })}
${ketQua('ch03/daily-temperatures.ts')}
${ketQua('ch03/DailyTemperatures.java')}
<div class="ml-en">
<h3>Watch the stack: who is waiting, who gets answered</h3>
<p>Blue = today; green = days answered today (they leave the stack). The stack column holds <em>indices</em> — store indices, not temperatures, because the answer is a distance <code>i − j</code>.</p>
</div>
<div class="ml-vi">
<h3>Nhìn stack: ai đang chờ, ai được trả lời</h3>
<p>Ô xanh dương = hôm nay; ô xanh lá = những ngày được trả lời hôm nay (rời stack). Cột stack chứa <em>chỉ số</em> — lưu chỉ số chứ đừng lưu nhiệt độ, vì đáp án là khoảng cách <code>i − j</code>.</p>
</div>
${BANG_DAILY}
<div class="ml-en">
<p>Read row 5: the stack before is <code>[2, 3, 4]</code> = 75°, 71°, 69° — decreasing, as promised. 72° pops 4 and 3 and stops at 75°. Row 6: 76° pops the remaining 5 and 2 — day 2 waited 4 days. Count the work: ${T.length} pushes and ${SO_POP} pops in total. However many pops one day does, each index is pushed once and popped at most once, so the whole loop does at most 2n stack operations: <strong>O(n) amortised</strong>, even with a <code>while</code> inside the <code>for</code>.</p>
${moPhong('ch03/daily-temperatures.sim.js', 'en', 'Daily Temperatures — monotonic stack, step by step', 'Each day waits in the stack until a warmer day pops it; watch the answer array fill in.')}
</div>
<div class="ml-vi">
<p>Đọc dòng 5: stack trước đó là <code>[2, 3, 4]</code> = 75°, 71°, 69° — giảm dần, đúng như đã hứa. 72° pop 4 và 3 rồi dừng ở 75°. Dòng 6: 76° pop nốt 5 và 2 — ngày 2 đã chờ 4 ngày. Đếm công việc: tổng cộng ${T.length} lần push và ${SO_POP} lần pop. Một ngày có pop bao nhiêu đi nữa thì mỗi chỉ số vẫn chỉ được push một lần và pop tối đa một lần, nên cả vòng lặp làm tối đa 2n thao tác stack: <strong>O(n) khấu hao</strong> (amortised), dù có <code>while</code> nằm trong <code>for</code>.</p>
${moPhong('ch03/daily-temperatures.sim.js', 'vi', 'Daily Temperatures — monotonic stack chạy từng bước', 'Mỗi ngày đứng chờ trong stack tới khi một ngày ấm hơn pop nó ra; xem mảng đáp án được điền dần.')}
</div>

<div class="ml-en">
<h3>The real cost, measured</h3>
<p>Worst case for the brute force: strictly decreasing temperatures, so no scan ever stops early. Same machine (Apple M1 Max):</p>
</div>
<div class="ml-vi">
<h3>Cái giá thật, đo bằng số</h3>
<p>Trường hợp xấu nhất cho vét cạn: nhiệt độ giảm hẳn, nên không lần quét nào dừng sớm được. Cùng một máy (Apple M1 Max):</p>
</div>
${ma('ch03/daily-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch03/daily-do.ts')}
${ketQua('ch03/DailyDo.java')}
<div class="ml-en">
<p>From 10⁴ to 10⁵ the brute force grew about 110× in Node (29.0 → 3,181 ms) and about 108× in Java (9.5 → 1,025 ms) — the signature of n². The stack grew about 11× in Node (0.08 → 0.86 ms) and stayed under 13 ms even at a million days, where the brute force would need roughly 100× more again — several minutes — so it was skipped. (Java's tiny numbers at 10⁵ and 10⁶ are the JIT having compiled the loop; the shape is what matters.) An online judge with a ~1 s limit accepts the brute force at n = 10⁴ and rejects it at 10⁵ — LC 739 allows n up to 10⁵.</p>
</div>
<div class="ml-vi">
<p>Từ 10⁴ lên 10⁵, vét cạn tăng khoảng 110 lần trên Node (29,0 → 3.181 ms) và khoảng 108 lần trên Java (9,5 → 1.025 ms) — chữ ký của n². Stack tăng khoảng 11 lần trên Node (0,08 → 0,86 ms) và vẫn dưới 13 ms ngay cả với một triệu ngày, nơi vét cạn sẽ cần thêm khoảng 100 lần nữa — vài phút — nên không chạy. (Số Java rất nhỏ ở 10⁵ và 10⁶ là do JIT đã biên dịch xong vòng lặp; thứ đáng xem là hình dạng.) Một máy chấm giới hạn khoảng 1 giây sẽ nhận vét cạn ở n = 10⁴ và từ chối ở 10⁵ — mà LC 739 cho n tới 10⁵.</p>
</div>

<div class="ml-en">
<h3>One template, four directions</h3>
<p>Every monotonic-stack problem is the same loop with two choices: <strong>what you pop on</strong> and <strong>what the answer is</strong>. Learn the table, not the problems:</p>
<table>
<thead><tr><th>You want, for each i…</th><th>Stack order (bottom → top)</th><th>Pop while</th><th>Answer comes from</th></tr></thead>
<tbody>
<tr><td>next greater element</td><td>decreasing</td><td><code>a[i] &gt; a[top]</code></td><td>i answers the popped index</td></tr>
<tr><td>next smaller element</td><td>increasing</td><td><code>a[i] &lt; a[top]</code></td><td>i answers the popped index</td></tr>
<tr><td>previous greater element</td><td>decreasing</td><td><code>a[top] &lt;= a[i]</code></td><td>the top <em>left</em> after popping answers i</td></tr>
<tr><td>previous smaller element</td><td>increasing</td><td><code>a[top] &gt;= a[i]</code></td><td>the top left after popping answers i</td></tr>
</tbody></table>
<p>"Greater or equal?" is decided by the strictness of the comparison — ask the interviewer how ties count, then pick <code>&gt;</code> or <code>&gt;=</code> on purpose.</p>
</div>
<div class="ml-vi">
<h3>Một khuôn, bốn hướng</h3>
<p>Mọi bài monotonic stack đều là cùng một vòng lặp với hai lựa chọn: <strong>pop khi nào</strong> và <strong>đáp án lấy từ đâu</strong>. Hãy học cái bảng, đừng học từng đề:</p>
<table>
<thead><tr><th>Với mỗi i, bạn cần…</th><th>Thứ tự stack (đáy → đỉnh)</th><th>Pop khi</th><th>Đáp án đến từ</th></tr></thead>
<tbody>
<tr><td>phần tử lớn hơn kế tiếp (next greater)</td><td>giảm dần</td><td><code>a[i] &gt; a[top]</code></td><td>i là đáp án của chỉ số bị pop</td></tr>
<tr><td>phần tử nhỏ hơn kế tiếp (next smaller)</td><td>tăng dần</td><td><code>a[i] &lt; a[top]</code></td><td>i là đáp án của chỉ số bị pop</td></tr>
<tr><td>phần tử lớn hơn phía trước (previous greater)</td><td>giảm dần</td><td><code>a[top] &lt;= a[i]</code></td><td>đỉnh CÒN LẠI sau khi pop là đáp án của i</td></tr>
<tr><td>phần tử nhỏ hơn phía trước (previous smaller)</td><td>tăng dần</td><td><code>a[top] &gt;= a[i]</code></td><td>đỉnh còn lại sau khi pop là đáp án của i</td></tr>
</tbody></table>
<p>"Lớn hơn hay lớn hơn hoặc bằng?" do độ chặt của phép so sánh quyết định — hỏi người phỏng vấn ca bằng nhau tính thế nào, rồi chọn <code>&gt;</code> hay <code>&gt;=</code> một cách CÓ CHỦ Ý.</p>
</div>

<div class="ml-en">
<h3>Variants: next greater (plain and circular) and the stock span</h3>
<p><em>Next Greater Element I</em> runs the same stack over <code>nums2</code> and stores answers in a map value → next greater, because the queries come from another array. <em>Next Greater Element II</em> is circular: the element after the last is the first. Instead of copying the array, walk 2n steps with <code>i = k % n</code> and push only during the first lap — the second lap only answers. <em>Online Stock Span</em> is "previous greater" on a stream: each new price swallows the entries with smaller-or-equal prices and adds up their spans, so each price is absorbed at most once — amortised O(1) per call.</p>
</div>
<div class="ml-vi">
<h3>Biến thể: next greater (thường và vòng) và stock span</h3>
<p><em>Next Greater Element I</em> chạy đúng stack đó trên <code>nums2</code> và cất đáp án vào map giá trị → phần tử lớn hơn kế tiếp, vì câu hỏi đến từ một mảng khác. <em>Next Greater Element II</em> là mảng vòng: sau phần tử cuối là phần tử đầu. Thay vì chép mảng thành hai lần, đi 2n bước với <code>i = k % n</code> và chỉ push ở vòng đầu — vòng hai chỉ để trả lời. <em>Online Stock Span</em> là "lớn hơn phía trước" trên một luồng dữ liệu: mỗi giá mới nuốt các ô có giá nhỏ hơn hoặc bằng và cộng dồn span của chúng, nên mỗi giá bị nuốt tối đa một lần — O(1) khấu hao mỗi lần gọi.</p>
</div>
${maHai('ch03/next-greater.ts', 'ch03/NextGreater.java', { vung: 'nge2' })}
${maHai('ch03/next-greater.ts', 'ch03/NextGreater.java', { vung: 'span' })}
${ketQua('ch03/next-greater.ts')}
<div class="ml-en">
<p>Check the span output by hand for the day priced 75: the days before it with price ≤ 75 going backwards are 60, 70, 60 — plus itself, span 4. Then 85 swallows the [75, 4] entry and the [80, 1] entry: 1 + 4 + 1 = 6.</p>
</div>
<div class="ml-vi">
<p>Tự kiểm output span bằng tay cho ngày giá 75: đi ngược về trước, các ngày có giá ≤ 75 là 60, 70, 60 — cộng chính nó, span 4. Rồi 85 nuốt ô [75, 4] và ô [80, 1]: 1 + 4 + 1 = 6.</p>
</div>

<div class="ml-en">
<h3>The hard one: Largest Rectangle in Histogram</h3>
<p>Bars of width 1 and heights <code>h</code>; find the area of the largest rectangle inside the histogram. For each bar, the widest rectangle of <em>its</em> height stretches left and right until a lower bar — so you need, for every bar, the previous smaller and the next smaller. One increasing stack gives both at once: when bar i is lower than the top, the top bar's rectangle is finished — its right limit is i, its left limit is the new top after popping. A sentinel height 0 at the end flushes everything that is left.</p>
</div>
<div class="ml-vi">
<h3>Đề khó: Largest Rectangle in Histogram</h3>
<p>Các cột rộng 1, chiều cao <code>h</code>; tìm diện tích hình chữ nhật lớn nhất nằm gọn trong biểu đồ. Với mỗi cột, hình chữ nhật rộng nhất có <em>đúng chiều cao của nó</em> kéo sang trái và phải tới khi gặp cột thấp hơn — nên với mỗi cột cần biết cột thấp hơn phía trước và cột thấp hơn kế tiếp. Một stack tăng dần cho cả hai cùng lúc: khi cột i thấp hơn đỉnh, hình chữ nhật của cột đỉnh "chốt sổ" — biên phải là i, biên trái là đỉnh mới sau khi pop. Một cột lính canh (sentinel) cao 0 ở cuối xả hết những gì còn lại.</p>
</div>
${maHai('ch03/histogram.ts', 'ch03/Histogram.java', { vung: 'giai' })}
${ketQua('ch03/histogram.ts')}
${BANG_HIST}
<div class="ml-en">
<p>Red = bars whose rectangle is finished in that row. Row 4 is the key moment: height 2 arrives, bar 3 (height 6) is finished with width 1 (area 6), then bar 2 (height 5) with width 2 — bars 2 and 3 — area 10, the answer. The width formula <code>i − left − 1</code> uses the <em>new</em> top as the left wall; when the stack becomes empty, the left wall is −1 (the bar reaches the very beginning), which is why bar 1 (height 1) gets width 6 in the sentinel row.</p>
</div>
<div class="ml-vi">
<p>Ô đỏ = những cột được chốt hình chữ nhật ở dòng đó. Dòng 4 là khoảnh khắc mấu chốt: cột cao 2 tới, cột 3 (cao 6) chốt với độ rộng 1 (diện tích 6), rồi cột 2 (cao 5) với độ rộng 2 — gồm cột 2 và 3 — diện tích 10, chính là đáp án. Công thức độ rộng <code>i − left − 1</code> dùng đỉnh <em>mới</em> làm bức tường bên trái; khi stack rỗng, tường trái là −1 (cột kéo dài tới tận đầu mảng), nên cột 1 (cao 1) được độ rộng 6 ở dòng lính canh.</p>
</div>

<div class="ml-en">
<h3>Where stacks live in real systems</h3>
<ul>
<li><strong>Undo in this very website.</strong> The handwriting canvas used in the study books, <code>frontend/src/components/sach-hoc/HandCanvas.tsx</code>, keeps <code>hist</code>: every committed stroke pushes the previous drawing (<code>hist.current.push(...)</code>), and Undo is <code>hist.current.pop()</code>. It also caps the history at <code>MAX_HISTORY = 60</code> by dropping the <em>oldest</em> entry with <code>shift()</code> — a stack that must also lose its bottom is really a deque (lesson 3.2). The notes editor (<code>NoteEditor.tsx</code>) gets undo/redo from ProseMirror's history plugin, and switches it off in collaborative mode because Yjs keeps its own undo stack — two undo stacks fighting would undo each other's work.</li>
<li><strong>Back and Forward.</strong> A browser's history is two stacks — exactly LC 1472 below. Typing a new address clears Forward, the same way typing after Ctrl+Z clears Redo.</li>
<li><strong>The call stack.</strong> Every function call pushes a <em>frame</em> (arguments, local variables, where to return); <code>return</code> pops it. JavaScript's event loop only runs the next queued task when this stack is empty — the Node.js course explains that interplay.</li>
<li><strong>Parsers and compilers.</strong> Bracket matching, HTML/XML tag nesting, the shunting-yard algorithm that turns <code>2 + 3 * 4</code> into postfix, and the stack machine of the JVM bytecode itself (<code>iload</code>, <code>iadd</code> push and pop an operand stack).</li>
</ul>
</div>
<div class="ml-vi">
<h3>Stack sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Hoàn tác ngay trên chính trang này.</strong> Khung viết tay trong sách học, <code>frontend/src/components/sach-hoc/HandCanvas.tsx</code>, giữ mảng <code>hist</code>: mỗi nét vẽ được chốt sẽ push bản vẽ trước đó (<code>hist.current.push(...)</code>), còn nút Hoàn tác là <code>hist.current.pop()</code>. Nó còn chặn lịch sử ở <code>MAX_HISTORY = 60</code> bằng cách bỏ phần tử <em>cũ nhất</em> với <code>shift()</code> — một stack mà còn phải bỏ bớt ở đáy thì thực chất là deque (bài 3.2). Trình soạn ghi chú (<code>NoteEditor.tsx</code>) lấy undo/redo từ plugin history của ProseMirror, và tắt nó ở chế độ cộng tác vì Yjs giữ stack hoàn tác riêng — hai stack hoàn tác tranh nhau sẽ hoàn tác cả việc của nhau.</li>
<li><strong>Nút Back và Forward.</strong> Lịch sử trình duyệt là hai stack — đúng đề LC 1472 dưới đây. Gõ một địa chỉ mới sẽ xoá Forward, giống hệt gõ chữ sau Ctrl+Z thì mất Redo.</li>
<li><strong>Call stack.</strong> Mỗi lời gọi hàm push một <em>khung</em> (frame — tham số, biến cục bộ, chỗ quay về); <code>return</code> pop nó ra. Event loop của JavaScript chỉ chạy tác vụ tiếp theo trong hàng đợi khi stack này rỗng — khoá Node.js giải thích sự phối hợp đó.</li>
<li><strong>Bộ phân tích cú pháp và trình biên dịch.</strong> Khớp ngoặc, lồng thẻ HTML/XML, thuật toán shunting-yard đổi <code>2 + 3 * 4</code> sang hậu tố, và chính máy stack của bytecode JVM (<code>iload</code>, <code>iadd</code> push và pop một stack toán hạng).</li>
</ul>
${lienKet({ khoa: 'nodejs', bai: 'nodejs-2-2-event-loop', title: 'Node.js 2.2 — Event loop, đi qua từng pha', sub: 'Call stack rỗng thì event loop mới lấy việc kế tiếp từ hàng đợi', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>Variant: Browser History with two stacks</h3>
<p>The back stack holds the pages behind you, the forward stack the pages you came back from. <code>goBack</code> moves the current page onto forward and pops back; <code>goForward</code> is the mirror. <code>visit</code> pushes the current page onto back and clears forward. Run it on cuongthai.com paths:</p>
</div>
<div class="ml-vi">
<h3>Biến thể: Browser History bằng hai stack</h3>
<p>Stack back giữ các trang phía sau bạn, stack forward giữ các trang bạn vừa lùi khỏi. <code>goBack</code> chuyển trang hiện tại sang forward rồi pop back; <code>goForward</code> là ảnh gương. <code>visit</code> push trang hiện tại vào back và xoá sạch forward. Chạy thử với các đường dẫn của cuongthai.com:</p>
</div>
${maHai('ch03/browser-history.ts', 'ch03/BrowserHistory.java', { vung: 'giai' })}
${ketQua('ch03/browser-history.ts')}

<div class="ml-en">
<h3>The call stack is a stack too — and it is small</h3>
<p>The call stack has a fixed size. Measured on this machine (Node 26, default settings), a trivial function that only calls itself overflows after about 10,000 frames, and the recursive checker below — whose frames are bigger — after about 6,000 nested calls. Java's default thread stack (around 512 KB–1 MB) gives the same order of magnitude. A recursive function on deeply nested input therefore crashes long before memory runs out. Below, the same "maximum nesting depth" check written recursively (one call per character) and iteratively (a counter is the whole stack when there is only one bracket type):</p>
</div>
<div class="ml-vi">
<h3>Call stack cũng là một stack — và nó nhỏ</h3>
<p>Call stack có kích thước cố định. Đo trên chính máy này (Node 26, cấu hình mặc định), một hàm tầm thường chỉ gọi lại chính nó tràn sau khoảng 10.000 khung, còn bộ kiểm đệ quy dưới đây — khung của nó to hơn — tràn sau khoảng 6.000 lời gọi lồng nhau. Stack mặc định của một luồng Java (khoảng 512 KB–1 MB) cho cùng cỡ đó. Vì vậy một hàm đệ quy chạy trên đầu vào lồng rất sâu sẽ sập từ lâu trước khi hết bộ nhớ. Dưới đây là cùng một phép kiểm "độ lồng sâu nhất" viết bằng đệ quy (mỗi ký tự một lời gọi) và bằng vòng lặp (khi chỉ có một loại ngoặc thì một biến đếm chính là cả cái stack):</p>
</div>
${ma('ch03/tran-ngan-xep.ts', { vung: 'dequy', nhan: 'TypeScript — recursive' })}
${ma('ch03/tran-ngan-xep.ts', { vung: 'lap', nhan: 'TypeScript — iterative' })}
${ketQua('ch03/tran-ngan-xep.ts')}
<div class="ml-en">
<p>n = 1,000 means 2,000 nested calls — fine. n = 100,000 means 200,000 nested calls: <code>RangeError: Maximum call stack size exceeded</code>. The iterative version answers instantly. This is the same crash you will meet in Chapter 5 with DFS on a degenerate tree and in lesson 3.3 with a recursive linked-list reversal. Picture the call stack at the moment of the crash:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">depthRec(s, ≈6000, …)</span><span class="lz-lnote">top — the frame that no longer fits</span></div>
  <div class="lz-layer"><span class="lz-lname">… thousands of frames …</span><span class="lz-lnote">each waiting for the call above it to return</span></div>
  <div class="lz-layer"><span class="lz-lname">depthRec(s, 1, 1)</span><span class="lz-lnote">waiting</span></div>
  <div class="lz-layer"><span class="lz-lname">depthRec(s, 0, 0)</span><span class="lz-lnote">waiting</span></div>
  <div class="lz-layer"><span class="lz-lname">main</span><span class="lz-lnote">bottom</span></div>
</div>
</div>
<div class="ml-vi">
<p>n = 1.000 nghĩa là 2.000 lời gọi lồng nhau — ổn. n = 100.000 nghĩa là 200.000 lời gọi lồng nhau: <code>RangeError: Maximum call stack size exceeded</code> (vượt kích thước tối đa của call stack). Bản vòng lặp trả lời ngay. Đây đúng là cú sập bạn sẽ gặp lại ở Chương 5 với DFS trên cây suy biến và ở bài 3.3 với đảo danh sách liên kết bằng đệ quy. Hình dung call stack ngay lúc sập:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">depthRec(s, ≈6000, …)</span><span class="lz-lnote">đỉnh — khung không còn chỗ để đặt</span></div>
  <div class="lz-layer"><span class="lz-lname">… hàng nghìn khung …</span><span class="lz-lnote">mỗi khung chờ lời gọi phía trên nó trả về</span></div>
  <div class="lz-layer"><span class="lz-lname">depthRec(s, 1, 1)</span><span class="lz-lnote">đang chờ</span></div>
  <div class="lz-layer"><span class="lz-lname">depthRec(s, 0, 0)</span><span class="lz-lnote">đang chờ</span></div>
  <div class="lz-layer"><span class="lz-lname">main</span><span class="lz-lnote">đáy</span></div>
</div>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: nesting bombs</h3>
<p>If your server parses user input recursively, an attacker does not need a big payload — just a <em>deep</em> one. A few hundred kilobytes of <code>[[[[[[…</code> or <code>{"a":{"a":{"a":…</code> can throw a stack overflow in a recursive parser and kill the request thread (or the whole process if the error is not caught). This is a real vulnerability class: Jackson-databind, the JSON library behind most Java/Spring back ends, had <strong>CVE-2020-36518</strong> — "a Java StackOverflow exception and denial of service via a large depth of nested objects" — fixed by adding a maximum nesting depth. The Node ecosystem's query-string parser <code>qs</code> (used by Express's extended URL-encoded parser) limits nesting to depth 5 by default for the same reason.</p>
<p>Defences you can name: parse with an <strong>explicit stack</strong> instead of recursion; enforce a <strong>maximum depth</strong> (reject at depth 64 or 1,000, not 200,000); cap the <strong>body size</strong> (this backend sets <code>express.json({ limit: '10mb' })</code> in <code>src/index.ts</code>); and never let a recursive function's depth be chosen by the client.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: quả bom lồng nhau</h3>
<p>Nếu máy chủ của bạn phân tích dữ liệu người dùng gửi lên bằng đệ quy, kẻ tấn công không cần gửi thứ gì to — chỉ cần thứ gì <em>sâu</em>. Vài trăm kilobyte <code>[[[[[[…</code> hay <code>{"a":{"a":{"a":…</code> có thể làm tràn stack trong một bộ phân tích đệ quy và giết luồng xử lý request (hoặc cả tiến trình nếu lỗi không được bắt). Đây là một loại lỗ hổng có thật: Jackson-databind, thư viện JSON đứng sau đa số backend Java/Spring, từng dính <strong>CVE-2020-36518</strong> — "ngoại lệ StackOverflow của Java và từ chối dịch vụ (DoS) qua đối tượng lồng nhau quá sâu" — được vá bằng cách thêm giới hạn độ sâu. Bộ phân tích query-string <code>qs</code> của hệ sinh thái Node (Express dùng nó cho chế độ urlencoded mở rộng) mặc định chỉ cho lồng tới độ sâu 5 cũng vì lý do đó.</p>
<p>Cách phòng có thể kể ra: phân tích bằng <strong>stack tự quản</strong> thay cho đệ quy; đặt <strong>độ sâu tối đa</strong> (từ chối ở độ sâu 64 hay 1.000, đừng để tới 200.000); chặn <strong>kích thước body</strong> (backend này đặt <code>express.json({ limit: '10mb' })</code> trong <code>src/index.ts</code>); và không bao giờ để client quyết định độ sâu đệ quy của hàm bạn viết.</p>
</div>

<div class="ml-en">
<h3>Trap: Java's <code>Stack</code> and <code>ArrayDeque</code> print in opposite orders</h3>
<div class="pitfall co-tieu-de"><p><strong>Trap — same pushes, different printout.</strong></p><p><code>java.util.Stack</code> is a 1996 class that extends <code>Vector</code>: every call is synchronized (slower), it allows index access that breaks LIFO, and it iterates bottom → top. <code>ArrayDeque</code> pushes onto its <em>head</em>, so it iterates top → bottom. If you debug by printing the stack, the two disagree:</p></div>
</div>
<div class="ml-vi">
<h3>Bẫy: <code>Stack</code> và <code>ArrayDeque</code> của Java in ra theo thứ tự ngược nhau</h3>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — push giống nhau, in ra khác nhau.</strong></p><p><code>java.util.Stack</code> là lớp từ năm 1996, kế thừa <code>Vector</code>: mọi lời gọi đều đồng bộ hoá (synchronized — chậm hơn), cho truy cập theo chỉ số làm vỡ nguyên tắc LIFO, và duyệt từ đáy → đỉnh. <code>ArrayDeque</code> push vào <em>đầu</em> của nó, nên duyệt từ đỉnh → đáy. Nếu bạn gỡ lỗi bằng cách in stack ra, hai lớp nói hai kiểu:</p></div>
</div>
${ma('ch03/JavaStackBay.java', { vung: 'bay', nhan: 'Java' })}
${ketQua('ch03/JavaStackBay.java')}
<div class="ml-en">
<p>Rules: use <code>Deque&lt;Integer&gt; st = new ArrayDeque&lt;&gt;()</code>; check <code>isEmpty()</code> before <code>pop()</code> (it throws), or use <code>peek()</code>/<code>poll()</code> which return <code>null</code>; for a stack of primitive ints in a hot loop, a plain <code>int[]</code> plus a <code>top</code> index (as in the Daily Temperatures Java solution) avoids boxing entirely. The official Javadoc of <code>Stack</code> itself says to prefer <code>Deque</code>.</p>
</div>
<div class="ml-vi">
<p>Quy tắc: dùng <code>Deque&lt;Integer&gt; st = new ArrayDeque&lt;&gt;()</code>; kiểm <code>isEmpty()</code> trước <code>pop()</code> (vì nó ném ngoại lệ), hoặc dùng <code>peek()</code>/<code>poll()</code> trả về <code>null</code>; với stack số nguyên trong vòng lặp nóng, một mảng <code>int[]</code> thường cộng chỉ số <code>top</code> (như lời giải Java của Daily Temperatures) tránh hẳn việc đóng hộp (boxing). Chính Javadoc chính thức của <code>Stack</code> cũng khuyên dùng <code>Deque</code>.</p>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: Daily Temperatures</h3>
${hoiThoai([
  ['I', 'For each day, tell me how many days until a warmer day.'],
  ['C', 'Just to confirm: strictly warmer, and 0 if there is none? And what range of n are we talking about?'],
  ['N', 'Strictness decides > versus >=; n decides whether O(n²) is acceptable.'],
  ['I', 'Strictly warmer, 0 if none, n up to 10⁵.'],
  ['C', 'The brute force scans right from every day — O(n²), about 10¹⁰ comparisons in the worst case when temperatures only fall, too slow. The waste is that the colder days in between are also waiting, and the same new day answers them. If I keep the waiting days on a stack, their temperatures are decreasing, so a new day pops exactly the ones it answers. Each index is pushed and popped once: O(n) time, O(n) space.'],
  ['N', 'Brute force with its worst case, then the invariant in one sentence, then both complexities. The word "amortised" is ready for the follow-up.'],
  ['I', 'Sounds good, go ahead.'],
  ['C', '(coding) I store indices, not temperatures, because the answer is a distance. The while pops while today is strictly warmer than the top… whatever stays in the stack at the end keeps its default 0.'],
  ['C', 'Quick test: [73, 74] gives [1, 0]; a falling list [60, 50, 40] gives all zeros — nobody is ever popped; equal temperatures [70, 70] give [0, 0] because I use strict greater.'],
  ['N', 'Three tests chosen to hit three different branches: a pop, no pops at all, and the tie rule.'],
  ['I', 'There is a while inside a for. Why is it not quadratic?'],
  ['C', 'Count pops instead of iterations: there are at most n pops in total over the whole run, because an index cannot be popped twice. So the inner loop runs n times in total, not per day.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: Daily Temperatures</h3>
<p>Cùng mạch hội thoại bằng tiếng Việt, kèm các cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Với mỗi ngày, cho tôi biết còn bao nhiêu ngày nữa thì tới ngày ấm hơn.'],
  ['C', 'Em xác nhận chút: ấm hơn hẳn, không có thì 0 ạ? Và n cỡ bao nhiêu? <em>("Strictly warmer, and 0 if there is none? What is the range of n?")</em>'],
  ['N', 'Độ chặt quyết định dùng &gt; hay &gt;=; cỡ n quyết định O(n²) có chấp nhận được không.'],
  ['I', 'Ấm hơn hẳn, không có thì 0, n tới 10⁵.'],
  ['C', 'Vét cạn là từ mỗi ngày quét sang phải — O(n²), khoảng 10¹⁰ phép so sánh khi nhiệt độ chỉ giảm, quá chậm. Chỗ phí là những ngày lạnh hơn ở giữa cũng đang chờ, và cùng một ngày mới trả lời luôn cho họ. Nếu em giữ các ngày đang chờ trên một stack thì nhiệt độ của chúng giảm dần, nên ngày mới pop đúng những ngày nó trả lời. Mỗi chỉ số push một lần, pop một lần: O(n) thời gian, O(n) bộ nhớ. <em>("Each index is pushed and popped at most once.")</em>'],
  ['N', 'Vét cạn kèm trường hợp xấu nhất, rồi bất biến trong một câu, rồi cả hai độ phức tạp. Chữ "khấu hao" để sẵn cho câu hỏi nối tiếp.'],
  ['I', 'Nghe ổn, code đi.'],
  ['C', '(vừa code vừa nói) Em lưu chỉ số chứ không lưu nhiệt độ, vì đáp án là khoảng cách. Vòng while pop khi hôm nay ấm hơn hẳn đỉnh… ai còn lại trong stack lúc cuối thì giữ mặc định 0.'],
  ['C', 'Test nhanh: [73, 74] ra [1, 0]; dãy giảm [60, 50, 40] ra toàn 0 — không ai bị pop; nhiệt độ bằng nhau [70, 70] ra [0, 0] vì em dùng lớn hơn hẳn.'],
  ['N', 'Ba test được chọn để chạm ba nhánh khác nhau: có pop, không pop lần nào, và luật khi bằng nhau.'],
  ['I', 'Có while trong for. Sao không phải bậc hai?'],
  ['C', 'Em đếm số lần pop thay vì số vòng lặp: cả quá trình có tối đa n lần pop, vì một chỉ số không thể bị pop hai lần. Nên vòng trong tổng cộng chạy n lần, chứ không phải n lần cho mỗi ngày. <em>("It is amortised O(1) per element.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Forgetting the final <code>stack is empty</code> check — <code>"(("</code> becomes valid.</li>
<li>Popping without checking for empty: <code>undefined</code> silently in JS, an exception in Java.</li>
<li>Pushing <em>values</em> into a monotonic stack when the answer needs a distance or a width — push indices.</li>
<li>Choosing <code>&gt;</code> vs <code>&gt;=</code> by accident: ties then behave differently from what the problem says.</li>
<li>Getting the operand order wrong in RPN (<code>b - a</code> instead of <code>a - b</code>), or using <code>Math.floor</code> for division.</li>
<li>Calling a <code>while</code> inside a <code>for</code> "O(n²)" without counting pushes and pops — or claiming O(n) without being able to explain why.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Quên phép kiểm cuối <code>stack rỗng</code> — <code>"(("</code> thành hợp lệ.</li>
<li>Pop mà không kiểm rỗng: JS lặng lẽ trả <code>undefined</code>, Java ném ngoại lệ.</li>
<li>Push <em>giá trị</em> vào monotonic stack trong khi đáp án cần khoảng cách hay độ rộng — hãy push chỉ số.</li>
<li>Chọn <code>&gt;</code> hay <code>&gt;=</code> một cách tình cờ: khi có phần tử bằng nhau, kết quả khác với điều đề yêu cầu.</li>
<li>Sai thứ tự toán hạng trong RPN (<code>b - a</code> thay vì <code>a - b</code>), hoặc dùng <code>Math.floor</code> cho phép chia.</li>
<li>Gọi "while trong for" là O(n²) mà không đếm số lần push/pop — hoặc khẳng định O(n) mà không giải thích được vì sao.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Tên đề giữ nguyên tiếng Anh để bạn tìm được trên LeetCode/NeetCode. Lời giải từng bước của 8 đề tổng hợp cả chương nằm ở <a href="${baiNay('dsa-3-4-luyen')}">bài 3.4 (Bộ luyện 3)</a>; khung giải 6 bước dùng cho mọi đề ở <a href="${baiNay('dsa-0-2-khung')}">bài 0.2</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>From memory, write Valid Parentheses in your interview language. Run it on <code>"{[()]}"</code>, <code>"([)]"</code>, <code>"]"</code>, <code>"(("</code>, <code>""</code>. Delete the last line (<code>return stack is empty</code>) and find the one input that now fails.</li>
<li>Open the Daily Temperatures simulation, change <code>T</code> to <code>[30, 60, 90, 80, 70, 100]</code>, predict the answer array on paper first, then run and compare.</li>
<li>Submit LC 20, LC 739 and LC 155. For each, write in your notebook: <em>signal → what the stack holds → invariant → complexity</em>.</li>
<li>Bonus: LC 84. Before coding, fill in the four-direction table for it: which direction, which order, pop on what.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, the deleted-line bug found with one input, and your hand-computed answer for the simulation matches its output.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stack / LIFO</span><span class="v">Last in, first out; push, pop, peek on one end only, O(1).</span></div>
  <div class="kv"><span class="k">invariant</span><span class="v">A rule the data structure obeys after every step ("temperatures decrease bottom → top").</span></div>
  <div class="kv"><span class="k">monotonic stack</span><span class="v">A stack kept increasing or decreasing; finds next/previous greater or smaller in O(n).</span></div>
  <div class="kv"><span class="k">amortised O(1)</span><span class="v">Some steps are expensive but the total over n steps is O(n).</span></div>
  <div class="kv"><span class="k">sentinel</span><span class="v">A fake element (height 0 at the end) that removes a special case.</span></div>
  <div class="kv"><span class="k">call stack / stack frame</span><span class="v">The runtime's own stack of active function calls; overflowing it raises RangeError / StackOverflowError.</span></div>
  <div class="kv"><span class="k">RPN (postfix)</span><span class="v">Operators after their operands: <code>2 1 + 3 *</code>.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>A stack answers "what is the most recent unfinished thing?" — matching, undo, back, nested work.</li>
<li>Entries can carry summaries of everything below (min stack).</li>
<li>Monotonic stack: pop what the new element answers; each index pushed and popped once ⇒ O(n).</li>
<li>Four directions (next/previous × greater/smaller) are one template; ties are a deliberate <code>&gt;</code> vs <code>&gt;=</code>.</li>
<li>Recursion uses the call stack, which is small; deep or hostile input needs an explicit stack and a depth limit.</li>
<li>Java: <code>ArrayDeque</code>, not <code>Stack</code>; JS: <code>Math.trunc</code>, not <code>Math.floor</code>, for integer division.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Stack', 'The standard order of the stack problems, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java ArrayDeque (Java SE 21 API)', 'Official documentation: push/pop/peek, offer/poll, why it beats Stack', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html')}
${nguon('🔐', 'CVE-2020-36518 — deeply nested JSON in jackson-databind', 'The GitHub advisory for the stack-overflow denial of service', 'https://github.com/advisories/GHSA-57j2-w4cx-62h2')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết Valid Parentheses bằng ngôn ngữ bạn sẽ phỏng vấn. Chạy với <code>"{[()]}"</code>, <code>"([)]"</code>, <code>"]"</code>, <code>"(("</code>, <code>""</code>. Xoá dòng cuối (<code>return stack rỗng</code>) và tìm đúng một đầu vào bây giờ bị sai.</li>
<li>Mở mô phỏng Daily Temperatures, đổi <code>T</code> thành <code>[30, 60, 90, 80, 70, 100]</code>, đoán mảng đáp án trên giấy TRƯỚC, rồi chạy và so.</li>
<li>Nộp LC 20, LC 739 và LC 155. Mỗi đề ghi vào sổ: <em>dấu hiệu → stack chứa gì → bất biến → độ phức tạp</em>.</li>
<li>Thêm: LC 84. Trước khi code, điền bảng bốn hướng cho nó: hướng nào, thứ tự nào, pop khi nào.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, tìm ra lỗi xoá dòng bằng đúng một đầu vào, và đáp án bạn tính tay cho mô phỏng khớp với output của nó.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stack / LIFO (ngăn xếp / vào sau ra trước)</span><span class="v">Chỉ thao tác ở một đầu: push, pop, peek, đều O(1).</span></div>
  <div class="kv"><span class="k">invariant (bất biến)</span><span class="v">Quy tắc cấu trúc dữ liệu luôn giữ sau mỗi bước ("nhiệt độ giảm dần từ đáy lên đỉnh").</span></div>
  <div class="kv"><span class="k">monotonic stack (ngăn xếp đơn điệu)</span><span class="v">Stack luôn tăng dần hoặc giảm dần; tìm phần tử lớn/nhỏ hơn kế tiếp/phía trước trong O(n).</span></div>
  <div class="kv"><span class="k">amortised O(1) (O(1) khấu hao)</span><span class="v">Vài bước đắt nhưng tổng n bước vẫn là O(n).</span></div>
  <div class="kv"><span class="k">sentinel (lính canh)</span><span class="v">Phần tử giả (cột cao 0 ở cuối) để bỏ một trường hợp đặc biệt.</span></div>
  <div class="kv"><span class="k">call stack / stack frame (ngăn xếp lời gọi / khung)</span><span class="v">Stack riêng của môi trường chạy chứa các lời gọi hàm đang dở; tràn nó sinh RangeError / StackOverflowError.</span></div>
  <div class="kv"><span class="k">RPN — postfix (ký pháp hậu tố)</span><span class="v">Toán tử đứng sau toán hạng: <code>2 1 + 3 *</code>.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Stack trả lời "thứ dang dở gần nhất là gì?" — khớp cặp, hoàn tác, quay lại, việc lồng nhau.</li>
<li>Mỗi ô có thể mang tóm tắt của mọi thứ bên dưới (min stack).</li>
<li>Monotonic stack: pop những phần tử mà phần tử mới là đáp án; mỗi chỉ số push và pop một lần ⇒ O(n).</li>
<li>Bốn hướng (kế tiếp/phía trước × lớn hơn/nhỏ hơn) là một khuôn; ca bằng nhau là lựa chọn có chủ ý giữa <code>&gt;</code> và <code>&gt;=</code>.</li>
<li>Đệ quy dùng call stack, mà call stack nhỏ; đầu vào sâu hoặc ác ý cần stack tự quản và giới hạn độ sâu.</li>
<li>Java: <code>ArrayDeque</code>, đừng dùng <code>Stack</code>; JS: chia nguyên dùng <code>Math.trunc</code>, đừng dùng <code>Math.floor</code>.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Stack', 'Thứ tự chuẩn các đề stack, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java ArrayDeque (Java SE 21 API)', 'Tài liệu chính thức: push/pop/peek, offer/poll, vì sao tốt hơn Stack', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html')}
${nguon('🔐', 'CVE-2020-36518 — JSON lồng sâu trong jackson-databind', 'Thông báo GitHub về lỗ hổng từ chối dịch vụ do tràn stack', 'https://github.com/advisories/GHSA-57j2-w4cx-62h2')}
</div>
`,
};
