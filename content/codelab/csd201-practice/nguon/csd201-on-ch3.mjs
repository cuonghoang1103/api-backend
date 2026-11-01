/** CSD201 · 3.5 — Thực hành chương 3: đệ quy trên danh sách liên kết, quay lui (tập con theo tổng, hoán vị), N quân hậu, đếm đường đi trên lưới có nhớ. */
import { moDun, deJava, deQuy, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-3-5-list-recursion',
  tieuDe: { en: 'PE style: count, sum, max and print backwards on a linked list — recursively', vi: 'Kiểu PE: đếm, tổng, max và in ngược trên danh sách liên kết — bằng đệ quy' },
  doKho: 'EASY', phut: 20, dangBai: 'pe',
  khaiNiem: ['recursion on node.next', 'empty list as the base case', 'work after the call = backwards'],
  moTa: {
    en: `<p>Recursion fits linked lists: a list is empty or a node followed by a smaller list. Complete, with <b>no loops</b> (rule R1), on the list starting at node ${c('p')}:</p>
<ul><li>${c('int count(Node p)')}, ${c('long sum(Node p)')};</li>
<li>${c('int max(Node p)')} — the list is not empty;</li>
<li>${c('void backwards(Node p, StringBuilder out)')} — append the values from the last to the first, each followed by a space.</li></ul>`,
    vi: `<p>Đệ quy hợp với danh sách liên kết: một danh sách hoặc rỗng, hoặc là một nút theo sau bởi danh sách nhỏ hơn. Hoàn thiện, <b>không vòng lặp</b> (luật R1), trên danh sách bắt đầu ở nút ${c('p')}: ${c('count(p)')}, ${c('sum(p)')}; ${c('max(p)')} — danh sách khác rỗng; ${c('backwards(p, out)')} — nối các giá trị từ cuối về đầu, mỗi giá trị kèm một dấu cách.</p>`,
  },
  yeuCau: { en: ['Recursion only (rule R1).', 'Node is given.'], vi: ['Chỉ đệ quy (luật R1).', 'Node cho sẵn.'] },
  dauVao: { en: 'One list per line ("-" = empty).', vi: 'Mỗi dòng một danh sách ("-" = rỗng).' },
  dauRa: { en: 'count, sum, max and the backward order.', vi: 'count, sum, max và thứ tự ngược.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no loops in ListRec — recursion only', vi: 'không vòng lặp trong ListRec — chỉ đệ quy', re: String.raw`\b(for|while|do)\b`, file: 'ListRec' }],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                Node head = null;
                if (!line.equals("-")) {
                    for (int i = p.length - 1; i >= 0; i--) {
                        head = new Node(n(i), head);
                    }
                }
                StringBuilder out = new StringBuilder();
                ListRec.backwards(head, out);
                r = "count=" + ListRec.count(head) + " sum=" + ListRec.sum(head) + " max=" + (head == null ? "-" : String.valueOf(ListRec.max(head))) + " backwards=[" + out.toString().trim() + "]";`,
    }),
  },
  tep: {
    'Node.java': j`
// GIVEN — do not change.
class Node {
    int info;
    Node next;

    Node(int x, Node p) {
        info = x;
        next = p;
    }
}
`,
    'ListRec.java': j`
public class ListRec {

    static int count(Node p) {
        //>> return 0; // TODO
        return p == null ? 0 : 1 + count(p.next);
        //<<
    }

    static long sum(Node p) {
        //>> return 0; // TODO
        return p == null ? 0 : p.info + sum(p.next);
        //<<
    }

    static int max(Node p) {
        //>> return 0; // TODO
        return p.next == null ? p.info : Math.max(p.info, max(p.next));
        //<<
    }

