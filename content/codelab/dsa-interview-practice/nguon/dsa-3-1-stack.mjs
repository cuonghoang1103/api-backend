/** Coding Interview Prep · 3.1 — Stack: khớp ngoặc (trả vị trí lỗi), ngăn xếp đơn điệu, stack nhớ thêm thông tin, đóng góp của từng phần tử. Đề tự soạn (không trùng đề LeetCode của bài). */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Khớp ngoặc: vị trí ngoặc lỗi đầu tiên (để tô đỏ trong trình soạn thảo) ── */
function firstBadBracket(code) {
  var OPEN = { ')': '(', ']': '[', '}': '{' }; // closing -> the opener it needs
  var stack = []; // INDEXES of openers still waiting for their partner
  for (var i = 0; i < code.length; i++) {
    var ch = code[i];
    if (ch === '(' || ch === '[' || ch === '{') stack.push(i);
    else if (OPEN[ch]) {
      // a closer must match the MOST RECENT unclosed opener — that is the top of the stack
      if (!stack.length || code[stack[stack.length - 1]] !== OPEN[ch]) return i;
      stack.pop();
    }
    // every other character (letters, quotes, spaces) is ignored
  }
  // leftovers: the earliest unclosed opener sits at the BOTTOM of the stack
  return stack.length ? stack[0] : -1;
}
const D1 = bai({
  ten: 'Editor lint: the first bracket to underline', kho: 'EASY', phut: 15, ham: 'firstBadBracket',
  en: `<p>The code editor in CT Work's snippet box underlines the <b>first</b> bracket that breaks the structure, so a student sees where their <code>if</code> block went wrong before pressing Run. Brackets are <code>()</code>, <code>[]</code> and <code>{}</code>; every other character is ignored.</p>
<p>Write <code>firstBadBracket(code)</code> returning the index to underline:</p>
<ul><li>scanning left to right, the first <b>closing</b> bracket that has no opener waiting, or whose most recent unclosed opener is of a different kind ⇒ its index;</li>
<li>if the scan ends cleanly but some openers were never closed ⇒ the index of the <b>earliest</b> unclosed opener;</li>
<li>a perfectly balanced snippet ⇒ <code>-1</code>.</li></ul>`,
  vi: `<p>Trình soạn thảo trong ô đoạn mã của CT Work gạch chân ngoặc <b>đầu tiên</b> làm vỡ cấu trúc, để sinh viên thấy khối <code>if</code> sai ở đâu trước khi bấm Chạy. Ngoặc gồm <code>()</code>, <code>[]</code>, <code>{}</code>; mọi ký tự khác bỏ qua.</p>
<p>Viết <code>firstBadBracket(code)</code> trả về chỉ số cần gạch chân:</p>
<ul><li>quét trái sang phải, ngoặc <b>đóng</b> đầu tiên mà không có ngoặc mở nào đang chờ, hoặc ngoặc mở chưa đóng gần nhất lại khác loại ⇒ chỉ số của nó;</li>
<li>nếu quét hết êm nhưng còn ngoặc mở chưa đóng ⇒ chỉ số ngoặc mở chưa đóng <b>sớm nhất</b>;</li>
<li>đoạn mã cân bằng hoàn toàn ⇒ <code>-1</code>.</li></ul>`,
  dauVao: ['code — a string (0 ≤ length ≤ 2·10⁵).', 'code — một chuỗi (0 ≤ độ dài ≤ 2·10⁵).'],
  dauRa: ['An index, or -1.', 'Một chỉ số, hoặc -1.'],
  rangBuoc: [['0 ≤ code.length ≤ 200 000.', '0 ≤ code.length ≤ 200 000.'], ['Target: O(n) time, O(n) memory.', 'Mục tiêu: O(n) thời gian, O(n) bộ nhớ.']],
  goiY: [
    ['A closing bracket must match the opener that was opened LAST and is still open — "last in, first out" is a stack.', 'Ngoặc đóng phải khớp ngoặc mở được mở SAU CÙNG mà vẫn còn mở — "vào sau, ra trước" chính là stack.'],
    ['Push the <b>index</b> of each opener, not the character: you can still read the character with <code>code[index]</code>, and at the end <code>stack[0]</code> is the earliest unclosed one.', 'Đẩy <b>chỉ số</b> của ngoặc mở, không đẩy ký tự: vẫn đọc được ký tự bằng <code>code[index]</code>, và cuối cùng <code>stack[0]</code> là ngoặc chưa đóng sớm nhất.'],
  ],
  loi: [
    ['Counting each bracket type separately: <code>"([)]"</code> has one of each pair and looks balanced, but the <code>)</code> at index 2 closes a <code>[</code>.', 'Đếm riêng từng loại ngoặc: <code>"([)]"</code> có đủ mỗi cặp một cái nên trông cân bằng, nhưng <code>)</code> ở chỉ số 2 lại đóng một <code>[</code>.'],
    ['Reporting the top of the stack at the end: for <code>"(("</code> that is index 1, but the bracket that was never closed FIRST is index 0.', 'Báo đỉnh stack ở cuối: với <code>"(("</code> đó là chỉ số 1, nhưng ngoặc bị bỏ dở SỚM NHẤT là chỉ số 0.'],
    ['Calling <code>stack[stack.length - 1]</code> on an empty stack for an input like <code>")"</code> — check emptiness first.', 'Đọc <code>stack[stack.length - 1]</code> khi stack rỗng với đầu vào như <code>")"</code> — kiểm rỗng trước.'],
  ],
  gt: ['Brackets nest, so the only opener a closer may match is the most recent one still open — exactly the top of a stack. Storing indexes keeps both facts we need: the kind (via <code>code[idx]</code>) and the position for the underline. The first violation while scanning is a closer that finds an empty stack or the wrong kind on top; if none happens, the leftovers are in opening order, so the bottom <code>stack[0]</code> is the earliest. Each character is pushed and popped at most once ⇒ O(n) time, O(n) memory in the worst case (all openers).', 'Ngoặc lồng nhau, nên ngoặc đóng chỉ được khớp với ngoặc mở gần nhất còn đang mở — đúng là đỉnh stack. Lưu chỉ số giữ được cả hai điều cần: loại ngoặc (qua <code>code[idx]</code>) và vị trí để gạch chân. Lỗi đầu tiên khi quét là một ngoặc đóng gặp stack rỗng hoặc đỉnh sai loại; nếu không có, phần còn lại nằm theo thứ tự mở, nên đáy <code>stack[0]</code> là sớm nhất. Mỗi ký tự được đẩy và lấy ra tối đa một lần ⇒ O(n) thời gian, O(n) bộ nhớ trường hợp xấu nhất (toàn ngoặc mở).'],
  kn: ['stack', 'bracket matching'],
  tns: [tn('stack', 'ngăn xếp', 'vào sau ra trước (LIFO).'), tn('LIFO — last in, first out', 'vào sau, ra trước'), tn('opener / closer', 'ngoặc mở / ngoặc đóng')],
  dau: `/**
 * code: string
 * returns the index of the first bracket to underline, or -1 if balanced
 */
function firstBadBracket(code) {
  // Write your solution here
  return -1;
}
`,
  giai: '// Reference solution — a stack of opener INDEXES.\n' + nguon(firstBadBracket),
  cases: [
    { args: ['if (a[i] > 0) { sum += a[i]; }'], moTa: ['Balanced ⇒ -1', 'Cân bằng ⇒ -1'] },
    { args: ['([)]'], moTa: ['")" closes a "[" ⇒ 2', '")" đóng một "[" ⇒ 2'] },
    { args: ['((x)('], moTa: ['Two openers never closed: report the earliest ⇒ 0', 'Hai ngoặc mở bị bỏ dở: báo cái sớm nhất ⇒ 0'] },
    { args: [''], an: true },
    { args: ['}'], an: true, moTa: ['Closer with nothing open ⇒ 0', 'Ngoặc đóng khi chưa mở gì ⇒ 0'] },
    { args: ['for (i = 0; i < n; i++) { if (a[i]) { x(); } '], an: true },
    { args: ['{[()()]}{'], an: true },
    { args: ['a(b[c]d)e]f'], an: true },
    { args: ['"(" + ")"'], an: true, moTa: ['Brackets inside quotes still count', 'Ngoặc trong nháy vẫn tính'] },
  ],
  perf: [{
    moTa: ['Performance: a 200 000-character snippet with one unclosed opener', 'Hiệu năng: đoạn mã 200 000 ký tự có một ngoặc mở bị bỏ dở'],
    than: 'var P = "([{", Q = ")]}", out = [], st = []; while (out.length < 199990) { var r = R(10); if (r < 4 || !st.length) { var k = R(3); st.push(k); out.push(P[k]); } else if (r < 8) out.push(Q[st.pop()]); else out.push("x"); } while (st.length) out.push(Q[st.pop()]); var p = R(out.length); out.splice(p, 0, "("); return firstBadBracket(out.join(""));',
  }],
  saiMau: [
    { ten: ['Counts each bracket type separately', 'Đếm riêng từng loại ngoặc'], ma: 'function firstBadBracket(code) {\n  var c = { "(": 0, "[": 0, "{": 0 }, m = { ")": "(", "]": "[", "}": "{" }, first = {};\n  for (var i = 0; i < code.length; i++) { var ch = code[i]; if (ch in c) { if (!c[ch]) first[ch] = i; c[ch]++; } else if (m[ch]) { if (!c[m[ch]]) return i; c[m[ch]]--; } }\n  var best = -1; for (var k in c) if (c[k] && (best < 0 || first[k] < best)) best = first[k];\n  return best;\n}\n' },
    { ten: ['Reports the TOP of the stack at the end', 'Báo ĐỈNH stack ở cuối'], ma: 'function firstBadBracket(code) {\n  var m = { ")": "(", "]": "[", "}": "{" }, st = [];\n  for (var i = 0; i < code.length; i++) { var ch = code[i]; if ("([{".includes(ch)) st.push(i); else if (m[ch]) { if (!st.length || code[st[st.length - 1]] !== m[ch]) return i; st.pop(); } }\n  return st.length ? st[st.length - 1] : -1;\n}\n' },
  ],
});

