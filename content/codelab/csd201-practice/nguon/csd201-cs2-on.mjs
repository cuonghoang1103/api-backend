/** CSD201 · ⭐ CS.2 — kỹ thuật mảng kiểu phỏng vấn (gen/java/cs2/Ex2…Ex7): cờ Hà Lan một lượt, cửa sổ co giãn ≤ k ký tự khác nhau, đếm đoạn chia hết cho k (tiền tố + số dư âm), mảng hiệu đặt chỗ chuyến bay, nước mưa hai con trỏ, đoạn con vòng lớn nhất (Kadane hai lần). */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const de1 = deCs({
  id: 'csd201-cs2-sort-colors',
  tieuDe: { en: 'Sort colours 0/1/2 in place in one pass — the Dutch national flag', vi: 'Sắp màu 0/1/2 tại chỗ trong một lượt — cờ Hà Lan' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['three pointers low / mid / high', 'invariant regions', 'O(1) extra memory'],
  moTa: {
    en: `<p>${c('a')} contains only 0, 1 and 2. Complete ${c('static void sortColors(int[] a)')}: rearrange it <b>in place</b> into 0…0 1…1 2…2 in a single pass, without ${c('Arrays.sort')} and without another array.</p>
<p>Keep three regions: ${c('a[0..low-1]')} = 0, ${c('a[low..mid-1]')} = 1, ${c('a[high+1..]')} = 2, and ${c('a[mid..high]')} unknown. Look at ${c('a[mid]')}: 0 → swap with low, advance both; 1 → advance mid; 2 → swap with high, move high back — and do NOT advance mid (the value that came in is still unknown).</p>`,
    vi: `<p>${c('a')} chỉ gồm 0, 1 và 2. Hoàn thiện ${c('sortColors(a)')}: sắp lại <b>tại chỗ</b> thành 0…0 1…1 2…2 trong một lượt, không dùng ${c('Arrays.sort')} và không dùng mảng khác.</p>
<p>Giữ ba vùng: ${c('a[0..low-1]')} = 0, ${c('a[low..mid-1]')} = 1, ${c('a[high+1..]')} = 2, còn ${c('a[mid..high]')} chưa xét. Xem ${c('a[mid]')}: 0 → đổi với low, tăng cả hai; 1 → tăng mid; 2 → đổi với high, lùi high — và KHÔNG tăng mid (giá trị vừa đổi vào chưa được xét).</p>`,
  },
  quyTac: [{ id: 'R1', en: 'no sorting library call and no extra array in SortColors', vi: 'không gọi hàm sắp xếp của thư viện và không tạo mảng phụ trong SortColors', re: String.raw`\b(Arrays|Collections)\s*\.\s*sort\b|\bnew\s+int\s*\[`, file: 'SortColors' }],
  them: '',
  lenh: `                if (p[0].equals("RUN")) {
                    int[] a = arr(p[1]);
                    SortColors.sortColors(a);
                    r = str(a);
                } else {
                    Random rnd = new Random(103);
                    String sai = null;
                    for (int t = 0; t < 20000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(15)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(3);
                        }
                        int[] want = a.clone();
                        Arrays.sort(want);
                        int[] got = a.clone();
                        SortColors.sortColors(got);
                        if (!Arrays.equals(got, want)) {
                            sai = str(a) + " -> " + str(got);
                        }
                    }
                    r = ketQua("20000 random arrays", 20000, sai);
                }`,
  tep: {
    'SortColors.java': j`
public class SortColors {

    public static void sortColors(int[] a) {
        //>> // TODO
        int low = 0, mid = 0, high = a.length - 1;
        while (mid <= high) {
            if (a[mid] == 0) {
                swap(a, low++, mid++);
            } else if (a[mid] == 1) {
                mid++;
            } else {
                swap(a, mid, high--); // do NOT advance mid: the swapped-in value is unseen
            }
        }
        //<<
    }
    //>> // TODO: helper(s)

    private static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples and edges', vi: 'ví dụ và biên' }, vao: 'RUN 2,0,2,1,1,0\nRUN -\nRUN 1\nRUN 2,2,2\nRUN 2,1,0\n' },
    { ten: { en: '20000 random arrays', vi: '20000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'Loop while mid <= high — the unknown region is a[mid..high].', vi: 'Lặp khi mid <= high — vùng chưa xét là a[mid..high].' },
    { en: 'A value swapped in from high has not been looked at yet, one swapped in from low is a 1 (already seen).', vi: 'Giá trị đổi vào từ high chưa được xem, còn giá trị đổi vào từ low là 1 (đã xem rồi).' },
  ],
  loiHayGap: [
    { en: 'mid++ after swapping with high — a 0 or 2 can be left in the middle.', vi: 'mid++ sau khi đổi với high — một số 0 hay 2 có thể bị bỏ lại ở giữa.' },
    { en: 'while (mid < high) — the last unknown element is never examined.', vi: 'while (mid < high) — phần tử chưa xét cuối cùng không bao giờ được xem.' },
  ],
  giaiThich: { en: '<p>Each step either advances mid or shrinks high, so the loop runs at most n times: O(n) time, O(1) memory, one pass. The same three-way partition is the heart of quicksort with many equal keys.</p>', vi: '<p>Mỗi bước hoặc tăng mid hoặc lùi high, nên vòng lặp chạy nhiều nhất n lần: O(n) thời gian, O(1) bộ nhớ, một lượt. Chính phép phân hoạch ba phần này là trái tim của quicksort khi có nhiều khoá bằng nhau.</p>' },
});

const de2 = deCs({
  id: 'csd201-cs2-longest-k-distinct',
  tieuDe: { en: 'Longest substring with at most k distinct characters — a growing/shrinking window', vi: 'Xâu con dài nhất có tối đa k ký tự khác nhau — cửa sổ co giãn' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['sliding window with a count map', 'shrink while invalid', 'each index enters and leaves once'],
  moTa: {
    en: `<p>Complete ${c('static int longestWithAtMostK(String s, int k)')}: the length of the longest substring of ${c('s')} that contains at most k different characters (k ≤ 0 → 0). Example: "eceba", k = 2 → 3 ("ece"); "aaabbccc", k = 1 → 3.</p>
<p>Extend the window with ${c('right')}, count characters in a map; while the map has more than k keys, remove ${c('s[left]')} and advance ${c('left')}. Every index enters and leaves the window once: O(n). The complexity check uses a string of 1,000,000 characters.</p>`,
    vi: `<p>Hoàn thiện ${c('longestWithAtMostK(s, k)')}: độ dài xâu con dài nhất của ${c('s')} chứa tối đa k ký tự khác nhau (k ≤ 0 → 0). Ví dụ: "eceba", k = 2 → 3 ("ece"); "aaabbccc", k = 1 → 3.</p>
<p>Mở rộng cửa sổ bằng ${c('right')}, đếm ký tự trong một map; khi map có nhiều hơn k khoá thì bỏ ${c('s[left]')} và tăng ${c('left')}. Mỗi chỉ số vào và ra khỏi cửa sổ đúng một lần: O(n). Kiểm độ phức tạp dùng xâu 1.000.000 ký tự.</p>`,
  },
  hen: { n: '1,000,000 characters', ms: 3000, can: 'O(n)', cham: 'O(n²) (restarting from every left end)' },
  them: `
    static int brute(String s, int k) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            Set<Character> seen = new HashSet<Character>();
            int j = i;
            while (j < s.length() && (seen.contains(s.charAt(j)) || seen.size() < k)) {
                seen.add(s.charAt(j));
                j++;
            }
            best = Math.max(best, j - i);
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(LongestK.longestWithAtMostK(p[1].equals("-") ? "" : p[1], n(2)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(107);
                    String sai = null;
                    for (int t = 0; t < 20000 && sai == null; t++) {
                        StringBuilder sb = new StringBuilder();
                        int len = rnd.nextInt(15);
                        for (int i = 0; i < len; i++) {
                            sb.append("abcd".charAt(rnd.nextInt(4)));
                        }
                        int k = rnd.nextInt(5);
                        String s = sb.toString();
                        int got = LongestK.longestWithAtMostK(s, k), want = brute(s, k);
                        if (got != want) {
                            sai = "\\"" + s + "\\" k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("20000 random strings", 20000, sai);
                } else {
                    StringBuilder sb = new StringBuilder();
                    Random rnd = new Random(2);
                    for (int i = 0; i < 1000000; i++) {
                        sb.append((char) ('a' + (i / 1000 % 2 == 0 ? rnd.nextInt(3) : rnd.nextInt(26))));
                    }
                    final String s = sb.toString();
                    final int[] got = new int[2];
                    r = Kiem.hen("1,000,000 characters, k = 3 and k = 20", 3000, new Runnable() {
                        public void run() {
                            got[0] = LongestK.longestWithAtMostK(s, 3);
                            got[1] = LongestK.longestWithAtMostK(s, 20);
                        }
                    }) + ", answers " + got[0] + " and " + got[1];
                }`,
  tep: {
    'LongestK.java': j`
import java.util.HashMap;
import java.util.Map;

public class LongestK {

    public static int longestWithAtMostK(String s, int k) {
        //>> return 0; // TODO
        if (k <= 0) {
            return 0;
        }
        Map<Character, Integer> count = new HashMap<Character, Integer>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            Integer v = count.get(c);
            count.put(c, v == null ? 1 : v + 1);
            while (count.size() > k) {
                char lc = s.charAt(left++);
                int w = count.get(lc) - 1;
                if (w == 0) {
                    count.remove(lc);
                } else {
                    count.put(lc, w);
                }
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples and edges', vi: 'ví dụ và biên' }, vao: 'RUN eceba 2\nRUN aaabbccc 1\nRUN - 2\nRUN abc 0\nRUN abcde 100\nRUN abaccc 2\n' },
    { ten: { en: '20000 random strings', vi: '20000 xâu ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Remove a character from the map when its count drops to 0 — the map size is then the number of distinct characters.', vi: 'Xoá ký tự khỏi map khi số đếm về 0 — khi đó kích thước map chính là số ký tự khác nhau.' },
    { en: 'Update the best length after the window is valid again.', vi: 'Cập nhật độ dài tốt nhất sau khi cửa sổ hợp lệ trở lại.' },
  ],
  loiHayGap: [
    { en: 'Keeping zero counts in the map — size() overcounts and the window shrinks too much.', vi: 'Giữ số đếm 0 trong map — size() đếm dư và cửa sổ co quá mức.' },
    { en: 'Moving left by one with "if" instead of "while" — the window may stay invalid.', vi: 'Dịch left một bước bằng "if" thay vì "while" — cửa sổ có thể vẫn không hợp lệ.' },
  ],
  giaiThich: { en: '<p>left and right only move forward, so the total work is O(n) map operations. The pattern "extend right, shrink left while invalid, record the answer" solves a whole family of window problems (longest without repeats, minimum window substring…).</p>', vi: '<p>left và right chỉ tiến lên, nên tổng công việc là O(n) phép trên map. Khuôn "mở phải, co trái khi không hợp lệ, ghi đáp án" giải cả một họ bài cửa sổ (dài nhất không lặp, cửa sổ nhỏ nhất chứa xâu…).</p>' },
});

const de3 = deCs({
  id: 'csd201-cs2-subarrays-div-k',
  tieuDe: { en: 'Count subarrays whose sum is divisible by k — prefix sums and remainders', vi: 'Đếm đoạn con có tổng chia hết cho k — tổng tiền tố và số dư' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['equal prefix remainders bracket a divisible subarray', 'Java % of a negative number', 'counting pairs on the fly'],
  moTa: {
    en: `<p>Complete ${c('static long countDivisible(int[] a, int k)')} (k ≥ 1, values may be negative): the number of non-empty contiguous subarrays whose sum is a multiple of k. Example ${c('{4,5,0,-2,-3,1}')}, k = 5 → 7.</p>
<p>sum(i..j) = P[j+1] − P[i] is divisible by k exactly when P[i] and P[j+1] have the same remainder. Count remainders of the prefixes seen so far (start with the empty prefix, remainder 0). Careful: in Java ${c('-7 % 5 == -2')} — bring it into [0, k) with ${c('((x % k) + k) % k')}. Use a long for the answer: a million zeros give 5·10¹¹ subarrays.</p>`,
    vi: `<p>Hoàn thiện ${c('countDivisible(a, k)')} (k ≥ 1, giá trị có thể âm): số đoạn con liên tiếp khác rỗng có tổng là bội của k. Ví dụ ${c('{4,5,0,-2,-3,1}')}, k = 5 → 7.</p>
<p>sum(i..j) = P[j+1] − P[i] chia hết cho k đúng khi P[i] và P[j+1] cùng số dư. Đếm số dư của các tiền tố đã gặp (bắt đầu bằng tiền tố rỗng, dư 0). Cẩn thận: trong Java ${c('-7 % 5 == -2')} — đưa về [0, k) bằng ${c('((x % k) + k) % k')}. Đáp án dùng long: một triệu số 0 cho 5·10¹¹ đoạn con.</p>`,
  },
  hen: { n: '1,000,000 elements', ms: 3000, can: 'O(n + k)', cham: 'O(n²) (every pair of ends)' },
  them: `
    static long brute(int[] a, int k) {
        long count = 0;
        for (int i = 0; i < a.length; i++) {
            long sum = 0;
            for (int j = i; j < a.length; j++) {
                sum += a[j];
                if (sum % k == 0) {
                    count++;
                }
            }
        }
        return count;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(DivByK.countDivisible(arr(p[1]), n(2)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(109);
                    String sai = null;
                    for (int t = 0; t < 20000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(14)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(21) - 10;
                        }
                        int k = 1 + rnd.nextInt(6);
                        long got = DivByK.countDivisible(a.clone(), k), want = brute(a, k);
                        if (got != want) {
                            sai = str(a) + " k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("20000 random arrays", 20000, sai);
                } else {
                    final int[] a = new int[1000000], z = new int[1000000];
                    Random rnd = new Random(9);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt(2000001) - 1000000;
                    }
                    final long[] got = new long[2];
                    r = Kiem.hen("1,000,000 elements, k = 7919, and a million zeros", 3000, new Runnable() {
                        public void run() {
                            got[0] = DivByK.countDivisible(a, 7919);
                            got[1] = DivByK.countDivisible(z, 3);
                        }
                    }) + ", answers " + got[0] + " and " + got[1];
                }`,
  tep: {
    'DivByK.java': j`
public class DivByK {

    public static long countDivisible(int[] a, int k) {
        //>> return 0; // TODO
        long[] byRemainder = new long[k];
        byRemainder[0] = 1; // the empty prefix has remainder 0
        long prefix = 0, count = 0;
        for (int x : a) {
            prefix += x;
            int r = (int) (((prefix % k) + k) % k); // Java's % can be negative
            count += byRemainder[r];
            byRemainder[r]++;
        }
        return count;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples and edges', vi: 'ví dụ và biên' }, vao: 'RUN 4,5,0,-2,-3,1 5\nRUN - 3\nRUN 5,5,5 5\nRUN -5 5\nRUN -1,2,9 2\n' },
    { ten: { en: '20000 random arrays with negatives', vi: '20000 mảng ngẫu nhiên có số âm' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Before counting the current prefix, the table holds the remainders of all earlier prefixes — add that count, then record the current one.', vi: 'Trước khi đếm tiền tố hiện tại, bảng chứa số dư của mọi tiền tố trước đó — cộng số đó, rồi mới ghi tiền tố hiện tại.' },
    { en: 'Keep the prefix in a long: a million values of ±10⁶ overflow an int.', vi: 'Giữ tiền tố bằng long: một triệu giá trị ±10⁶ tràn int.' },
  ],
  loiHayGap: [
    { en: 'Using prefix % k directly as an index — negative remainders throw ArrayIndexOutOfBoundsException.', vi: 'Dùng thẳng prefix % k làm chỉ số — số dư âm ném ArrayIndexOutOfBoundsException.' },
    { en: 'Forgetting the empty prefix — subarrays that start at index 0 are not counted.', vi: 'Quên tiền tố rỗng — các đoạn bắt đầu ở chỉ số 0 không được đếm.' },
  ],
  giaiThich: { en: '<p>A pair of prefixes with equal remainders ⇔ a divisible subarray, so the answer is Σ C(cnt[r], 2) — accumulated on the fly in one pass: O(n + k) time, O(k) memory instead of O(n²).</p>', vi: '<p>Một cặp tiền tố cùng số dư ⇔ một đoạn chia hết, nên đáp án là Σ C(cnt[r], 2) — cộng dồn ngay trong một lượt: O(n + k) thời gian, O(k) bộ nhớ thay vì O(n²).</p>' },
});

const de4 = deCs({
  id: 'csd201-cs2-flight-bookings',
  tieuDe: { en: 'Flight bookings — m range updates with a difference array', vi: 'Đặt chỗ chuyến bay — m lần cập nhật đoạn bằng mảng hiệu' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['difference array', 'range update in O(1)', 'prefix sum to rebuild'],
  moTa: {
    en: `<p>Flights are numbered 1…n. ${c('bookings[i] = {first, last, seats}')} reserves ${c('seats')} seats on every flight first…last (inclusive). Complete ${c('static long[] bookings(int[][] bookings, int n)')}: the total seats per flight.</p>
<p>Example n = 5, bookings [1,2,10] [2,3,20] [2,5,25] → [10, 55, 45, 25, 25]. Adding to every flight of every range is O(m · n) — the complexity check has 200,000 bookings over 200,000 flights. Instead write ${c('+seats')} at first−1 and ${c('−seats')} at last in a difference array, then one prefix-sum pass.</p>`,
    vi: `<p>Các chuyến bay đánh số 1…n. ${c('bookings[i] = {first, last, seats}')} giữ ${c('seats')} chỗ trên mọi chuyến first…last (tính cả hai đầu). Hoàn thiện ${c('bookings(bookings, n)')}: tổng số chỗ của từng chuyến.</p>
<p>Ví dụ n = 5, đặt chỗ [1,2,10] [2,3,20] [2,5,25] → [10, 55, 45, 25, 25]. Cộng vào từng chuyến của từng đoạn là O(m · n) — kiểm độ phức tạp có 200.000 lượt đặt trên 200.000 chuyến. Thay vào đó ghi ${c('+seats')} ở first−1 và ${c('−seats')} ở last trong mảng hiệu, rồi một lượt cộng dồn.</p>`,
  },
  hen: { n: '200,000 bookings × 200,000 flights', ms: 3000, can: 'O(m + n)', cham: 'O(m · n) (adding to every flight of every range)' },
  dauVao: { en: 'RUN n first,last,seats first,last,seats … · RANDOM · PERF.', vi: 'RUN n first,last,seats first,last,seats … · RANDOM · PERF.' },
  them: `
    static long[] brute(int[][] b, int n) {
        long[] res = new long[n];
        for (int[] x : b) {
            for (int i = x[0] - 1; i <= x[1] - 1; i++) {
                res[i] += x[2];
            }
        }
        return res;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[][] b = new int[p.length - 2][];
                    for (int i = 2; i < p.length; i++) {
                        b[i - 2] = arr(p[i]);
                    }
                    r = Arrays.toString(Flights.bookings(b, n(1)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(113);
                    String sai = null;
                    for (int t = 0; t < 8000 && sai == null; t++) {
                        int nn = 1 + rnd.nextInt(15), m = rnd.nextInt(8);
                        int[][] b = new int[m][];
                        for (int i = 0; i < m; i++) {
                            int first = 1 + rnd.nextInt(nn);
                            b[i] = new int[] {first, first + rnd.nextInt(nn - first + 1), 1 + rnd.nextInt(50)};
                        }
                        long[] got = Flights.bookings(b, nn), want = brute(b, nn);
                        if (!Arrays.equals(got, want)) {
                            sai = "n=" + nn + " " + Arrays.deepToString(b) + " -> " + Arrays.toString(got) + ", expected " + Arrays.toString(want);
                        }
                    }
                    r = ketQua("8000 random booking lists", 8000, sai);
                } else {
                    final int N = 200000;
                    final int[][] b = new int[N][];
                    Random rnd = new Random(11);
                    for (int i = 0; i < N; i++) {
                        b[i] = new int[] {1 + rnd.nextInt(10), N - rnd.nextInt(10), 1 + rnd.nextInt(1000)};
                    }
                    final long[][] got = new long[1][];
                    r = Kiem.hen("200,000 bookings over 200,000 flights", 3000, new Runnable() {
                        public void run() {
                            got[0] = Flights.bookings(b, N);
                        }
                    }) + (got[0] == null ? "" : ", flight 1: " + got[0][0] + ", flight 100000: " + got[0][99999] + ", flight 200000: " + got[0][N - 1]);
                }`,
  tep: {
    'Flights.java': j`
public class Flights {

    // bookings[i] = {first, last, seats}, flights numbered 1..n, ranges inclusive
    public static long[] bookings(int[][] bookings, int n) {
        //>> return new long[n]; // TODO
        long[] diff = new long[n + 1];
        for (int[] b : bookings) {
            diff[b[0] - 1] += b[2];
            diff[b[1]] -= b[2]; // b[1] = last (1-based) = the index just after the range (0-based)
        }
        long[] res = new long[n];
        long running = 0;
        for (int i = 0; i < n; i++) {
            running += diff[i];
            res[i] = running;
        }
        return res;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples and edges', vi: 'ví dụ và biên' }, vao: 'RUN 5 1,2,10 2,3,20 2,5,25\nRUN 3\nRUN 1 1,1,7\nRUN 3 2,2,4\nRUN 4 1,4,1 4,4,2\n' },
    { ten: { en: '8000 random booking lists', vi: '8000 danh sách đặt chỗ ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Size the difference array n + 1 so that the "−seats" of a range ending at flight n has a place.', vi: 'Cho mảng hiệu cỡ n + 1 để "−seats" của đoạn kết thúc ở chuyến n có chỗ.' },
    { en: 'Flight f (1-based) is index f − 1: the range starts at first − 1 and stops before index last.', vi: 'Chuyến f (đánh từ 1) là chỉ số f − 1: đoạn bắt đầu ở first − 1 và dừng trước chỉ số last.' },
  ],
  loiHayGap: [
    { en: 'Subtracting at last − 1 instead of last — the last flight of every booking loses its seats.', vi: 'Trừ ở last − 1 thay vì last — chuyến cuối của mỗi lượt đặt mất chỗ.' },
    { en: 'An int for the totals — 200,000 bookings of up to 1000 seats overflow.', vi: 'Dùng int cho tổng — 200.000 lượt đặt tới 1000 chỗ thì tràn.' },
  ],
  giaiThich: { en: '<p>The difference array stores how the value CHANGES from one flight to the next; a range update touches two cells, and the prefix sum rebuilds all values at the end: O(m + n) instead of O(m · n). The 2-D version (four corners) does the same for rectangle updates.</p>', vi: '<p>Mảng hiệu lưu giá trị THAY ĐỔI bao nhiêu từ chuyến này sang chuyến sau; một lần cập nhật đoạn chạm hai ô, và tổng tiền tố dựng lại mọi giá trị ở cuối: O(m + n) thay vì O(m · n). Bản 2 chiều (bốn góc) làm y vậy cho cập nhật hình chữ nhật.</p>' },
});

const de5 = deCs({
  id: 'csd201-cs2-trapping-rain-water',
  tieuDe: { en: 'Trapping rain water with two pointers in O(n) time and O(1) memory', vi: 'Hứng nước mưa bằng hai con trỏ trong O(n) thời gian và O(1) bộ nhớ' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['water[i] = min(maxLeft, maxRight) − h[i]', 'move the lower side', 'running maxima'],
  moTa: {
    en: `<p>${c('h[i] ≥ 0')} are the heights of bars of width 1. Complete ${c('static long trap(int[] h)')}: how much water stays after rain. Example ${c('{0,1,0,2,1,0,1,3,2,1,2,1}')} → 6.</p>
<p>Above bar i the water level is min(tallest bar on its left, tallest on its right). Two pointers from both ends: if ${c('h[lo] < h[hi]')}, the left side is the lower one, so the water above lo depends only on ${c('leftMax')} — settle it and move lo; otherwise settle hi with ${c('rightMax')}. O(n), O(1) memory; the complexity check has 2,000,000 bars.</p>`,
    vi: `<p>${c('h[i] ≥ 0')} là chiều cao các cột rộng 1. Hoàn thiện ${c('trap(h)')}: lượng nước đọng lại sau mưa. Ví dụ ${c('{0,1,0,2,1,0,1,3,2,1,2,1}')} → 6.</p>
<p>Trên cột i, mực nước là min(cột cao nhất bên trái, cột cao nhất bên phải). Hai con trỏ từ hai đầu: nếu ${c('h[lo] < h[hi]')} thì bên trái thấp hơn, nên nước trên lo chỉ phụ thuộc ${c('leftMax')} — chốt nó rồi dời lo; ngược lại chốt hi bằng ${c('rightMax')}. O(n), O(1) bộ nhớ; kiểm độ phức tạp có 2.000.000 cột.</p>`,
  },
  hen: { n: '2,000,000 bars', ms: 3000, can: 'O(n)', cham: 'O(n²) (scanning left and right for every bar)' },
  quyTac: [{ id: 'R1', en: 'O(1) extra memory: no new array in Rain', vi: 'bộ nhớ phụ O(1): không tạo mảng mới trong Rain', re: String.raw`\bnew\s+(int|long)\s*\[`, file: 'Rain' }],
  them: `
    static long brute(int[] h) {
        long water = 0;
        for (int i = 0; i < h.length; i++) {
            int l = 0, rr = 0;
            for (int j = 0; j <= i; j++) {
                l = Math.max(l, h[j]);
            }
            for (int j = i; j < h.length; j++) {
                rr = Math.max(rr, h[j]);
            }
            water += Math.min(l, rr) - h[i];
        }
        return water;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Rain.trap(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(127);
                    String sai = null;
                    for (int t = 0; t < 20000 && sai == null; t++) {
                        int[] h = new int[rnd.nextInt(15)];
                        for (int i = 0; i < h.length; i++) {
                            h[i] = rnd.nextInt(6);
                        }
                        long got = Rain.trap(h.clone()), want = brute(h);
                        if (got != want) {
                            sai = str(h) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("20000 random height lists", 20000, sai);
                } else {
                    final int[] h = new int[2000000];
                    Random rnd = new Random(13);
                    for (int i = 0; i < h.length; i++) {
                        h[i] = i == 0 || i == h.length - 1 ? 1000000000 : rnd.nextInt(1000000);
                    }
                    final long[] got = new long[1];
                    r = Kiem.hen("2,000,000 bars", 3000, new Runnable() {
                        public void run() {
                            got[0] = Rain.trap(h);
                        }
                    }) + ", water " + got[0];
                }`,
  tep: {
    'Rain.java': j`
public class Rain {

    public static long trap(int[] h) {
        //>> return 0; // TODO
        int lo = 0, hi = h.length - 1, leftMax = 0, rightMax = 0;
        long water = 0;
        while (lo < hi) {
            if (h[lo] < h[hi]) { // the left side is lower: its own maximum decides
                leftMax = Math.max(leftMax, h[lo]);
                water += leftMax - h[lo];
                lo++;
            } else {
                rightMax = Math.max(rightMax, h[hi]);
                water += rightMax - h[hi];
                hi--;
            }
        }
        return water;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples and edges', vi: 'ví dụ và biên' }, vao: 'RUN 0,1,0,2,1,0,1,3,2,1,2,1\nRUN -\nRUN 5\nRUN 3,3,3\nRUN 5,0,5\nRUN 1,2,3,4,5\nRUN 4,2,0,3,2,5\n' },
    { ten: { en: '20000 random height lists', vi: '20000 dãy chiều cao ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Why moving the lower side is safe: the other side already has a bar at least as tall, so the far maximum can only help.', vi: 'Vì sao dời bên thấp là an toàn: bên kia đã có một cột cao ít nhất bằng, nên max phía xa chỉ có thể lớn hơn.' },
    { en: 'Update the running maximum before adding water, so a new tallest bar adds 0.', vi: 'Cập nhật max chạy trước khi cộng nước, để cột cao nhất mới cộng 0.' },
  ],
  loiHayGap: [
    { en: 'Prefix and suffix maximum arrays — correct and O(n), but O(n) memory (rule R1).', vi: 'Mảng max tiền tố và hậu tố — đúng và O(n), nhưng tốn O(n) bộ nhớ (luật R1).' },
    { en: 'An int total — 2·10⁶ bars under a 10⁹ wall hold about 2·10¹⁵ units.', vi: 'Tổng kiểu int — 2·10⁶ cột dưới bức tường 10⁹ chứa khoảng 2·10¹⁵ đơn vị.' },
  ],
  giaiThich: { en: '<p>Each step settles one bar exactly: when h[lo] < h[hi], min(maxLeft, maxRight) for lo is leftMax because some bar on the right (h[hi]) is already taller. n − 1 steps, O(1) memory.</p>', vi: '<p>Mỗi bước chốt chính xác một cột: khi h[lo] < h[hi], min(maxTrái, maxPhải) của lo là leftMax vì bên phải đã có một cột (h[hi]) cao hơn. n − 1 bước, O(1) bộ nhớ.</p>' },
});

const de6 = deCs({
  id: 'csd201-cs2-max-circular-subarray',
  tieuDe: { en: 'Maximum sum of a circular subarray — Kadane twice', vi: 'Tổng lớn nhất của đoạn con vòng — Kadane hai lần' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['Kadane for max and min subarray', 'wrap-around = total − minimum subarray', 'all-negative special case'],
  moTa: {
    en: `<p>${c('a')} (n ≥ 1) is circular: after the last element comes the first. Complete ${c('static long maxCircular(int[] a)')}: the largest sum of a non-empty contiguous piece of the circle (each element used at most once). Examples: ${c('{5,-3,5}')} → 10 (5 + 5 across the end), ${c('{-3,-2,-3}')} → -2.</p>
<p>A best piece either does not wrap (ordinary Kadane) or wraps — then what is left out is a contiguous middle piece with the <b>minimum</b> sum, so wrap = total − minSubarray. Exception: if every element is negative, the minimum subarray is the whole array and "wrap" would be empty.</p>`,
    vi: `<p>${c('a')} (n ≥ 1) là vòng tròn: sau phần tử cuối là phần tử đầu. Hoàn thiện ${c('maxCircular(a)')}: tổng lớn nhất của một đoạn liên tiếp khác rỗng trên vòng (mỗi phần tử dùng nhiều nhất một lần). Ví dụ: ${c('{5,-3,5}')} → 10 (5 + 5 vòng qua cuối), ${c('{-3,-2,-3}')} → -2.</p>
<p>Đoạn tốt nhất hoặc không vòng (Kadane thường) hoặc vòng — khi đó phần bị bỏ ra là một đoạn giữa liên tiếp có tổng <b>nhỏ nhất</b>, nên vòng = tổng − đoạn nhỏ nhất. Ngoại lệ: nếu mọi phần tử đều âm, đoạn nhỏ nhất là cả mảng và "vòng" sẽ rỗng.</p>`,
  },
  hen: { n: '2,000,000 elements', ms: 3000, can: 'O(n)', cham: 'O(n²) (every start, every length)' },
  them: `
    static long brute(int[] a) {
        int n = a.length;
        long best = a[0];
        for (int i = 0; i < n; i++) {
            long sum = 0;
            for (int len = 1; len <= n; len++) {
                sum += a[(i + len - 1) % n];
                best = Math.max(best, sum);
            }
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Circular.maxCircular(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(131);
                    String sai = null;
                    for (int t = 0; t < 20000 && sai == null; t++) {
                        int[] a = new int[1 + rnd.nextInt(13)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(21) - 10;
                        }
                        long got = Circular.maxCircular(a.clone()), want = brute(a);
                        if (got != want) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("20000 random arrays", 20000, sai);
                } else {
                    final int[] a = new int[2000000];
                    Random rnd = new Random(17);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt(2000001) - 1000000 + (i < 1000 || i >= a.length - 1000 ? 900000 : 0);
                    }
                    final long[] got = new long[1];
                    r = Kiem.hen("2,000,000 elements", 3000, new Runnable() {
                        public void run() {
                            got[0] = Circular.maxCircular(a);
                        }
                    }) + ", best " + got[0];
                }`,
  tep: {
    'Circular.java': j`
public class Circular {

    public static long maxCircular(int[] a) {
        //>> return 0; // TODO
        long total = 0, bestMax = a[0], curMax = 0, bestMin = a[0], curMin = 0;
        boolean allNegative = true;
        for (int x : a) {
            total += x;
            curMax = Math.max(x, curMax + x);
            bestMax = Math.max(bestMax, curMax);
            curMin = Math.min(x, curMin + x);
            bestMin = Math.min(bestMin, curMin);
            if (x >= 0) {
                allNegative = false;
            }
        }
        if (allNegative) {
            return bestMax; // wrapping would leave an empty piece
        }
        return Math.max(bestMax, total - bestMin);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples and edges', vi: 'ví dụ và biên' }, vao: 'RUN 5,-3,5\nRUN -3,-2,-3\nRUN -1\nRUN 3,3,3\nRUN 1,-2,3,-2\nRUN 0,-1,-2\n' },
    { ten: { en: '20000 random arrays vs every rotation', vi: '20000 mảng ngẫu nhiên so với mọi phép xoay' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'One pass can run both Kadanes (max and min) and the total together.', vi: 'Một lượt có thể chạy cả hai Kadane (max và min) cùng tổng.' },
    { en: 'Kadane step: cur = max(x, cur + x) — either extend the piece or start again at x.', vi: 'Bước Kadane: cur = max(x, cur + x) — hoặc nối dài đoạn hoặc bắt đầu lại ở x.' },
  ],
  loiHayGap: [
    { en: 'Returning total − minSubarray for an all-negative array — the answer becomes 0 (an empty piece).', vi: 'Trả tổng − đoạn nhỏ nhất với mảng toàn âm — đáp án thành 0 (đoạn rỗng).' },
    { en: 'Concatenating the array with itself and running Kadane — a piece longer than n uses elements twice.', vi: 'Nối mảng với chính nó rồi chạy Kadane — đoạn dài hơn n dùng phần tử hai lần.' },
  ],
  giaiThich: { en: '<p>Either the best piece lies inside a[0..n−1] (Kadane) or its complement is a contiguous inner piece, which must have the minimum sum. Two Kadane scans (or one combined) give O(n) time and O(1) memory instead of O(n²) over all rotations.</p>', vi: '<p>Đoạn tốt nhất hoặc nằm trong a[0..n−1] (Kadane), hoặc phần bù của nó là một đoạn giữa liên tiếp, phải có tổng nhỏ nhất. Hai lượt Kadane (hoặc một lượt gộp) cho O(n) thời gian và O(1) bộ nhớ thay vì O(n²) trên mọi phép xoay.</p>' },
});

export default moDun({ slug: 'csd201-cs2-on', ten: '10.2 ⭐ CS.2 Array techniques — interview problems', de: [de1, de2, de3, de4, de5, de6] });