    static void backwards(Node p, StringBuilder out) {
        //>> // TODO
        if (p == null) {
            return;
        }
        backwards(p.next, out); // the rest first...
        out.append(p.info).append(' '); // ...then this node: last to first
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a few lists', vi: 'vài danh sách' }, vao: '3 8 -2 7\n5\n-\n' },
    { ten: { en: 'negatives, equal values', vi: 'số âm, giá trị bằng nhau' }, vao: '-5 -2 -9\n4 4 4\n1000000000 1000000000 1000000000\n', an: true },
  ],
  goiY: [
    { en: 'Base case: p == null (the empty list). Recursive case: this node + the answer for p.next.', vi: 'Trường hợp cơ sở: p == null (danh sách rỗng). Trường hợp đệ quy: nút này + đáp án cho p.next.' },
    { en: 'backwards: recurse FIRST, append AFTER — the appends happen while the calls return, from the last node back.', vi: 'backwards: gọi đệ quy TRƯỚC, nối SAU — các lần nối xảy ra khi lời gọi quay về, từ nút cuối ngược lên.' },
  ],
  loiHayGap: [
    { en: 'Appending before the recursive call — that prints forwards.', vi: 'Nối trước lời gọi đệ quy — in ra chiều xuôi.' },
    { en: 'max with base case p == null returning 0 — wrong for all-negative lists.', vi: 'max có trường hợp cơ sở p == null trả 0 — sai với danh sách toàn số âm.' },
  ],
  giaiThich: { en: '<p>Each function makes one call per node: O(n) time and O(n) stack depth. Printing backwards without recursion would need a stack or a reversal — the call stack is that stack.</p>', vi: '<p>Mỗi hàm gọi một lần cho mỗi nút: O(n) thời gian và O(n) độ sâu ngăn xếp. In ngược mà không đệ quy thì cần một ngăn xếp hoặc phải đảo danh sách — ngăn xếp lời gọi chính là ngăn xếp đó.</p>' },
});

