/** CSD201 · ⭐ CS.4 — quy hoạch động phần 2 kiểu phỏng vấn (gen/java/cs4/Ex*): đặt dấu ± (đếm tập con, vòng giảm), mảng con chung dài nhất (≠ LCS), trộn hai chuỗi (tham lam sai), đếm cách chọn dãy con, hầm ngục (điền ngược), cắt ít nhất thành palindrome (hai bước). */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const MOD_EN = 'modulo 1,000,000,007';
const MOD_VI = 'lấy dư 1.000.000.007';

const de1 = deCs({
  id: 'csd201-cs4-target-sum',
  tieuDe: { en: 'Target sum: + or − before every number — turn it into counting subsets', vi: 'Đặt dấu + hoặc − trước mỗi số — quy về đếm tập con' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['P − N = target, P + N = sum ⇒ P = (sum + target)/2', '0/1 counting knapsack, loop DOWN', 'zeros double the count'],
  moTa: {
    en: `<p>${c('a')} holds non-negative ints. Put + or − in front of every number; complete ${c('static long ways(int[] a, int target)')}: in how many ways the result equals target, ${MOD_EN}. Example ${c('{2,1,3,1,1}')}, target 2 → 5; ${c('{0,0,1}')}, target 1 → 4 (+0 and −0 are different choices).</p>
<p>If P = sum of the "+" numbers and N of the "−" ones, P − N = target and P + N = sum, so P = (sum + target)/2: count subsets with sum P (0 if |target| > sum or sum + target is odd). ${c('cnt[s] += cnt[s − x]')} with s going <b>down</b> so that each number is used once. The complexity check has 200 numbers — 2²⁰⁰ sign patterns.</p>`,
    vi: `<p>${c('a')} gồm các số nguyên không âm. Đặt + hoặc − trước mỗi số; hoàn thiện ${c('ways(a, target)')}: có bao nhiêu cách để kết quả bằng target, ${MOD_VI}. Ví dụ ${c('{2,1,3,1,1}')}, target 2 → 5; ${c('{0,0,1}')}, target 1 → 4 (+0 và −0 là hai lựa chọn khác nhau).</p>
<p>Gọi P = tổng các số mang "+", N = tổng các số mang "−": P − N = target và P + N = sum, nên P = (sum + target)/2: đếm tập con có tổng P (0 nếu |target| > sum hoặc sum + target lẻ). ${c('cnt[s] += cnt[s − x]')} với s đi <b>xuống</b> để mỗi số dùng một lần. Kiểm độ phức tạp có 200 số — 2²⁰⁰ cách đặt dấu.</p>`,
  },
  hen: { n: '200 numbers, sum ≤ 10,000', ms: 3000, can: 'O(n · sum)', cham: 'O(2ⁿ) (trying every sign)' },
  dauVao: { en: 'RUN numbers target · RANDOM · PERF.', vi: 'RUN các số target · RANDOM · PERF.' },
  them: `
    static long brute(int[] a, int i, int left) {
        if (i == a.length) {
            return left == 0 ? 1 : 0;
        }
        return brute(a, i + 1, left - a[i]) + brute(a, i + 1, left + a[i]);
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(TargetSum.ways(arr(p[1]), n(2)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(41);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(11)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(6);
                        }
                        int target = rnd.nextInt(17) - 8;
                        long got = TargetSum.ways(a.clone(), target), want = brute(a, 0, target);
                        if (got != want) {
                            sai = str(a) + " target=" + target + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random cases vs every sign pattern", 3000, sai);
                } else {
                    final int[] a = new int[200];
                    Random rnd = new Random(43);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i % 20 == 0 ? 0 : 1 + rnd.nextInt(50);
                    }
                    final long[] got = new long[2];
                    r = Kiem.hen("200 numbers", 3000, new Runnable() {
                        public void run() {
                            got[0] = TargetSum.ways(a, 0);
                            got[1] = TargetSum.ways(a, 36);
                        }
                    }) + ", answers " + got[0] + " and " + got[1];
                }`,
  tep: {
    'TargetSum.java': j`
public class TargetSum {
    static final long MOD = 1_000_000_007L;

    public static long ways(int[] a, int target) {
        //>> return 0; // TODO
        int sum = 0;
        for (int x : a) {
            sum += x;
        }
        if (Math.abs(target) > sum || (sum + target) % 2 != 0) {
            return 0; // impossible
        }
        int P = (sum + target) / 2; // the sum of the "+" numbers
        long[] cnt = new long[P + 1];
        cnt[0] = 1; // the empty subset
        for (int x : a) {
            for (int s = P; s >= x; s--) { // DOWN: each number at most once
                cnt[s] = (cnt[s] + cnt[s - x]) % MOD;
            }
        }
        return cnt[P];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 2,1,3,1,1 2\nRUN 0,0,1 1\nRUN 5 -5\nRUN 1,2 2\nRUN - 0\nRUN 3 7\n' },
    { ten: { en: '3000 random cases', vi: '3000 ca ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Check the two impossible cases first: |target| > sum, and sum + target odd.', vi: 'Kiểm hai trường hợp bất khả trước: |target| > sum, và sum + target lẻ.' },
    { en: 'A 0 must still be processed: cnt[s] += cnt[s − 0] doubles every count, exactly the +0/−0 choice.', vi: 'Số 0 vẫn phải xử lý: cnt[s] += cnt[s − 0] nhân đôi mọi số đếm, đúng lựa chọn +0/−0.' },
  ],
  loiHayGap: [
    { en: 'Looping s upward — each number can be used many times (unbounded knapsack).', vi: 'Cho s chạy lên — mỗi số dùng được nhiều lần (cái túi không giới hạn).' },
    { en: 'Skipping zeros or the parity test — a negative or fractional P.', vi: 'Bỏ qua số 0 hay phép kiểm chẵn lẻ — P âm hoặc lẻ nửa.' },
  ],
  giaiThich: { en: '<p>The algebra turns 2ⁿ sign patterns into "how many subsets have sum P" — a 0/1 counting knapsack over sums 0…P: O(n · sum) time, O(sum) memory.</p>', vi: '<p>Phép biến đổi đại số đưa 2ⁿ cách đặt dấu về "có bao nhiêu tập con có tổng P" — cái túi 0/1 đếm trên các tổng 0…P: O(n · sum) thời gian, O(sum) bộ nhớ.</p>' },
});

const de2 = deCs({
  id: 'csd201-cs4-common-subarray',
  tieuDe: { en: 'Longest common subarray (contiguous!) — not the LCS', vi: 'Mảng con chung dài nhất (liên tiếp!) — không phải LCS' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['dp[i][j] = common block ENDING at a[i−1], b[j−1]', 'a mismatch resets to 0', 'answer = max over all cells'],
  moTa: {
    en: `<p>Complete ${c('static int longest(int[] a, int[] b)')}: the length of the longest <b>contiguous</b> block that appears in both arrays. Example ${c('{5,1,2,8,3,7}')} and ${c('{1,2,3,7,8}')} → 2 ([1,2] or [3,7]); the LCS (which may skip) would be 4.</p>
<p>${c('dp[i][j]')} = length of the common block that ends exactly at a[i−1] and b[j−1]: equal → ${c('dp[i−1][j−1] + 1')}, different → 0. The answer is the maximum cell, not ${c('dp[n][m]')}. The complexity check uses two arrays of 3000 that share long blocks.</p>`,
    vi: `<p>Hoàn thiện ${c('longest(a, b)')}: độ dài khối <b>liên tiếp</b> dài nhất xuất hiện trong cả hai mảng. Ví dụ ${c('{5,1,2,8,3,7}')} và ${c('{1,2,3,7,8}')} → 2 ([1,2] hoặc [3,7]); LCS (được bỏ qua phần tử) sẽ là 4.</p>
<p>${c('dp[i][j]')} = độ dài khối chung kết thúc đúng tại a[i−1] và b[j−1]: bằng nhau → ${c('dp[i−1][j−1] + 1')}, khác → 0. Đáp án là ô lớn nhất, không phải ${c('dp[n][m]')}. Kiểm độ phức tạp dùng hai mảng 3000 phần tử có chung những khối dài.</p>`,
  },
  hen: { n: '3000 × 3000', ms: 3000, can: 'O(n · m)', cham: 'O(n · m · L) (extending from every pair of starts)' },
  them: `
    static int brute(int[] a, int[] b) {
        int best = 0;
        for (int i = 0; i < a.length; i++) {
            for (int jj = 0; jj < b.length; jj++) {
                int k = 0;
                while (i + k < a.length && jj + k < b.length && a[i + k] == b[jj + k]) {
                    k++;
                }
                best = Math.max(best, k);
            }
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Common.longest(arr(p[1]), arr(p[2])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(45);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(9)], b = new int[rnd.nextInt(9)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(3);
                        }
                        for (int i = 0; i < b.length; i++) {
                            b[i] = rnd.nextInt(3);
                        }
                        int got = Common.longest(a.clone(), b.clone()), want = brute(a, b);
                        if (got != want) {
                            sai = str(a) + " vs " + str(b) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random pairs (empty too)", 3000, sai);
                } else {
                    final int[] a = new int[3000], b = new int[3000];
                    for (int i = 0; i < 3000; i++) {
                        a[i] = i % 1000 == 999 ? 1 : 0;
                        b[i] = i % 1300 == 1299 ? 2 : 0;
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("3000 x 3000 with long common blocks", 3000, new Runnable() {
                        public void run() {
                            got[0] = Common.longest(a, b);
                        }
                    }) + ", longest " + got[0];
                }`,
  tep: {
    'Common.java': j`
public class Common {

    public static int longest(int[] a, int[] b) {
        //>> return 0; // TODO
        int[][] dp = new int[a.length + 1][b.length + 1]; // block ENDING at a[i-1], b[j-1]
        int best = 0;
        for (int i = 1; i <= a.length; i++) {
            for (int j = 1; j <= b.length; j++) {
                if (a[i - 1] == b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    best = Math.max(best, dp[i][j]); // the answer can end anywhere
                } // else 0: the block is broken
            }
        }
        return best;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 5,1,2,8,3,7 1,2,3,7,8\nRUN 1,2,3,2,1 3,2,1,4,7\nRUN - 1,2\nRUN 4,4,4 4,4\nRUN 1,2,3 4,5,6\n' },
    { ten: { en: '3000 random pairs', vi: '3000 cặp ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Pad the table with a row and column of zeros so that dp[i−1][j−1] always exists.', vi: 'Đệm bảng một hàng và một cột số 0 để dp[i−1][j−1] luôn tồn tại.' },
    { en: 'Only the previous row is needed — a 1-D version is a good follow-up (careful with the order of j).', vi: 'Chỉ cần hàng trước — bản 1 chiều là bài tiếp theo hay (cẩn thận thứ tự j).' },
  ],
  loiHayGap: [
    { en: 'Copying the LCS recurrence max(dp[i−1][j], dp[i][j−1]) — that allows gaps.', vi: 'Chép công thức LCS max(dp[i−1][j], dp[i][j−1]) — công thức đó cho phép có khoảng trống.' },
    { en: 'Returning dp[n][m] — the best block rarely ends at both last elements.', vi: 'Trả dp[n][m] — khối tốt nhất hiếm khi kết thúc ở cả hai phần tử cuối.' },
  ],
  giaiThich: { en: '<p>"Ending exactly here" is the key state for contiguous problems: it makes a mismatch a reset to 0 and the global answer a maximum over all states. n·m cells, O(1) each.</p>', vi: '<p>"Kết thúc đúng ở đây" là trạng thái then chốt của các bài liên tiếp: nó biến chỗ khác nhau thành đặt lại về 0 và đáp án chung thành max trên mọi trạng thái. n·m ô, mỗi ô O(1).</p>' },
});

const de3 = deCs({
  id: 'csd201-cs4-interleave',
  tieuDe: { en: 'Is c an interleaving of a and b? — a 2-D boolean table (greedy fails)', vi: 'c có phải trộn của a và b không? — bảng boolean 2 chiều (tham lam sai)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['dp[i][j]: a[0..i) and b[0..j) form c[0..i+j)', 'last character from a or from b', 'greedy "take from a first" fails'],
  moTa: {
    en: `<p>Complete ${c('static boolean can(String a, String b, String c)')}: can c be obtained by merging a and b while keeping the order of characters inside each? Examples: a = abc, b = xab: c = axbabc → true, abcxba → false. a = ab, b = ac, c = acab → true, although taking from a whenever it matches fails.</p>
<p>${c('dp[i][j]')} = the first i characters of a and the first j of b can form the first i + j of c: true if (${c('dp[i−1][j]')} and a[i−1] = c[i+j−1]) or (${c('dp[i][j−1]')} and b[j−1] = c[i+j−1]). Check the lengths first. The complexity check uses strings of 2000 a’s.</p>`,
    vi: `<p>Hoàn thiện ${c('can(a, b, c)')}: c có thể tạo bằng cách trộn a và b mà giữ nguyên thứ tự ký tự bên trong mỗi xâu không? Ví dụ: a = abc, b = xab: c = axbabc → true, abcxba → false. a = ab, b = ac, c = acab → true, dù cách "khớp a thì lấy a" thất bại.</p>
<p>${c('dp[i][j]')} = i ký tự đầu của a và j ký tự đầu của b tạo được i + j ký tự đầu của c: đúng nếu (${c('dp[i−1][j]')} và a[i−1] = c[i+j−1]) hoặc (${c('dp[i][j−1]')} và b[j−1] = c[i+j−1]). Kiểm độ dài trước. Kiểm độ phức tạp dùng các xâu 2000 chữ a.</p>`,
  },
  hen: { n: '2000 + 2000 characters', ms: 3000, can: 'O(n · m)', cham: 'exponential (plain recursion on repeated letters)' },
  dauVao: { en: 'RUN a b c (- = empty string) · RANDOM · PERF.', vi: 'RUN a b c (- = xâu rỗng) · RANDOM · PERF.' },
  them: `
    static String s(String x) {
        return x.equals("-") ? "" : x;
    }

    static boolean brute(String a, String b, String c) {
        if (c.isEmpty()) {
            return a.isEmpty() && b.isEmpty();
        }
        if (!a.isEmpty() && a.charAt(0) == c.charAt(0) && brute(a.substring(1), b, c.substring(1))) {
            return true;
        }
        return !b.isEmpty() && b.charAt(0) == c.charAt(0) && brute(a, b.substring(1), c.substring(1));
    }

    static String rs(Random rnd, int max) {
        StringBuilder sb = new StringBuilder();
        int n = rnd.nextInt(max + 1);
        for (int i = 0; i < n; i++) {
            sb.append(rnd.nextBoolean() ? 'a' : 'b');
        }
        return sb.toString();
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Interleave.can(s(p[1]), s(p[2]), s(p[3])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(47);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        String a = rs(rnd, 5), b = rs(rnd, 5), cc;
                        if (t % 2 == 0) {
                            StringBuilder sb = new StringBuilder();
                            int i = 0, jj = 0;
                            while (i < a.length() || jj < b.length()) {
                                if (jj == b.length() || (i < a.length() && rnd.nextBoolean())) {
                                    sb.append(a.charAt(i++));
                                } else {
                                    sb.append(b.charAt(jj++));
                                }
                            }
                            cc = sb.toString();
                        } else {
                            cc = rs(rnd, 10);
                        }
                        boolean got = Interleave.can(a, b, cc), want = brute(a, b, cc);
                        if (got != want) {
                            sai = "a=" + a + " b=" + b + " c=" + cc + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random triples (half real merges)", 3000, sai);
                } else {
                    StringBuilder x = new StringBuilder();
                    for (int i = 0; i < 2000; i++) {
                        x.append('a');
                    }
                    final String a = x.toString(), cTrue = a + a, cFalse = a + a.substring(1) + "b";
                    final boolean[] got = new boolean[2];
                    r = Kiem.hen("a = b = 2000 a's", 3000, new Runnable() {
                        public void run() {
                            got[0] = Interleave.can(a, a, cTrue);
                            got[1] = Interleave.can(a, a, cFalse);
                        }
                    }) + ", answers " + got[0] + " and " + got[1];
                }`,
  tep: {
    'Interleave.java': j`
public class Interleave {

    public static boolean can(String a, String b, String c) {
        //>> return false; // TODO
        int n = a.length(), m = b.length();
        if (n + m != c.length()) {
            return false; // lengths first
        }
        boolean[][] dp = new boolean[n + 1][m + 1];
        dp[0][0] = true;
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= m; j++) {
                if (i > 0 && dp[i - 1][j] && a.charAt(i - 1) == c.charAt(i + j - 1)) {
                    dp[i][j] = true; // the last character came from a
                }
                if (j > 0 && dp[i][j - 1] && b.charAt(j - 1) == c.charAt(i + j - 1)) {
                    dp[i][j] = true; // the last character came from b
                }
            }
        }
        return dp[n][m];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples (greedy fails on the 4th)', vi: 'ví dụ (tham lam sai ở dòng 4)' }, vao: 'RUN abc xab axbabc\nRUN abc xab abxcab\nRUN abc xab abcxba\nRUN ab ac acab\nRUN - - -\nRUN a - ab\n' },
    { ten: { en: '3000 random triples', vi: '3000 bộ ba ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Row 0 and column 0 are prefixes of only one string — the same two rules handle them if you guard i > 0 and j > 0.', vi: 'Hàng 0 và cột 0 là tiền tố của chỉ một xâu — hai luật đó tự xử lý nếu bạn chặn i > 0 và j > 0.' },
    { en: 'The character to match is always c[i + j − 1].', vi: 'Ký tự cần khớp luôn là c[i + j − 1].' },
  ],
  loiHayGap: [
    { en: 'Greedy: take from a whenever it matches — ab / ac / acab returns false.', vi: 'Tham lam: khớp a là lấy a — ab / ac / acab trả false.' },
    { en: 'Forgetting the length test — c longer than a + b can still "match" a prefix.', vi: 'Quên kiểm độ dài — c dài hơn a + b vẫn có thể "khớp" một tiền tố.' },
  ],
  giaiThich: { en: '<p>When both a and b can supply the next character, the choice matters later — that is why greedy fails and why plain recursion explodes on repeated letters. The table has (n + 1)(m + 1) cells, each decided in O(1).</p>', vi: '<p>Khi cả a lẫn b đều cung cấp được ký tự kế tiếp, lựa chọn đó ảnh hưởng về sau — vì vậy tham lam sai và đệ quy trần bùng nổ với chữ lặp lại. Bảng có (n + 1)(m + 1) ô, mỗi ô quyết định trong O(1).</p>' },
});

const de4 = deCs({
  id: 'csd201-cs4-distinct-subseq',
  tieuDe: { en: 'In how many ways can t be picked out of s? — distinct subsequences', vi: 'Có bao nhiêu cách chọn t ra từ s? — đếm dãy con' },
  doKho: 'HARD', phut: 25,
  khaiNiem: ['dp[j] = ways to form t[0..j)', 'j goes DOWN (each s[i] used once)', 'counting modulo a prime'],
  moTa: {
    en: `<p>Complete ${c('static long count(String s, String t)')}: the number of ways to choose positions of s (in order) that spell t, ${MOD_EN}. Examples: s = banana: t = ban → 3, t = ana → 4, t = "" → 1. 60 a’s choosing 30 gives C(60, 30) — beyond an int.</p>
<p>${c('dp[j]')} = number of ways to form ${c('t[0..j)')} from the part of s read so far, ${c('dp[0] = 1')}. For each character of s, for j from |t| <b>down</b> to 1: if s[i] = t[j−1], ${c('dp[j] += dp[j−1]')}. O(|s|·|t|); the complexity check has |s| = 20,000, |t| = 300.</p>`,
    vi: `<p>Hoàn thiện ${c('count(s, t)')}: số cách chọn các vị trí của s (theo thứ tự) ghép thành t, ${MOD_VI}. Ví dụ: s = banana: t = ban → 3, t = ana → 4, t = "" → 1. 60 chữ a chọn 30 cho C(60, 30) — vượt int.</p>
<p>${c('dp[j]')} = số cách tạo ${c('t[0..j)')} từ phần s đã đọc, ${c('dp[0] = 1')}. Với mỗi ký tự của s, cho j từ |t| <b>xuống</b> 1: nếu s[i] = t[j−1] thì ${c('dp[j] += dp[j−1]')}. O(|s|·|t|); kiểm độ phức tạp có |s| = 20.000, |t| = 300.</p>`,
  },
  hen: { n: '|s| = 20,000, |t| = 300', ms: 3000, can: 'O(|s| · |t|)', cham: 'exponential (every choice of positions)' },
  dauVao: { en: 'RUN s t (- = empty) · RANDOM · PERF.', vi: 'RUN s t (- = rỗng) · RANDOM · PERF.' },
  them: `
    static String s(String x) {
        return x.equals("-") ? "" : x;
    }

    static long brute(String s, String t) {
        long cc = 0;
        for (int m = 0; m < (1 << s.length()); m++) {
            if (Integer.bitCount(m) != t.length()) {
                continue;
            }
            StringBuilder b = new StringBuilder();
            for (int i = 0; i < s.length(); i++) {
                if ((m >> i & 1) == 1) {
                    b.append(s.charAt(i));
                }
            }
            if (b.toString().equals(t)) {
                cc++;
            }
        }
        return cc;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Subseq.count(s(p[1]), s(p[2])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(49);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        StringBuilder a = new StringBuilder(), b = new StringBuilder();
                        int n = rnd.nextInt(13), m = rnd.nextInt(5);
                        for (int i = 0; i < n; i++) {
                            a.append(rnd.nextBoolean() ? 'a' : 'b');
                        }
                        for (int i = 0; i < m; i++) {
                            b.append(rnd.nextBoolean() ? 'a' : 'b');
                        }
                        long got = Subseq.count(a.toString(), b.toString()), want = brute(a.toString(), b.toString());
                        if (got != want) {
                            sai = "s=" + a + " t=" + b + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random pairs over {a,b}", 2000, sai);
                } else {
                    StringBuilder a = new StringBuilder(), b = new StringBuilder();
                    Random rnd = new Random(51);
                    for (int i = 0; i < 20000; i++) {
                        a.append((char) ('a' + rnd.nextInt(3)));
                    }
                    for (int i = 0; i < 300; i++) {
                        b.append((char) ('a' + rnd.nextInt(3)));
                    }
                    final String ss = a.toString(), tt = b.toString();
                    final long[] got = new long[1];
                    r = Kiem.hen("|s| = 20,000, |t| = 300", 3000, new Runnable() {
                        public void run() {
                            got[0] = Subseq.count(ss, tt);
                        }
                    }) + ", count mod p = " + got[0];
                }`,
  tep: {
    'Subseq.java': j`
public class Subseq {
    static final long MOD = 1_000_000_007L;

    public static long count(String s, String t) {
        //>> return 0; // TODO
        long[] dp = new long[t.length() + 1];
        dp[0] = 1; // the empty t: one way (pick nothing)
        for (int i = 0; i < s.length(); i++) {
            for (int j = t.length(); j >= 1; j--) { // DOWN: s[i] is used once
                if (s.charAt(i) == t.charAt(j - 1)) {
                    dp[j] = (dp[j] + dp[j - 1]) % MOD;
                }
            }
        }
        return dp[t.length()];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN banana ban\nRUN banana ana\nRUN banana -\nRUN - a\nRUN aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n' },
    { ten: { en: '2000 random pairs', vi: '2000 cặp ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'A 2-D table dp[i][j] works too; the 1-D version needs j to go down for the same reason as 0/1 knapsack.', vi: 'Bảng 2 chiều dp[i][j] cũng được; bản 1 chiều cần j đi xuống vì cùng lý do với cái túi 0/1.' },
    { en: 'C(60, 30) = 118264581564861424 — its remainder mod 1,000,000,007 is what the grader prints.', vi: 'C(60, 30) = 118264581564861424 — máy chấm in số dư của nó cho 1.000.000.007.' },
  ],
  loiHayGap: [
    { en: 'j going up — one character of s is used for two positions of t ("aa" in "a" counts 1).', vi: 'j đi lên — một ký tự của s bị dùng cho hai vị trí của t ("aa" trong "a" đếm ra 1).' },
    { en: 'Forgetting dp[0] = 1 — every count stays 0.', vi: 'Quên dp[0] = 1 — mọi số đếm đều là 0.' },
  ],
  giaiThich: { en: '<p>Each character of s either is not used, or matches the j-th character of t and extends every way of forming t[0..j−1). That is the counting version of LCS, O(|s|·|t|) time and O(|t|) memory.</p>', vi: '<p>Mỗi ký tự của s hoặc không dùng, hoặc khớp ký tự thứ j của t và nối dài mọi cách tạo t[0..j−1). Đó là bản đếm của LCS, O(|s|·|t|) thời gian và O(|t|) bộ nhớ.</p>' },
});

const de5 = deCs({
  id: 'csd201-cs4-dungeon',
  tieuDe: { en: 'Dungeon: the smallest starting health — fill the table BACKWARDS', vi: 'Hầm ngục: máu khởi đầu nhỏ nhất — điền bảng NGƯỢC' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['need[r][c] = health needed when ENTERING (r, c)', 'max(1, next − g[r][c])', 'why forward DP fails'],
  moTa: {
    en: `<p>A knight walks from the top-left to the bottom-right cell of ${c('g')} moving only right or down; ${c('g[r][c]')} is added to his health (negative = damage). Health must stay ≥ 1 at every moment, including after the last cell. Complete ${c('static int start(int[][] g)')}: the smallest starting health. Example ${c('[-2,-4,3] [-6,8,-1] [9,-12,5]')} → 7.</p>
<p>Going forward you would need two numbers per cell (health left and lowest point so far) and neither alone decides. Going <b>backwards</b> one number suffices: ${c('need[r][c] = max(1, min(need[r+1][c], need[r][c+1]) − g[r][c])')}, with 1 needed after the exit. The complexity check is a 1000 × 1000 grid.</p>`,
    vi: `<p>Hiệp sĩ đi từ ô trên trái tới ô dưới phải của ${c('g')}, chỉ sang phải hoặc xuống; ${c('g[r][c]')} được cộng vào máu (âm = mất máu). Máu phải luôn ≥ 1 ở mọi lúc, kể cả sau ô cuối. Hoàn thiện ${c('start(g)')}: máu khởi đầu nhỏ nhất. Ví dụ ${c('[-2,-4,3] [-6,8,-1] [9,-12,5]')} → 7.</p>
<p>Đi xuôi thì mỗi ô cần hai số (máu còn lại và điểm thấp nhất đã qua) và không số nào tự quyết định được. Đi <b>ngược</b> chỉ cần một số: ${c('need[r][c] = max(1, min(need[r+1][c], need[r][c+1]) − g[r][c])')}, sau lối ra cần 1. Kiểm độ phức tạp là lưới 1000 × 1000.</p>`,
  },
  hen: { n: '1000 × 1000 grid', ms: 3000, can: 'O(R · C)', cham: 'exponential (every path)' },
  dauVao: { en: 'RUN row row … (each row 1,2,3) · RANDOM · PERF.', vi: 'RUN hàng hàng … (mỗi hàng 1,2,3) · RANDOM · PERF.' },
  them: `
    static int brute(int[][] g, int r, int cc, int sum, int low) {
        sum += g[r][cc];
        low = Math.min(low, sum);
        if (r == g.length - 1 && cc == g[0].length - 1) {
            return Math.max(1, 1 - low);
        }
        int b = Integer.MAX_VALUE;
        if (r + 1 < g.length) {
            b = Math.min(b, brute(g, r + 1, cc, sum, low));
        }
        if (cc + 1 < g[0].length) {
            b = Math.min(b, brute(g, r, cc + 1, sum, low));
        }
        return b;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[][] g = new int[p.length - 1][];
                    for (int i = 1; i < p.length; i++) {
                        g[i - 1] = arr(p[i]);
                    }
                    r = String.valueOf(Dungeon.start(g));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(53);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        int R = 1 + rnd.nextInt(4), C = 1 + rnd.nextInt(4);
                        int[][] g = new int[R][C];
                        for (int[] row : g) {
                            for (int i = 0; i < C; i++) {
                                row[i] = rnd.nextInt(21) - 12;
                            }
                        }
                        int got = Dungeon.start(g), want = brute(g, 0, 0, 0, 0);
                        if (got != want) {
                            sai = Arrays.deepToString(g) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random grids vs every path", 2000, sai);
                } else {
                    final int[][] g = new int[1000][1000];
                    Random rnd = new Random(55);
                    for (int[] row : g) {
                        for (int i = 0; i < row.length; i++) {
                            row[i] = rnd.nextInt(201) - 110;
                        }
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("1000 x 1000 grid", 3000, new Runnable() {
                        public void run() {
                            got[0] = Dungeon.start(g);
                        }
                    }) + ", start " + got[0];
                }`,
  tep: {
    'Dungeon.java': j`
import java.util.Arrays;

public class Dungeon {

    public static int start(int[][] g) {
        //>> return 1; // TODO
        int R = g.length, C = g[0].length;
        int[][] need = new int[R + 1][C + 1];
        for (int[] row : need) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }
        need[R][C - 1] = 1; // after the last cell we still need 1
        need[R - 1][C] = 1;
        for (int r = R - 1; r >= 0; r--) {
            for (int c = C - 1; c >= 0; c--) {
                int next = Math.min(need[r + 1][c], need[r][c + 1]); // the cheaper way onward
                need[r][c] = Math.max(1, next - g[r][c]);
            }
        }
        return need[0][0];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN -2,-4,3 -6,8,-1 9,-12,5\nRUN 5\nRUN -5\nRUN 0\nRUN 1,-3,3 0,-2,0 -3,-3,-3\n' },
    { ten: { en: '2000 random grids', vi: '2000 lưới ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Add a border row and column filled with "infinity", except the two cells next to the exit, which need 1.', vi: 'Thêm một hàng và một cột viền chứa "vô cực", trừ hai ô cạnh lối ra cần 1.' },
    { en: 'A big potion (g positive) can make next − g ≤ 0 — the max(1, …) keeps the knight alive on entry.', vi: 'Bình thuốc lớn (g dương) có thể làm next − g ≤ 0 — max(1, …) giữ hiệp sĩ còn sống khi bước vào.' },
  ],
  loiHayGap: [
    { en: 'Forward DP that maximises health left — a path with more health at the end may dip lower on the way.', vi: 'Quy hoạch xuôi tối đa máu còn lại — đường còn nhiều máu ở cuối có thể tụt thấp hơn giữa đường.' },
    { en: 'Forgetting the max(1, …) — the table claims 0 or negative health is enough.', vi: 'Quên max(1, …) — bảng cho rằng máu 0 hoặc âm là đủ.' },
  ],
  giaiThich: { en: '<p>Backwards, the future is already summarised in one number: how much health you must carry into the next cell. Choosing the cheaper next cell and subtracting the current cell gives the requirement on entry, clamped to 1. R·C cells, O(1) each.</p>', vi: '<p>Đi ngược, tương lai đã được tóm trong một số: lượng máu phải mang vào ô kế tiếp. Chọn ô kế rẻ hơn rồi trừ ô hiện tại cho ra yêu cầu khi bước vào, kẹp ở 1. R·C ô, mỗi ô O(1).</p>' },
});

const de6 = deCs({
  id: 'csd201-cs4-min-cuts',
  tieuDe: { en: 'Fewest cuts so that every piece is a palindrome — two DP tables', vi: 'Cắt ít nhất để mọi mảnh là palindrome — hai bảng quy hoạch động' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['pal[i][j] by interval DP', 'cut[j] = fewest cuts for s[0..j]', 'greedy longest-prefix fails'],
  moTa: {
    en: `<p>Complete ${c('static int minCuts(String s)')}: the fewest cuts that split s into palindromes (0 for an empty string or a palindrome). Examples: abaccd → 2 (aba|cc|d), aab → 1, racecar → 0, abcd → 3. Greedy "cut off the longest palindromic prefix" gives 2 for abaab, the answer is 1 (a|baab).</p>
<p>Step 1: ${c('pal[i][j] = s[i] == s[j] && (j − i < 2 || pal[i+1][j−1])')}, filled with i going down. Step 2: ${c('cut[j]')} = fewest cuts for s[0..j]: the last piece is some palindrome s[i..j], so ${c('cut[j] = min(i == 0 ? 0 : cut[i−1] + 1)')}. O(n²); the complexity check has n = 2000.</p>`,
    vi: `<p>Hoàn thiện ${c('minCuts(s)')}: số lần cắt ít nhất để chia s thành các palindrome (xâu rỗng hoặc palindrome → 0). Ví dụ: abaccd → 2 (aba|cc|d), aab → 1, racecar → 0, abcd → 3. Tham lam "cắt tiền tố palindrome dài nhất" cho 2 với abaab, đáp án là 1 (a|baab).</p>
<p>Bước 1: ${c('pal[i][j] = s[i] == s[j] && (j − i < 2 || pal[i+1][j−1])')}, điền với i đi xuống. Bước 2: ${c('cut[j]')} = số lần cắt ít nhất cho s[0..j]: mảnh cuối là một palindrome s[i..j], nên ${c('cut[j] = min(i == 0 ? 0 : cut[i−1] + 1)')}. O(n²); kiểm độ phức tạp có n = 2000.</p>`,
  },
  hen: { n: 'n = 2000', ms: 3000, can: 'O(n²)', cham: 'exponential, or O(n³) with an isPalindrome test inside the loop' },
  dauVao: { en: 'RUN s (- = empty) · RANDOM · PERF.', vi: 'RUN s (- = rỗng) · RANDOM · PERF.' },
  them: `
    static boolean isPal(String s) {
        return new StringBuilder(s).reverse().toString().equals(s);
    }

    static int brute(String s) {
        if (s.isEmpty() || isPal(s)) {
            return 0;
        }
        int b = Integer.MAX_VALUE;
        for (int k = 1; k < s.length(); k++) {
            if (isPal(s.substring(0, k))) {
                b = Math.min(b, 1 + brute(s.substring(k)));
            }
        }
        return b;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Cuts.minCuts(p[1].equals("-") ? "" : p[1]));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(57);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        StringBuilder sb = new StringBuilder();
                        int n = rnd.nextInt(11);
                        for (int i = 0; i < n; i++) {
                            sb.append("abc".charAt(rnd.nextInt(t % 2 == 0 ? 2 : 3)));
                        }
                        String s = sb.toString();
                        int got = Cuts.minCuts(s), want = brute(s);
                        if (got != want) {
                            sai = "\\"" + s + "\\" -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random strings (empty too)", 2000, sai);
                } else {
                    StringBuilder sb = new StringBuilder();
                    Random rnd = new Random(59);
                    for (int i = 0; i < 2000; i++) {
                        sb.append(i % 400 < 300 ? 'a' : (char) ('a' + rnd.nextInt(3)));
                    }
                    final String s = sb.toString();
                    final int[] got = new int[1];
                    r = Kiem.hen("n = 2000", 3000, new Runnable() {
                        public void run() {
                            got[0] = Cuts.minCuts(s);
                        }
                    }) + ", cuts " + got[0];
                }`,
  tep: {
    'Cuts.java': j`
public class Cuts {

    public static int minCuts(String s) {
        //>> return 0; // TODO
        int n = s.length();
        if (n == 0) {
            return 0;
        }
        boolean[][] pal = new boolean[n][n]; // step 1: which pieces are palindromes
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);
            }
        }
        int[] cut = new int[n]; // step 2: fewest cuts for s[0..j]
        for (int j = 0; j < n; j++) {
            cut[j] = j; // worst: a cut after every character
            for (int i = 0; i <= j; i++) {
                if (pal[i][j]) { // the last piece is s[i..j]
                    cut[j] = Math.min(cut[j], i == 0 ? 0 : cut[i - 1] + 1);
                }
            }
        }
        return cut[n - 1];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples (greedy fails on abaab)', vi: 'ví dụ (tham lam sai ở abaab)' }, vao: 'RUN abaccd\nRUN aab\nRUN racecar\nRUN abcd\nRUN abaab\nRUN -\n' },
    { ten: { en: '2000 random strings', vi: '2000 xâu ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'pal[i][j] needs pal[i+1][j−1], a row BELOW — so fill i from n − 1 down to 0.', vi: 'pal[i][j] cần pal[i+1][j−1], ở hàng DƯỚI — nên điền i từ n − 1 xuống 0.' },
    { en: 'If s[0..j] is itself a palindrome, cut[j] = 0 — that is the i == 0 case.', vi: 'Nếu chính s[0..j] là palindrome thì cut[j] = 0 — đó là trường hợp i == 0.' },
  ],
  loiHayGap: [
    { en: 'Testing palindromes with substring + reverse inside the double loop — O(n³), too slow for 2000.', vi: 'Kiểm palindrome bằng substring + reverse trong vòng lặp đôi — O(n³), quá chậm với 2000.' },
    { en: 'Greedy longest prefix — abaab gives aba|a|b (2 cuts) instead of a|baab.', vi: 'Tham lam tiền tố dài nhất — abaab ra aba|a|b (2 lần cắt) thay vì a|baab.' },
  ],
  giaiThich: { en: '<p>Two O(n²) tables: an interval DP that answers "is s[i..j] a palindrome" in O(1), and a prefix DP over the last piece. Precomputing the first table is what keeps the second one quadratic instead of cubic.</p>', vi: '<p>Hai bảng O(n²): một bảng quy hoạch theo đoạn trả lời "s[i..j] có là palindrome" trong O(1), và một bảng theo tiền tố trên mảnh cuối. Tính trước bảng thứ nhất là điều giữ bảng thứ hai ở mức bình phương thay vì lập phương.</p>' },
});

export default moDun({ slug: 'csd201-cs4-on', ten: '10.4 ⭐ CS.4 Dynamic programming II — interview problems', de: [de1, de2, de3, de4, de5, de6] });
