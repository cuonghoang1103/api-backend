/** CSD201 · ⭐ CS.9 — băm, chuỗi, bit kiểu phỏng vấn (gen/java/cs9/Ex*): trùng gần trong k (HashMap chỉ số cuối), đếm đoạn con tổng k (tiền tố + HashMap), ký tự duy nhất đầu tiên (mảng đếm 26), số xuất hiện một lần giữa các bộ ba (cộng từng bit mod 3), đếm bit 0..n (DP i >> 1), đảo 32 bit. */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const de1 = deCs({
  id: 'csd201-cs9-nearby-duplicate',
  tieuDe: { en: 'Equal values at most k apart — a HashMap of the last index', vi: 'Hai giá trị bằng nhau cách nhau không quá k — HashMap chỉ số cuối' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['remember the last index of every value', 'O(n) expected', 'only the nearest previous occurrence matters'],
  moTa: {
    en: `<p>Complete ${c('static boolean nearbyDuplicate(int[] a, int k)')}: is there i ≠ j with ${c('a[i] == a[j]')} and ${c('|i − j| ≤ k')}? Examples: ${c('{1,2,3,1}')}, k = 3 → true; ${c('{1,0,1,1}')}, k = 1 → true; ${c('{1,2,3,1,2,3}')}, k = 2 → false.</p>
<p>Walk once and keep in a ${c('HashMap<Integer, Integer>')} the last index where each value was seen: if the current value was seen at an index ≥ i − k, answer true. Only the most recent previous occurrence can be the closest. Comparing every pair within distance k is O(n · k) — the complexity check uses n = 1,000,000, k = 100,000.</p>`,
    vi: `<p>Hoàn thiện ${c('nearbyDuplicate(a, k)')}: có i ≠ j với ${c('a[i] == a[j]')} và ${c('|i − j| ≤ k')} không? Ví dụ: ${c('{1,2,3,1}')}, k = 3 → true; ${c('{1,0,1,1}')}, k = 1 → true; ${c('{1,2,3,1,2,3}')}, k = 2 → false.</p>
<p>Đi một lượt và giữ trong ${c('HashMap<Integer, Integer>')} chỉ số cuối cùng mỗi giá trị xuất hiện: nếu giá trị hiện tại từng gặp ở chỉ số ≥ i − k thì trả true. Chỉ lần xuất hiện gần nhất trước đó mới có thể là gần nhất. So mọi cặp trong khoảng k là O(n · k) — kiểm độ phức tạp dùng n = 1.000.000, k = 100.000.</p>`,
  },
  hen: { n: 'n = 1,000,000, k = 100,000', ms: 3000, can: 'O(n) expected', cham: 'O(n · k) (every pair in the window)' },
  dauVao: { en: 'RUN array k · RANDOM · PERF.', vi: 'RUN mảng k · RANDOM · PERF.' },
  them: `
    static boolean brute(int[] a, int k) {
        for (int i = 0; i < a.length; i++) {
            for (int jj = i + 1; jj < a.length && jj - i <= k; jj++) {
                if (a[i] == a[jj]) {
                    return true;
                }
            }
        }
        return false;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(NearbyDup.nearbyDuplicate(arr(p[1]), n(2)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(131);
                    String sai = null;
                    for (int t = 0; t < 5000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(12)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(8) - 3;
                        }
                        int k = rnd.nextInt(5);
                        boolean got = NearbyDup.nearbyDuplicate(a.clone(), k), want = brute(a, k);
                        if (got != want) {
                            sai = str(a) + " k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("5000 random arrays (k = 0 too)", 5000, sai);
                } else {
                    final int[] a = new int[1000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i % 200001; // equal values exactly 200,001 apart
                    }
                    final boolean[] got = new boolean[2];
                    r = Kiem.hen("n = 1,000,000", 3000, new Runnable() {
                        public void run() {
                            got[0] = NearbyDup.nearbyDuplicate(a, 100000);
                            got[1] = NearbyDup.nearbyDuplicate(a, 200001);
                        }
                    }) + ", answers " + got[0] + " and " + got[1];
                }`,
  tep: {
    'NearbyDup.java': j`
import java.util.HashMap;
import java.util.Map;

public class NearbyDup {

    public static boolean nearbyDuplicate(int[] a, int k) {
        //>> return false; // TODO
        Map<Integer, Integer> last = new HashMap<Integer, Integer>(); // value -> last index seen
        for (int i = 0; i < a.length; i++) {
            Integer prev = last.get(a[i]);
            if (prev != null && i - prev <= k) {
                return true;
            }
            last.put(a[i], i);
        }
        return false;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,2,3,1 3\nRUN 1,0,1,1 1\nRUN 1,2,3,1,2,3 2\nRUN - 5\nRUN 7,7 0\n' },
    { ten: { en: '5000 random arrays', vi: '5000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Update the map AFTER the check — the current index replaces the old one either way.', vi: 'Cập nhật map SAU phép kiểm — chỉ số hiện tại thay chỉ số cũ trong mọi trường hợp.' },
    { en: 'k = 0 can never be true (i ≠ j).', vi: 'k = 0 không bao giờ cho true (i ≠ j).' },
  ],
  loiHayGap: [
    { en: 'Keeping the FIRST index of each value — a later, closer pair is missed.', vi: 'Giữ chỉ số ĐẦU TIÊN của mỗi giá trị — bỏ sót một cặp sau gần hơn.' },
    { en: 'Comparing Integer objects with == (prev == i) — boxed values above 127 are different objects.', vi: 'So hai đối tượng Integer bằng == — giá trị đóng hộp lớn hơn 127 là các đối tượng khác nhau.' },
  ],
  giaiThich: { en: '<p>For every value only its most recent index matters, so the map holds one entry per distinct value and each step is an expected O(1) lookup and update: O(n) time, O(n) memory. A HashSet of the last k values (a sliding window) is the alternative with O(k) memory.</p>', vi: '<p>Với mỗi giá trị chỉ chỉ số gần nhất là quan trọng, nên map giữ một mục cho mỗi giá trị khác nhau và mỗi bước là một lần tra và cập nhật O(1) kỳ vọng: O(n) thời gian, O(n) bộ nhớ. HashSet chứa k giá trị gần nhất (cửa sổ trượt) là phương án dùng O(k) bộ nhớ.</p>' },
});

const de2 = deCs({
  id: 'csd201-cs9-subarray-sum-k',
  tieuDe: { en: 'Count subarrays that sum to k — prefix sums + HashMap (negatives allowed)', vi: 'Đếm đoạn con có tổng k — tổng tiền tố + HashMap (có số âm)' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['sum(i..j) = P[j+1] − P[i]', 'count earlier prefixes equal to P − k', 'why two pointers fail with negatives'],
  moTa: {
    en: `<p>Complete ${c('static long subarraySum(int[] a, long k)')}: the number of non-empty contiguous subarrays with sum exactly k. Values may be negative, so a sliding window does not work. Examples: ${c('{1,1,1}')}, k = 2 → 2; ${c('{1,2,3}')}, k = 3 → 2; ${c('{1,-1,0}')}, k = 0 → 3.</p>
<p>A subarray ending at j has sum k exactly when an earlier prefix equals P − k. Keep a ${c('HashMap<Long, Integer>')} prefix → how many times, starting with ${c('{0: 1}')}; for each element add ${c('count[P − k]')}, then record P. Use long for the prefix and the answer — the complexity check has a million zeros with k = 0 (5·10¹¹ subarrays).</p>`,
    vi: `<p>Hoàn thiện ${c('subarraySum(a, k)')}: số đoạn con liên tiếp khác rỗng có tổng đúng bằng k. Giá trị có thể âm, nên cửa sổ trượt không dùng được. Ví dụ: ${c('{1,1,1}')}, k = 2 → 2; ${c('{1,2,3}')}, k = 3 → 2; ${c('{1,-1,0}')}, k = 0 → 3.</p>
<p>Đoạn con kết thúc ở j có tổng k đúng khi một tiền tố trước đó bằng P − k. Giữ ${c('HashMap<Long, Integer>')} tiền tố → số lần, bắt đầu bằng ${c('{0: 1}')}; với mỗi phần tử cộng ${c('count[P − k]')}, rồi ghi nhận P. Dùng long cho tiền tố và đáp án — kiểm độ phức tạp có một triệu số 0 với k = 0 (5·10¹¹ đoạn con).</p>`,
  },
  hen: { n: '1,000,000 elements', ms: 3000, can: 'O(n) expected', cham: 'O(n²) (every pair of ends)' },
  dauVao: { en: 'RUN array k · RANDOM · PERF.', vi: 'RUN mảng k · RANDOM · PERF.' },
  them: `
    static long brute(int[] a, long k) {
        long total = 0;
        for (int i = 0; i < a.length; i++) {
            long s = 0;
            for (int jj = i; jj < a.length; jj++) {
                s += a[jj];
                if (s == k) {
                    total++;
                }
            }
        }
        return total;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(SumK.subarraySum(arr(p[1]), Long.parseLong(p[2])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(133);
                    String sai = null;
                    for (int t = 0; t < 5000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(13)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(9) - 4;
                        }
                        long k = rnd.nextInt(9) - 4;
                        long got = SumK.subarraySum(a.clone(), k), want = brute(a, k);
                        if (got != want) {
                            sai = str(a) + " k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("5000 random arrays with negatives", 5000, sai);
                } else {
                    final int[] a = new int[1000000], z = new int[1000000];
                    Random rnd = new Random(135);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt(201) - 100;
                    }
                    final long[] got = new long[2];
                    r = Kiem.hen("1,000,000 elements (random) + 1,000,000 zeros", 3000, new Runnable() {
                        public void run() {
                            got[0] = SumK.subarraySum(a, 50);
                            got[1] = SumK.subarraySum(z, 0);
                        }
                    }) + ", answers " + got[0] + " and " + got[1];
                }`,
  tep: {
    'SumK.java': j`
import java.util.HashMap;
import java.util.Map;

public class SumK {

    public static long subarraySum(int[] a, long k) {
        //>> return 0; // TODO
        Map<Long, Integer> count = new HashMap<Long, Integer>();
        count.put(0L, 1); // the empty prefix
        long prefix = 0, total = 0;
        for (int x : a) {
            prefix += x;
            Integer c = count.get(prefix - k); // earlier prefixes P' with prefix - P' == k
            if (c != null) {
                total += c;
            }
            Integer mine = count.get(prefix);
            count.put(prefix, mine == null ? 1 : mine + 1);
        }
        return total;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,1,1 2\nRUN 1,2,3 3\nRUN 1,-1,0 0\nRUN - 0\nRUN 3,4,7,2,-3,1,4,2 7\n' },
    { ten: { en: '5000 random arrays', vi: '5000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Look up prefix − k before recording prefix — otherwise k = 0 counts empty subarrays.', vi: 'Tra prefix − k trước khi ghi nhận prefix — nếu không, k = 0 đếm cả đoạn rỗng.' },
    { en: 'Keys are Long: count.get(prefix − k) with an int expression would look up an Integer key and never match.', vi: 'Khoá là Long: count.get(prefix − k) với biểu thức int sẽ tra khoá Integer và không bao giờ khớp.' },
  ],
  loiHayGap: [
    { en: 'A sliding window — it assumes the sum grows when the window grows, false with negatives.', vi: 'Cửa sổ trượt — giả định tổng tăng khi cửa sổ mở rộng, sai khi có số âm.' },
    { en: 'Forgetting {0: 1} — subarrays starting at index 0 are not counted.', vi: 'Quên {0: 1} — các đoạn bắt đầu ở chỉ số 0 không được đếm.' },
  ],
  giaiThich: { en: '<p>Counting pairs of equal-difference prefixes on the fly turns O(n²) pairs into n expected-O(1) map operations. The same idea counted subarrays divisible by k in CS.2 (with remainders as keys) and downward tree paths in CS.7.</p>', vi: '<p>Đếm ngay các cặp tiền tố có hiệu cần tìm biến O(n²) cặp thành n phép map O(1) kỳ vọng. Cùng ý đó đã đếm đoạn chia hết cho k ở CS.2 (khoá là số dư) và đường đi xuống trên cây ở CS.7.</p>' },
});

const de3 = deCs({
  id: 'csd201-cs9-first-unique-char',
  tieuDe: { en: 'The first non-repeating character — a counting array of 26', vi: 'Ký tự không lặp đầu tiên — mảng đếm 26 ô' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['two passes: count, then find', 'int[26] instead of a HashMap', 'O(n) time, O(1) extra memory'],
  moTa: {
    en: `<p>Complete ${c('static int firstUnique(String s)')} (lowercase letters only): the index of the first character that occurs exactly once in s, or −1. Examples: leetcode → 0, loveleetcode → 2, aabb → −1.</p>
<p>Pass 1 counts every letter in ${c('int[26]')} (index ${c('c − \'a\'')}); pass 2 returns the first index whose letter has count 1. Counting the occurrences of each character separately is O(n²) — the complexity check has a 1,000,000-character string whose only unique letter is the last one.</p>`,
    vi: `<p>Hoàn thiện ${c('firstUnique(s)')} (chỉ chữ thường): chỉ số của ký tự đầu tiên xuất hiện đúng một lần trong s, hoặc −1. Ví dụ: leetcode → 0, loveleetcode → 2, aabb → −1.</p>
<p>Lượt 1 đếm mọi chữ trong ${c('int[26]')} (chỉ số ${c('c − \'a\'')}); lượt 2 trả chỉ số đầu tiên mà chữ của nó có số đếm 1. Đếm số lần xuất hiện của từng ký tự riêng là O(n²) — kiểm độ phức tạp có xâu 1.000.000 ký tự mà chữ duy nhất không lặp là chữ cuối.</p>`,
  },
  hen: { n: '1,000,000 characters', ms: 3000, can: 'O(n)', cham: 'O(n²) (counting each character separately)' },
  dauVao: { en: 'RUN word (- = empty) · RANDOM · PERF.', vi: 'RUN từ (- = rỗng) · RANDOM · PERF.' },
  them: `
    static int brute(String s) {
        for (int i = 0; i < s.length(); i++) {
            int cc = 0;
            for (int jj = 0; jj < s.length(); jj++) {
                if (s.charAt(jj) == s.charAt(i)) {
                    cc++;
                }
            }
            if (cc == 1) {
                return i;
            }
        }
        return -1;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Unique.firstUnique(p[1].equals("-") ? "" : p[1]));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(137);
                    String sai = null;
                    for (int t = 0; t < 5000 && sai == null; t++) {
                        StringBuilder sb = new StringBuilder();
                        int n = rnd.nextInt(12);
                        for (int i = 0; i < n; i++) {
                            sb.append((char) ('a' + rnd.nextInt(1 + t % 6)));
                        }
                        String s = sb.toString();
                        int got = Unique.firstUnique(s), want = brute(s);
                        if (got != want) {
                            sai = "\\"" + s + "\\" -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("5000 random strings", 5000, sai);
                } else {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < 999999; i++) {
                        sb.append((char) ('a' + i % 25));
                    }
                    sb.append('z');
                    final String s = sb.toString();
                    final int[] got = new int[1];
                    r = Kiem.hen("1,000,000 characters", 3000, new Runnable() {
                        public void run() {
                            got[0] = Unique.firstUnique(s);
                        }
                    }) + ", index " + got[0];
                }`,
  tep: {
    'Unique.java': j`
public class Unique {

    public static int firstUnique(String s) {
        //>> return -1; // TODO
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); i++) {
            cnt[s.charAt(i) - 'a']++;
        }
        for (int i = 0; i < s.length(); i++) {
            if (cnt[s.charAt(i) - 'a'] == 1) {
                return i;
            }
        }
        return -1;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN leetcode\nRUN loveleetcode\nRUN aabb\nRUN -\nRUN z\n' },
    { ten: { en: '5000 random strings', vi: '5000 xâu ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The second pass walks the STRING, not the alphabet — "first" means smallest index.', vi: 'Lượt hai đi theo XÂU, không theo bảng chữ cái — "đầu tiên" nghĩa là chỉ số nhỏ nhất.' },
    { en: 'c − \'a\' maps a…z to 0…25.', vi: 'c − \'a\' ánh xạ a…z thành 0…25.' },
  ],
  loiHayGap: [
    { en: 'Scanning the 26 counts for the first 1 — that is the alphabetically first unique letter.', vi: 'Quét 26 số đếm tìm số 1 đầu tiên — đó là chữ duy nhất đứng đầu theo bảng chữ cái.' },
    { en: 's.indexOf(c) == s.lastIndexOf(c) for every c — correct, O(n²).', vi: 's.indexOf(c) == s.lastIndexOf(c) với mọi c — đúng, O(n²).' },
  ],
  giaiThich: { en: '<p>When the keys are a small fixed alphabet, an array indexed by the character is a perfect hash table: no hashing, no boxing, O(1) memory. Two linear passes: O(n).</p>', vi: '<p>Khi khoá là một bảng chữ nhỏ cố định, mảng đánh chỉ số theo ký tự là một bảng băm hoàn hảo: không băm, không đóng hộp, O(1) bộ nhớ. Hai lượt tuyến tính: O(n).</p>' },
});

const de4 = deCs({
  id: 'csd201-cs9-single-number-2',
  tieuDe: { en: 'Every number three times except one — add each bit position mod 3', vi: 'Mọi số xuất hiện ba lần trừ một — cộng từng vị trí bit theo mod 3' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['(x >> b) & 1', 'a bit count not divisible by 3 belongs to the single number', 'works for negatives (bit 31)'],
  moTa: {
    en: `<p>In ${c('a')} every value appears exactly three times except one value that appears once. Complete ${c('static int single(int[] a)')} using <b>O(1) extra memory</b>: no HashMap/HashSet, no sorting, no extra array. Examples: ${c('{2,2,3,2}')} → 3; ${c('{0,1,0,1,0,1,99}')} → 99; ${c('{-5,7,7,7}')} → −5.</p>
<p>For every bit position b = 0…31 add up ${c('(x >> b) & 1')} over all x. The three copies of each repeated value contribute a multiple of 3; if the sum is not divisible by 3, bit b belongs to the single number. Bit 31 makes negative answers come out right automatically.</p>`,
    vi: `<p>Trong ${c('a')} mọi giá trị xuất hiện đúng ba lần trừ một giá trị xuất hiện một lần. Hoàn thiện ${c('single(a)')} với <b>bộ nhớ phụ O(1)</b>: không HashMap/HashSet, không sắp xếp, không mảng phụ. Ví dụ: ${c('{2,2,3,2}')} → 3; ${c('{0,1,0,1,0,1,99}')} → 99; ${c('{-5,7,7,7}')} → −5.</p>
<p>Với mỗi vị trí bit b = 0…31 cộng ${c('(x >> b) & 1')} trên mọi x. Ba bản của mỗi giá trị lặp đóng góp một bội của 3; nếu tổng không chia hết cho 3 thì bit b thuộc số đơn lẻ. Bit 31 làm đáp án âm tự ra đúng.</p>`,
  },
  quyTac: [{ id: 'R1', en: 'O(1) extra memory in Triple: no collection, no sorting, no new array', vi: 'bộ nhớ phụ O(1) trong Triple: không collection, không sắp xếp, không mảng mới', re: String.raw`\b(HashMap|HashSet|TreeMap|TreeSet|Map|Set|List)\b|\bsort\s*\(|\bnew\s+(int|long|byte|short|char|boolean)\s*\[`, file: 'Triple' }],
  them: `
    static int brute(int[] a) {
        Map<Integer, Integer> cnt = new HashMap<Integer, Integer>();
        for (int x : a) {
            Integer v = cnt.get(x);
            cnt.put(x, v == null ? 1 : v + 1);
        }
        for (Map.Entry<Integer, Integer> e : cnt.entrySet()) {
            if (e.getValue() == 1) {
                return e.getKey();
            }
        }
        throw new IllegalStateException();
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Triple.single(arr(p[1])));
                } else {
                    Random rnd = new Random(139);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        int groups = rnd.nextInt(5);
                        List<Integer> l = new ArrayList<Integer>();
                        Set<Integer> used = new HashSet<Integer>();
                        int lone = t % 2 == 0 ? rnd.nextInt() : rnd.nextInt(21) - 10;
                        used.add(lone);
                        l.add(lone);
                        for (int g = 0; g < groups; g++) {
                            int v;
                            do {
                                v = t % 2 == 0 ? rnd.nextInt() : rnd.nextInt(21) - 10;
                            } while (!used.add(v));
                            l.add(v);
                            l.add(v);
                            l.add(v);
                        }
                        Collections.shuffle(l, rnd);
                        int[] a = new int[l.size()];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = l.get(i);
                        }
                        int got = Triple.single(a.clone()), want = brute(a);
                        if (got != want) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random arrays (negatives, MIN/MAX range)", 2000, sai);
                }`,
  tep: {
    'Triple.java': j`
public class Triple {

    public static int single(int[] a) {
        //>> return a[0]; // TODO
        int ans = 0;
        for (int bit = 0; bit < 32; bit++) {
            int sum = 0;
            for (int x : a) {
                sum += (x >> bit) & 1;
            }
            if (sum % 3 != 0) {
                ans |= 1 << bit; // this bit belongs to the single number
            }
        }
        return ans;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 2,2,3,2\nRUN 0,1,0,1,0,1,99\nRUN -5,7,7,7\nRUN 42\nRUN -2147483648,1,1,1\n' },
    { ten: { en: '2000 random arrays', vi: '2000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'Loop over 32 bits outside and over the array inside — 32 · n steps, no memory.', vi: 'Vòng ngoài 32 bit, vòng trong mảng — 32 · n bước, không tốn bộ nhớ.' },
    { en: 'Set a bit with ans |= 1 << b; for b = 31 that makes ans negative, which is correct.', vi: 'Bật bit bằng ans |= 1 << b; với b = 31 ans thành âm, và như vậy là đúng.' },
  ],
  loiHayGap: [
    { en: 'XOR of everything — that works for pairs, not triples (x ^ x ^ x = x).', vi: 'XOR tất cả — dùng được cho cặp, không cho bộ ba (x ^ x ^ x = x).' },
    { en: 'Looping only over bits 0…30 — negative answers lose their sign bit.', vi: 'Chỉ lặp bit 0…30 — đáp án âm mất bit dấu.' },
  ],
  giaiThich: { en: '<p>Counting each bit modulo 3 separates the single value from the triples in 32 passes with two int variables. (A constant-time-per-element version keeps two bitmasks "ones" and "twos" — a tiny state machine per bit.)</p>', vi: '<p>Đếm từng bit theo mod 3 tách số đơn lẻ khỏi các bộ ba trong 32 lượt với hai biến int. (Bản O(1) mỗi phần tử giữ hai mặt nạ bit "ones" và "twos" — một máy trạng thái nhỏ cho mỗi bit.)</p>' },
});

const de5 = deCs({
  id: 'csd201-cs9-counting-bits',
  tieuDe: { en: 'Count the 1-bits of every number 0…n — dp[i] = dp[i >> 1] + (i & 1)', vi: 'Đếm số bit 1 của mọi số 0…n — dp[i] = dp[i >> 1] + (i & 1)' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['reuse the answer of i >> 1', 'O(n) without bitCount', 'i & (i − 1) clears the lowest 1'],
  moTa: {
    en: `<p>Complete ${c('static int[] countBits(int n)')}: an array of n + 1 values where element i is the number of 1-bits of i. ${c('countBits(5)')} = [0, 1, 1, 2, 1, 2]. Do not use ${c('Integer.bitCount')} or ${c('Long.bitCount')}.</p>
<p>Dropping the lowest bit (${c('i >> 1')}) gives a smaller number whose answer is already in the table: ${c('dp[i] = dp[i >> 1] + (i & 1)')}. (Equally good: ${c('dp[i] = dp[i & (i − 1)] + 1')}.) One pass, O(n).</p>`,
    vi: `<p>Hoàn thiện ${c('countBits(n)')}: mảng n + 1 giá trị, phần tử i là số bit 1 của i. ${c('countBits(5)')} = [0, 1, 1, 2, 1, 2]. Không dùng ${c('Integer.bitCount')} hay ${c('Long.bitCount')}.</p>
<p>Bỏ bit thấp nhất (${c('i >> 1')}) cho một số nhỏ hơn mà đáp án đã có trong bảng: ${c('dp[i] = dp[i >> 1] + (i & 1)')}. (Cũng tốt: ${c('dp[i] = dp[i & (i − 1)] + 1')}.) Một lượt, O(n).</p>`,
  },
  quyTac: [{ id: 'R1', en: 'no bitCount and no string conversion in Bits', vi: 'không dùng bitCount và không đổi sang xâu trong Bits', re: String.raw`bitCount|toBinaryString|toString\s*\([^)]*,`, file: 'Bits' }],
  dauVao: { en: 'RUN n · RANDOM (n = 0..5000 vs Integer.bitCount).', vi: 'RUN n · RANDOM (n = 0..5000 so với Integer.bitCount).' },
  them: '',
  lenh: `                if (p[0].equals("RUN")) {
                    r = str(Bits.countBits(n(1)));
                } else {
                    String sai = null;
                    int[] all = Bits.countBits(1 << 20);
                    if (all.length != (1 << 20) + 1) {
                        sai = "countBits(2^20) has length " + all.length;
                    }
                    for (int i = 0; i < all.length && sai == null; i++) {
                        if (all[i] != Integer.bitCount(i)) {
                            sai = "countBits(2^20)[" + i + "] = " + all[i] + ", expected " + Integer.bitCount(i);
                        }
                    }
                    r = ketQua("every i = 0..2^20", (1 << 20) + 1, sai);
                }`,
  tep: {
    'Bits.java': j`
public class Bits {

    public static int[] countBits(int n) {
        //>> return new int[n + 1]; // TODO
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            dp[i] = dp[i >> 1] + (i & 1); // drop the lowest bit, reuse that answer
        }
        return dp;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 0\nRUN 5\nRUN 15\nRUN 16\n' },
    { ten: { en: 'every i up to 2²⁰', vi: 'mọi i tới 2²⁰' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'i >> 1 is i with its lowest bit removed; i & 1 is that bit.', vi: 'i >> 1 là i đã bỏ bit thấp nhất; i & 1 chính là bit đó.' },
    { en: 'dp[0] = 0 is already there: a new int[] starts at zero.', vi: 'dp[0] = 0 có sẵn: int[] mới khởi tạo bằng 0.' },
  ],
  loiHayGap: [
    { en: 'Counting the bits of every i with a loop — correct, O(n log n), and misses the point.', vi: 'Đếm bit của từng i bằng vòng lặp — đúng, O(n log n), và bỏ lỡ ý chính.' },
    { en: 'An array of size n instead of n + 1.', vi: 'Mảng cỡ n thay vì n + 1.' },
  ],
  giaiThich: { en: '<p>Each answer depends on one smaller answer, so a single left-to-right pass fills the table: O(n). It is dynamic programming on the binary representation.</p>', vi: '<p>Mỗi đáp án phụ thuộc một đáp án nhỏ hơn, nên một lượt từ trái sang điền đủ bảng: O(n). Đó là quy hoạch động trên biểu diễn nhị phân.</p>' },
});

const de6 = deCs({
  id: 'csd201-cs9-reverse-bits',
  tieuDe: { en: 'Reverse the 32 bits of an int — shifts and the unsigned >>>', vi: 'Đảo 32 bit của một int — phép dịch và >>> không dấu' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['result = (result << 1) | (n & 1)', 'n >>>= 1 (unsigned)', 'exactly 32 iterations'],
  moTa: {
    en: `<p>Complete ${c('static int reverseBits(int n)')}: the int whose bit i equals bit 31 − i of n (all 32 bits, leading zeros included). Example ${c('00000010100101000001111010011100')} (43261596) → ${c('00111001011110000010100101000000')} (964176192); 1 → −2147483648.</p>
<p>32 times: shift the result left and put the lowest bit of n in, then shift n right with the <b>unsigned</b> ${c('>>>')}. Do not use ${c('Integer.reverse')} or strings.</p>`,
    vi: `<p>Hoàn thiện ${c('reverseBits(n)')}: số int có bit i bằng bit 31 − i của n (đủ 32 bit, kể cả các số 0 đứng đầu). Ví dụ ${c('00000010100101000001111010011100')} (43261596) → ${c('00111001011110000010100101000000')} (964176192); 1 → −2147483648.</p>
<p>32 lần: dịch kết quả sang trái và đưa bit thấp nhất của n vào, rồi dịch n sang phải bằng phép <b>không dấu</b> ${c('>>>')}. Không dùng ${c('Integer.reverse')} hay xâu.</p>`,
  },
  quyTac: [{ id: 'R1', en: 'no Integer.reverse / Long.reverse and no strings in Reverse', vi: 'không Integer.reverse / Long.reverse và không dùng xâu trong Reverse', re: String.raw`\.reverse\s*\(|toBinaryString|String|StringBuilder|parseInt|parseLong`, file: 'Reverse' }],
  dauVao: { en: 'RUN n · RANDOM (100,000 ints vs Integer.reverse).', vi: 'RUN n · RANDOM (100.000 số so với Integer.reverse).' },
  them: '',
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Reverse.reverseBits(n(1)));
                } else {
                    Random rnd = new Random(141);
                    String sai = null;
                    int[] ext = {0, 1, -1, Integer.MIN_VALUE, Integer.MAX_VALUE};
                    for (int t = 0; t < 100000 && sai == null; t++) {
                        int x = t < ext.length ? ext[t] : rnd.nextInt();
                        int got = Reverse.reverseBits(x), want = Integer.reverse(x);
                        if (got != want) {
                            sai = x + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("100,000 ints (0, -1, MIN, MAX too)", 100000, sai);
                }`,
  tep: {
    'Reverse.java': j`
public class Reverse {

    public static int reverseBits(int n) {
        //>> return n; // TODO
        int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1); // push the lowest bit of n into result
            n >>>= 1; // unsigned shift: no sign bit copied in
        }
        return result;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 43261596\nRUN 1\nRUN 0\nRUN -1\nRUN -2147483648\nRUN -3\n' },
    { ten: { en: '100,000 random ints', vi: '100.000 số ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'Always loop exactly 32 times — stopping when n becomes 0 drops the trailing zeros of the result.', vi: 'Luôn lặp đúng 32 lần — dừng khi n về 0 làm mất các số 0 cuối của kết quả.' },
    { en: 'With >>> the loop also works for negative n; with >> the sign bit is copied in forever.', vi: 'Với >>> vòng lặp chạy đúng cả với n âm; với >> bit dấu bị chép vào mãi mãi.' },
  ],
  loiHayGap: [
    { en: 'n >>= 1 — harmless here because exactly 32 bits are read, but a "while (n != 0)" loop never ends for negative n.', vi: 'n >>= 1 — ở đây vô hại vì đọc đúng 32 bit, nhưng vòng "while (n != 0)" không bao giờ dừng với n âm.' },
    { en: 'Building the result with + instead of | — fine, but shifting before or after the add in the wrong order loses a bit.', vi: 'Ghép kết quả bằng + thay vì | — vẫn được, nhưng dịch trước/sau sai thứ tự làm mất một bit.' },
  ],
  giaiThich: { en: '<p>32 shift-and-or steps, O(1). Library code (Integer.reverse) swaps groups of bits in 5 rounds — 16-bit halves, bytes, nibbles, pairs, single bits — the same divide-and-conquer idea applied to a word.</p>', vi: '<p>32 bước dịch-và-hoặc, O(1). Mã thư viện (Integer.reverse) đổi chỗ từng nhóm bit trong 5 vòng — nửa 16 bit, byte, nibble, cặp, bit đơn — cùng ý chia để trị áp lên một từ máy.</p>' },
});

export default moDun({ slug: 'csd201-cs9-on', ten: '10.9 ⭐ CS.9 Hashing, strings and bits — interview problems', de: [de1, de2, de3, de4, de5, de6] });