/* ── 2. Ngăn xếp đơn điệu: phút gần nhất trước đó có lưu lượng CAO HƠN ── */
function previousHigher(counts) {
  var res = new Array(counts.length);
  var stack = []; // indexes; their counts are strictly DECREASING from bottom to top
  for (var i = 0; i < counts.length; i++) {
    // anything not higher than counts[i] can never be "the previous higher" for i or anyone after i
    while (stack.length && counts[stack[stack.length - 1]] <= counts[i]) stack.pop();
    res[i] = stack.length ? stack[stack.length - 1] : -1;
    stack.push(i);
  }
  return res;
}
const D2 = bai({
  ten: 'Traffic spikes: the previous busier minute', kho: 'MEDIUM', phut: 20, ham: 'previousHigher',
  en: `<p>The API gateway of the FPT course portal stores <code>counts[i]</code> = number of requests in minute <code>i</code>. When a minute looks busy, the on-call engineer asks: "when was the last minute that was even <b>busier</b>?" — that tells them whether this is a new peak or just a small wave.</p>
<p>Write <code>previousHigher(counts)</code> returning an array <code>res</code> where <code>res[i]</code> is the largest index <code>j &lt; i</code> with <code>counts[j] &gt; counts[i]</code> (strictly greater), or <code>-1</code> if there is none.</p>`,
  vi: `<p>Cổng API của cổng học tập FPT lưu <code>counts[i]</code> = số request trong phút <code>i</code>. Khi một phút trông đông, kỹ sư trực hỏi: "lần gần nhất có phút còn <b>đông hơn</b> là khi nào?" — để biết đây là đỉnh mới hay chỉ một gợn sóng nhỏ.</p>
<p>Viết <code>previousHigher(counts)</code> trả về mảng <code>res</code> với <code>res[i]</code> là chỉ số lớn nhất <code>j &lt; i</code> có <code>counts[j] &gt; counts[i]</code> (lớn hơn hẳn), hoặc <code>-1</code> nếu không có.</p>`,
  dauVao: ['counts — array of non-negative integers.', 'counts — mảng số nguyên không âm.'],
  dauRa: ['number[] of the same length.', 'number[] cùng độ dài.'],
  rangBuoc: [['0 ≤ counts.length ≤ 200 000; 0 ≤ counts[i] ≤ 10⁹.', '0 ≤ counts.length ≤ 200 000; 0 ≤ counts[i] ≤ 10⁹.'], ['Target: O(n) time.', 'Mục tiêu: O(n) thời gian.']],
  goiY: [
    ['Walking backwards from i works, but a steadily growing traffic curve makes every walk go all the way back: O(n²). What can you forget forever?', 'Đi lùi từ i thì đúng, nhưng một đường lưu lượng tăng đều làm mọi lần đi lùi chạy tới đầu mảng: O(n²). Cái gì có thể quên vĩnh viễn?'],
    ['If an earlier minute j has <code>counts[j] ≤ counts[i]</code>, minute i is both later and at least as busy — j can never be the answer for anyone after i. Pop such j from a stack; the top that survives is the answer.', 'Nếu phút j trước đó có <code>counts[j] ≤ counts[i]</code>, phút i vừa muộn hơn vừa đông ít nhất bằng — j không bao giờ là đáp án cho ai sau i nữa. Lấy những j đó khỏi stack; đỉnh còn lại chính là đáp án.'],
  ],
  loi: [
    ['Popping with <code>&lt;</code> instead of <code>&lt;=</code>: an equal minute stays on the stack and is reported as "busier" (for <code>[5, 5]</code> you would answer <code>[-1, 0]</code> instead of <code>[-1, -1]</code>).', 'Lấy ra với <code>&lt;</code> thay vì <code>&lt;=</code>: phút bằng nhau còn nằm trên stack và bị báo là "đông hơn" (với <code>[5, 5]</code> sẽ ra <code>[-1, 0]</code> thay vì <code>[-1, -1]</code>).'],
    ['Pushing the count instead of the index: you then know <i>how busy</i> the previous peak was but not <i>when</i>.', 'Đẩy số đếm thay vì chỉ số: khi đó biết đỉnh trước <i>đông bao nhiêu</i> nhưng không biết <i>khi nào</i>.'],
    ['Walking backwards for every minute: fine on random data, O(n²) on a rising curve — the large check is exactly that.', 'Đi lùi cho mỗi phút: ổn với dữ liệu ngẫu nhiên, O(n²) với đường tăng dần — kiểm lớn chính là trường hợp đó.'],
  ],
  gt: ['The stack keeps only the minutes that can still be somebody\'s answer: going from bottom to top they are later and strictly less busy, so the counts are strictly decreasing — a <b>monotonic stack</b>. For minute i we pop everything not higher than it (those are dominated by i forever), and whatever is left on top is the latest strictly-higher minute. Each index is pushed once and popped at most once, so all the while-loops together run at most n times ⇒ O(n) amortised time, O(n) memory.', 'Stack chỉ giữ những phút còn có thể là đáp án của ai đó: từ đáy lên đỉnh chúng muộn dần và ít đông hơn hẳn, nên số đếm giảm ngặt — một <b>monotonic stack (ngăn xếp đơn điệu)</b>. Với phút i ta lấy ra mọi phút không cao hơn nó (chúng bị i lấn át mãi mãi), cái còn lại trên đỉnh là phút gần nhất cao hơn hẳn. Mỗi chỉ số vào một lần, ra tối đa một lần, nên tất cả vòng while cộng lại chạy tối đa n lần ⇒ O(n) khấu hao, O(n) bộ nhớ.'],
  kn: ['monotonic stack', 'previous greater element'],
  tns: [tn('monotonic stack', 'ngăn xếp đơn điệu', 'stack mà giá trị luôn tăng (hoặc giảm) từ đáy lên đỉnh.'), tn('dominated', 'bị lấn át', 'không bao giờ còn là đáp án tốt hơn.'), tn('amortised O(n)', 'O(n) khấu hao', 'tổng chi phí cả lượt là O(n) dù một bước có thể tốn nhiều.')],
  dau: `/**
 * counts: number[] — requests per minute
 * returns res[i] = latest j < i with counts[j] > counts[i], or -1
 */
function previousHigher(counts) {
  // Write your solution here
  return counts.map(function () { return -1; });
}
`,
  giai: '// Reference solution — monotonic (strictly decreasing) stack of indexes.\n' + nguon(previousHigher),
  cases: [
    { args: [[120, 80, 95, 60, 200, 150]] },
    { args: [[5, 5, 5]], moTa: ['Equal is not busier ⇒ all -1', 'Bằng nhau không phải đông hơn ⇒ toàn -1'] },
    { args: [[]], an: true },
    { args: [[9, 7, 5, 3, 1]], an: true },
    { args: [[1, 2, 3, 4, 5]], an: true },
    { args: [[50, 10, 50, 20, 40, 30, 60, 0]], an: true },
    { args: [[0]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 minutes of steadily rising traffic (walking back each time is O(n²))', 'Hiệu năng: 200 000 phút lưu lượng tăng đều (mỗi lần đi lùi là O(n²))'],
    than: 'var n = 200000, a = new Array(n); for (var i = 0; i < n; i++) a[i] = 3 * i + R(5); var r = previousHigher(a), s = 0, neg = 0; for (var j = 0; j < n; j++) { if (r[j] < 0) neg++; else s += r[j]; } return { length: r.length, minusOnes: neg, sumOfIndexes: s, last: r[n - 1] };',
  }],
  saiMau: [
    { ten: ['O(n²): walk backwards from every minute', 'O(n²): đi lùi từ mỗi phút'], chiHieuNang: true, ma: 'function previousHigher(counts) {\n  var res = [];\n  for (var i = 0; i < counts.length; i++) { var j = i - 1; while (j >= 0 && counts[j] <= counts[i]) j--; res.push(j); }\n  return res;\n}\n' },
    { ten: ['Pops with < (equal counted as busier)', 'Lấy ra với < (bằng nhau bị tính là đông hơn)'], ma: 'function previousHigher(counts) {\n  var res = [], st = [];\n  for (var i = 0; i < counts.length; i++) { while (st.length && counts[st[st.length - 1]] < counts[i]) st.pop(); res.push(st.length ? st[st.length - 1] : -1); st.push(i); }\n  return res;\n}\n' },
  ],
});

/* ── 3. Stack nhớ thêm thông tin: giỏ hàng có hoàn tác + món đắt nhất ── */
function cartMax(ops) {
  var stack = []; // each entry: [price, the max price of the cart at the moment this item was added]
  var out = [];
  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];
    if (op === 'undo') { if (stack.length) stack.pop(); }          // undo on an empty cart does nothing
    else if (op === 'max') out.push(stack.length ? stack[stack.length - 1][1] : null);
    else {                                                         // "add <price>"
      var price = Number(op.slice(4));
      var best = stack.length ? Math.max(price, stack[stack.length - 1][1]) : price;
      stack.push([price, best]); // the max BELOW never changes while this item is on top ⇒ remember it now
    }
  }
  return out;
}
const D3 = bai({
  ten: 'Shopping cart with undo: the priciest item, instantly', kho: 'MEDIUM', phut: 20, ham: 'cartMax',
  en: `<p>The campus shop app has a cart where the only way to remove items is <b>Undo</b> (it removes the most recently added item that is still in the cart). The header shows the price of the most expensive item in the cart and must refresh instantly, even for students who build carts of thousands of stationery items.</p>
<p>Write <code>cartMax(ops)</code>. Each op is one of <code>"add &lt;price&gt;"</code>, <code>"undo"</code> (does nothing if the cart is empty) or <code>"max"</code>. Return the array of answers to the <code>"max"</code> ops, in order — the highest price currently in the cart, or <code>null</code> if the cart is empty.</p>`,
  vi: `<p>App căng-tin trường có giỏ hàng mà cách duy nhất để bỏ món là <b>Hoàn tác</b> (bỏ món được thêm gần nhất còn trong giỏ). Đầu trang hiện giá món đắt nhất trong giỏ và phải cập nhật tức thì, kể cả với sinh viên dồn hàng nghìn món văn phòng phẩm.</p>
<p>Viết <code>cartMax(ops)</code>. Mỗi thao tác là <code>"add &lt;giá&gt;"</code>, <code>"undo"</code> (giỏ rỗng thì không làm gì) hoặc <code>"max"</code>. Trả về mảng câu trả lời của các thao tác <code>"max"</code>, theo thứ tự — giá cao nhất đang có trong giỏ, hoặc <code>null</code> nếu giỏ rỗng.</p>`,
  dauVao: ['ops — array of strings "add P" (P integer), "undo", "max".', 'ops — mảng chuỗi "add P" (P nguyên), "undo", "max".'],
  dauRa: ['(number | null)[] — one entry per "max".', '(number | null)[] — mỗi "max" một phần tử.'],
  rangBuoc: [['0 ≤ ops.length ≤ 200 000; 1 ≤ P ≤ 10⁷.', '0 ≤ ops.length ≤ 200 000; 1 ≤ P ≤ 10⁷.'], ['Target: O(1) per op.', 'Mục tiêu: O(1) mỗi thao tác.']],
  goiY: [
    ['Undo always removes the LAST added item — the cart is a stack. The hard part is "max" after an undo: the old maximum might be the item that just left.', 'Hoàn tác luôn bỏ món thêm SAU CÙNG — giỏ là một stack. Phần khó là "max" sau khi hoàn tác: giá cao nhất cũ có thể chính là món vừa bị bỏ.'],
    ['While an item sits on top, everything below it never changes. So when you push an item, also store "max of the cart including this item" next to it. Undo pops both; "max" reads the top.', 'Khi một món nằm trên đỉnh, mọi thứ bên dưới không đổi. Nên khi đẩy một món, lưu luôn "max của giỏ tính cả món này" bên cạnh. Hoàn tác lấy ra cả hai; "max" đọc đỉnh.'],
  ],
  loi: [
    ['Keeping a single variable <code>maxSoFar</code>: after undoing the 90 000₫ item the header still shows 90 000₫.', 'Giữ một biến <code>maxSoFar</code> duy nhất: sau khi hoàn tác món 90 000₫ đầu trang vẫn hiện 90 000₫.'],
    ['Recomputing <code>Math.max(...cart)</code> on every "max": correct, but O(n) per query — and the spread of 100 000 numbers can even throw <code>RangeError</code>.', 'Tính lại <code>Math.max(...cart)</code> ở mỗi "max": đúng, nhưng O(n) mỗi truy vấn — và spread 100 000 số còn có thể ném <code>RangeError</code>.'],
    ['Comparing prices as strings: <code>"9" &gt; "10"</code>. Convert with <code>Number()</code>.', 'So giá dạng chuỗi: <code>"9" &gt; "10"</code>. Đổi bằng <code>Number()</code>.'],
  ],
  gt: ['The max of a stack only changes at the top, so it can be stored per level: entry k remembers the max of entries 0..k. Push computes it from the previous level in O(1), pop simply discards the level and the level below already holds the right answer, and "max" reads the top. Every op is O(1), O(n) memory for the stack. This is the "stack remembers extra facts" pattern of the lesson (Min Stack) in a different shell.', 'Max của một stack chỉ đổi ở đỉnh, nên lưu được theo từng tầng: phần tử k nhớ max của các phần tử 0..k. Đẩy tính nó từ tầng trước trong O(1), lấy ra chỉ việc bỏ tầng đó và tầng dưới đã giữ sẵn đáp án đúng, còn "max" đọc đỉnh. Mọi thao tác O(1), O(n) bộ nhớ cho stack. Đây là mẫu "stack nhớ thêm thông tin" của bài (Min Stack) trong một vỏ khác.'],
  kn: ['stack', 'augmented stack'],
  tns: [tn('augmented stack', 'stack mang thêm thông tin', 'mỗi tầng lưu thêm một giá trị tổng hợp như max/min.'), tn('undo', 'hoàn tác'), tn('O(1) per operation', 'O(1) mỗi thao tác')],
  dau: `/**
 * ops: string[] — "add <price>", "undo", "max"
 * returns the answers of the "max" ops (null when the cart is empty)
 */
function cartMax(ops) {
  // Write your solution here
  var best = null, out = [];
  for (var op of ops) {
    if (op.startsWith('add ')) best = Math.max(best || 0, Number(op.slice(4)));
    else if (op === 'max') out.push(best);
  }
  return out;
}
`,
  giai: '// Reference solution — every stack level stores (price, max up to this level).\n' + nguon(cartMax),
  cases: [
    { args: [['add 15000', 'add 90000', 'add 32000', 'max', 'undo', 'max', 'undo', 'max']], moTa: ['Undo the 90 000 item ⇒ max falls back', 'Hoàn tác món 90 000 ⇒ max tụt về'] },
    { args: [['max', 'undo', 'add 7000', 'max']], moTa: ['Empty cart ⇒ null; undo on empty does nothing', 'Giỏ rỗng ⇒ null; hoàn tác khi rỗng không làm gì'] },
    { args: [[]], an: true },
    { args: [['add 9', 'add 10', 'max', 'undo', 'max']], an: true, moTa: ['Numbers, not strings', 'So số, không so chuỗi'] },
    { args: [['add 50', 'add 50', 'undo', 'max', 'undo', 'max', 'undo', 'max']], an: true },
    { args: [['add 1', 'add 2', 'add 3', 'undo', 'undo', 'add 1', 'max', 'add 5', 'max', 'undo', 'undo', 'undo', 'max']], an: true },
  ],
  perf: [{
    moTa: ['Performance: 100 000 adds then 100 000 "max" queries (rescanning the cart is O(n) per query)', 'Hiệu năng: 100 000 lần thêm rồi 100 000 truy vấn "max" (quét lại giỏ là O(n) mỗi truy vấn)'],
    than: 'var ops = []; for (var i = 0; i < 100000; i++) ops.push("add " + (1 + R(10000000))); for (var j = 0; j < 100000; j++) ops.push(j % 50 === 49 ? "undo" : "max"); var r = cartMax(ops), s = 0; for (var k = 0; k < r.length; k++) s += r[k]; return { answers: r.length, sum: s, last: r[r.length - 1] };',
  }],
  saiMau: [
    { ten: ['O(n) per "max": rescan the cart', 'O(n) mỗi "max": quét lại giỏ'], chiHieuNang: true, ma: 'function cartMax(ops) {\n  var cart = [], out = [];\n  for (var op of ops) {\n    if (op === "undo") cart.pop();\n    else if (op === "max") { var b = null; for (var x of cart) if (b === null || x > b) b = x; out.push(b); }\n    else cart.push(Number(op.slice(4)));\n  }\n  return out;\n}\n' },
    { ten: ['One running max variable (undo never lowers it)', 'Một biến max chạy (hoàn tác không hạ nó xuống)'], ma: 'function cartMax(ops) {\n  var cart = [], best = null, out = [];\n  for (var op of ops) {\n    if (op === "undo") { cart.pop(); if (!cart.length) best = null; }\n    else if (op === "max") out.push(best);\n    else { var p = Number(op.slice(4)); cart.push(p); best = best === null ? p : Math.max(best, p); }\n  }\n  return out;\n}\n' },
  ],
});

