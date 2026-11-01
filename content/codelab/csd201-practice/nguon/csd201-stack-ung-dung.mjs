/** CSD201 · 2.3 — Ứng dụng ngăn xếp: kiểm ngoặc (báo vị trí lỗi), tính biểu thức hậu tố, trung tố → hậu tố (shunting-yard), undo/redo. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-2-3-brackets',
  tieuDe: { en: 'Balanced brackets — and where the first error is', vi: 'Kiểm tra ngoặc cân bằng — và lỗi đầu tiên nằm ở đâu' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['stack of opening brackets', 'matching pairs', 'three kinds of error'],
  moTa: {
    en: `<p>Complete ${c('static String check(String s)')} for the brackets ${c('()')}, ${c('[]')}, ${c('{}')} (other characters are ignored). Return:</p>
<ul><li>${c('"OK"')} when every bracket is matched;</li>
<li>${c('"MISMATCH at i"')} — a closing bracket at index i does not match the last open one;</li>
<li>${c('"UNEXPECTED at i"')} — a closing bracket at index i with nothing open;</li>
<li>${c('"UNCLOSED at i"')} — the end is reached with brackets still open; i = index of the <b>innermost</b> unclosed one (the top of the stack).</li></ul>
<p>Report the first error from the left. Push the <b>index</b> of every opening bracket, not the character, so you can report positions.</p>`,
    vi: `<p>Hoàn thiện ${c('static String check(String s)')} cho các ngoặc ${c('()')}, ${c('[]')}, ${c('{}')} (ký tự khác bỏ qua). Trả về ${c('"OK"')} khi mọi ngoặc khớp; ${c('"MISMATCH at i"')} — ngoặc đóng ở chỉ số i không khớp ngoặc mở gần nhất; ${c('"UNEXPECTED at i"')} — ngoặc đóng ở chỉ số i mà không có gì đang mở; ${c('"UNCLOSED at i"')} — hết chuỗi mà vẫn còn ngoặc mở, i = chỉ số ngoặc mở <b>trong cùng</b> (đỉnh ngăn xếp).</p>
<p>Báo lỗi đầu tiên tính từ trái. Đẩy <b>chỉ số</b> của mỗi ngoặc mở chứ không phải ký tự, để báo được vị trí.</p>`,
  },
  yeuCau: { en: ['One pass with a stack: O(n).', 'Exact result strings.'], vi: ['Một lượt với ngăn xếp: O(n).', 'Chuỗi kết quả đúng từng chữ.'] },
  dauVao: { en: 'One expression per line.', vi: 'Mỗi dòng một biểu thức.' },
  dauRa: { en: 'OK or the first error.', vi: 'OK hoặc lỗi đầu tiên.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ lenh: '                r = Brackets.check(line);' }) },
  tep: {
    'Brackets.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class Brackets {

    static String check(String s) {
        //>> return "OK"; // TODO: a stack of indexes of opening brackets
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (ch == '(' || ch == '[' || ch == '{') {
                st.push(i);
            } else if (ch == ')' || ch == ']' || ch == '}') {
                if (st.isEmpty()) {
                    return "UNEXPECTED at " + i;
                }
                char open = s.charAt(st.pop());
                if ("([{".indexOf(open) != ")]}".indexOf(ch)) {
                    return "MISMATCH at " + i;
                }
            }
        }
        return st.isEmpty() ? "OK" : "UNCLOSED at " + st.peek();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the three errors and OK', vi: 'ba loại lỗi và OK' }, vao: '{a[(b+c)*d]}\n(a+b]\na+b)\n((a)\n[{()}]()\n' },
    { ten: { en: 'empty-ish lines, nested unclosed, first error wins', vi: 'dòng gần rỗng, lồng chưa đóng, lỗi đầu tiên thắng' }, vao: 'x\n{[(\n)(\n([)]\nif (a[i] > 0) { f(x); }\n', an: true },
  ],
  goiY: [
    { en: 'Opening bracket: push its index. Closing bracket: if the stack is empty → UNEXPECTED; otherwise pop and compare the kinds.', vi: 'Ngoặc mở: đẩy chỉ số của nó. Ngoặc đóng: ngăn xếp rỗng → UNEXPECTED; ngược lại pop và so loại ngoặc.' },
    { en: '"([{".indexOf(open) == ")]}".indexOf(close) tells whether two brackets form a pair.', vi: '"([{".indexOf(open) == ")]}".indexOf(close) cho biết hai ngoặc có thành cặp không.' },
  ],
  loiHayGap: [
    { en: 'Counting brackets instead of stacking them — "([)]" has the right counts but is not balanced.', vi: 'Đếm số ngoặc thay vì dùng ngăn xếp — "([)]" đủ số lượng nhưng không cân bằng.' },
    { en: 'Forgetting the end check — "((a)" leaves an open bracket and must not be OK.', vi: 'Quên kiểm khi hết chuỗi — "((a)" còn một ngoặc mở và không được là OK.' },
  ],
  giaiThich: { en: '<p>The most recently opened bracket must be closed first — exactly LIFO, so a stack fits. Each character is pushed and popped at most once: O(n). The same idea checks HTML tags and matches begin/end blocks in compilers.</p>', vi: '<p>Ngoặc mở gần nhất phải được đóng trước — đúng LIFO, nên ngăn xếp vừa khít. Mỗi ký tự được đẩy và lấy ra tối đa một lần: O(n). Cùng ý tưởng kiểm thẻ HTML và khớp khối begin/end trong trình biên dịch.</p>' },
});

const de2 = deJava({
  id: 'csd201-2-3-postfix-eval',
  tieuDe: { en: 'Evaluate a postfix (RPN) expression', vi: 'Tính giá trị biểu thức hậu tố (RPN)' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['postfix notation', 'operand stack', 'order of operands for - and /', 'error handling'],
  moTa: {
    en: `<p>Complete ${c('static String eval(String expr)')}: tokens are separated by spaces; numbers are integers (maybe negative, e.g. ${c('-3')}), operators are ${c('+ - * /')} (integer division, as in Java). Return the result as text, or:</p>
<ul><li>${c('"ERROR: not enough operands"')} — an operator finds fewer than two values on the stack;</li>
<li>${c('"ERROR: too many operands"')} — more than one value is left at the end (or none: an empty expression);</li>
<li>${c('"ERROR: division by zero"')}.</li></ul>
<p>${c('"5 1 2 + 4 * + 3 -"')} → ${c('"14"')}. Mind the order: for ${c('a b -')} the stack gives ${c('b')} first.</p>`,
    vi: `<p>Hoàn thiện ${c('static String eval(String expr)')}: các token cách nhau dấu cách; số là số nguyên (có thể âm, vd ${c('-3')}), toán tử là ${c('+ - * /')} (chia nguyên như Java). Trả về kết quả dạng chữ, hoặc ${c('"ERROR: not enough operands"')} — toán tử gặp ít hơn hai giá trị trên ngăn xếp; ${c('"ERROR: too many operands"')} — cuối cùng còn hơn một giá trị (hoặc không còn gì: biểu thức rỗng); ${c('"ERROR: division by zero"')}.</p>
<p>${c('"5 1 2 + 4 * + 3 -"')} → ${c('"14"')}. Cẩn thận thứ tự: với ${c('a b -')} ngăn xếp trả ${c('b')} trước.</p>`,
  },
  yeuCau: { en: ['One pass, a stack of long values.', 'Exact error strings.'], vi: ['Một lượt, ngăn xếp các giá trị long.', 'Chuỗi lỗi đúng từng chữ.'] },
  dauVao: { en: 'One expression per line.', vi: 'Mỗi dòng một biểu thức.' },
  dauRa: { en: 'The value or the error.', vi: 'Giá trị hoặc lỗi.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ lenh: '                r = Postfix.eval(line);' }) },
  tep: {
    'Postfix.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class Postfix {

    static String eval(String expr) {
        //>> return "0"; // TODO
        Deque<Long> st = new ArrayDeque<>();
        for (String t : expr.trim().split("\\s+")) {
            if (t.isEmpty()) {
                continue;
            }
            if (t.length() == 1 && "+-*/".indexOf(t.charAt(0)) >= 0) {
                if (st.size() < 2) {
                    return "ERROR: not enough operands";
                }
                long b = st.pop(); // the RIGHT operand comes off first
                long a = st.pop();
                char op = t.charAt(0);
                if (op == '/' && b == 0) {
                    return "ERROR: division by zero";
                }
                st.push(op == '+' ? a + b : op == '-' ? a - b : op == '*' ? a * b : a / b);
            } else {
                st.push(Long.parseLong(t));
            }
        }
        return st.size() == 1 ? String.valueOf(st.pop()) : "ERROR: too many operands";
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ examples and operand order', vi: 'ví dụ của slide và thứ tự toán hạng' }, vao: '5 1 2 + 4 * + 3 -\n2 3 4 * +\n10 3 -\n10 3 /\n-7 2 /\n' },
    { ten: { en: 'errors', vi: 'các lỗi' }, vao: '1 +\n1 2\n4 0 /\n7\n+\n', an: true },
    { ten: { en: 'big values need long', vi: 'giá trị lớn cần long' }, vao: '100000 100000 * 3 *\n2147483647 1 +\n', an: true },
  ],
  goiY: [
    { en: 'A number: push it. An operator: pop b, then pop a, push a op b.', vi: 'Gặp số: đẩy vào. Gặp toán tử: pop b, rồi pop a, đẩy a op b.' },
    { en: 'A token is an operator only when it is exactly one of + - * / — "-3" is a number.', vi: 'Token là toán tử chỉ khi nó đúng là một trong + - * / — "-3" là số.' },
  ],
  loiHayGap: [
    { en: 'a = pop(), b = pop() — then 10 3 - gives -7 and 10 3 / gives 0.', vi: 'a = pop(), b = pop() — khi đó 10 3 - ra -7 và 10 3 / ra 0.' },
    { en: 'Treating "-7" as the minus operator because it starts with "-".', vi: 'Coi "-7" là toán tử trừ vì nó bắt đầu bằng "-".' },
  ],
  giaiThich: { en: '<p>Postfix needs no parentheses and no precedence: each operator applies to the two most recent values, which are the top two of the stack. One pass, O(n). This is how the JVM itself executes expressions — on an operand stack.</p>', vi: '<p>Hậu tố không cần ngoặc và độ ưu tiên: mỗi toán tử áp lên hai giá trị gần nhất, chính là hai giá trị trên đỉnh ngăn xếp. Một lượt, O(n). Đó cũng là cách JVM thực thi biểu thức — trên ngăn xếp toán hạng.</p>' },
});