const de2 = deJava({
  id: 'csd201-3-5-backtracking',
  tieuDe: { en: 'Backtracking: subsets with a given sum, and permutations in order', vi: 'Quay lui: tập con có tổng cho trước, và hoán vị theo thứ tự' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['choose / explore / un-choose', 'pruning', 'lexicographic order'],
  moTa: {
    en: `<p>Two backtracking generators.</p>
<ul><li>${c('static List<String> subsetsWithSum(int[] a, int target)')} — every subset of ${c('a')} (a is sorted ascending, values &gt; 0, distinct) whose sum is target, each written as its values in increasing order separated by ${c('+')} (${c('"2+3+5"')}), listed in <b>lexicographic order of the index sequences</b> (the order a "take a[i] first, then skip it" recursion produces). Prune: stop a branch as soon as the sum exceeds target.</li>
<li>${c('static List<String> permutations(String s)')} — all orderings of the distinct letters of s, sorted (s itself is given sorted). Use a ${c('boolean[] used')} and a ${c('StringBuilder')} you append to and then remove from.</li></ul>`,
    vi: `<p>Hai bộ sinh quay lui. ${c('subsetsWithSum(a, target)')} — mọi tập con của ${c('a')} (a sắp tăng, giá trị &gt; 0, khác nhau) có tổng bằng target, mỗi tập viết các giá trị tăng dần nối bằng ${c('+')} (${c('"2+3+5"')}), liệt kê theo <b>thứ tự từ điển của dãy chỉ số</b> (thứ tự mà đệ quy "lấy a[i] trước, rồi bỏ nó" sinh ra); tỉa nhánh: dừng ngay khi tổng vượt target. ${c('permutations(s)')} — mọi cách sắp các chữ cái khác nhau của s, theo thứ tự tăng (s cho sẵn đã sắp); dùng ${c('boolean[] used')} và một ${c('StringBuilder')} thêm vào rồi gỡ ra.</p>`,
  },
  yeuCau: { en: ['Recursive backtracking for both (rules R1, R2).', 'Exact order of the lists.'], vi: ['Quay lui đệ quy cho cả hai (luật R1, R2).', 'Đúng thứ tự danh sách.'] },
  dauVao: { en: 'SUB target : values · PERM letters.', vi: 'SUB target : giá trị · PERM chữ cái.' },
  dauRa: { en: 'The number of results and the list.', vi: 'Số kết quả và danh sách.' },
  main: 'KiemTra',
  quyTac: [deQuy('yes', 'Backtrack', 'sub', 'R1'), deQuy('yes', 'Backtrack', 'perm', 'R2')],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("SUB")) {
                    int[] a = new int[p.length - 3];
                    for (int i = 3; i < p.length; i++) {
                        a[i - 3] = n(i);
                    }
                    List<String> res = Backtrack.subsetsWithSum(a, n(1));
                    r = res.size() + " " + res;
                } else {
                    List<String> res = Backtrack.permutations(p.length > 1 ? p[1] : "");
                    r = res.size() + " " + (res.size() > 30 ? res.subList(0, 10) + " ... " + res.get(res.size() - 1) : res.toString());
                }`,
    }),
  },
  tep: {
    'Backtrack.java': j`
import java.util.ArrayList;
import java.util.List;

public class Backtrack {

    static List<String> subsetsWithSum(int[] a, int target) {
        List<String> out = new ArrayList<>();
        sub(a, 0, target, new ArrayList<Integer>(), out);
        return out;
    }

    // choose a[i] or not, for i = from, from+1, ...
    private static void sub(int[] a, int i, int left, List<Integer> chosen, List<String> out) {
        //>> // TODO: base cases, take a[i], skip a[i]
        if (left == 0) {
            StringBuilder sb = new StringBuilder();
            for (int x : chosen) {
                sb.append(sb.length() > 0 ? "+" : "").append(x);
            }
            out.add(sb.toString());
            return;
        }
        if (i == a.length || a[i] > left) {
            return; // sorted and positive: nothing further can fit (pruning)
        }
        chosen.add(a[i]); // choose
        sub(a, i + 1, left - a[i], chosen, out); // explore
        chosen.remove(chosen.size() - 1); // un-choose
        sub(a, i + 1, left, chosen, out); // skip a[i]
        //<<
    }

    static List<String> permutations(String s) {
        List<String> out = new ArrayList<>();
        perm(s, new boolean[s.length()], new StringBuilder(), out);
        return out;
    }

    private static void perm(String s, boolean[] used, StringBuilder cur, List<String> out) {
        //>> // TODO
        if (cur.length() == s.length()) {
            out.add(cur.toString());
            return;
        }
        for (int i = 0; i < s.length(); i++) {
            if (!used[i]) {
                used[i] = true;
                cur.append(s.charAt(i));
                perm(s, used, cur, out);
                cur.deleteCharAt(cur.length() - 1);
                used[i] = false;
            }
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s examples', vi: 'ví dụ của bài' }, vao: 'SUB 10 : 1 2 3 4 5 6\nSUB 7 : 2 3 5\nPERM abc\nPERM ab\n' },
    { ten: { en: 'no solution, the whole set, one letter, 8 letters', vi: 'không có lời giải, cả tập, một chữ, 8 chữ' }, vao: 'SUB 100 : 1 2 3\nSUB 6 : 1 2 3\nSUB 1 : 2 3\nPERM x\nPERM abcdefgh\n', an: true },
  ],
  goiY: [
    { en: 'subsets: at index i, first try taking a[i] (add it, recurse, remove it), then try skipping it — that order gives the required listing.', vi: 'Tập con: ở chỉ số i, thử lấy a[i] trước (thêm, đệ quy, gỡ ra), rồi thử bỏ nó — thứ tự đó cho đúng danh sách yêu cầu.' },
    { en: 'Because a is sorted and positive, once a[i] > what is left, no later element can fit either: return.', vi: 'Vì a đã sắp và dương, khi a[i] > phần còn lại thì không phần tử nào sau nó vừa nữa: trả về.' },
  ],
  loiHayGap: [
    { en: 'Forgetting to un-choose (remove the last element / clear used[i]) — later branches see the leftovers of earlier ones.', vi: 'Quên gỡ lựa chọn (bỏ phần tử cuối / đặt lại used[i]) — các nhánh sau thấy phần thừa của nhánh trước.' },
    { en: 'Recording a subset only when i == a.length — the same subsets are found, but listed in a different order than required.', vi: 'Chỉ ghi tập con khi i == a.length — vẫn tìm đủ tập con nhưng liệt kê khác thứ tự yêu cầu.' },
  ],
  giaiThich: { en: '<p>Backtracking walks the tree of partial choices depth-first: each node adds one decision, and undoing it on the way back lets one list/array serve the whole search. There are 2ⁿ subsets and n! permutations, so the output size dominates; pruning cuts whole subtrees that cannot succeed.</p>', vi: '<p>Quay lui đi theo chiều sâu trên cây các lựa chọn dở dang: mỗi nút thêm một quyết định, và gỡ nó ra khi quay về giúp một danh sách/mảng phục vụ cả cuộc tìm. Có 2ⁿ tập con và n! hoán vị, nên kích thước đầu ra chiếm ưu thế; tỉa nhánh cắt bỏ cả cây con không thể thành công.</p>' },
});

const de3 = deJava({
  id: 'csd201-3-5-n-queens',
  tieuDe: { en: 'N queens: count every placement and print the first one', vi: 'N quân hậu: đếm mọi cách đặt và in cách đầu tiên' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['one queen per row', 'columns and two diagonals in O(1)', 'backtracking with pruning'],
  moTa: {
    en: `<p>Place n queens on an n × n board so that no two attack each other. Complete ${c('static long count(int n)')} (all solutions) and ${c('static int[] first(int n)')} — the first solution in lexicographic order of ${c('col[row]')} (rows 0..n−1, columns tried from 0), or ${c('null')} when there is none.</p>
<p>Put one queen per row; keep three ${c('boolean')} arrays — used columns, used ${c('row + col')} diagonals, used ${c('row − col + n − 1')} diagonals — so each test is O(1). The grader asks up to n = 12 (14,200 solutions) within a time limit.</p>`,
    vi: `<p>Đặt n quân hậu lên bàn n × n sao cho không quân nào ăn nhau. Hoàn thiện ${c('count(n)')} (mọi lời giải) và ${c('first(n)')} — lời giải đầu tiên theo thứ tự từ điển của ${c('col[row]')} (hàng 0..n−1, thử cột từ 0), hoặc ${c('null')} nếu không có.</p>
<p>Mỗi hàng một quân; giữ ba mảng ${c('boolean')} — cột đã dùng, đường chéo ${c('row + col')} đã dùng, đường chéo ${c('row − col + n − 1')} đã dùng — để mỗi phép thử là O(1). Máy chấm hỏi tới n = 12 (14.200 lời giải) có hạn giờ.</p>`,
  },
  yeuCau: { en: ['Backtracking row by row (recursive).', 'O(1) safety test with the three arrays.'], vi: ['Quay lui từng hàng (đệ quy).', 'Kiểm an toàn O(1) bằng ba mảng.'] },
  dauVao: { en: 'One n per line.', vi: 'Mỗi dòng một n.' },
  dauRa: { en: 'The count and the first solution.', vi: 'Số lời giải và lời giải đầu tiên.' },
  main: 'KiemTra',
  hen: { n: '12', ms: 4000, can: 'backtracking with O(1) checks', cham: 'trying all nⁿ placements', en: 'Generating every placement of 12 queens is 12¹² ≈ 9·10¹² boards.', vi: 'Sinh mọi cách đặt 12 quân là 12¹² ≈ 9·10¹² bàn cờ.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                final int k = n(0);
                final long[] c = new long[1];
                final int[][] f = new int[1][];
                r = Kiem.hen("n = " + k, 4000, new Runnable() {
                    public void run() {
                        c[0] = Queens.count(k);
                        f[0] = Queens.first(k);
                    }
                }) + ", count " + c[0] + ", first " + (f[0] == null ? "null" : Arrays.toString(f[0]));`,
    }),
  },
  tep: {
    'Queens.java': j`
public class Queens {
    //>> // TODO: fields / helpers
    private static int n;
    private static int[] col;
    private static boolean[] usedCol, diag1, diag2;
    private static long found;
    private static boolean stopAtFirst;

    private static void reset(int size, boolean first) {
        n = size;
        col = new int[n];
        usedCol = new boolean[n];
        diag1 = new boolean[2 * n];
        diag2 = new boolean[2 * n];
        found = 0;
        stopAtFirst = first;
    }

    // places queens in rows r..n-1; returns true to stop the whole search
    private static boolean place(int r) {
        if (r == n) {
            found++;
            return stopAtFirst;
        }
        for (int c = 0; c < n; c++) {
            if (usedCol[c] || diag1[r + c] || diag2[r - c + n - 1]) {
                continue;
            }
            col[r] = c;
            usedCol[c] = diag1[r + c] = diag2[r - c + n - 1] = true;
            if (place(r + 1)) {
                return true;
            }
            usedCol[c] = diag1[r + c] = diag2[r - c + n - 1] = false;
        }
        return false;
    }
    //<<

    static long count(int size) {
        //>> return 0; // TODO
        reset(size, false);
        place(0);
        return found;
        //<<
    }

    static int[] first(int size) {
        //>> return null; // TODO
        reset(size, true);
        return place(0) ? col.clone() : null;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'n = 1, 4, 5, 8', vi: 'n = 1, 4, 5, 8' }, vao: '1\n4\n5\n8\n' },
    { ten: { en: 'no solution for 2 and 3; n = 10 and 12', vi: 'n = 2 và 3 vô nghiệm; n = 10 và 12' }, vao: '2\n3\n10\n12\n', an: true },
  ],
  goiY: [
    { en: 'Two queens share a "/" diagonal when row + col is equal, and a "\\" diagonal when row − col is equal (add n − 1 to make it an index).', vi: 'Hai quân chung đường chéo "/" khi row + col bằng nhau, và chung đường chéo "\\" khi row − col bằng nhau (cộng n − 1 để thành chỉ số).' },
    { en: 'For first(n), let the recursion return true as soon as row n is reached, and stop unwinding the loops.', vi: 'Với first(n), cho đệ quy trả true ngay khi tới hàng n, và dừng mọi vòng lặp khi quay về.' },
  ],
  loiHayGap: [
    { en: 'Checking safety by scanning all previous rows — still correct, but O(n) per test; the arrays make it O(1).', vi: 'Kiểm an toàn bằng cách quét mọi hàng trước — vẫn đúng nhưng O(n) mỗi lần; ba mảng làm nó O(1).' },
    { en: 'Returning the col array itself from first() — later calls overwrite it; return a copy.', vi: 'Trả về chính mảng col từ first() — các lần gọi sau ghi đè nó; trả về bản sao.' },
  ],
  giaiThich: { en: '<p>Placing row by row with column and diagonal marks prunes every attacked square immediately; the search visits only consistent partial boards (about 850,000 for n = 12 instead of 12¹² boards). Backtracking is still exponential in general, but pruning makes moderate n practical.</p>', vi: '<p>Đặt từng hàng với dấu cột và đường chéo loại ngay mọi ô bị ăn; cuộc tìm chỉ ghé các bàn dở dang hợp lệ (khoảng 850.000 với n = 12 thay vì 12¹² bàn). Quay lui nói chung vẫn hàm mũ, nhưng tỉa nhánh làm n vừa phải trở nên khả thi.</p>' },
});

const de4 = deJava({
  id: 'csd201-3-5-grid-paths-memo',
  tieuDe: { en: 'Grid paths with obstacles: recursion + memo instead of 10¹⁶ calls', vi: 'Đường đi trên lưới có vật cản: đệ quy + bảng nhớ thay vì 10¹⁶ lời gọi' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['paths(r, c) = paths(r+1, c) + paths(r, c+1)', 'memoization on (r, c)', 'long results'],
  moTa: {
    en: `<p>A robot starts at the top-left cell of a grid and moves only <b>right</b> or <b>down</b> to the bottom-right cell; cells with ${c("'#'")} are blocked. Complete ${c('static long paths(String[] grid)')}: the number of different paths (0 if the start or the end is blocked).</p>
<p>The recursion ${c('ways(r, c) = ways(r+1, c) + ways(r, c+1)')} is exponential on its own — a 30 × 30 grid has about 3·10¹⁶ paths. Keep it recursive and memoize ${c('ways(r, c)')} in a ${c('long[][]')}: each cell is computed once.</p>`,
    vi: `<p>Robot xuất phát ở ô trên-trái và chỉ đi <b>phải</b> hoặc <b>xuống</b> tới ô dưới-phải; ô ${c("'#'")} bị chặn. Hoàn thiện ${c('static long paths(String[] grid)')}: số đường đi khác nhau (0 nếu ô đầu hoặc ô cuối bị chặn).</p>
<p>Đệ quy ${c('ways(r, c) = ways(r+1, c) + ways(r, c+1)')} tự nó là hàm mũ — lưới 30 × 30 có khoảng 3·10¹⁶ đường. Giữ đệ quy và ghi nhớ ${c('ways(r, c)')} trong ${c('long[][]')}: mỗi ô chỉ tính một lần.</p>`,
  },
  yeuCau: { en: ['Recursive with a memo: O(rows × cols).', 'Results in long.'], vi: ['Đệ quy có bảng nhớ: O(hàng × cột).', 'Kết quả kiểu long.'] },
  dauVao: { en: 'Grids separated by empty lines; OPEN n = an empty n × n grid.', vi: 'Các lưới cách nhau dòng trống; OPEN n = lưới trống n × n.' },
  dauRa: { en: 'The number of paths.', vi: 'Số đường đi.' },
  main: 'KiemTra',
  hen: { n: '30 × 30', ms: 3000, can: 'O(rows × cols) with a memo', cham: 'plain recursion (one call per path)' },
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
            if (line.startsWith("OPEN")) {
                int n = Integer.parseInt(line.substring(5).trim());
                final String[] g = new String[n];
                char[] row = new char[n];
                Arrays.fill(row, '.');
                Arrays.fill(g, new String(row));
                final long[] v = new long[1];
                System.out.println(line + " -> " + Kiem.hen("empty " + n + " x " + n, 3000, new Runnable() {
                    public void run() {
                        v[0] = Grid.paths(g);
                    }
                }) + ", paths " + v[0]);
            } else if (line.isEmpty()) {
                if (!rows.isEmpty()) {
                    System.out.println(rows + " -> " + Grid.paths(rows.toArray(new String[0])));
                    rows.clear();
                }
            } else {
                rows.add(line);
            }
        }
        if (!rows.isEmpty()) {
            System.out.println(rows + " -> " + Grid.paths(rows.toArray(new String[0])));
        }
    }
}
`,
  },
  tep: {
    'Grid.java': j`
public class Grid {

    static long paths(String[] grid) {
        //>> return 0; // TODO: recursion + memo
        int rows = grid.length;
        int cols = grid[0].length();
        long[][] memo = new long[rows][cols];
        for (long[] m : memo) {
            java.util.Arrays.fill(m, -1);
        }
        return ways(grid, 0, 0, memo);
        //<<
    }
    //>> // TODO: helper(s)

    private static long ways(String[] g, int r, int c, long[][] memo) {
        if (r >= g.length || c >= g[0].length() || g[r].charAt(c) == '#') {
            return 0;
        }
        if (r == g.length - 1 && c == g[0].length() - 1) {
            return 1;
        }
        if (memo[r][c] >= 0) {
            return memo[r][c];
        }
        return memo[r][c] = ways(g, r + 1, c, memo) + ways(g, r, c + 1, memo);
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'open grids and an obstacle', vi: 'lưới trống và một vật cản' }, vao: '...\n...\n...\n\n...\n.#.\n...\n\n.\n\nOPEN 10\n' },
    { ten: { en: 'blocked start or end, walls', vi: 'ô đầu hoặc cuối bị chặn, tường' }, vao: '#..\n...\n\n...\n..#\n\n.#.\n.#.\n...\n\n.....\n####.\n.....\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'OPEN 30\nOPEN 34\n', an: true },
  ],
  goiY: [
    { en: 'Base cases: outside the grid or on #, 0 paths; on the goal cell, 1 path.', vi: 'Trường hợp cơ sở: ra ngoài lưới hoặc đứng trên #, 0 đường; tới ô đích, 1 đường.' },
    { en: 'Fill the memo with −1 ("unknown") — 0 is a real answer for blocked areas.', vi: 'Điền bảng nhớ bằng −1 ("chưa biết") — 0 là đáp án thật của vùng bị chặn.' },
  ],
  loiHayGap: [
    { en: 'Using 0 as "not computed" — regions with no path are recomputed again and again.', vi: 'Dùng 0 làm "chưa tính" — vùng không có đường bị tính đi tính lại.' },
    { en: 'int results — a 34 × 34 grid has more than 2·10¹⁸ paths, near the long limit.', vi: 'Kết quả int — lưới 34 × 34 có hơn 2·10¹⁸ đường, sát giới hạn long.' },
  ],
  giaiThich: { en: '<p>There are only rows × cols different subproblems ways(r, c); with the memo each is solved once in O(1) after its two neighbours: O(rows × cols). Without it the recursion makes one call per path — about C(2n−2, n−1), which is 3·10¹⁶ for n = 30.</p>', vi: '<p>Chỉ có hàng × cột bài toán con ways(r, c) khác nhau; có bảng nhớ thì mỗi bài giải một lần trong O(1) sau hai ô kề: O(hàng × cột). Không có nó, đệ quy gọi một lần cho mỗi đường đi — khoảng C(2n−2, n−1), tức 3·10¹⁶ với n = 30.</p>' },
});

export default moDun({ slug: 'csd201-on-ch3', ten: '3.5 🧪 Practice — list recursion, backtracking, N queens, memoized grid paths', de: [de1, de2, de3, de4] });
