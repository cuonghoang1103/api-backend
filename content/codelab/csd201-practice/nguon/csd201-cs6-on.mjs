/** CSD201 · ⭐ CS.6 — quay lui kiểu phỏng vấn (gen/java/cs6/Ex2…Ex7): khôi phục địa chỉ IP, tập con khác nhau khi có trùng (bỏ trùng cùng tầng), chọn k chữ số có tổng n, hoán vị đẹp (cắt nhánh tại chỗ), đường Hamilton trên lưới (đánh dấu/bỏ đánh dấu), chia thành k nhóm tổng bằng nhau. */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const DS = `
    static String lst(List<List<Integer>> x) {
        List<String> s = new ArrayList<String>();
        for (List<Integer> l : x) {
            List<Integer> t = new ArrayList<Integer>(l);
            Collections.sort(t);
            s.add(t.toString());
        }
        Collections.sort(s);
        return x.size() + " " + s;
    }
`;

const de1 = deCs({
  id: 'csd201-cs6-restore-ip',
  tieuDe: { en: 'Restore IP addresses — cut a digit string into 4 valid octets', vi: 'Khôi phục địa chỉ IP — cắt xâu chữ số thành 4 octet hợp lệ' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['choose the next piece of length 1–3', 'validity: 0–255, no leading zero', 'prune when too few or too many digits remain'],
  moTa: {
    en: `<p>Complete ${c('static List<String> restore(String s)')}: every way to insert three dots into the digit string s so that each of the 4 pieces is a valid IPv4 octet — a number 0…255 written without a leading zero (only "0" itself may start with 0). Example "25525511135" → 255.255.11.135 and 255.255.111.35; "0000" → 0.0.0.0; "101023" → 5 addresses. Any order is accepted (the grader sorts).</p>
<p>Backtracking: at depth d try a piece of length 1, 2 or 3; keep it only if valid, recurse, then remove it. Prune when the remaining digits cannot fill the remaining pieces (fewer than 4 − d or more than 3·(4 − d)).</p>`,
    vi: `<p>Hoàn thiện ${c('restore(s)')}: mọi cách chèn ba dấu chấm vào xâu chữ số s để cả 4 mảnh đều là octet IPv4 hợp lệ — số 0…255 viết không có số 0 đứng đầu (chỉ chính "0" được bắt đầu bằng 0). Ví dụ "25525511135" → 255.255.11.135 và 255.255.111.35; "0000" → 0.0.0.0; "101023" → 5 địa chỉ. Thứ tự nào cũng được (máy chấm tự sắp).</p>
<p>Quay lui: ở tầng d thử mảnh dài 1, 2 hoặc 3; chỉ giữ nếu hợp lệ, gọi đệ quy, rồi bỏ mảnh đó ra. Cắt nhánh khi số chữ số còn lại không thể lấp các mảnh còn lại (ít hơn 4 − d hoặc nhiều hơn 3·(4 − d)).</p>`,
  },
  dauVao: { en: 'RUN digits · RANDOM.', vi: 'RUN chữ số · RANDOM.' },
  them: `
    static boolean ok(String p) {
        return p.length() >= 1 && p.length() <= 3 && (p.length() == 1 || p.charAt(0) != '0') && Integer.parseInt(p) <= 255;
    }

    static List<String> brute(String s) {
        List<String> res = new ArrayList<String>();
        int n = s.length();
        for (int a = 1; a <= 3; a++) {
            for (int b = 1; b <= 3; b++) {
                for (int cc = 1; cc <= 3; cc++) {
                    int d = n - a - b - cc;
                    if (d < 1 || d > 3) {
                        continue;
                    }
                    String p1 = s.substring(0, a), p2 = s.substring(a, a + b), p3 = s.substring(a + b, a + b + cc), p4 = s.substring(a + b + cc);
                    if (ok(p1) && ok(p2) && ok(p3) && ok(p4)) {
                        res.add(p1 + "." + p2 + "." + p3 + "." + p4);
                    }
                }
            }
        }
        return res;
    }

    static String sorted(List<String> x) {
        List<String> t = new ArrayList<String>(x);
        Collections.sort(t);
        return t.size() + " " + t;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = sorted(RestoreIp.restore(p[1]));
                } else {
                    Random rnd = new Random(83);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        StringBuilder sb = new StringBuilder();
                        int n = 1 + rnd.nextInt(14);
                        for (int i = 0; i < n; i++) {
                            sb.append((char) ('0' + (rnd.nextInt(3) == 0 ? rnd.nextInt(3) : rnd.nextInt(10))));
                        }
                        String s = sb.toString(), got = sorted(RestoreIp.restore(s)), want = sorted(brute(s));
                        if (!got.equals(want)) {
                            sai = s + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random digit strings (lengths 1..14)", 3000, sai);
                }`,
  tep: {
    'RestoreIp.java': j`
import java.util.ArrayList;
import java.util.List;

public class RestoreIp {

    public static List<String> restore(String s) {
        //>> return new ArrayList<String>(); // TODO
        List<String> res = new ArrayList<String>();
        go(s, 0, new String[4], 0, res);
        return res;
        //<<
    }
    //>> // TODO: helper(s)

    private static void go(String s, int pos, String[] parts, int d, List<String> res) {
        int left = s.length() - pos;
        if (d == 4) {
            if (left == 0) {
                res.add(parts[0] + "." + parts[1] + "." + parts[2] + "." + parts[3]);
            }
            return;
        }
        if (left < 4 - d || left > 3 * (4 - d)) {
            return; // the remaining digits cannot fill the remaining pieces
        }
        for (int len = 1; len <= 3 && pos + len <= s.length(); len++) {
            String p = s.substring(pos, pos + len);
            if (len > 1 && p.charAt(0) == '0') {
                break; // a leading zero: longer pieces are invalid too
            }
            if (Integer.parseInt(p) > 255) {
                break;
            }
            parts[d] = p; // choose
            go(s, pos + len, parts, d + 1, res); // explore (the next call overwrites parts[d + 1..] — nothing to undo)
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 25525511135\nRUN 0000\nRUN 101023\nRUN 1111\nRUN 256256256256\nRUN 123\n' },
    { ten: { en: '3000 random digit strings vs every cut', vi: '3000 xâu chữ số ngẫu nhiên so với mọi cách cắt' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'A piece longer than 1 that starts with 0 is invalid, and so is every longer piece from the same position — break.', vi: 'Mảnh dài hơn 1 bắt đầu bằng 0 là không hợp lệ, và mọi mảnh dài hơn từ cùng vị trí cũng vậy — break.' },
    { en: 'Stop at depth 4 and accept only if every digit has been used.', vi: 'Dừng ở tầng 4 và chỉ nhận khi đã dùng hết mọi chữ số.' },
  ],
  loiHayGap: [
    { en: 'Accepting "01" or "00" as an octet.', vi: 'Nhận "01" hay "00" làm octet.' },
    { en: 'Calling Integer.parseInt on a piece of more than 3 digits — numbers like "99999999999" overflow (keep len ≤ 3).', vi: 'Gọi Integer.parseInt trên mảnh hơn 3 chữ số — số như "99999999999" tràn (giữ len ≤ 3).' },
  ],
  giaiThich: { en: '<p>At most 3⁴ = 81 leaves, so the work is constant — the lesson is the shape: choose a piece, check it, recurse, undo, with early pruning on the number of remaining digits. The brute force here is three nested loops over the piece lengths.</p>', vi: '<p>Nhiều nhất 3⁴ = 81 lá, nên công việc là hằng số — bài học nằm ở khuôn: chọn một mảnh, kiểm nó, đệ quy, hoàn tác, cắt nhánh sớm theo số chữ số còn lại. Vét cạn ở đây là ba vòng lặp lồng nhau theo độ dài các mảnh.</p>' },
});

const de2 = deCs({
  id: 'csd201-cs6-subsets-dup',
  tieuDe: { en: 'All DISTINCT subsets when the input has duplicates — skip equal values at the same depth', vi: 'Mọi tập con KHÁC NHAU khi đầu vào có phần tử trùng — bỏ giá trị trùng ở cùng tầng' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['sort first', 'if (i > start && a[i] == a[i − 1]) continue', 'generate, do not deduplicate afterwards'],
  moTa: {
    en: `<p>Complete ${c('static List<List<Integer>> subsets(int[] a)')}: every distinct sub-multiset of a, each exactly once (the empty one included). Example ${c('{1,2,2}')} → [], [1], [1,2], [1,2,2], [2], [2,2] — 6, not 8. Any order is accepted.</p>
<p>Sort, then backtrack: each call adds the current subset to the result and tries every next index i ≥ start; <b>skip</b> ${c('a[i]')} if it equals ${c('a[i−1]')} and ${c('i > start')} — trying the same value twice at the same depth would build the same subsets again. Generating all 2ⁿ subsets and removing duplicates with a Set is too slow: the complexity check has 30 numbers with only 16,807 distinct subsets.</p>`,
    vi: `<p>Hoàn thiện ${c('subsets(a)')}: mọi đa tập con khác nhau của a, mỗi cái đúng một lần (kể cả tập rỗng). Ví dụ ${c('{1,2,2}')} → [], [1], [1,2], [1,2,2], [2], [2,2] — 6, không phải 8. Thứ tự nào cũng được.</p>
<p>Sắp xếp, rồi quay lui: mỗi lời gọi thêm tập hiện tại vào kết quả và thử mọi chỉ số kế tiếp i ≥ start; <b>bỏ qua</b> ${c('a[i]')} nếu nó bằng ${c('a[i−1]')} và ${c('i > start')} — thử cùng một giá trị hai lần ở cùng tầng sẽ dựng lại đúng các tập cũ. Sinh đủ 2ⁿ tập con rồi lọc trùng bằng Set là quá chậm: kiểm độ phức tạp có 30 số mà chỉ 16.807 tập con khác nhau.</p>`,
  },
  hen: { n: '30 numbers (five values, six times each)', ms: 3000, can: 'O(number of distinct subsets · n)', cham: 'O(2ⁿ) (generate everything, deduplicate later)' },
  them: DS + `
    static List<List<Integer>> brute(int[] a) {
        int[] s = a.clone();
        Arrays.sort(s);
        Set<List<Integer>> set = new HashSet<List<Integer>>();
        for (int m = 0; m < (1 << s.length); m++) {
            List<Integer> l = new ArrayList<Integer>();
            for (int i = 0; i < s.length; i++) {
                if ((m >> i & 1) == 1) {
                    l.add(s[i]);
                }
            }
            set.add(l);
        }
        return new ArrayList<List<Integer>>(set);
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = lst(SubsetsDup.subsets(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(85);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(9)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(4) - 1;
                        }
                        String got = lst(SubsetsDup.subsets(a.clone())), want = lst(brute(a));
                        if (!got.equals(want)) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random arrays with duplicates", 2000, sai);
                } else {
                    final int[] a = new int[30];
                    for (int i = 0; i < 30; i++) {
                        a[i] = 5 - i % 5;
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("30 numbers", 3000, new Runnable() {
                        public void run() {
                            got[0] = SubsetsDup.subsets(a).size();
                        }
                    }) + ", distinct subsets " + got[0];
                }`,
  tep: {
    'SubsetsDup.java': j`
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SubsetsDup {

    public static List<List<Integer>> subsets(int[] in) {
        //>> return new ArrayList<List<Integer>>(); // TODO
        int[] a = in.clone();
        Arrays.sort(a); // equal values side by side
        List<List<Integer>> res = new ArrayList<List<Integer>>();
        go(a, 0, new ArrayList<Integer>(), res);
        return res;
        //<<
    }
    //>> // TODO: helper(s)

    private static void go(int[] a, int start, List<Integer> cur, List<List<Integer>> res) {
        res.add(new ArrayList<Integer>(cur)); // every node of the tree is a subset
        for (int i = start; i < a.length; i++) {
            if (i > start && a[i] == a[i - 1]) {
                continue; // the same value was just tried at this depth
            }
            cur.add(a[i]); // choose
            go(a, i + 1, cur, res); // explore
            cur.remove(cur.size() - 1); // undo
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,2,2\nRUN -\nRUN 0\nRUN 2,1,2,1\nRUN 4,4,4\n' },
    { ten: { en: '2000 random arrays', vi: '2000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Add a COPY of the current list to the result — the list itself keeps changing.', vi: 'Thêm BẢN SAO của danh sách hiện tại vào kết quả — chính danh sách đó còn thay đổi.' },
    { en: 'The test is i > start, not i > 0: equal values in DIFFERENT depths are fine ([2, 2] must appear).', vi: 'Phép kiểm là i > start, không phải i > 0: giá trị bằng nhau ở các tầng KHÁC nhau thì được ([2, 2] phải xuất hiện).' },
  ],
  loiHayGap: [
    { en: 'i > 0 instead of i > start — [2, 2] disappears.', vi: 'i > 0 thay vì i > start — [2, 2] biến mất.' },
    { en: 'Forgetting to sort — equal values are not adjacent and the skip rule misses them.', vi: 'Quên sắp xếp — các giá trị bằng nhau không đứng cạnh nhau và luật bỏ qua bỏ sót.' },
  ],
  giaiThich: { en: '<p>Sorting puts equal values together; skipping a value already tried at the same depth means each distinct multiset is reached by exactly one path — the one that uses the earliest copies. The work is proportional to the output, not to 2ⁿ.</p>', vi: '<p>Sắp xếp đặt các giá trị bằng nhau cạnh nhau; bỏ một giá trị đã thử ở cùng tầng nghĩa là mỗi đa tập khác nhau được tới bằng đúng một đường — đường dùng các bản sao sớm nhất. Công việc tỉ lệ với đầu ra, không phải với 2ⁿ.</p>' },
});

const de3 = deCs({
  id: 'csd201-cs6-combination-sum-3',
  tieuDe: { en: 'Choose exactly k different digits 1–9 that sum to n — prune on the running sum', vi: 'Chọn đúng k chữ số khác nhau 1–9 có tổng n — cắt nhánh theo tổng đang cộng' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['combinations in increasing order', 'stop when the sum is exceeded', 'stop when the count is reached'],
  moTa: {
    en: `<p>Complete ${c('static List<List<Integer>> combos(int k, int n)')}: every set of exactly k different digits from 1…9 whose sum is n, each set listed once (any order of sets; digits within a set increasing). Example k = 3, n = 9 → [1,2,6], [1,3,5], [2,3,4]; k = 3, n = 7 → [1,2,4].</p>
<p>Backtrack over the next digit d from ${c('start')} to 9; since digits are tried in increasing order, as soon as ${c('sum + d > n')} every larger d fails too — break. Stop a branch when k digits are chosen.</p>`,
    vi: `<p>Hoàn thiện ${c('combos(k, n)')}: mọi tập đúng k chữ số khác nhau từ 1…9 có tổng n, mỗi tập liệt kê một lần (thứ tự các tập tuỳ ý; chữ số trong tập tăng dần). Ví dụ k = 3, n = 9 → [1,2,6], [1,3,5], [2,3,4]; k = 3, n = 7 → [1,2,4].</p>
<p>Quay lui theo chữ số kế tiếp d từ ${c('start')} tới 9; vì chữ số được thử theo thứ tự tăng, ngay khi ${c('sum + d > n')} thì mọi d lớn hơn cũng hỏng — break. Dừng một nhánh khi đã chọn đủ k chữ số.</p>`,
  },
  dauVao: { en: 'RUN k n · RANDOM (every k = 1..9, n = 1..50 vs the 512 subsets).', vi: 'RUN k n · RANDOM (mọi k = 1..9, n = 1..50 so với 512 tập con).' },
  them: DS + `
    static List<List<Integer>> brute(int k, int n) {
        List<List<Integer>> res = new ArrayList<List<Integer>>();
        for (int m = 0; m < 512; m++) {
            if (Integer.bitCount(m) != k) {
                continue;
            }
            List<Integer> l = new ArrayList<Integer>();
            int s = 0;
            for (int d = 1; d <= 9; d++) {
                if ((m >> (d - 1) & 1) == 1) {
                    l.add(d);
                    s += d;
                }
            }
            if (s == n) {
                res.add(l);
            }
        }
        return res;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = lst(Digits.combos(n(1), n(2)));
                } else {
                    String sai = null;
                    int done = 0;
                    for (int k = 1; k <= 9 && sai == null; k++) {
                        for (int nn = 1; nn <= 50 && sai == null; nn++) {
                            done++;
                            String got = lst(Digits.combos(k, nn)), want = lst(brute(k, nn));
                            if (!got.equals(want)) {
                                sai = "k=" + k + " n=" + nn + " -> " + got + ", expected " + want;
                            }
                        }
                    }
                    r = ketQua("every k = 1..9, n = 1..50", done, sai);
                }`,
  tep: {
    'Digits.java': j`
import java.util.ArrayList;
import java.util.List;

public class Digits {

    public static List<List<Integer>> combos(int k, int n) {
        //>> return new ArrayList<List<Integer>>(); // TODO
        List<List<Integer>> res = new ArrayList<List<Integer>>();
        go(k, n, 1, 0, new ArrayList<Integer>(), res);
        return res;
        //<<
    }
    //>> // TODO: helper(s)

    private static void go(int k, int n, int start, int sum, List<Integer> cur, List<List<Integer>> res) {
        if (cur.size() == k) {
            if (sum == n) {
                res.add(new ArrayList<Integer>(cur));
            }
            return;
        }
        for (int d = start; d <= 9; d++) {
            if (sum + d > n) {
                break; // larger digits only make it worse
            }
            cur.add(d);
            go(k, n, d + 1, sum + d, cur, res);
            cur.remove(cur.size() - 1);
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 3 9\nRUN 3 7\nRUN 4 1\nRUN 9 45\nRUN 2 18\nRUN 1 9\n' },
    { ten: { en: 'every k and n', vi: 'mọi k và n' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'Pass start = d + 1 to the next call: each digit at most once and sets come out increasing.', vi: 'Truyền start = d + 1 cho lời gọi kế: mỗi chữ số dùng nhiều nhất một lần và các tập ra theo thứ tự tăng.' },
    { en: 'Check "k digits chosen" before trying more digits.', vi: 'Kiểm "đã chọn đủ k chữ số" trước khi thử thêm chữ số.' },
  ],
  loiHayGap: [
    { en: 'start = d instead of d + 1 — a digit is reused ([3, 3, 3] for n = 9).', vi: 'start = d thay vì d + 1 — một chữ số bị dùng lại ([3, 3, 3] với n = 9).' },
    { en: 'Adding cur itself instead of a copy — every saved set ends up empty.', vi: 'Thêm chính cur thay vì bản sao — mọi tập đã lưu cuối cùng đều rỗng.' },
  ],
  giaiThich: { en: '<p>Combinations in increasing order guarantee each set is produced once; the sum bound cuts a branch the moment it cannot succeed. At most C(9, k) leaves.</p>', vi: '<p>Tổ hợp theo thứ tự tăng bảo đảm mỗi tập chỉ sinh một lần; cận theo tổng cắt nhánh ngay khi nó không thể thành công. Nhiều nhất C(9, k) lá.</p>' },
});

const de4 = deCs({
  id: 'csd201-cs6-beautiful-arrangement',
  tieuDe: { en: 'Beautiful arrangements — prune at the current position, not at the end', vi: 'Hoán vị đẹp — cắt nhánh ngay tại vị trí hiện tại, không đợi tới cuối' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['permutations with a used[] array', 'check the rule while placing', 'early pruning vs n!'],
  moTa: {
    en: `<p>A permutation p of 1…n is beautiful if for every position i (1-based) ${c('p[i] % i == 0')} or ${c('i % p[i] == 0')}. Complete ${c('static long count(int n)')} (1 ≤ n ≤ 15): how many beautiful permutations exist. n = 2 → 2, n = 3 → 3, n = 4 → 8.</p>
<p>Fill positions 1, 2, … in order; at position i try only the unused values v that satisfy the rule <b>for i</b>. Most branches die immediately. Building whole permutations and checking them at the end is n! — 1.3·10¹² for n = 15, which the complexity check uses.</p>`,
    vi: `<p>Hoán vị p của 1…n là đẹp nếu với mọi vị trí i (đánh từ 1) ${c('p[i] % i == 0')} hoặc ${c('i % p[i] == 0')}. Hoàn thiện ${c('count(n)')} (1 ≤ n ≤ 15): có bao nhiêu hoán vị đẹp. n = 2 → 2, n = 3 → 3, n = 4 → 8.</p>
<p>Điền các vị trí 1, 2, … theo thứ tự; ở vị trí i chỉ thử các giá trị v chưa dùng thoả luật <b>tại i</b>. Hầu hết các nhánh chết ngay. Dựng trọn hoán vị rồi mới kiểm ở cuối là n! — 1,3·10¹² với n = 15, đúng giá trị kiểm độ phức tạp dùng.</p>`,
  },
  hen: { n: 'n = 15', ms: 3000, can: 'pruned backtracking (a few million nodes)', cham: 'n! (checking complete permutations)' },
  dauVao: { en: 'RUN n · RANDOM (n = 1..9 vs every permutation) · PERF.', vi: 'RUN n · RANDOM (n = 1..9 so với mọi hoán vị) · PERF.' },
  them: `
    static long cnt;

    static void all(int[] p, int k) {
        if (k == p.length) {
            for (int i = 0; i < p.length; i++) {
                if (p[i] % (i + 1) != 0 && (i + 1) % p[i] != 0) {
                    return;
                }
            }
            cnt++;
            return;
        }
        for (int i = k; i < p.length; i++) {
            int t = p[k];
            p[k] = p[i];
            p[i] = t;
            all(p, k + 1);
            t = p[k];
            p[k] = p[i];
            p[i] = t;
        }
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Beautiful.count(n(1)));
                } else if (p[0].equals("RANDOM")) {
                    String sai = null;
                    for (int nn = 1; nn <= 9 && sai == null; nn++) {
                        int[] perm = new int[nn];
                        for (int i = 0; i < nn; i++) {
                            perm[i] = i + 1;
                        }
                        cnt = 0;
                        all(perm, 0);
                        long got = Beautiful.count(nn);
                        if (got != cnt) {
                            sai = "n=" + nn + " -> " + got + ", expected " + cnt;
                        }
                    }
                    r = ketQua("n = 1..9", 9, sai);
                } else {
                    final long[] got = new long[1];
                    r = Kiem.hen("n = 15", 3000, new Runnable() {
                        public void run() {
                            got[0] = Beautiful.count(15);
                        }
                    }) + ", count " + got[0];
                }`,
  tep: {
    'Beautiful.java': j`
public class Beautiful {

    public static long count(int n) {
        //>> return 0; // TODO
        return place(n, 1, new boolean[n + 1]);
        //<<
    }
    //>> // TODO: helper(s)

    private static long place(int n, int i, boolean[] used) {
        if (i > n) {
            return 1; // every position filled
        }
        long total = 0;
        for (int v = 1; v <= n; v++) {
            if (!used[v] && (v % i == 0 || i % v == 0)) { // prune HERE, at position i
                used[v] = true;
                total += place(n, i + 1, used);
                used[v] = false;
            }
        }
        return total;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'small n', vi: 'n nhỏ' }, vao: 'RUN 1\nRUN 2\nRUN 3\nRUN 4\nRUN 6\n' },
    { ten: { en: 'n = 1..9 vs every permutation', vi: 'n = 1..9 so với mọi hoán vị' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'A boolean used[1..n] marks the values already placed; unmark after the recursive call.', vi: 'Mảng boolean used[1..n] đánh dấu các giá trị đã đặt; bỏ đánh dấu sau lời gọi đệ quy.' },
    { en: 'Return counts from the recursion (long) instead of a global counter — easier to reason about.', vi: 'Trả số đếm từ đệ quy (long) thay vì biến đếm toàn cục — dễ suy luận hơn.' },
  ],
  loiHayGap: [
    { en: 'Generating every permutation and testing it at the end — correct, but 15! steps.', vi: 'Sinh mọi hoán vị rồi kiểm ở cuối — đúng, nhưng 15! bước.' },
    { en: 'Forgetting used[v] = false — later branches think v is still taken.', vi: 'Quên used[v] = false — các nhánh sau tưởng v vẫn đang bị dùng.' },
  ],
  giaiThich: { en: '<p>Checking the rule when a value is placed removes a branch together with all of its (n − i)! completions. For n = 15 only a few million nodes survive instead of 1.3·10¹² leaves — the whole point of backtracking over brute force.</p>', vi: '<p>Kiểm luật ngay khi đặt một giá trị loại cả nhánh cùng (n − i)! cách hoàn tất của nó. Với n = 15 chỉ còn vài triệu nút thay vì 1,3·10¹² lá — chính là điểm mạnh của quay lui so với vét cạn.</p>' },
});

const de5 = deCs({
  id: 'csd201-cs6-unique-paths-3',
  tieuDe: { en: 'Walk over every empty cell exactly once — count Hamiltonian paths on a grid', vi: 'Đi qua mọi ô trống đúng một lần — đếm đường Hamilton trên lưới' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['mark on the way in, unmark on the way out', 'count the cells still to visit', '4-directional moves'],
  moTa: {
    en: `<p>The grid has exactly one start (1), one end (2), obstacles (−1) and empty cells (0). Moving up/down/left/right, count the paths from start to end that walk over <b>every</b> non-obstacle cell exactly once. Complete ${c('static long paths(int[][] g)')}. Example ${c('[1,0,0,0] [0,0,0,0] [0,0,2,-1]')} → 2; ${c('[1,0,0,0] [0,0,0,0] [0,0,0,2]')} → 4; ${c('[0,1] [2,0]')} → 0.</p>
<p>DFS from the start with a ${c('visited')} grid and a counter of cells still to visit; reaching the end counts only when that counter says everything else has been visited. Always unmark the cell before returning — the next branch needs it free.</p>`,
    vi: `<p>Lưới có đúng một ô xuất phát (1), một ô đích (2), chướng ngại (−1) và ô trống (0). Đi lên/xuống/trái/phải, đếm các đường từ xuất phát tới đích đi qua <b>mọi</b> ô không phải chướng ngại đúng một lần. Hoàn thiện ${c('paths(g)')}. Ví dụ ${c('[1,0,0,0] [0,0,0,0] [0,0,2,-1]')} → 2; ${c('[1,0,0,0] [0,0,0,0] [0,0,0,2]')} → 4; ${c('[0,1] [2,0]')} → 0.</p>
<p>DFS từ ô xuất phát với lưới ${c('visited')} và biến đếm số ô còn phải thăm; tới đích chỉ được tính khi biến đếm cho biết mọi ô khác đã thăm. Luôn bỏ đánh dấu ô trước khi trả về — nhánh sau cần nó trống.</p>`,
  },
  dauVao: { en: 'RUN row row … (each row 1,0,-1,2) · RANDOM (grids up to 12 cells vs a bitmask DP).', vi: 'RUN hàng hàng … (mỗi hàng 1,0,-1,2) · RANDOM (lưới tới 12 ô so với quy hoạch động bitmask).' },
  them: `
    // independent check: dp[mask][v] = paths from the start visiting exactly mask and ending at v
    static long brute(int[][] g) {
        int R = g.length, C = g[0].length;
        List<int[]> cells = new ArrayList<int[]>();
        int s = -1, e = -1;
        for (int r = 0; r < R; r++) {
            for (int cc = 0; cc < C; cc++) {
                if (g[r][cc] != -1) {
                    if (g[r][cc] == 1) {
                        s = cells.size();
                    }
                    if (g[r][cc] == 2) {
                        e = cells.size();
                    }
                    cells.add(new int[] {r, cc});
                }
            }
        }
        int n = cells.size();
        long[][] dp = new long[1 << n][n];
        dp[1 << s][s] = 1;
        for (int m = 1; m < (1 << n); m++) {
            for (int v = 0; v < n; v++) {
                if (dp[m][v] == 0 || v == e) {
                    continue;
                }
                for (int w = 0; w < n; w++) {
                    if ((m >> w & 1) == 0 && Math.abs(cells.get(v)[0] - cells.get(w)[0]) + Math.abs(cells.get(v)[1] - cells.get(w)[1]) == 1) {
                        dp[m | 1 << w][w] += dp[m][v];
                    }
                }
            }
        }
        return dp[(1 << n) - 1][e];
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[][] g = new int[p.length - 1][];
                    for (int i = 1; i < p.length; i++) {
                        g[i - 1] = arr(p[i]);
                    }
                    r = String.valueOf(Hamilton.paths(g));
                } else {
                    Random rnd = new Random(87);
                    String sai = null;
                    for (int t = 0; t < 1500 && sai == null; t++) {
                        int R = 1 + rnd.nextInt(4), C = 1 + rnd.nextInt(Math.min(4, 12 / R));
                        if (R * C < 2) {
                            C = 2;
                        }
                        int[][] g = new int[R][C];
                        for (int[] row : g) {
                            for (int i = 0; i < C; i++) {
                                row[i] = rnd.nextInt(5) == 0 ? -1 : 0;
                            }
                        }
                        int a = rnd.nextInt(R * C), b;
                        do {
                            b = rnd.nextInt(R * C);
                        } while (b == a);
                        g[a / C][a % C] = 1;
                        g[b / C][b % C] = 2;
                        long got = Hamilton.paths(g), want = brute(g);
                        if (got != want) {
                            sai = Arrays.deepToString(g) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("1500 random grids", 1500, sai);
                }`,
  tep: {
    'Hamilton.java': j`
public class Hamilton {

    public static long paths(int[][] g) {
        //>> return 0; // TODO
        int R = g.length, C = g[0].length, sr = 0, sc = 0, toVisit = 0;
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                if (g[r][c] != -1) {
                    toVisit++;
                }
                if (g[r][c] == 1) {
                    sr = r;
                    sc = c;
                }
            }
        }
        return dfs(g, new boolean[R][C], sr, sc, toVisit);
        //<<
    }
    //>> // TODO: helper(s)

    private static long dfs(int[][] g, boolean[][] seen, int r, int c, int left) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] == -1 || seen[r][c]) {
            return 0;
        }
        if (g[r][c] == 2) {
            return left == 1 ? 1 : 0; // the end must be the last cell
        }
        seen[r][c] = true; // mark on the way in
        long total = dfs(g, seen, r + 1, c, left - 1) + dfs(g, seen, r - 1, c, left - 1)
                + dfs(g, seen, r, c + 1, left - 1) + dfs(g, seen, r, c - 1, left - 1);
        seen[r][c] = false; // unmark on the way out
        return total;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,0,0,0 0,0,0,0 0,0,2,-1\nRUN 1,0,0,0 0,0,0,0 0,0,0,2\nRUN 0,1 2,0\nRUN 1,2\nRUN 1,-1,2\n' },
    { ten: { en: '1500 random grids vs bitmask DP', vi: '1500 lưới ngẫu nhiên so với quy hoạch động bitmask' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'Count the non-obstacle cells once at the start; each step into a new cell decreases the counter.', vi: 'Đếm số ô không chướng ngại một lần lúc đầu; mỗi bước vào ô mới giảm biến đếm.' },
    { en: 'Treat the end cell specially: reaching it ends the path, whether or not it counts.', vi: 'Xử lý riêng ô đích: tới nó là kết thúc đường đi, dù có được tính hay không.' },
  ],
  loiHayGap: [
    { en: 'Not unmarking a cell after exploring — later branches cannot use it and the count is too small.', vi: 'Không bỏ đánh dấu ô sau khi khám phá — các nhánh sau không dùng được nó và số đếm bị thiếu.' },
    { en: 'Walking through the end cell and continuing — a path may pass the end before covering everything.', vi: 'Đi xuyên qua ô đích rồi đi tiếp — đường đi có thể ngang qua đích trước khi phủ hết.' },
  ],
  giaiThich: { en: '<p>Counting Hamiltonian paths is hard in general, but grids of ≤ 20 cells are small enough for backtracking: mark, recurse in four directions, unmark. The grader’s independent check is the bitmask DP (2ⁿ · n states) — a different algorithm with the same answers.</p>', vi: '<p>Đếm đường Hamilton nói chung là bài khó, nhưng lưới ≤ 20 ô đủ nhỏ cho quay lui: đánh dấu, đệ quy bốn hướng, bỏ đánh dấu. Phép kiểm độc lập của máy chấm là quy hoạch động bitmask (2ⁿ · n trạng thái) — một thuật toán khác cho cùng đáp án.</p>' },
});

const de6 = deCs({
  id: 'csd201-cs6-partition-k',
  tieuDe: { en: 'Split into k subsets with equal sums — fill one bucket at a time', vi: 'Chia thành k nhóm có tổng bằng nhau — điền đầy từng nhóm một' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['target = sum / k', 'sort descending to fail fast', 'used[] + bucket by bucket'],
  moTa: {
    en: `<p>Complete ${c('static boolean canPartition(int[] a, int k)')} (positive ints, 1 ≤ k ≤ n ≤ 16): can a be split into k groups with equal sums, every number in exactly one group? Example ${c('{4,3,2,3,5,2,1}')}: k = 4 → true (5, 1+4, 2+3, 2+3), k = 3 → false.</p>
<p>The sum must be divisible by k and no number may exceed target = sum / k. Sort descending (big numbers fail fast), then fill <b>one bucket completely</b> before starting the next: try each unused number that still fits; when a bucket reaches target, start the next one from index 0. Prune: if a value just failed in this position, skip equal values.</p>`,
    vi: `<p>Hoàn thiện ${c('canPartition(a, k)')} (số nguyên dương, 1 ≤ k ≤ n ≤ 16): có chia được a thành k nhóm có tổng bằng nhau, mỗi số đúng một nhóm không? Ví dụ ${c('{4,3,2,3,5,2,1}')}: k = 4 → true (5, 1+4, 2+3, 2+3), k = 3 → false.</p>
<p>Tổng phải chia hết cho k và không số nào được vượt target = sum / k. Sắp giảm dần (số lớn thất bại sớm), rồi điền <b>đầy một nhóm</b> trước khi sang nhóm kế: thử mỗi số chưa dùng còn vừa; khi một nhóm đạt target thì bắt đầu nhóm sau từ chỉ số 0. Cắt nhánh: một giá trị vừa thất bại ở vị trí này thì bỏ qua các giá trị bằng nó.</p>`,
  },
  dauVao: { en: 'RUN numbers k · RANDOM (vs trying every assignment to buckets).', vi: 'RUN các số k · RANDOM (so với thử mọi cách gán vào nhóm).' },
  them: `
    static boolean brute(int[] a, int i, int[] bucket) {
        if (i == a.length) {
            for (int b : bucket) {
                if (b != bucket[0]) {
                    return false;
                }
            }
            return true;
        }
        for (int b = 0; b < bucket.length; b++) {
            bucket[b] += a[i];
            boolean ok = brute(a, i + 1, bucket);
            bucket[b] -= a[i];
            if (ok) {
                return true;
            }
        }
        return false;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[] a = arr(p[1]);
                    String before = str(a);
                    r = Partition.canPartition(a, n(2)) + (str(a).equals(before) ? "" : " (a WAS MODIFIED)");
                } else {
                    Random rnd = new Random(89);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        int n = 1 + rnd.nextInt(8);
                        int[] a = new int[n];
                        for (int i = 0; i < n; i++) {
                            a[i] = 1 + rnd.nextInt(6);
                        }
                        int k = 1 + rnd.nextInt(n);
                        boolean got = Partition.canPartition(a.clone(), k), want = brute(a, 0, new int[k]);
                        if (got != want) {
                            sai = str(a) + " k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random cases", 2000, sai);
                }`,
  tep: {
    'Partition.java': j`
import java.util.Arrays;

public class Partition {

    public static boolean canPartition(int[] in, int k) {
        //>> return false; // TODO
        int sum = 0;
        for (int x : in) {
            sum += x;
        }
        if (sum % k != 0) {
            return false;
        }
        int target = sum / k;
        int[] a = in.clone();
        Arrays.sort(a);
        for (int i = 0, j = a.length - 1; i < j; i++, j--) { // descending: big numbers fail fast
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        if (a[0] > target) {
            return false;
        }
        return fill(a, new boolean[a.length], k, 0, 0, target);
        //<<
    }
    //>> // TODO: helper(s)

    // fill the current bucket (sum so far = cur) using numbers from index start on
    private static boolean fill(int[] a, boolean[] used, int k, int start, int cur, int target) {
        if (k == 1) {
            return true; // the last bucket gets everything left, which sums to target
        }
        if (cur == target) {
            return fill(a, used, k - 1, 0, 0, target); // the next bucket
        }
        int lastFailed = -1;
        for (int i = start; i < a.length; i++) {
            if (used[i] || cur + a[i] > target || a[i] == lastFailed) {
                continue;
            }
            used[i] = true;
            if (fill(a, used, k, i + 1, cur + a[i], target)) {
                return true;
            }
            used[i] = false;
            lastFailed = a[i]; // an equal value here would fail the same way
            if (cur == 0) {
                return false; // the largest unused number fits in no bucket
            }
        }
        return false;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 4,3,2,3,5,2,1 4\nRUN 4,3,2,3,5,2,1 3\nRUN 7 1\nRUN 2,2,2,2,3,3 3\nRUN 1,1,1,1,2,2,2,2 4\nRUN 10,1,1,1,1 2\n' },
    { ten: { en: '2000 random cases', vi: '2000 ca ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'When a bucket is complete, restart the search for the next bucket from index 0 (unused numbers may be anywhere).', vi: 'Khi một nhóm đầy, bắt đầu tìm cho nhóm kế từ chỉ số 0 (số chưa dùng có thể ở bất kỳ đâu).' },
    { en: 'If placing a number into an EMPTY bucket fails, no other choice can help — return false at once.', vi: 'Nếu đặt một số vào nhóm RỖNG mà thất bại thì không lựa chọn nào khác cứu được — trả false ngay.' },
  ],
  loiHayGap: [
    { en: 'Forgetting used[i] = false after a failed branch.', vi: 'Quên used[i] = false sau một nhánh thất bại.' },
    { en: 'Trying each number in every bucket — k! identical orderings of the buckets are explored.', vi: 'Thử mỗi số vào mọi nhóm — duyệt k! cách sắp các nhóm giống hệt nhau.' },
  ],
  giaiThich: { en: '<p>Filling buckets one at a time removes the k! symmetric orderings; sorting descending makes impossible branches fail early; skipping equal values and the "empty bucket" rule cut the rest. Worst case still exponential, but fine for n ≤ 16 (a bitmask DP over 2ⁿ subsets is the alternative).</p>', vi: '<p>Điền từng nhóm một loại bỏ k! cách sắp nhóm đối xứng; sắp giảm dần làm nhánh bất khả thất bại sớm; bỏ qua giá trị bằng nhau và luật "nhóm rỗng" cắt phần còn lại. Trường hợp xấu nhất vẫn là hàm mũ, nhưng đủ dùng với n ≤ 16 (quy hoạch động bitmask trên 2ⁿ tập con là phương án thay thế).</p>' },
});

export default moDun({ slug: 'csd201-cs6-on', ten: '10.6 ⭐ CS.6 Backtracking — interview problems', de: [de1, de2, de3, de4, de5, de6] });