/* ── 4. Đóng góp của từng phần tử: tổng "nút cổ chai" của mọi đoạn ngày ── */
function sumOfBottlenecks(caps) {
  var n = caps.length;
  var left = new Array(n), right = new Array(n), st = [];
  // left[i]: how many start positions make caps[i] the min — stop at the previous STRICTLY smaller value
  for (var i = 0; i < n; i++) {
    while (st.length && caps[st[st.length - 1]] >= caps[i]) st.pop();
    left[i] = i - (st.length ? st[st.length - 1] : -1);
    st.push(i);
  }
  st = [];
  // right[i]: how many end positions — stop at the next smaller OR EQUAL value (ties belong to the leftmost one)
  for (var j = n - 1; j >= 0; j--) {
    while (st.length && caps[st[st.length - 1]] > caps[j]) st.pop();
    right[j] = (st.length ? st[st.length - 1] : n) - j;
    st.push(j);
  }
  var total = 0;
  for (var k = 0; k < n; k++) total += caps[k] * left[k] * right[k]; // caps[k] is the min of left*right ranges
  return total;
}
const D4 = bai({
  ten: 'Capacity planning: the bottleneck of every stretch of days', kho: 'HARD', phut: 35, ham: 'sumOfBottlenecks',
  en: `<p>The exam server's capacity forecast gives <code>caps[i]</code> = how many concurrent students it can serve on day <code>i</code>. A booking of the server for a <b>contiguous stretch</b> of days can only promise the <b>smallest</b> capacity in that stretch (its bottleneck). The planning team wants one number to compare forecasts: the sum of the bottleneck over <b>all</b> contiguous stretches.</p>
<p>Write <code>sumOfBottlenecks(caps)</code> returning <code>Σ min(caps[l..r])</code> over all <code>0 ≤ l ≤ r &lt; n</code>.</p>`,
  vi: `<p>Dự báo sức chứa của máy chủ thi cho <code>caps[i]</code> = số sinh viên đồng thời phục vụ được ở ngày <code>i</code>. Một lần đặt máy chủ cho một <b>chuỗi ngày liên tiếp</b> chỉ hứa được sức chứa <b>nhỏ nhất</b> trong chuỗi đó (nút cổ chai). Nhóm kế hoạch muốn một con số để so các bản dự báo: tổng nút cổ chai của <b>mọi</b> chuỗi ngày liên tiếp.</p>
<p>Viết <code>sumOfBottlenecks(caps)</code> trả về <code>Σ min(caps[l..r])</code> với mọi <code>0 ≤ l ≤ r &lt; n</code>.</p>`,
  dauVao: ['caps — array of positive integers.', 'caps — mảng số nguyên dương.'],
  dauRa: ['A number (it fits exactly in a JS number for these limits).', 'Một số (với giới hạn này vừa chính xác trong số JS).'],
  rangBuoc: [['0 ≤ caps.length ≤ 200 000; 1 ≤ caps[i] ≤ 10⁴ (the answer stays below 2⁵³).', '0 ≤ caps.length ≤ 200 000; 1 ≤ caps[i] ≤ 10⁴ (đáp án luôn dưới 2⁵³).'], ['Target: O(n).', 'Mục tiêu: O(n).']],
  goiY: [
    ['Turn the question around: instead of "what is the min of each stretch", ask "for how many stretches is <code>caps[i]</code> the min?" Then the answer is <code>Σ caps[i] × count(i)</code>.', 'Lật câu hỏi: thay vì "min của từng chuỗi là gì", hỏi "<code>caps[i]</code> là min của bao nhiêu chuỗi?" Khi đó đáp án là <code>Σ caps[i] × count(i)</code>.'],
    ['caps[i] is the min of [l..r] when l lies after the previous smaller value and r before the next smaller value. A monotonic stack finds both boundaries in O(n): count(i) = (i − prevSmaller) × (nextSmaller − i).', 'caps[i] là min của [l..r] khi l nằm sau giá trị nhỏ hơn đứng trước và r nằm trước giá trị nhỏ hơn đứng sau. Monotonic stack tìm cả hai biên trong O(n): count(i) = (i − prevSmaller) × (nextSmaller − i).'],
    ['Ties: with <code>[2, 2]</code> the stretch [0..1] must be counted ONCE. Make one side strict (&lt;) and the other non-strict (≤).', 'Giá trị bằng nhau: với <code>[2, 2]</code> chuỗi [0..1] chỉ được đếm MỘT lần. Cho một phía so ngặt (&lt;), phía kia không ngặt (≤).'],
  ],
  loi: [
    ['Strict on both sides: every stretch whose minimum appears twice is counted twice (<code>[2, 2]</code> gives 8 instead of 6).', 'Ngặt cả hai phía: mọi chuỗi có giá trị min xuất hiện hai lần bị đếm hai lần (<code>[2, 2]</code> ra 8 thay vì 6).'],
    ['Two loops with a running minimum: O(n²) = 2·10¹⁰ steps for 200 000 days.', 'Hai vòng với min chạy: O(n²) = 2·10¹⁰ bước với 200 000 ngày.'],
    ['Taking the result modulo 10⁹+7 out of habit from LeetCode — this task asks for the exact sum.', 'Theo thói quen LeetCode mà lấy dư 10⁹+7 — đề này hỏi tổng chính xác.'],
  ],
  gt: ['Contribution counting: every stretch has exactly one "owner" of its minimum if ties are broken consistently (here: the leftmost equal value owns it, because the left scan stops at a strictly smaller value and the right scan stops at a smaller-or-equal one). The owner i can start anywhere in (prevSmaller, i] and end anywhere in [i, nextSmallerOrEqual), so it owns left[i] × right[i] stretches. Both boundary arrays come from one monotonic-stack pass each — every index pushed and popped at most once ⇒ O(n) time, O(n) memory. The largest possible answer is 10⁴ × n(n+1)/2 ≈ 2·10¹⁴, below 2⁵³, so plain numbers are exact (Java: <code>long</code>).', 'Đếm đóng góp: mỗi chuỗi có đúng một "chủ" của giá trị min nếu phá hoà nhất quán (ở đây: giá trị bằng nhau đứng trái nhất làm chủ, vì lượt quét trái dừng ở giá trị nhỏ hơn hẳn còn lượt quét phải dừng ở giá trị nhỏ hơn hoặc bằng). Chủ i có thể bắt đầu bất cứ đâu trong (prevSmaller, i] và kết thúc bất cứ đâu trong [i, nextSmallerOrEqual), nên nó làm chủ left[i] × right[i] chuỗi. Mỗi mảng biên lấy từ một lượt monotonic stack — mỗi chỉ số vào/ra tối đa một lần ⇒ O(n) thời gian, O(n) bộ nhớ. Đáp án lớn nhất là 10⁴ × n(n+1)/2 ≈ 2·10¹⁴, dưới 2⁵³, nên số thường là chính xác (Java: <code>long</code>).'],
  kn: ['monotonic stack', 'contribution technique'],
  tns: [tn('contribution technique', 'kỹ thuật đếm đóng góp', 'đổi "tổng theo đoạn" thành "mỗi phần tử góp bao nhiêu".'), tn('bottleneck', 'nút cổ chai'), tn('tie-breaking', 'phá hoà', 'quy tắc chọn một khi hai giá trị bằng nhau.'), tn('next smaller element', 'phần tử nhỏ hơn kế tiếp')],
  dau: `/**
 * caps: number[] — capacity per day
 * returns the sum of min(caps[l..r]) over all contiguous stretches l..r
 */
function sumOfBottlenecks(caps) {
  // Write your solution here
  var total = 0;
  for (var i = 0; i < caps.length; i++) total += caps[i];
  return total;
}
`,
  giai: '// Reference solution — contribution counting with two monotonic-stack passes (ties: strict left, non-strict right).\n' + nguon(sumOfBottlenecks),
  cases: [
    { args: [[3, 1, 2, 4]], moTa: ['10 stretches, bottlenecks sum to 17', '10 chuỗi, tổng nút cổ chai 17'] },
    { args: [[2, 2]], moTa: ['Ties: [2], [2], [2,2] ⇒ 6', 'Bằng nhau: [2], [2], [2,2] ⇒ 6'] },
    { args: [[]], an: true },
    { args: [[5]], an: true },
    { args: [[1, 2, 3, 4, 5]], an: true },
    { args: [[4, 4, 4, 4]], an: true },
    { args: [[7, 3, 7, 3, 7, 1, 9]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 days (two nested loops = 2·10¹⁰ steps)', 'Hiệu năng: 200 000 ngày (hai vòng lồng = 2·10¹⁰ bước)'],
    than: 'var n = 200000, a = new Array(n); for (var i = 0; i < n; i++) a[i] = 1 + R(10000); return sumOfBottlenecks(a);',
  }],
  saiMau: [
    { ten: ['O(n²): running minimum from every start', 'O(n²): min chạy từ mỗi điểm đầu'], chiHieuNang: true, ma: 'function sumOfBottlenecks(caps) {\n  var t = 0;\n  for (var l = 0; l < caps.length; l++) { var m = Infinity; for (var r = l; r < caps.length; r++) { if (caps[r] < m) m = caps[r]; t += m; } }\n  return t;\n}\n' },
    { ten: ['Strict on both sides (ties counted twice)', 'Ngặt cả hai phía (bằng nhau bị đếm hai lần)'], ma: 'function sumOfBottlenecks(caps) {\n  var n = caps.length, L = [], Rr = [], st = [];\n  for (var i = 0; i < n; i++) { while (st.length && caps[st[st.length - 1]] > caps[i]) st.pop(); L[i] = i - (st.length ? st[st.length - 1] : -1); st.push(i); }\n  st = [];\n  for (var j = n - 1; j >= 0; j--) { while (st.length && caps[st[st.length - 1]] > caps[j]) st.pop(); Rr[j] = (st.length ? st[st.length - 1] : n) - j; st.push(j); }\n  var t = 0; for (var k = 0; k < n; k++) t += caps[k] * L[k] * Rr[k];\n  return t;\n}\n' },
  ],
});

export default mod('dsa-3-1-stack', '3.1 Stack: matching, monotonic stack, undo', [D1, D2, D3, D4]);