const de3 = deJava({
  id: 'csd201-2-3-infix-to-postfix',
  tieuDe: { en: 'Infix to postfix with the shunting-yard algorithm', vi: 'Trung tố sang hậu tố bằng thuật toán shunting-yard' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['operator stack', 'precedence', 'left associativity', 'parentheses'],
  moTa: {
    en: `<p>Complete ${c('static String toPostfix(String infix)')}: operands are single letters or digits, operators ${c('+ - * /')} (left-associative, ${c('* /')} before ${c('+ -')}), parentheses allowed, spaces ignored. Return the postfix tokens separated by one space: ${c('"a+b*(c-d)/e"')} → ${c('"a b c d - * e / +"')}.</p>
<p>Rules: an operand goes straight to the output; an operator first pops to the output every operator on the stack with <b>greater or equal</b> precedence (stopping at ${c('(')}), then is pushed; ${c('(')} is pushed; ${c(')')} pops until the matching ${c('(')} (which is discarded). At the end pop everything. You may assume the input is well formed.</p>`,
    vi: `<p>Hoàn thiện ${c('static String toPostfix(String infix)')}: toán hạng là một chữ cái hoặc chữ số, toán tử ${c('+ - * /')} (kết hợp trái, ${c('* /')} trước ${c('+ -')}), có ngoặc, bỏ qua dấu cách. Trả về các token hậu tố cách nhau một dấu cách: ${c('"a+b*(c-d)/e"')} → ${c('"a b c d - * e / +"')}.</p>
<p>Luật: toán hạng ra thẳng output; toán tử trước hết pop ra output mọi toán tử trên ngăn xếp có độ ưu tiên <b>lớn hơn hoặc bằng</b> (dừng ở ${c('(')}), rồi mới được đẩy vào; ${c('(')} được đẩy vào; ${c(')')} pop tới ${c('(')} tương ứng (bỏ ${c('(')} đi). Cuối cùng pop hết. Được giả sử đầu vào hợp lệ.</p>`,
  },
  yeuCau: { en: ['One pass with an operator stack: O(n).', 'Tokens separated by exactly one space.'], vi: ['Một lượt với ngăn xếp toán tử: O(n).', 'Token cách nhau đúng một dấu cách.'] },
  dauVao: { en: 'One infix expression per line.', vi: 'Mỗi dòng một biểu thức trung tố.' },
  dauRa: { en: 'The postfix form.', vi: 'Dạng hậu tố.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ lenh: '                r = Shunting.toPostfix(line);' }) },
  tep: {
    'Shunting.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class Shunting {

    //>> // TODO: helper(s)
    private static int prec(char op) {
        return op == '*' || op == '/' ? 2 : op == '+' || op == '-' ? 1 : 0; // '(' has 0: never popped by an operator
    }
    //<<

    static String toPostfix(String infix) {
        //>> return ""; // TODO
        StringBuilder out = new StringBuilder();
        Deque<Character> ops = new ArrayDeque<>();
        for (char ch : infix.toCharArray()) {
            if (ch == ' ') {
                continue;
            }
            if (Character.isLetterOrDigit(ch)) {
                out.append(ch).append(' ');
            } else if (ch == '(') {
                ops.push(ch);
            } else if (ch == ')') {
                while (ops.peek() != '(') {
                    out.append(ops.pop()).append(' ');
                }
                ops.pop(); // discard '('
            } else {
                while (!ops.isEmpty() && prec(ops.peek()) >= prec(ch)) { // >= : left associative
                    out.append(ops.pop()).append(' ');
                }
                ops.push(ch);
            }
        }
        while (!ops.isEmpty()) {
            out.append(ops.pop()).append(' ');
        }
        return out.toString().trim();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'precedence and parentheses', vi: 'độ ưu tiên và ngoặc' }, vao: 'a+b*(c-d)/e\na+b*c\n(a+b)*c\na*b+c\n' },
    { ten: { en: 'left associativity', vi: 'kết hợp trái' }, vao: 'a-b-c\na/b*c\n8-2+3\n', an: true },
    { ten: { en: 'nested parentheses and spaces', vi: 'ngoặc lồng nhau và dấu cách' }, vao: '((a))\na * ( b + ( c - d ) * e )\n( 1 + 2 ) * ( 3 + 4 ) / 5\nx\n', an: true },
  ],
  goiY: [
    { en: 'Give "(" the lowest precedence (0) so that no operator ever pops it — only ")" removes it.', vi: 'Cho "(" độ ưu tiên thấp nhất (0) để không toán tử nào pop nó — chỉ ")" mới gỡ nó.' },
    { en: 'Pop while the top has precedence >= the incoming one: that makes a-b-c come out as a b - c - (left to right).', vi: 'Pop khi đỉnh có độ ưu tiên >= toán tử đang vào: nhờ vậy a-b-c ra a b - c - (trái sang phải).' },
  ],
  loiHayGap: [
    { en: 'Popping only on strictly greater precedence — a-b-c becomes a b c - -, which means a-(b-c).', vi: 'Chỉ pop khi ưu tiên lớn hơn hẳn — a-b-c thành a b c - -, nghĩa là a-(b-c).' },
    { en: 'Appending "(" or ")" to the output — postfix has no parentheses.', vi: 'Đưa "(" hay ")" ra output — hậu tố không có ngoặc.' },
  ],
  giaiThich: { en: '<p>Operators wait on the stack until an operator that binds less tightly (or a closing parenthesis, or the end) arrives; at that moment everything above it is complete and goes to the output. Each token is pushed and popped at most once: O(n). Dijkstra designed it for the first ALGOL compilers.</p>', vi: '<p>Toán tử chờ trên ngăn xếp tới khi gặp toán tử ràng buộc lỏng hơn (hoặc ngoặc đóng, hoặc hết chuỗi); lúc đó mọi thứ phía trên đã đủ và ra output. Mỗi token được đẩy và lấy ra tối đa một lần: O(n). Dijkstra thiết kế nó cho các trình biên dịch ALGOL đầu tiên.</p>' },
});

const de4 = deJava({
  id: 'csd201-2-3-undo-redo',
  tieuDe: { en: 'Undo and redo with two stacks', vi: 'Undo và redo bằng hai ngăn xếp' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['undo stack', 'redo stack', 'a new action clears redo'],
  moTa: {
    en: `<p>A tiny text editor. ${c('Editor')} keeps the text in a ${c('StringBuilder')}; actions are ${c('type(String s)')} (append) and ${c('delete(int k)')} (remove the last k characters, fewer if the text is shorter). ${c('undo()')} reverts the last action, ${c('redo()')} re-applies the last undone one; both return false when there is nothing to do. Any new action <b>clears</b> the redo history.</p>
<p>Store on the undo stack what is needed to revert: for ${c('type')} the length typed, for ${c('delete')} the characters actually removed.</p>`,
    vi: `<p>Một trình soạn thảo tí hon. ${c('Editor')} giữ văn bản trong ${c('StringBuilder')}; thao tác gồm ${c('type(s)')} (nối thêm) và ${c('delete(k)')} (xoá k ký tự cuối, ít hơn nếu văn bản ngắn hơn). ${c('undo()')} hoàn tác thao tác gần nhất, ${c('redo()')} làm lại thao tác vừa hoàn tác; cả hai trả false khi không có gì để làm. Thao tác mới nào cũng <b>xoá sạch</b> lịch sử redo.</p>
<p>Lưu trên ngăn xếp undo những gì cần để hoàn tác: với ${c('type')} là chuỗi đã gõ, với ${c('delete')} là các ký tự đã thực sự bị xoá.</p>`,
  },
  yeuCau: { en: ['Two stacks (Deque) of actions.', 'undo and redo are O(length of the action).'], vi: ['Hai ngăn xếp (Deque) các thao tác.', 'undo và redo là O(độ dài thao tác).'] },
  dauVao: { en: 'TYPE text · DEL k · UNDO · REDO.', vi: 'TYPE chữ · DEL k · UNDO · REDO.' },
  dauRa: { en: 'Result and the text.', vi: 'Kết quả và văn bản.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        Editor t = new Editor();',
      lenh: `                if (p[0].equals("TYPE")) {
                    t.type(line.substring(5));
                } else if (p[0].equals("DEL")) {
                    t.delete(n(1));
                } else if (p[0].equals("UNDO")) {
                    r = String.valueOf(t.undo());
                } else {
                    r = String.valueOf(t.redo());
                }`,
      trangThai: '"text=\\"" + t.text() + "\\""',
    }),
  },
  tep: {
    'Editor.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class Editor {
    private final StringBuilder text = new StringBuilder();
    //>> // TODO: fields (two stacks)
    // an action: kind 'T' (typed s) or 'D' (deleted s)
    private static final class Action {
        final char kind;
        final String s;

        Action(char kind, String s) {
            this.kind = kind;
            this.s = s;
        }
    }

    private final Deque<Action> undo = new ArrayDeque<>();
    private final Deque<Action> redo = new ArrayDeque<>();

    private void apply(Action a) {
        if (a.kind == 'T') {
            text.append(a.s);
        } else {
            text.setLength(text.length() - a.s.length());
        }
    }

    private void revert(Action a) {
        if (a.kind == 'T') {
            text.setLength(text.length() - a.s.length());
        } else {
            text.append(a.s);
        }
    }
    //<<

    public String text() {
        return text.toString();
    }

    public void type(String s) {
        //>> text.append(s); // TODO: record the action, clear redo
        Action a = new Action('T', s);
        apply(a);
        undo.push(a);
        redo.clear();
        //<<
    }

    public void delete(int k) {
        //>> // TODO
        int m = Math.min(k, text.length());
        Action a = new Action('D', text.substring(text.length() - m));
        apply(a);
        undo.push(a);
        redo.clear();
        //<<
    }

    public boolean undo() {
        //>> return false; // TODO
        if (undo.isEmpty()) {
            return false;
        }
        Action a = undo.pop();
        revert(a);
        redo.push(a);
        return true;
        //<<
    }

    public boolean redo() {
        //>> return false; // TODO
        if (redo.isEmpty()) {
            return false;
        }
        Action a = redo.pop();
        apply(a);
        undo.push(a);
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'type, delete, undo, redo', vi: 'gõ, xoá, undo, redo' }, vao: 'TYPE hello\nTYPE  world\nDEL 3\nUNDO\nUNDO\nREDO\nREDO\nREDO\nUNDO\n' },
    { ten: { en: 'a new action clears redo; delete more than the text', vi: 'thao tác mới xoá redo; xoá nhiều hơn văn bản' }, vao: 'UNDO\nTYPE ab\nDEL 10\nUNDO\nUNDO\nREDO\nTYPE c\nREDO\nUNDO\nUNDO\nUNDO\n', an: true },
  ],
  goiY: [
    { en: 'Represent each action as (kind, string). Applying "typed s" appends s; reverting it cuts s.length() characters. "Deleted s" is the mirror image.', vi: 'Biểu diễn mỗi thao tác là (loại, chuỗi). Áp dụng "đã gõ s" là nối s; hoàn tác là cắt s.length() ký tự. "Đã xoá s" là ảnh gương.' },
    { en: 'undo: pop from undo, revert, push on redo. redo: pop from redo, apply, push on undo. type/delete: apply, push on undo, clear redo.', vi: 'undo: pop khỏi undo, hoàn tác, đẩy vào redo. redo: pop khỏi redo, áp dụng, đẩy vào undo. type/delete: áp dụng, đẩy vào undo, xoá redo.' },
  ],
  loiHayGap: [
    { en: 'Recording delete(k) as "k characters" — after undo you no longer know WHICH characters to put back.', vi: 'Ghi delete(k) là "k ký tự" — sau khi undo không còn biết phải trả lại NHỮNG ký tự nào.' },
    { en: 'Not clearing redo on a new action — redo then re-applies an action from a history that no longer exists.', vi: 'Không xoá redo khi có thao tác mới — redo sau đó áp lại một thao tác của lịch sử không còn tồn tại.' },
  ],
  giaiThich: { en: '<p>The last action done is the first to undo (LIFO), and the last undone is the first to redo (LIFO again): two stacks. Storing the removed text makes every action reversible. Editors and IDEs implement exactly this "command" pattern.</p>', vi: '<p>Thao tác làm sau cùng được hoàn tác đầu tiên (LIFO), thao tác hoàn tác sau cùng được làm lại đầu tiên (lại LIFO): hai ngăn xếp. Lưu phần chữ đã xoá làm mọi thao tác đều đảo ngược được. Trình soạn thảo và IDE cài đúng mẫu "command" này.</p>' },
});

export default moDun({ slug: 'csd201-stack-ung-dung', ten: '2.3 Stack applications: brackets, RPN, undo', de: [de1, de2, de3, de4] });
