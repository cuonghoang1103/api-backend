/** CSD201 · 3.4 — Thiết kế đệ quy & khử đệ quy đuôi: đuôi → vòng lặp, loang vùng bằng ngăn xếp tường minh, phân tích cú pháp đệ quy xuống. */
import { moDun, deJava, deQuy, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-3-4-tail-to-loop',
  tieuDe: { en: 'Eliminate the tail call: three tail-recursive functions become loops', vi: 'Khử lời gọi đuôi: ba hàm đệ quy đuôi thành vòng lặp' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['tail recursion', 'accumulator parameter', 'parameters become loop variables', 'StackOverflowError'],
  moTa: {
    en: `<p>The starter has three <b>tail-recursive</b> functions — the recursive call is the very last thing each one does:</p>
<ul><li>${c('sumTo(long n, long acc)')} — 1 + 2 + … + n (plus acc);</li>
<li>${c('gcd(long a, long b)')} — Euclid;</li>
<li>${c('indexOf(int[] a, int key, int lo, int hi)')} — binary search on a sorted array, −1 if absent.</li></ul>
<p>Java does not eliminate tail calls, so ${c('sumTo(10_000_000, 0)')} throws ${c('StackOverflowError')}. Rewrite all three as loops: each parameter becomes a variable that the loop updates exactly as the recursive call would. Rule R1 forbids any of them calling itself.</p>`,
    vi: `<p>Bản khởi đầu có ba hàm <b>đệ quy đuôi</b> — lời gọi đệ quy là việc cuối cùng mỗi hàm làm: ${c('sumTo(n, acc)')} — 1 + 2 + … + n (cộng acc); ${c('gcd(a, b)')} — Euclid; ${c('indexOf(a, key, lo, hi)')} — tìm nhị phân trên mảng đã sắp, không có thì −1.</p>
<p>Java không khử lời gọi đuôi, nên ${c('sumTo(10_000_000, 0)')} ném ${c('StackOverflowError')}. Viết lại cả ba bằng vòng lặp: mỗi tham số thành một biến được vòng lặp cập nhật đúng như lời gọi đệ quy sẽ làm. Luật R1 cấm hàm nào tự gọi chính nó.</p>`,
  },
  yeuCau: { en: ['Same results as the recursive versions.', 'No recursion (rule R1).'], vi: ['Kết quả giống bản đệ quy.', 'Không đệ quy (luật R1).'] },
  dauVao: { en: 'SUM n · GCD a b · FIND n key (array 0, 3, 6, …).', vi: 'SUM n · GCD a b · FIND n key (mảng 0, 3, 6, …).' },
  dauRa: { en: 'The results.', vi: 'Các kết quả.' },
  main: 'KiemTra',
  quyTac: [deQuy('no', 'Tail')],
  hen: { n: '10,000,000', ms: 3000, can: 'a loop (O(1) stack)', cham: 'tail recursion (one stack frame per step)', en: 'Ten million nested calls overflow the stack: the case prints THROWS StackOverflowError.', vi: 'Mười triệu lời gọi lồng nhau tràn ngăn xếp: ca in THROWS StackOverflowError.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("SUM")) {
                    final long k = Long.parseLong(p[1]);
                    final long[] v = new long[1];
                    r = Kiem.hen("sumTo(" + k + ")", 3000, new Runnable() {
                        public void run() {
                            v[0] = Tail.sumTo(k, 0);
                        }
                    }) + " = " + v[0];
                } else if (p[0].equals("GCD")) {
                    r = String.valueOf(Tail.gcd(Long.parseLong(p[1]), Long.parseLong(p[2])));
                } else {
                    int[] a = new int[n(1)];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = 3 * i;
                    }
                    r = String.valueOf(Tail.indexOf(a, n(2), 0, a.length - 1));
                }`,
    }),
  },
  tep: {
    'Tail.java': j`
public class Tail {

    static long sumTo(long n, long acc) {
        //>> if (n == 0) { ⏎     return acc; ⏎ } ⏎ return sumTo(n - 1, acc + n); // TODO: make it a loop
        while (n != 0) {
            acc += n;
            n--;
        }
        return acc;
        //<<
    }

    static long gcd(long a, long b) {
        //>> if (b == 0) { ⏎     return a; ⏎ } ⏎ return gcd(b, a % b); // TODO: make it a loop
        while (b != 0) {
            long t = a % b;
            a = b;
            b = t;
        }
        return a;
        //<<
    }

    static int indexOf(int[] a, int key, int lo, int hi) {
        //>> if (lo > hi) { ⏎     return -1; ⏎ } ⏎ int mid = (lo + hi) >>> 1; ⏎ if (a[mid] == key) { ⏎     return mid; ⏎ } ⏎ return key < a[mid] ? indexOf(a, key, lo, mid - 1) : indexOf(a, key, mid + 1, hi); // TODO: make it a loop
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] == key) {
                return mid;
            }
            if (key < a[mid]) {
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        return -1;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small values', vi: 'giá trị nhỏ' }, vao: 'SUM 10\nSUM 0\nGCD 48 18\nGCD 7 0\nFIND 10 27\nFIND 10 28\nFIND 0 5\n' },
    { ten: { en: 'deep: ten million steps', vi: 'sâu: mười triệu bước' }, vao: 'SUM 10000000\nGCD 1000000000000 999999999999\nFIND 1000000 2999997\n', an: true },
  ],
  goiY: [
    { en: 'A tail call f(x′, y′) at the end of f(x, y) means: "set x = x′, y = y′ and start again" — that is a while loop around the body.', vi: 'Lời gọi đuôi f(x′, y′) ở cuối f(x, y) nghĩa là: "gán x = x′, y = y′ rồi làm lại từ đầu" — chính là vòng while bao quanh thân hàm.' },
    { en: 'The base case becomes the loop exit: while (!base) { update the parameters } return the base value.', vi: 'Trường hợp cơ sở thành điều kiện thoát vòng: while (!cơ sở) { cập nhật tham số } trả giá trị cơ sở.' },
  ],
  loiHayGap: [
    { en: 'Updating a before computing a % b in gcd — use a temporary.', vi: 'Cập nhật a trước khi tính a % b trong gcd — dùng biến tạm.' },
    { en: 'Keeping the recursion and raising the stack with -Xss — works on your machine, not on the grader’s (and not in the exam).', vi: 'Giữ đệ quy rồi nới ngăn xếp bằng -Xss — chạy trên máy bạn, không chạy trên máy chấm (và phòng thi).' },
  ],
  giaiThich: { en: '<p>In a tail call nothing remains to be done after the call returns, so the current frame is useless — a loop reuses the same variables instead. The result is the same algorithm with O(1) stack space; compilers of Scheme or Kotlin (tailrec) do this automatically, javac does not.</p>', vi: '<p>Ở lời gọi đuôi không còn việc gì sau khi lời gọi trả về, nên khung hiện tại vô dụng — vòng lặp dùng lại chính các biến đó. Kết quả là cùng thuật toán với O(1) bộ nhớ ngăn xếp; trình biên dịch Scheme hay Kotlin (tailrec) tự làm việc này, javac thì không.</p>' },
});

