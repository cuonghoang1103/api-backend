/** CSD201 · 3.3 — Phân tích đệ quy: đếm lời gọi bằng hệ thức, đếm nghịch thế chia để trị O(n log n), đoạn con tổng lớn nhất chia để trị (kiểm độ phức tạp). */
import { moDun, deJava, deQuy, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-3-3-count-calls',
  tieuDe: { en: 'How many calls does naive fib(n) make? Solve the recurrence, do not run it', vi: 'fib(n) ngây thơ gọi bao nhiêu lần? Giải hệ thức, đừng chạy nó' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['recursion tree', 'counting calls with a recurrence', 'C(n) = C(n−1) + C(n−2) + 1'],
  moTa: {
    en: `<p>The naive ${c('fib(n)')} (if n &lt; 2 return n, else fib(n−1) + fib(n−2)) makes C(n) calls in total, where ${c('C(0) = C(1) = 1')} and ${c('C(n) = C(n−1) + C(n−2) + 1')}. Complete:</p>
<ul><li>${c('static long calls(int n)')} — C(n) for 0 ≤ n ≤ 85, computed from the recurrence bottom-up (a loop or a memo), not by calling fib;</li>
<li>${c('static long callsOf(int n, int k)')} — how many times ${c('fib(k)')} itself is called while computing fib(n) (0 ≤ k ≤ n): 1 for k = n; for k &lt; n it follows a Fibonacci pattern (work it out on the recursion tree of fib(5)).</li></ul>`,
    vi: `<p>Hàm ${c('fib(n)')} ngây thơ (n &lt; 2 trả n, ngược lại fib(n−1) + fib(n−2)) gọi tổng cộng C(n) lần, với ${c('C(0) = C(1) = 1')} và ${c('C(n) = C(n−1) + C(n−2) + 1')}. Hoàn thiện ${c('calls(n)')} — C(n) với 0 ≤ n ≤ 85, tính từ dưới lên theo hệ thức (vòng lặp hoặc bảng nhớ), không gọi fib; và ${c('callsOf(n, k)')} — trong lúc tính fib(n) thì chính ${c('fib(k)')} được gọi bao nhiêu lần (0 ≤ k ≤ n): k = n là 1; k &lt; n theo một quy luật Fibonacci (vẽ cây đệ quy của fib(5) để tìm).</p>`,
  },
  yeuCau: { en: ['No call to a real fib — O(n) arithmetic.', 'Values up to n = 85 fit in a long.'], vi: ['Không gọi fib thật — O(n) phép tính.', 'Giá trị tới n = 85 vừa long.'] },
  dauVao: { en: 'CALLS n · OF n k.', vi: 'CALLS n · OF n k.' },
  dauRa: { en: 'The numbers.', vi: 'Các con số.' },
  main: 'KiemTra',
  hen: { n: '85', ms: 2000, can: 'O(n)', cham: 'running the exponential recursion and counting', en: 'C(85) is about 4·10¹⁷ calls.', vi: 'C(85) khoảng 4·10¹⁷ lời gọi.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                final long[] v = new long[1];
                final boolean of = p[0].equals("OF");
                final int a = n(1);
                final int b = of ? n(2) : 0;
                r = Kiem.hen(line, 2000, new Runnable() {
                    public void run() {
                        v[0] = of ? Calls.callsOf(a, b) : Calls.calls(a);
                    }
                }) + " = " + v[0];`,
    }),
  },
  tep: {
    'Calls.java': j`
public class Calls {

    static long calls(int n) {
        //>> return 0; // TODO: C(0) = C(1) = 1, C(n) = C(n-1) + C(n-2) + 1
        long a = 1; // C(i-2)
        long b = 1; // C(i-1)
        for (int i = 2; i <= n; i++) {
            long c = a + b + 1;
            a = b;
            b = c;
        }
        return b;
        //<<
    }

    static long callsOf(int n, int k) {
        //>> return 0; // TODO
        if (k == n) {
            return 1;
        }
        if (k == 0) {
            return n == 1 ? 0 : fibNum(n - 1); // fib(0) is called once per call of fib(2)
        }
        return fibNum(n - k + 1); // fib(k) is called F(n-k+1) times for 1 <= k <= n
        //<<
    }
    //>> // TODO: helper(s)

    private static long fibNum(int m) {
        long a = 0;
        long b = 1;
        for (int i = 0; i < m; i++) {
            long c = a + b;
            a = b;
            b = c;
        }
        return a;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the recursion tree of fib(5)', vi: 'cây đệ quy của fib(5)' }, vao: 'CALLS 0\nCALLS 1\nCALLS 5\nOF 5 5\nOF 5 4\nOF 5 3\nOF 5 2\nOF 5 1\nOF 5 0\n' },
    { ten: { en: 'big n', vi: 'n lớn' }, vao: 'CALLS 30\nCALLS 85\nOF 85 1\nOF 85 0\nOF 40 20\nOF 2 0\nOF 1 0\n', an: true },
  ],
  goiY: [
    { en: 'Draw fib(5): fib(4) once, fib(3) twice, fib(2) three times, fib(1) five times — Fibonacci numbers again: fib(k) is called F(n−k+1) times for k ≥ 1.', vi: 'Vẽ fib(5): fib(4) một lần, fib(3) hai lần, fib(2) ba lần, fib(1) năm lần — lại là số Fibonacci: fib(k) được gọi F(n−k+1) lần với k ≥ 1.' },
    { en: 'fib(0) is only called from fib(2), once per call of fib(2): so callsOf(n, 0) = callsOf(n, 2) for n ≥ 2.', vi: 'fib(0) chỉ được gọi từ fib(2), mỗi lần gọi fib(2) một lần: nên callsOf(n, 0) = callsOf(n, 2) với n ≥ 2.' },
  ],
  loiHayGap: [
    { en: 'Answering by actually running the naive recursion with a counter — C(85) ≈ 4·10¹⁷ calls never finish.', vi: 'Trả lời bằng cách chạy thật đệ quy ngây thơ có bộ đếm — C(85) ≈ 4·10¹⁷ lời gọi không bao giờ xong.' },
    { en: 'Forgetting the "+ 1" of the call itself — that gives F(n+1) instead of C(n) = 2F(n+1) − 1.', vi: 'Quên "+ 1" của chính lời gọi đó — ra F(n+1) thay vì C(n) = 2F(n+1) − 1.' },
  ],
  giaiThich: { en: '<p>The recurrence C(n) = C(n−1) + C(n−2) + 1 has the solution C(n) = 2F(n+1) − 1, so naive fib makes Θ(φⁿ) calls — the recursion tree analysis of the lesson. fib(k) for k ≥ 1 appears F(n−k+1) times and fib(0) as often as fib(2): the waste memoization removes.</p>', vi: '<p>Hệ thức C(n) = C(n−1) + C(n−2) + 1 có nghiệm C(n) = 2F(n+1) − 1, nên fib ngây thơ gọi Θ(φⁿ) lần — đúng phép phân tích cây đệ quy của bài. fib(k) với k ≥ 1 xuất hiện F(n−k+1) lần và fib(0) nhiều như fib(2): sự lãng phí mà ghi nhớ loại bỏ.</p>' },
});

const de2 = deJava({
  id: 'csd201-3-3-inversions',
  tieuDe: { en: 'Count inversions in O(n log n) — merge sort with a counter', vi: 'Đếm nghịch thế trong O(n log n) — merge sort kèm bộ đếm' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['divide and conquer', 'T(n) = 2T(n/2) + O(n) = O(n log n)', 'counting during the merge'],
  moTa: {
    en: `<p>An inversion is a pair i &lt; j with a[i] &gt; a[j]. Complete ${c('static long inversions(int[] a)')} (a may be changed — sort it on the way). Checking every pair is O(n²); instead sort with merge sort and count during the merge: when an element of the <b>right</b> half is taken before the remaining elements of the left half, it forms an inversion with each of them.</p>
<p>${c('[2,4,1,3,5]')} → 3 ((2,1), (4,1), (4,3)). The master theorem gives T(n) = 2T(n/2) + O(n) = O(n log n).</p>`,
    vi: `<p>Một nghịch thế là cặp i &lt; j với a[i] &gt; a[j]. Hoàn thiện ${c('static long inversions(int[] a)')} (được phép đổi a — sắp nó dọc đường). Kiểm mọi cặp là O(n²); thay vào đó sắp bằng merge sort và đếm trong lúc trộn: khi một phần tử của nửa <b>phải</b> được lấy trước các phần tử còn lại của nửa trái, nó tạo nghịch thế với từng phần tử đó.</p>
<p>${c('[2,4,1,3,5]')} → 3 ((2,1), (4,1), (4,3)). Định lý thợ cho T(n) = 2T(n/2) + O(n) = O(n log n).</p>`,
  },
  yeuCau: { en: ['O(n log n).', 'Equal values are not inversions.'], vi: ['O(n log n).', 'Giá trị bằng nhau không phải nghịch thế.'] },
  dauVao: { en: 'One array per line ("-" = empty); PERF.', vi: 'Mỗi dòng một mảng ("-" = rỗng); PERF.' },
  dauRa: { en: 'The number of inversions.', vi: 'Số nghịch thế.' },
  main: 'KiemTra',
  hen: { n: '1,000,000', ms: 3000, can: 'O(n log n)', cham: 'O(n²)', en: 'Checking all pairs of a million values is 5·10¹¹ comparisons.', vi: 'Kiểm mọi cặp của một triệu giá trị là 5·10¹¹ phép so sánh.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[1000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = a.length - i; // decreasing: n(n-1)/2 inversions
                    }
                    final long[] v = new long[1];
                    r = Kiem.hen("n = 1,000,000 decreasing", 3000, new Runnable() {
                        public void run() {
                            v[0] = Inversions.inversions(a);
                        }
                    }) + ", inversions " + v[0];
                } else {
                    int[] a = line.equals("-") ? new int[0] : new int[p.length];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = n(i);
                    }
                    r = String.valueOf(Inversions.inversions(a));
                }`,
    }),
  },
  tep: {
    'Inversions.java': j`
public class Inversions {

    static long inversions(int[] a) {
        //>> return 0; // TODO: merge sort + count
        return sort(a, new int[a.length], 0, a.length - 1);
        //<<
    }
    //>> // TODO: helper(s)

    // sorts a[lo..hi] and returns the inversions inside it
    private static long sort(int[] a, int[] tmp, int lo, int hi) {
        if (lo >= hi) {
            return 0;
        }
        int mid = (lo + hi) >>> 1;
        long count = sort(a, tmp, lo, mid) + sort(a, tmp, mid + 1, hi);
        int i = lo;
        int j = mid + 1;
        int k = lo;
        while (i <= mid && j <= hi) {
            if (a[i] <= a[j]) {
                tmp[k++] = a[i++];
            } else {
                count += mid - i + 1; // a[j] jumps over every remaining left element
                tmp[k++] = a[j++];
            }
        }
        while (i <= mid) {
            tmp[k++] = a[i++];
        }
        while (j <= hi) {
            tmp[k++] = a[j++];
        }
        System.arraycopy(tmp, lo, a, lo, hi - lo + 1);
        return count;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the example, sorted, reversed', vi: 'ví dụ, đã sắp, sắp ngược' }, vao: '2 4 1 3 5\n1 2 3 4\n4 3 2 1\n7\n-\n' },
    { ten: { en: 'equal values, negatives', vi: 'giá trị bằng nhau, số âm' }, vao: '3 3 3\n3 1 3 1\n-1 -5 0 -5\n5 5 4 4 3 3\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Inversions of a = inversions inside the left half + inside the right half + "cross" inversions between the halves — count the last ones while merging.', vi: 'Nghịch thế của a = nghịch thế trong nửa trái + trong nửa phải + nghịch thế "chéo" giữa hai nửa — đếm loại cuối trong lúc trộn.' },
    { en: 'When a[j] (right half) is smaller than a[i], it is smaller than all of a[i..mid] too: add mid − i + 1.', vi: 'Khi a[j] (nửa phải) nhỏ hơn a[i], nó cũng nhỏ hơn toàn bộ a[i..mid]: cộng mid − i + 1.' },
  ],
  loiHayGap: [
    { en: 'Taking the right element on ties (a[i] >= a[j]) — equal values are counted as inversions.', vi: 'Lấy phần tử bên phải khi bằng nhau (a[i] >= a[j]) — giá trị bằng nhau bị tính là nghịch thế.' },
    { en: 'An int counter — a reversed array of a million has about 5·10¹¹ inversions.', vi: 'Bộ đếm int — mảng ngược một triệu phần tử có khoảng 5·10¹¹ nghịch thế.' },
  ],
  giaiThich: { en: '<p>Each level of the recursion merges n elements and counts cross inversions in the same pass: O(n) per level, log₂ n levels, O(n log n) total — the master theorem with a = b = 2 and f(n) = Θ(n).</p>', vi: '<p>Mỗi tầng đệ quy trộn n phần tử và đếm nghịch thế chéo trong cùng lượt: O(n) mỗi tầng, log₂ n tầng, tổng O(n log n) — định lý thợ với a = b = 2 và f(n) = Θ(n).</p>' },
});

const de3 = deJava({
  id: 'csd201-3-3-max-subarray-dc',
  tieuDe: { en: 'Maximum subarray by divide and conquer (best crossing the middle)', vi: 'Đoạn con tổng lớn nhất bằng chia để trị (tốt nhất cắt qua giữa)' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['divide and conquer', 'the crossing case', 'T(n) = 2T(n/2) + O(n)'],
  moTa: {
    en: `<p>Complete ${c('static long maxSub(int[] a, int lo, int hi)')}: the largest sum of a non-empty contiguous part of ${c('a[lo..hi]')}. Divide at mid; the answer is the best of: the left half, the right half, and the best part <b>crossing</b> mid (the best suffix of the left half ending at mid + the best prefix of the right half starting at mid + 1, each found with one loop).</p>
<p>${c('[-2,1,-3,4,-1,2,1,-5,4]')} → 6 (${c('4,-1,2,1')}); all negative → the largest single element.</p>`,
    vi: `<p>Hoàn thiện ${c('static long maxSub(int[] a, int lo, int hi)')}: tổng lớn nhất của một đoạn liên tiếp khác rỗng trong ${c('a[lo..hi]')}. Chia ở mid; đáp án là lớn nhất trong: nửa trái, nửa phải, và đoạn tốt nhất <b>cắt qua</b> mid (hậu tố tốt nhất của nửa trái kết thúc ở mid + tiền tố tốt nhất của nửa phải bắt đầu ở mid + 1, mỗi cái tìm bằng một vòng lặp).</p>
<p>${c('[-2,1,-3,4,-1,2,1,-5,4]')} → 6 (${c('4,-1,2,1')}); toàn số âm → phần tử lớn nhất.</p>`,
  },
  yeuCau: { en: ['Recursive divide and conquer: O(n log n).', 'Non-empty part; sums in long.'], vi: ['Chia để trị đệ quy: O(n log n).', 'Đoạn khác rỗng; tổng kiểu long.'] },
  dauVao: { en: 'One array per line; PERF.', vi: 'Mỗi dòng một mảng; PERF.' },
  dauRa: { en: 'The maximum sum.', vi: 'Tổng lớn nhất.' },
  main: 'KiemTra',
  quyTac: [deQuy('yes', 'MaxSub', 'maxSub')],
  hen: { n: '1,000,000', ms: 3000, can: 'O(n log n)', cham: 'O(n²) (every start, every end)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = Kiem.ngauNhien(1000000, 2001, 17);
                    for (int i = 0; i < a.length; i++) {
                        a[i] -= 1000;
                    }
                    final long[] v = new long[1];
                    r = Kiem.hen("n = 1,000,000", 3000, new Runnable() {
                        public void run() {
                            v[0] = MaxSub.maxSub(a, 0, a.length - 1);
                        }
                    }) + ", best " + v[0];
                } else {
                    int[] a = new int[p.length];
                    for (int i = 0; i < p.length; i++) {
                        a[i] = n(i);
                    }
                    r = String.valueOf(MaxSub.maxSub(a, 0, a.length - 1));
                }`,
    }),
  },
  tep: {
    'MaxSub.java': j`
public class MaxSub {

    static long maxSub(int[] a, int lo, int hi) {
        //>> return 0; // TODO: left, right, crossing
        if (lo == hi) {
            return a[lo];
        }
        int mid = (lo + hi) >>> 1;
        long best = Math.max(maxSub(a, lo, mid), maxSub(a, mid + 1, hi));
        long sum = 0;
        long left = Long.MIN_VALUE; // best suffix of a[lo..mid] ending at mid
        for (int i = mid; i >= lo; i--) {
            sum += a[i];
            left = Math.max(left, sum);
        }
        sum = 0;
        long right = Long.MIN_VALUE; // best prefix of a[mid+1..hi]
        for (int i = mid + 1; i <= hi; i++) {
            sum += a[i];
            right = Math.max(right, sum);
        }
        return Math.max(best, left + right);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the classic example, all negative, one element', vi: 'ví dụ kinh điển, toàn âm, một phần tử' }, vao: '-2 1 -3 4 -1 2 1 -5 4\n-3 -1 -2\n5\n1 2 3\n' },
    { ten: { en: 'best part at an end, big sums', vi: 'đoạn tốt nhất ở một đầu, tổng lớn' }, vao: '5 -10 1 1\n1 1 -10 5\n2000000000 2000000000 -1\n0 0 0\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The crossing part must contain a[mid] and a[mid+1]: extend left from mid keeping the best running sum, extend right from mid+1 the same way, add the two.', vi: 'Đoạn cắt qua phải chứa a[mid] và a[mid+1]: mở rộng sang trái từ mid giữ tổng chạy tốt nhất, sang phải từ mid+1 tương tự, cộng hai cái lại.' },
    { en: 'Start the best suffix/prefix at Long.MIN_VALUE (not 0): the part must not be empty.', vi: 'Khởi tạo hậu tố/tiền tố tốt nhất bằng Long.MIN_VALUE (không phải 0): đoạn không được rỗng.' },
  ],
  loiHayGap: [
    { en: 'Starting the crossing sums at 0 — for all-negative input the crossing part becomes empty and the answer 0.', vi: 'Khởi tạo tổng cắt qua bằng 0 — với dữ liệu toàn âm, đoạn cắt qua thành rỗng và đáp án là 0.' },
    { en: 'Trying every (start, end) pair — O(n²), the complexity check fails.', vi: 'Thử mọi cặp (đầu, cuối) — O(n²), trượt kiểm độ phức tạp.' },
  ],
  giaiThich: { en: '<p>Two half-size subproblems plus a linear crossing scan: T(n) = 2T(n/2) + Θ(n) = Θ(n log n), and the recursion depth is only log₂ n. (Kadane’s algorithm does it in O(n) — the ⭐ CS.2 lesson — but this is the textbook divide-and-conquer example of the master theorem.)</p>', vi: '<p>Hai bài toán con cỡ một nửa cộng một lượt quét tuyến tính cắt qua giữa: T(n) = 2T(n/2) + Θ(n) = Θ(n log n), và độ sâu đệ quy chỉ log₂ n. (Thuật toán Kadane làm trong O(n) — bài ⭐ CS.2 — nhưng đây là ví dụ chia để trị chuẩn của định lý thợ.)</p>' },
});

export default moDun({ slug: 'csd201-de-quy-phan-tich', ten: '3.3 Analysing recursion: recursion trees & the Master theorem', de: [de1, de2, de3] });
