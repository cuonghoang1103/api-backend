/** CSD201 · ⭐ CS.3 — quy hoạch động phần 1 kiểu phỏng vấn (gen/java/cs3/Ex1…Ex7): số chính phương ít nhất, vé du lịch rẻ nhất, đếm dãy có thứ tự (mod 10⁹+7, vòng tổng ở ngoài), tích lớn nhất (giữ cả min), số dãy con tăng dài nhất, búp bê Nga (sắp + LIS O(n log n)). */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const de1 = deCs({
  id: 'csd201-cs3-perfect-squares',
  tieuDe: { en: 'Fewest perfect squares that sum to n — coin change with coins 1, 4, 9, 16 …', vi: 'Ít số chính phương nhất có tổng bằng n — đổi tiền với các đồng 1, 4, 9, 16 …' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['bottom-up table dp[x]', 'dp[x] = 1 + min dp[x − s²]', 'greedy fails (12 = 4 + 4 + 4)'],
  moTa: {
    en: `<p>Complete ${c('static int numSquares(int n)')} (0 ≤ n ≤ 200,000): the smallest number of perfect squares (1, 4, 9, …) whose sum is n; ${c('numSquares(0) = 0')}. Examples: 12 → 3 (4 + 4 + 4 — greedy 9 + 1 + 1 + 1 uses 4), 13 → 2, 7 → 4.</p>
<p>Fill ${c('dp[0..n]')} from small to large: ${c('dp[x] = min over s² ≤ x of dp[x − s²] + 1')}. O(n√n). Plain recursion without a table is exponential — the complexity check asks for n = 200,000.</p>`,
    vi: `<p>Hoàn thiện ${c('numSquares(n)')} (0 ≤ n ≤ 200.000): số ít nhất các số chính phương (1, 4, 9, …) có tổng bằng n; ${c('numSquares(0) = 0')}. Ví dụ: 12 → 3 (4 + 4 + 4 — tham lam 9 + 1 + 1 + 1 dùng 4), 13 → 2, 7 → 4.</p>
<p>Điền ${c('dp[0..n]')} từ nhỏ tới lớn: ${c('dp[x] = min theo s² ≤ x của dp[x − s²] + 1')}. O(n√n). Đệ quy trần không bảng là hàm mũ — kiểm độ phức tạp hỏi n = 200.000.</p>`,
  },
  hen: { n: 'n = 200,000', ms: 3000, can: 'O(n√n)', cham: 'exponential (recursion without a table)' },
  dauVao: { en: 'RUN n · RANDOM (every n from 0 to 600 against a BFS) · PERF.', vi: 'RUN n · RANDOM (mọi n từ 0 tới 600 so với BFS) · PERF.' },
  them: `
    static int bfs(int n) {
        int[] dist = new int[n + 1];
        Arrays.fill(dist, -1);
        dist[0] = 0;
        ArrayDeque<Integer> q = new ArrayDeque<Integer>();
        q.add(0);
        while (!q.isEmpty()) {
            int v = q.poll();
            if (v == n) {
                return dist[v];
            }
            for (int s = 1; v + s * s <= n; s++) {
                if (dist[v + s * s] < 0) {
                    dist[v + s * s] = dist[v] + 1;
                    q.add(v + s * s);
                }
            }
        }
        return -1;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Squares.numSquares(n(1)));
                } else if (p[0].equals("RANDOM")) {
                    String sai = null;
                    for (int x = 0; x <= 600 && sai == null; x++) {
                        int got = Squares.numSquares(x), want = bfs(x);
                        if (got != want) {
                            sai = "n=" + x + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("n = 0..600 (shortest path 0 -> n by squares)", 601, sai);
                } else {
                    final int[] got = new int[2];
                    r = Kiem.hen("n = 200,000 and n = 199,999", 3000, new Runnable() {
                        public void run() {
                            got[0] = Squares.numSquares(200000);
                            got[1] = Squares.numSquares(199999);
                        }
                    }) + ", answers " + got[0] + " and " + got[1];
                }`,
  tep: {
    'Squares.java': j`
public class Squares {

    public static int numSquares(int n) {
        //>> return n; // TODO
        int[] dp = new int[n + 1];
        for (int x = 1; x <= n; x++) {
            dp[x] = x; // 1 + 1 + ... + 1 is always possible
            for (int s = 1; s * s <= x; s++) {
                dp[x] = Math.min(dp[x], dp[x - s * s] + 1);
            }
        }
        return dp[n];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples (greedy fails on 12)', vi: 'ví dụ (tham lam sai ở 12)' }, vao: 'RUN 12\nRUN 13\nRUN 7\nRUN 0\nRUN 1\nRUN 48\n' },
    { ten: { en: 'every n up to 600 vs BFS', vi: 'mọi n tới 600 so với BFS' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Start dp[x] at x (all ones) — it is always a valid upper bound.', vi: 'Khởi đầu dp[x] = x (toàn số 1) — luôn là một cận trên hợp lệ.' },
    { en: 'The inner loop runs s = 1, 2, … while s·s ≤ x.', vi: 'Vòng trong chạy s = 1, 2, … khi s·s ≤ x.' },
  ],
  loiHayGap: [
    { en: 'Greedy: take the largest square first — 12 gives 9 + 1 + 1 + 1.', vi: 'Tham lam: lấy số chính phương lớn nhất trước — 12 ra 9 + 1 + 1 + 1.' },
    { en: 'Recursion without memoisation — fine for 50, hopeless for 200,000.', vi: 'Đệ quy không ghi nhớ — ổn với 50, vô vọng với 200.000.' },
  ],
  giaiThich: { en: '<p>The subproblem is "best for x"; its last square s² leaves x − s², which is already solved. n states × √n choices = O(n√n). By Lagrange’s four-square theorem no answer exceeds 4.</p>', vi: '<p>Bài toán con là "tốt nhất cho x"; số chính phương cuối s² để lại x − s², đã giải xong. n trạng thái × √n lựa chọn = O(n√n). Theo định lý bốn số chính phương của Lagrange, không đáp án nào vượt quá 4.</p>' },
});

const de2 = deCs({
  id: 'csd201-cs3-min-cost-tickets',
  tieuDe: { en: 'Cheapest travel passes (1, 7 and 30 days) — DP over calendar days', vi: 'Vé du lịch rẻ nhất (1, 7 và 30 ngày) — quy hoạch động theo ngày' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['dp[d] = cheapest cover of travel days ≤ d', 'a pass ending today', 'non-travel days copy dp[d − 1]'],
  moTa: {
    en: `<p>${c('days')} (strictly increasing, 1…365) are the days you travel; ${c('cost = {c1, c7, c30}')} are the prices of passes valid for 1, 7 and 30 consecutive days. Complete ${c('static int minCost(int[] days, int[] cost)')}: the cheapest total that covers every travel day (0 for no days). Example days ${c('{1,3,4,5,9,20,21,22,25,60}')}, cost ${c('{30,100,250}')} → 260.</p>
<p>${c('dp[d]')} = cheapest cover of all travel days ≤ d. If d is not a travel day, ${c('dp[d] = dp[d−1]')}; otherwise the pass covering day d ends today: ${c('min(dp[d−1] + c1, dp[max(0,d−7)] + c7, dp[max(0,d−30)] + c30)')}. Prices need not be "sensible" (a 7-day pass may cost more than a 30-day one).</p>`,
    vi: `<p>${c('days')} (tăng hẳn, 1…365) là các ngày bạn đi; ${c('cost = {c1, c7, c30}')} là giá vé dùng 1, 7 và 30 ngày liên tiếp. Hoàn thiện ${c('minCost(days, cost)')}: tổng rẻ nhất phủ mọi ngày đi (không có ngày nào thì 0). Ví dụ ngày ${c('{1,3,4,5,9,20,21,22,25,60}')}, giá ${c('{30,100,250}')} → 260.</p>
<p>${c('dp[d]')} = cách phủ rẻ nhất mọi ngày đi ≤ d. Ngày d không đi thì ${c('dp[d] = dp[d−1]')}; ngược lại vé phủ ngày d kết thúc hôm nay: ${c('min(dp[d−1] + c1, dp[max(0,d−7)] + c7, dp[max(0,d−30)] + c30)')}. Giá vé không nhất thiết "hợp lý" (vé 7 ngày có thể đắt hơn vé 30 ngày).</p>`,
  },
  hen: { n: '300 travel days', ms: 3000, can: 'O(last day)', cham: 'exponential (trying every pass at every uncovered day without a table)' },
  dauVao: { en: 'RUN days c1,c7,c30 · RANDOM · PERF.', vi: 'RUN ngày c1,c7,c30 · RANDOM · PERF.' },
  them: `
    static int brute(int[] days, int i, int[] cost) {
        if (i == days.length) {
            return 0;
        }
        int best = Integer.MAX_VALUE;
        int[] len = {1, 7, 30};
        for (int k = 0; k < 3; k++) {
            int jj = i;
            while (jj < days.length && days[jj] < days[i] + len[k]) {
                jj++;
            }
            best = Math.min(best, cost[k] + brute(days, jj, cost));
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Tickets.minCost(arr(p[1]), arr(p[2])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(21);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        TreeSet<Integer> set = new TreeSet<Integer>();
                        int m = rnd.nextInt(9);
                        while (set.size() < m) {
                            set.add(1 + rnd.nextInt(80));
                        }
                        int[] days = new int[m];
                        int i = 0;
                        for (int d : set) {
                            days[i++] = d;
                        }
                        int[] cost = {1 + rnd.nextInt(60), 1 + rnd.nextInt(200), 1 + rnd.nextInt(400)};
                        int got = Tickets.minCost(days.clone(), cost.clone()), want = brute(days, 0, cost);
                        if (got != want) {
                            sai = str(days) + " cost " + str(cost) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random trips (odd prices too)", 2000, sai);
                } else {
                    final int[] days = new int[300];
                    for (int i = 0; i < 300; i++) {
                        days[i] = 1 + i + i / 5;
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("300 travel days", 3000, new Runnable() {
                        public void run() {
                            got[0] = Tickets.minCost(days, new int[] {7, 30, 95});
                        }
                    }) + ", cost " + got[0];
                }`,
  tep: {
    'Tickets.java': j`
public class Tickets {

    // cost = {price of a 1-day, a 7-day and a 30-day pass}
    public static int minCost(int[] days, int[] cost) {
        //>> return 0; // TODO
        if (days.length == 0) {
            return 0;
        }
        int last = days[days.length - 1];
        boolean[] travel = new boolean[last + 1];
        for (int d : days) {
            travel[d] = true;
        }
        int[] dp = new int[last + 1];
        for (int d = 1; d <= last; d++) {
            if (!travel[d]) {
                dp[d] = dp[d - 1]; // nothing to buy today
                continue;
            }
            dp[d] = dp[d - 1] + cost[0];
            dp[d] = Math.min(dp[d], dp[Math.max(0, d - 7)] + cost[1]); // a 7-day pass ending today
            dp[d] = Math.min(dp[d], dp[Math.max(0, d - 30)] + cost[2]);
        }
        return dp[last];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,3,4,5,9,20,21,22,25,60 30,100,250\nRUN - 2,7,15\nRUN 365 30,100,250\nRUN 1,2,3,4,5,6,7,8,9,10,30,31 2,7,15\nRUN 1,2,3 5,4,100\n' },
    { ten: { en: '2000 random trips', vi: '2000 chuyến đi ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Index the table by calendar day, not by position in days[] — then "7 days ago" is simply d − 7.', vi: 'Đánh chỉ số bảng theo ngày lịch, không theo vị trí trong days[] — khi đó "7 ngày trước" chỉ là d − 7.' },
    { en: 'Clamp d − 7 and d − 30 at 0: a pass bought before day 1 covers from the start.', vi: 'Kẹp d − 7 và d − 30 ở 0: vé mua trước ngày 1 phủ từ đầu.' },
  ],
  loiHayGap: [
    { en: 'Assuming the 30-day pass is always the best deal for busy months — the prices are arbitrary.', vi: 'Cho rằng vé 30 ngày luôn lợi nhất cho tháng đi nhiều — giá là tuỳ ý.' },
    { en: 'Charging a non-travel day (dp[d] = dp[d−1] + c1 for every day).', vi: 'Tính tiền cả ngày không đi (dp[d] = dp[d−1] + c1 với mọi ngày).' },
  ],
  giaiThich: { en: '<p>Looking at the LAST pass instead of the first gives a one-dimensional table over calendar days: three choices per travel day, O(last day) overall (≤ 365 steps). The brute force branches three ways at every uncovered day — 3³⁰⁰ for the complexity check.</p>', vi: '<p>Nhìn vào vé CUỐI thay vì vé đầu cho một bảng một chiều theo ngày lịch: ba lựa chọn mỗi ngày đi, tổng O(ngày cuối) (≤ 365 bước). Vét cạn rẽ ba nhánh ở mỗi ngày chưa phủ — 3³⁰⁰ cho phép kiểm độ phức tạp.</p>' },
});

const de3 = deCs({
  id: 'csd201-cs3-combination-sum-4',
  tieuDe: { en: 'Count ordered sequences that sum to a target — the loop order decides the answer', vi: 'Đếm dãy CÓ THỨ TỰ có tổng bằng đích — thứ tự hai vòng lặp quyết định đáp án' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['target loop outside = ordered (compositions)', 'coin loop outside = unordered (coin change II)', 'counting modulo 10⁹ + 7'],
  moTa: {
    en: `<p>${c('nums')} holds distinct positive ints. Complete ${c('static long count(int[] nums, int target)')}: the number of <b>ordered</b> sequences of elements of nums (repetition allowed) whose sum is target, modulo ${c('1_000_000_007')}. ${c('count(…, 0) = 1')} (the empty sequence). Example nums ${c('{1,2,3}')}, target 4 → 7 (1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2, 1+3, 3+1).</p>
<p>${c('dp[x] = Σ dp[x − v]')} over v ∈ nums — with the loop over x OUTSIDE and the loop over v inside. Swapping the loops counts each multiset once (1+3 and 3+1 together) and gives 4. The complexity check uses target = 100,000 with 50 values.</p>`,
    vi: `<p>${c('nums')} gồm các số nguyên dương phân biệt. Hoàn thiện ${c('count(nums, target)')}: số dãy <b>có thứ tự</b> các phần tử của nums (được lặp) có tổng bằng target, lấy dư ${c('1_000_000_007')}. ${c('count(…, 0) = 1')} (dãy rỗng). Ví dụ nums ${c('{1,2,3}')}, target 4 → 7 (1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2, 1+3, 3+1).</p>
<p>${c('dp[x] = Σ dp[x − v]')} theo v ∈ nums — vòng theo x ở NGOÀI, vòng theo v ở trong. Đổi chỗ hai vòng sẽ đếm mỗi đa tập một lần (1+3 và 3+1 gộp làm một) và ra 4. Kiểm độ phức tạp dùng target = 100.000 với 50 giá trị.</p>`,
  },
  hen: { n: 'target 100,000, 50 values', ms: 3000, can: 'O(target · |nums|)', cham: 'exponential (listing the sequences)' },
  dauVao: { en: 'RUN nums target · RANDOM · PERF.', vi: 'RUN nums target · RANDOM · PERF.' },
  them: `
    static long brute(int[] nums, int left) {
        if (left == 0) {
            return 1;
        }
        long s = 0;
        for (int v : nums) {
            if (v <= left) {
                s += brute(nums, left - v);
            }
        }
        return s;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Ordered.count(arr(p[1]), n(2)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(23);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        TreeSet<Integer> set = new TreeSet<Integer>();
                        int m = 1 + rnd.nextInt(3);
                        while (set.size() < m) {
                            set.add(1 + rnd.nextInt(6));
                        }
                        int[] nums = new int[m];
                        int i = 0;
                        for (int v : set) {
                            nums[i++] = v;
                        }
                        int target = rnd.nextInt(16);
                        long got = Ordered.count(nums.clone(), target), want = brute(nums, target);
                        if (got != want) {
                            sai = str(nums) + " target=" + target + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random cases vs listing every sequence", 2000, sai);
                } else {
                    final int[] nums = new int[50];
                    for (int i = 0; i < 50; i++) {
                        nums[i] = 1 + 3 * i;
                    }
                    final long[] got = new long[2];
                    r = Kiem.hen("target 100,000 with 50 values; {1,2,3} with target 40", 3000, new Runnable() {
                        public void run() {
                            got[0] = Ordered.count(nums, 100000);
                            got[1] = Ordered.count(new int[] {1, 2, 3}, 40);
                        }
                    }) + ", answers " + got[0] + " and " + got[1];
                }`,
  tep: {
    'Ordered.java': j`
public class Ordered {
    static final long MOD = 1_000_000_007L;

    public static long count(int[] nums, int target) {
        //>> return 0; // TODO
        long[] dp = new long[target + 1];
        dp[0] = 1; // the empty sequence
        for (int x = 1; x <= target; x++) { // ORDER MATTERS: the target loop is outside
            for (int v : nums) {
                if (v <= x) {
                    dp[x] = (dp[x] + dp[x - v]) % MOD;
                }
            }
        }
        return dp[target];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,2,3 4\nRUN 5 3\nRUN 5 0\nRUN 2,3 7\nRUN 1,2,3 40\n' },
    { ten: { en: '2000 random cases', vi: '2000 ca ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Think of the LAST element v of the sequence: what is left is any ordered sequence for x − v.', vi: 'Nghĩ về phần tử CUỐI v của dãy: phần còn lại là một dãy có thứ tự bất kỳ cho x − v.' },
    { en: 'Take the remainder after every addition so the values stay below 2·10⁹ + 14.', vi: 'Lấy dư sau mỗi phép cộng để giá trị luôn dưới 2·10⁹ + 14.' },
  ],
  loiHayGap: [
    { en: 'for (v : nums) outside, for (x …) inside — that is coin change II (unordered), 4 instead of 7.', vi: 'for (v : nums) ở ngoài, for (x …) ở trong — đó là đổi tiền II (không thứ tự), ra 4 thay vì 7.' },
    { en: 'No modulo — {1,2,3} with target 40 already exceeds an int, larger targets exceed a long.', vi: 'Không lấy dư — {1,2,3} với target 40 đã vượt int, target lớn hơn vượt cả long.' },
  ],
  giaiThich: { en: '<p>With x outside, dp[x] is complete before it is used, and each sequence is built by appending its last element — every order is a different path. With v outside, values are added in a fixed order, so each multiset is built exactly once. Both tables are O(target · |nums|); only the meaning differs.</p>', vi: '<p>Với x ở ngoài, dp[x] đã đủ trước khi được dùng, và mỗi dãy được dựng bằng cách nối phần tử cuối — mỗi thứ tự là một đường khác nhau. Với v ở ngoài, các giá trị được thêm theo một thứ tự cố định, nên mỗi đa tập chỉ được dựng đúng một lần. Cả hai bảng đều O(target · |nums|); chỉ ý nghĩa khác nhau.</p>' },
});

const de4 = deCs({
  id: 'csd201-cs3-max-product',
  tieuDe: { en: 'Maximum product subarray — keep the largest AND the smallest product', vi: 'Đoạn con có tích lớn nhất — giữ cả tích lớn nhất LẪN nhỏ nhất' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['two running states hi / lo', 'a negative number swaps them', 'zero resets'],
  moTa: {
    en: `<p>Complete ${c('static long maxProduct(int[] a)')} (n ≥ 1): the largest product of a non-empty contiguous subarray. Example ${c('{2,-3,4,-2,0}')} → 48 (the whole prefix 2·(−3)·4·(−2)).</p>
<p>Unlike Kadane for sums, the best product ending at i may come from the <b>smallest</b> (most negative) product ending at i − 1 multiplied by a negative ${c('a[i]')}. Keep both: ${c('hi = max(x, hi·x, lo·x)')}, ${c('lo = min(x, hi·x, lo·x)')} (compute both from the old values). Inputs are chosen so that products fit in a long.</p>`,
    vi: `<p>Hoàn thiện ${c('maxProduct(a)')} (n ≥ 1): tích lớn nhất của một đoạn con liên tiếp khác rỗng. Ví dụ ${c('{2,-3,4,-2,0}')} → 48 (cả tiền tố 2·(−3)·4·(−2)).</p>
<p>Khác Kadane cho tổng, tích tốt nhất kết thúc ở i có thể đến từ tích <b>nhỏ nhất</b> (âm nhất) kết thúc ở i − 1 nhân với ${c('a[i]')} âm. Giữ cả hai: ${c('hi = max(x, hi·x, lo·x)')}, ${c('lo = min(x, hi·x, lo·x)')} (tính cả hai từ giá trị cũ). Dữ liệu được chọn để tích vừa kiểu long.</p>`,
  },
  hen: { n: '1,000,000 elements', ms: 3000, can: 'O(n)', cham: 'O(n²) (every subarray)' },
  them: `
    static long brute(int[] a) {
        long best = Long.MIN_VALUE;
        for (int i = 0; i < a.length; i++) {
            long pr = 1;
            for (int jj = i; jj < a.length; jj++) {
                pr *= a[jj];
                best = Math.max(best, pr);
            }
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Product.maxProduct(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(25);
                    String sai = null;
                    for (int t = 0; t < 20000 && sai == null; t++) {
                        int[] a = new int[1 + rnd.nextInt(10)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(11) - 5;
                        }
                        long got = Product.maxProduct(a.clone()), want = brute(a);
                        if (got != want) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("20000 random arrays", 20000, sai);
                } else {
                    final int[] a = new int[1000000];
                    Random rnd = new Random(27);
                    int[] vals = {-2, -1, 1, 2, 3, -3};
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i % 25 == 24 ? 0 : vals[rnd.nextInt(vals.length)];
                    }
                    final long[] got = new long[1];
                    r = Kiem.hen("1,000,000 elements", 3000, new Runnable() {
                        public void run() {
                            got[0] = Product.maxProduct(a);
                        }
                    }) + ", best " + got[0];
                }`,
  tep: {
    'Product.java': j`
public class Product {

    public static long maxProduct(int[] a) {
        //>> return a[0]; // TODO
        long hi = a[0], lo = a[0], best = a[0];
        for (int i = 1; i < a.length; i++) {
            long x = a[i];
            long h = Math.max(x, Math.max(hi * x, lo * x)); // a negative x turns the smallest into the largest
            long l = Math.min(x, Math.min(hi * x, lo * x));
            hi = h;
            lo = l;
            best = Math.max(best, hi);
        }
        return best;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 2,-3,4,-2,0\nRUN -2,0,-1\nRUN -3\nRUN -2,3,-4\nRUN 0,2\nRUN -1,-1\n' },
    { ten: { en: '20000 random arrays', vi: '20000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Compute the new hi and lo into temporaries — updating hi first and then using it for lo is a bug.', vi: 'Tính hi và lo mới vào biến tạm — cập nhật hi trước rồi dùng nó để tính lo là sai.' },
    { en: 'Including x itself in the max/min handles zeros: the product restarts at the next element.', vi: 'Đưa chính x vào max/min là xử lý được số 0: tích bắt đầu lại ở phần tử kế.' },
  ],
  loiHayGap: [
    { en: 'Tracking only the maximum (Kadane for sums) — {−2, 3, −4} gives 3 instead of 24.', vi: 'Chỉ giữ giá trị lớn nhất (Kadane cho tổng) — {−2, 3, −4} ra 3 thay vì 24.' },
    { en: 'Starting best at 0 — an array like {−3} has answer −3.', vi: 'Khởi đầu best = 0 — mảng như {−3} có đáp án −3.' },
  ],
  giaiThich: { en: '<p>The state is a pair (largest, smallest product ending here): a negative factor swaps their roles, so both must be carried. One pass, O(1) memory.</p>', vi: '<p>Trạng thái là một cặp (tích lớn nhất, nhỏ nhất kết thúc ở đây): thừa số âm đổi vai hai giá trị, nên phải mang theo cả hai. Một lượt, O(1) bộ nhớ.</p>' },
});

const de5 = deCs({
  id: 'csd201-cs3-number-of-lis',
  tieuDe: { en: 'How many longest increasing subsequences? — length and count side by side', vi: 'Có bao nhiêu dãy con tăng dài nhất? — độ dài và số đếm song song' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['len[i] = LIS ending at i', 'cnt[i] = how many of them', 'longer → restart the count, equal → add'],
  moTa: {
    en: `<p>Complete ${c('static long countLis(int[] a)')}: the number of <b>strictly</b> increasing subsequences of maximum length (chosen by positions; 0 for an empty array). Example ${c('{1,4,2,5,3,6}')} → 3 (1 4 5 6, 1 2 5 6, 1 2 3 6); ${c('{2,2,2}')} → 3 (each single 2).</p>
<p>For each i keep ${c('len[i]')} and ${c('cnt[i]')}. For every j &lt; i with ${c('a[j] < a[i]')}: if ${c('len[j] + 1 > len[i]')} take the new length and <b>copy</b> cnt[j]; if equal, <b>add</b> cnt[j]. The answer sums cnt[i] over the i with the maximum len. O(n²) — fine for the check with n = 3000; trying all subsets is 2ⁿ.</p>`,
    vi: `<p>Hoàn thiện ${c('countLis(a)')}: số dãy con tăng <b>ngặt</b> có độ dài lớn nhất (chọn theo vị trí; mảng rỗng → 0). Ví dụ ${c('{1,4,2,5,3,6}')} → 3 (1 4 5 6, 1 2 5 6, 1 2 3 6); ${c('{2,2,2}')} → 3 (mỗi số 2 riêng lẻ).</p>
<p>Với mỗi i giữ ${c('len[i]')} và ${c('cnt[i]')}. Với mọi j &lt; i có ${c('a[j] < a[i]')}: nếu ${c('len[j] + 1 > len[i]')} thì nhận độ dài mới và <b>chép</b> cnt[j]; nếu bằng thì <b>cộng</b> cnt[j]. Đáp án cộng cnt[i] trên các i có len lớn nhất. O(n²) — đủ cho phép kiểm n = 3000; thử mọi tập con là 2ⁿ.</p>`,
  },
  hen: { n: '3000 elements', ms: 3000, can: 'O(n²)', cham: 'exponential (all subsets)' },
  them: `
    static long brute(int[] a) {
        int best = 0;
        long cc = 0;
        for (int m = 0; m < (1 << a.length); m++) {
            int last = Integer.MIN_VALUE, len = 0;
            boolean ok = true;
            for (int i = 0; i < a.length && ok; i++) {
                if ((m >> i & 1) == 1) {
                    if (len > 0 && a[i] <= last) {
                        ok = false;
                    }
                    last = a[i];
                    len++;
                }
            }
            if (!ok) {
                continue;
            }
            if (len > best) {
                best = len;
                cc = 1;
            } else if (len == best) {
                cc++;
            }
        }
        return a.length == 0 ? 0 : cc;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Lis.countLis(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(29);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(12)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(6);
                        }
                        long got = Lis.countLis(a.clone()), want = brute(a);
                        if (got != want) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random arrays vs all subsets", 3000, sai);
                } else {
                    final int[] a = new int[3000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i % 60 == 59 ? a[i - 1] : i; // 50 values appear twice: 2^50 longest subsequences
                    }
                    final long[] got = new long[1];
                    r = Kiem.hen("3000 elements (50 values twice)", 3000, new Runnable() {
                        public void run() {
                            got[0] = Lis.countLis(a);
                        }
                    }) + ", count " + got[0];
                }`,
  tep: {
    'Lis.java': j`
public class Lis {

    // answers fit in a long for the tests
    public static long countLis(int[] a) {
        //>> return 0; // TODO
        int n = a.length, best = 0;
        int[] len = new int[n];
        long[] cnt = new long[n];
        for (int i = 0; i < n; i++) {
            len[i] = 1;
            cnt[i] = 1;
            for (int j = 0; j < i; j++) {
                if (a[j] >= a[i]) {
                    continue;
                }
                if (len[j] + 1 > len[i]) { // longer: restart the count
                    len[i] = len[j] + 1;
                    cnt[i] = cnt[j];
                } else if (len[j] + 1 == len[i]) { // same length: add
                    cnt[i] += cnt[j];
                }
            }
            best = Math.max(best, len[i]);
        }
        long total = 0;
        for (int i = 0; i < n; i++) {
            if (len[i] == best) {
                total += cnt[i];
            }
        }
        return total;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,4,2,5,3,6\nRUN 2,2,2\nRUN -\nRUN 1,3,5,4,7\nRUN 5,4,3,2,1\n' },
    { ten: { en: '3000 random arrays', vi: '3000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Every element alone is an increasing subsequence: start len[i] = 1, cnt[i] = 1.', vi: 'Mỗi phần tử đứng một mình là một dãy con tăng: khởi đầu len[i] = 1, cnt[i] = 1.' },
    { en: 'Use a long array for cnt — with n = 3000 the counts become huge.', vi: 'Dùng mảng long cho cnt — với n = 3000 số đếm trở nên rất lớn.' },
  ],
  loiHayGap: [
    { en: 'cnt[i]++ instead of += cnt[j] — counts endings, not subsequences.', vi: 'cnt[i]++ thay vì += cnt[j] — đếm số điểm kết thúc, không phải số dãy con.' },
    { en: 'Using ≤ — the problem asks for strictly increasing.', vi: 'Dùng ≤ — đề yêu cầu tăng ngặt.' },
  ],
  giaiThich: { en: '<p>A longest subsequence ending at i extends one ending at some j with len[j] = len[i] − 1, so cnt[i] is the sum of those cnt[j]. Two arrays, O(n²) time. (An O(n log n) version exists with Fenwick trees, keyed by value.)</p>', vi: '<p>Một dãy dài nhất kết thúc ở i nối dài một dãy kết thúc ở j nào đó có len[j] = len[i] − 1, nên cnt[i] là tổng các cnt[j] đó. Hai mảng, O(n²) thời gian. (Có bản O(n log n) dùng cây Fenwick theo giá trị.)</p>' },
});

const de6 = deCs({
  id: 'csd201-cs3-russian-doll',
  tieuDe: { en: 'Russian doll envelopes — sort cleverly, then LIS in O(n log n)', vi: 'Phong bì búp bê Nga — sắp khéo rồi LIS trong O(n log n)' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['sort by width up, equal widths by height DOWN', 'LIS with tails[] + binary search', 'strict in both dimensions'],
  moTa: {
    en: `<p>An envelope ${c('{w, h}')} fits inside another when both its width and its height are strictly smaller. Complete ${c('static int maxDolls(int[][] env)')}: the largest number of envelopes that can be nested in a chain. Example ${c('[5,4] [6,4] [6,7] [2,3] [7,8] [6,5]')} → 4.</p>
<p>Sort by width ascending, and for <b>equal widths by height descending</b> — then two envelopes of the same width can never both be picked by an increasing subsequence of heights. The answer is the LIS of the heights, computed with ${c('tails[k]')} = the smallest last height of an increasing subsequence of length k + 1 and a binary search per element: O(n log n). The complexity check has 200,000 envelopes; do not reorder the caller’s array.</p>`,
    vi: `<p>Phong bì ${c('{w, h}')} lồng được vào phong bì khác khi cả rộng lẫn cao đều nhỏ hơn hẳn. Hoàn thiện ${c('maxDolls(env)')}: số phong bì nhiều nhất lồng được thành một chuỗi. Ví dụ ${c('[5,4] [6,4] [6,7] [2,3] [7,8] [6,5]')} → 4.</p>
<p>Sắp theo rộng tăng, và với <b>rộng bằng nhau thì theo cao giảm</b> — khi đó hai phong bì cùng rộng không bao giờ cùng được chọn bởi một dãy con tăng theo chiều cao. Đáp án là LIS của chiều cao, tính bằng ${c('tails[k]')} = chiều cao cuối nhỏ nhất của dãy con tăng dài k + 1 và một lần tìm nhị phân mỗi phần tử: O(n log n). Kiểm độ phức tạp có 200.000 phong bì; không đổi thứ tự mảng của nơi gọi.</p>`,
  },
  hen: { n: '200,000 envelopes', ms: 3000, can: 'O(n log n)', cham: 'O(n²) (the quadratic LIS)' },
  dauVao: { en: 'RUN w,h w,h … · RANDOM · PERF.', vi: 'RUN w,h w,h … · RANDOM · PERF.' },
  them: `
    static int brute(int[][] e) {
        int best = 0;
        for (int m = 0; m < (1 << e.length); m++) {
            List<int[]> s = new ArrayList<int[]>();
            for (int i = 0; i < e.length; i++) {
                if ((m >> i & 1) == 1) {
                    s.add(e[i]);
                }
            }
            Collections.sort(s, new Comparator<int[]>() {
                public int compare(int[] x, int[] y) {
                    return x[0] - y[0];
                }
            });
            boolean ok = true;
            for (int i = 1; i < s.size(); i++) {
                if (!(s.get(i - 1)[0] < s.get(i)[0] && s.get(i - 1)[1] < s.get(i)[1])) {
                    ok = false;
                }
            }
            if (ok) {
                best = Math.max(best, s.size());
            }
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[][] e = new int[p.length - 1][];
                    for (int i = 1; i < p.length; i++) {
                        e[i - 1] = arr(p[i]);
                    }
                    String before = Arrays.deepToString(e);
                    r = Dolls.maxDolls(e) + (Arrays.deepToString(e).equals(before) ? "" : " (env WAS REORDERED)");
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(31);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        int[][] e = new int[rnd.nextInt(10)][];
                        for (int i = 0; i < e.length; i++) {
                            e[i] = new int[] {1 + rnd.nextInt(6), 1 + rnd.nextInt(6)};
                        }
                        int got = Dolls.maxDolls(e.clone()), want = brute(e);
                        if (got != want) {
                            sai = Arrays.deepToString(e) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random sets vs all subsets", 2000, sai);
                } else {
                    final int[][] e = new int[200000][];
                    Random rnd = new Random(33);
                    for (int i = 0; i < e.length; i++) {
                        e[i] = new int[] {1 + rnd.nextInt(100000), 1 + rnd.nextInt(100000)};
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("200,000 envelopes", 3000, new Runnable() {
                        public void run() {
                            got[0] = Dolls.maxDolls(e);
                        }
                    }) + ", chain " + got[0];
                }`,
  tep: {
    'Dolls.java': j`
import java.util.Arrays;
import java.util.Comparator;

public class Dolls {

    public static int maxDolls(int[][] env) {
        //>> return env.length; // TODO
        int[][] e = env.clone(); // do not reorder the caller's array
        Arrays.sort(e, new Comparator<int[]>() {
            public int compare(int[] p, int[] q) {
                if (p[0] != q[0]) {
                    return Integer.compare(p[0], q[0]);
                }
                return Integer.compare(q[1], p[1]); // equal widths: height DOWN
            }
        });
        int[] tails = new int[e.length];
        int len = 0;
        for (int[] x : e) {
            int lo = 0, hi = len; // first tail >= x[1]
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (tails[mid] >= x[1]) {
                    hi = mid;
                } else {
                    lo = mid + 1;
                }
            }
            tails[lo] = x[1];
            if (lo == len) {
                len++;
            }
        }
        return len;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples (equal widths)', vi: 'ví dụ (rộng bằng nhau)' }, vao: 'RUN 5,4 6,4 6,7 2,3 7,8 6,5\nRUN 3,1 3,2 3,3\nRUN 1,1\nRUN 1,1 1,1 2,2\nRUN 4,5 4,6 6,7 2,3 1,1\n' },
    { ten: { en: '2000 random sets', vi: '2000 tập ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Sort a clone of the array (env.clone() copies the row references — enough, the rows are not changed).', vi: 'Sắp một bản sao của mảng (env.clone() chép các tham chiếu hàng — đủ, các hàng không bị sửa).' },
    { en: 'In tails[], replace the first element ≥ h (lower bound) — that keeps the sequence STRICTLY increasing.', vi: 'Trong tails[], thay phần tử đầu tiên ≥ h (lower bound) — giữ dãy tăng NGẶT.' },
  ],
  loiHayGap: [
    { en: 'Sorting equal widths by height ascending — {3,1} {3,2} {3,3} gives 3 instead of 1.', vi: 'Sắp các phong bì cùng rộng theo cao tăng — {3,1} {3,2} {3,3} ra 3 thay vì 1.' },
    { en: 'The O(n²) LIS — correct but 4·10¹⁰ steps for 200,000 envelopes.', vi: 'LIS O(n²) — đúng nhưng 4·10¹⁰ bước với 200.000 phong bì.' },
  ],
  giaiThich: { en: '<p>After the sort, any strictly increasing run of heights automatically has strictly increasing widths: equal widths appear in decreasing height, so at most one of them can be in the run. The patience-sorting LIS then costs O(n log n).</p>', vi: '<p>Sau khi sắp, mọi dãy chiều cao tăng ngặt tự động có chiều rộng tăng ngặt: các phong bì cùng rộng xuất hiện theo cao giảm, nên nhiều nhất một cái nằm trong dãy. LIS kiểu xếp bài khi đó tốn O(n log n).</p>' },
});

export default moDun({ slug: 'csd201-cs3-on', ten: '10.3 ⭐ CS.3 Dynamic programming I — interview problems', de: [de1, de2, de3, de4, de5, de6] });