const de2 = deJava({
  id: 'csd201-3-4-flood-fill-stack',
  tieuDe: { en: 'Flood fill with an explicit stack: regions of a 2000 × 2000 map', vi: 'Loang vùng bằng ngăn xếp tường minh: các vùng của bản đồ 2000 × 2000' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['replacing recursion by a stack', 'marking visited cells when pushed', '4-neighbourhood'],
  moTa: {
    en: `<p>A map is a grid of ${c("'#'")} (land) and ${c("'.'")} (water). Complete ${c('static int[] regions(char[][] g)')}: the sizes of all land regions (cells connected up/down/left/right), in the order their top-left-most first cell is met when scanning rows top to bottom, left to right.</p>
<p>The natural recursive flood fill visits one cell per call — a region of four million cells needs four million nested calls and overflows the stack. Use a ${c('Deque<int[]>')} (or two int arrays) as an explicit stack; mark a cell when you <b>push</b> it so no cell is pushed twice.</p>`,
    vi: `<p>Bản đồ là lưới ${c("'#'")} (đất) và ${c("'.'")} (nước). Hoàn thiện ${c('static int[] regions(char[][] g)')}: kích thước mọi vùng đất (các ô nối nhau theo trên/dưới/trái/phải), theo thứ tự gặp ô đầu tiên của vùng khi quét hàng từ trên xuống, trái sang phải.</p>
<p>Loang đệ quy tự nhiên ghé một ô mỗi lời gọi — vùng bốn triệu ô cần bốn triệu lời gọi lồng nhau và tràn ngăn xếp. Dùng ${c('Deque<int[]>')} (hoặc hai mảng int) làm ngăn xếp tường minh; đánh dấu ô khi <b>đẩy</b> nó vào để không ô nào bị đẩy hai lần.</p>`,
  },
  yeuCau: { en: ['No recursion (rule R1); O(rows × cols).', 'Do not change g (use your own visited array).'], vi: ['Không đệ quy (luật R1); O(hàng × cột).', 'Không sửa g (dùng mảng đánh dấu riêng).'] },
  dauVao: { en: 'A grid (lines of # and .), then an empty line — or BIG for the large test.', vi: 'Một lưới (các dòng # và .), rồi một dòng trống — hoặc BIG cho phép thử lớn.' },
  dauRa: { en: 'The region sizes.', vi: 'Kích thước các vùng.' },
  main: 'KiemTra',
  quyTac: [deQuy('no', 'Flood')],
  hen: { n: '2000 × 2000 land cells (one region)', ms: 4000, can: 'O(rows × cols) with an explicit stack', cham: 'recursive flood fill', en: 'Four million nested calls: StackOverflowError.', vi: 'Bốn triệu lời gọi lồng nhau: StackOverflowError.' },
  harness: {
    'KiemTra.java': j`
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> rows = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.equals("BIG")) {
                final char[][] g = new char[2000][2000];
                for (char[] row : g) {
                    Arrays.fill(row, '#');
                }
                for (int i = 1; i < 2000; i += 2) {
                    for (int k = 0; k < 1999; k++) {
                        g[i][(i / 2) % 2 == 0 ? k + 1 : k] = '.'; // a snake: one long winding region
                    }
                }
                final int[][] res = new int[1][];
                System.out.println(Kiem.hen("2000 x 2000 snake", 4000, new Runnable() {
                    public void run() {
                        res[0] = Flood.regions(g);
                    }
                }) + ", regions " + (res[0] == null ? "-" : Arrays.toString(res[0])));
                continue;
            }
            if (!line.isEmpty()) {
                rows.add(line);
                continue;
            }
            print(rows);
            rows.clear();
        }
        if (!rows.isEmpty()) {
            print(rows);
        }
    }

    static void print(List<String> rows) {
        char[][] g = new char[rows.size()][];
        for (int i = 0; i < g.length; i++) {
            g[i] = rows.get(i).toCharArray();
        }
        String before = Arrays.deepToString(g);
        int[] res = Flood.regions(g);
        System.out.println(rows.size() + " row(s) -> " + Arrays.toString(res) + (before.equals(Arrays.deepToString(g)) ? "" : " (the grid was CHANGED)"));
    }
}
`,
  },
  tep: {
    'Flood.java': j`
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

public class Flood {

    static int[] regions(char[][] g) {
        //>> return new int[0]; // TODO: scan, and fill each new region with an explicit stack
        int rows = g.length;
        List<Integer> sizes = new ArrayList<>();
        boolean[][] seen = new boolean[rows][];
        for (int r = 0; r < rows; r++) {
            seen[r] = new boolean[g[r].length];
        }
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        Deque<int[]> st = new ArrayDeque<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < g[r].length; c++) {
                if (g[r][c] != '#' || seen[r][c]) {
                    continue;
                }
                int size = 0;
                seen[r][c] = true;
                st.push(new int[] {r, c});
                while (!st.isEmpty()) {
                    int[] cell = st.pop();
                    size++;
                    for (int d = 0; d < 4; d++) {
                        int nr = cell[0] + dr[d];
                        int nc = cell[1] + dc[d];
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < g[nr].length && g[nr][nc] == '#' && !seen[nr][nc]) {
                            seen[nr][nc] = true; // mark when pushed: never pushed twice
                            st.push(new int[] {nr, nc});
                        }
                    }
                }
                sizes.add(size);
            }
        }
        int[] res = new int[sizes.size()];
        for (int i = 0; i < res.length; i++) {
            res[i] = sizes.get(i);
        }
        return res;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'islands, diagonal cells are not connected', vi: 'các đảo, ô chéo không nối nhau' }, vao: '##..#\n#..##\n...#.\n#.#..\n\n#.#\n.#.\n#.#\n\n...\n...\n' },
    { ten: { en: 'one big U-shaped region, a ring with a lake', vi: 'một vùng lớn hình chữ U, một vòng có hồ' }, vao: '#...#\n#...#\n#####\n\n#####\n#...#\n#.#.#\n#...#\n#####\n', an: true },
    { ten: { en: 'complexity check (a winding region of two million cells)', vi: 'kiểm độ phức tạp (một vùng uốn khúc hai triệu ô)' }, vao: 'BIG\n', an: true },
  ],
  goiY: [
    { en: 'Scan every cell; an unvisited land cell starts a new region: push it, then pop cells and push their unvisited land neighbours until the stack is empty.', vi: 'Quét mọi ô; ô đất chưa thăm bắt đầu một vùng mới: đẩy nó vào, rồi pop từng ô và đẩy các ô đất kề chưa thăm cho tới khi ngăn xếp rỗng.' },
    { en: 'Mark a cell visited when you PUSH it — marking when you pop lets the same cell be pushed by several neighbours.', vi: 'Đánh dấu ô đã thăm khi ĐẨY nó vào — đánh dấu khi pop thì cùng một ô bị nhiều hàng xóm đẩy vào.' },
  ],
  loiHayGap: [
    { en: 'Recursive fill(r, c) — fine on small maps, StackOverflowError on the big snake.', vi: 'fill(r, c) đệ quy — ổn với bản đồ nhỏ, StackOverflowError với con rắn lớn.' },
    { en: 'Marking visited by writing \'.\' into g — the caller’s map is destroyed (the grader checks it).', vi: 'Đánh dấu bằng cách ghi \'.\' vào g — bản đồ của người gọi bị phá (máy chấm kiểm).' },
  ],
  giaiThich: { en: '<p>The explicit stack holds exactly what the call stack would have held (the cells still to expand), but on the heap, where millions of entries are fine. Each cell is pushed and popped at most once and looks at four neighbours: O(rows × cols).</p>', vi: '<p>Ngăn xếp tường minh giữ đúng những gì ngăn xếp lời gọi lẽ ra giữ (các ô còn phải loang), nhưng trên heap, nơi hàng triệu phần tử không thành vấn đề. Mỗi ô được đẩy và lấy ra tối đa một lần, xem bốn ô kề: O(hàng × cột).</p>' },
});

const de3 = deJava({
  id: 'csd201-3-4-recursive-descent',
  tieuDe: { en: 'A recursive-descent calculator: expression → term → factor', vi: 'Máy tính đệ quy xuống: expression → term → factor' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['grammar rules as mutually recursive functions', 'precedence from the grammar', 'unary minus', 'position in the input'],
  moTa: {
    en: `<p>Design the recursion from a grammar:</p>
<pre>expr   = term   { ("+" | "-") term }
term   = factor { ("*" | "/") factor }
factor = number | "(" expr ")" | "-" factor</pre>
<p>Complete ${c('Calc.eval(String s)')}: return the value as text, or ${c('"ERROR: division by zero"')}. Numbers are non-negative integers, spaces may appear anywhere, division is integer division (Java ${c('/')}), values fit in a long. One function per rule, sharing a position field; the input is well formed.</p>`,
    vi: `<p>Thiết kế đệ quy từ một văn phạm (xem khung trên). Hoàn thiện ${c('Calc.eval(String s)')}: trả giá trị dạng chữ, hoặc ${c('"ERROR: division by zero"')}. Số là số nguyên không âm, dấu cách có thể ở bất kỳ đâu, phép chia là chia nguyên (Java ${c('/')}), giá trị vừa long. Mỗi luật một hàm, dùng chung một trường vị trí; đầu vào hợp lệ.</p>`,
  },
  yeuCau: { en: ['One recursive function per grammar rule.', 'Left-associative + - * /.'], vi: ['Mỗi luật văn phạm một hàm đệ quy.', '+ - * / kết hợp trái.'] },
  dauVao: { en: 'One expression per line.', vi: 'Mỗi dòng một biểu thức.' },
  dauRa: { en: 'The value or the error.', vi: 'Giá trị hoặc lỗi.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ lenh: '                r = Calc.eval(line);' }) },
  tep: {
    'Calc.java': j`
public class Calc {
    //>> // TODO: fields and one method per grammar rule
    private final String s;
    private int pos;

    private Calc(String s) {
        this.s = s;
    }

    private char peek() {
        while (pos < s.length() && s.charAt(pos) == ' ') {
            pos++;
        }
        return pos < s.length() ? s.charAt(pos) : '\0';
    }

    private long expr() {
        long v = term();
        while (peek() == '+' || peek() == '-') {
            char op = s.charAt(pos++);
            long t = term();
            v = op == '+' ? v + t : v - t;
        }
        return v;
    }

    private long term() {
        long v = factor();
        while (peek() == '*' || peek() == '/') {
            char op = s.charAt(pos++);
            long f = factor();
            if (op == '/' && f == 0) {
                throw new ArithmeticException("division by zero");
            }
            v = op == '*' ? v * f : v / f;
        }
        return v;
    }

    private long factor() {
        char ch = peek();
        if (ch == '(') {
            pos++;
            long v = expr();
            peek();
            pos++; // ')'
            return v;
        }
        if (ch == '-') {
            pos++;
            return -factor();
        }
        long v = 0;
        while (pos < s.length() && Character.isDigit(s.charAt(pos))) {
            v = v * 10 + (s.charAt(pos++) - '0');
        }
        return v;
    }
    //<<

    static String eval(String s) {
        //>> return "0"; // TODO
        try {
            return String.valueOf(new Calc(s).expr());
        } catch (ArithmeticException e) {
            return "ERROR: division by zero";
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'precedence, parentheses, left associativity', vi: 'độ ưu tiên, ngoặc, kết hợp trái' }, vao: '1 + 2 * 3\n(1 + 2) * 3\n10 - 4 - 3\n100 / 10 / 5\n2 * (3 + 4) * 5\n' },
    { ten: { en: 'unary minus, spaces, division by zero', vi: 'dấu trừ một ngôi, dấu cách, chia cho 0' }, vao: '-3 + 5\n-(2 + 3) * -2\n  7/2  \n8 / (3 - 3)\n--4\n', an: true },
    { ten: { en: 'deep nesting and big values', vi: 'lồng sâu và giá trị lớn' }, vao: '((((((1))))))\n1000000000 * 1000000000\n(((2 + 3) * (4 - 1)) - ((6 / 2) * 3)) * 100\n', an: true },
  ],
  goiY: [
    { en: 'expr calls term, term calls factor, and factor calls expr again for "(" — the recursion mirrors the nesting of the input.', vi: 'expr gọi term, term gọi factor, và factor lại gọi expr khi gặp "(" — đệ quy phản chiếu độ lồng của đầu vào.' },
    { en: 'Precedence comes for free: * and / are handled one level deeper (term) than + and - (expr). A while loop inside each rule makes the operators left-associative.', vi: 'Độ ưu tiên có sẵn: * và / được xử lý sâu hơn một tầng (term) so với + và - (expr). Vòng while trong mỗi luật làm toán tử kết hợp trái.' },
  ],
  loiHayGap: [
    { en: 'Writing expr = term "+" expr (right recursion) — 10 - 4 - 3 becomes 10 - (4 - 3) = 9.', vi: 'Viết expr = term "+" expr (đệ quy phải) — 10 - 4 - 3 thành 10 - (4 - 3) = 9.' },
    { en: 'Forgetting to skip spaces before every look at the next character.', vi: 'Quên bỏ qua dấu cách trước mỗi lần nhìn ký tự kế tiếp.' },
  ],
  giaiThich: { en: '<p>Each grammar rule becomes one function and each alternative a branch; recursion appears exactly where the grammar is recursive (parentheses, unary minus). Every character is consumed once: O(n). This is how hand-written parsers (javac, many JSON parsers) are structured.</p>', vi: '<p>Mỗi luật văn phạm thành một hàm, mỗi lựa chọn một nhánh; đệ quy xuất hiện đúng chỗ văn phạm đệ quy (ngoặc, dấu trừ một ngôi). Mỗi ký tự được đọc một lần: O(n). Các bộ phân tích viết tay (javac, nhiều bộ đọc JSON) có đúng cấu trúc này.</p>' },
});

export default moDun({ slug: 'csd201-de-quy-thiet-ke', ten: '3.4 Designing recursion & eliminating tail calls', de: [de1, de2, de3] });
