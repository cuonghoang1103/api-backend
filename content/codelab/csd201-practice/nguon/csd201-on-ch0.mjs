/** CSD201 · 0.5 — Thực hành Mục 0: tổng tiền tố, tìm trùng O(n), mảng co giãn gấp đôi, CarShop f1–f4 (từ gen/java/ch0 Pe4–Pe7). */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'csd201-0-5-prefix-sums',
  tieuDe: { en: 'Prefix sums: answer 200,000 range-sum queries', vi: 'Tổng tiền tố: trả lời 200.000 truy vấn tổng đoạn' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['prefix sums', 'O(n) preprocessing, O(1) per query', 'long overflow'],
  moTa: {
    en: `<p>Complete ${c('RangeSum')}: the constructor ${c('RangeSum(int[] a)')} prepares the array once, then ${c('long sum(int l, int r)')} returns ${c('a[l] + a[l+1] + … + a[r]')} (0 ≤ l ≤ r &lt; n). Store the prefix sums ${c('p[i] = a[0] + … + a[i]')} in a ${c('long[]')} so that every query is one subtraction.</p>
<p>The values reach ±10⁹, so the sums need ${c('long')}.</p>`,
    vi: `<p>Hoàn thiện ${c('RangeSum')}: constructor ${c('RangeSum(int[] a)')} chuẩn bị mảng một lần, rồi ${c('long sum(int l, int r)')} trả về ${c('a[l] + a[l+1] + … + a[r]')} (0 ≤ l ≤ r &lt; n). Lưu tổng tiền tố ${c('p[i] = a[0] + … + a[i]')} trong ${c('long[]')} để mỗi truy vấn chỉ là một phép trừ.</p>
<p>Giá trị tới ±10⁹ nên tổng phải là ${c('long')}.</p>`,
  },
  yeuCau: { en: ['O(n) in the constructor, O(1) per query.', 'Do not keep a reference to the caller’s array and re-add it in sum().'], vi: ['O(n) trong constructor, O(1) mỗi truy vấn.', 'Không giữ mảng của người gọi rồi cộng lại trong sum().'] },
  dauVao: { en: 'First line: the array. Then "l r" queries; PERF runs the big test.', vi: 'Dòng đầu: mảng. Sau đó các truy vấn "l r"; PERF chạy phép thử lớn.' },
  dauRa: { en: 'One sum per query.', vi: 'Mỗi truy vấn một tổng.' },
  main: 'KiemTra',
  hen: { n: '200,000 elements and 200,000 queries', ms: 3000, can: 'O(1) per query', cham: 'O(n) per query', en: 'Adding the range again for each query costs about 2·10¹⁰ additions.', vi: 'Cộng lại cả đoạn cho mỗi truy vấn tốn khoảng 2·10¹⁰ phép cộng.' },
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String first = sc.nextLine().trim();
        if (first.equals("PERF")) {
            final int n = 200000;
            final int[] a = Kiem.ngauNhien(n, 2000000001, 11);
            for (int i = 0; i < n; i++) {
                a[i] -= 1000000000;
            }
            final long[] total = new long[1];
            System.out.println(Kiem.hen("n = 200,000, 200,000 queries", 3000, new Runnable() {
                public void run() {
                    RangeSum rs = new RangeSum(a);
                    int[] l = Kiem.ngauNhien(n, n / 2, 3);
                    for (int q = 0; q < n; q++) {
                        total[0] += rs.sum(l[q], l[q] + n / 2 - 1);
                    }
                }
            }));
            System.out.println("checksum " + total[0]);
            return;
        }
        String[] p = first.split("\\s+");
        int[] a = new int[p.length];
        for (int i = 0; i < p.length; i++) {
            a[i] = Integer.parseInt(p[i]);
        }
        RangeSum rs = new RangeSum(a);
        a[0] = 999; // the caller changes its array afterwards: your sums must not change
        while (sc.hasNextLine()) {
            String[] q = sc.nextLine().trim().split("\\s+");
            int l = Integer.parseInt(q[0]);
            int r = Integer.parseInt(q[1]);
            System.out.println("sum(" + l + ".." + r + ") = " + rs.sum(l, r));
        }
    }
}
`,
  },
  tep: {
    'RangeSum.java': j`
public class RangeSum {
    //>> // TODO: fields
    private final long[] p; // p[i] = a[0] + ... + a[i]
    //<<

    public RangeSum(int[] a) {
        //>> // TODO: build the prefix sums in one pass
        p = new long[a.length];
        long s = 0;
        for (int i = 0; i < a.length; i++) {
            s += a[i];
            p[i] = s;
        }
        //<<
    }

    // a[l] + ... + a[r]
    public long sum(int l, int r) {
        //>> return 0; // TODO: O(1)
        return l == 0 ? p[r] : p[r] - p[l - 1];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s array 3 1 4 1 5 9 2 6', vi: 'mảng của bài 3 1 4 1 5 9 2 6' }, vao: '3 1 4 1 5 9 2 6\n2 5\n0 7\n0 0\n7 7\n3 4\n' },
    { ten: { en: 'big values need long; negative values', vi: 'giá trị lớn cần long; giá trị âm' }, vao: '1000000000 1000000000 1000000000 -5 -1000000000\n0 2\n0 4\n3 4\n1 3\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'sum(l, r) = p[r] - p[l-1]: everything up to r, minus everything before l. l = 0 has nothing before it.', vi: 'sum(l, r) = p[r] - p[l-1]: tất cả tới r trừ tất cả trước l. l = 0 thì không có gì đứng trước.' },
    { en: 'Build p with a running total: s += a[i]; p[i] = s; — one pass, n additions.', vi: 'Dựng p bằng tổng chạy: s += a[i]; p[i] = s; — một lượt, n phép cộng.' },
  ],
  loiHayGap: [
    { en: 'int prefix sums — three values of 10⁹ already overflow an int.', vi: 'Tổng tiền tố kiểu int — ba giá trị 10⁹ đã tràn int.' },
    { en: 'p[r] - p[l] — that drops a[l]; the range must include both ends.', vi: 'p[r] - p[l] — làm mất a[l]; đoạn phải gồm cả hai đầu.' },
    { en: 'Keeping the caller’s array and looping from l to r in sum(): correct, but O(n) per query — and wrong once the caller changes the array.', vi: 'Giữ mảng của người gọi rồi lặp l..r trong sum(): đúng nhưng O(n) mỗi truy vấn — và sai khi người gọi sửa mảng.' },
  ],
  giaiThich: { en: '<p>n − 1 additions build every prefix sum once; afterwards each query is one subtraction. Total O(n + q) instead of O(n·q): for n = q = 200,000 that is 4·10⁵ operations against 2·10¹⁰.</p>', vi: '<p>n − 1 phép cộng dựng mọi tổng tiền tố một lần; sau đó mỗi truy vấn là một phép trừ. Tổng O(n + q) thay vì O(n·q): với n = q = 200.000 là 4·10⁵ phép tính so với 2·10¹⁰.</p>' },
});

const de2 = deJava({
  id: 'csd201-0-5-duplicates',
  tieuDe: { en: 'Find a duplicate in O(n): from all pairs to a HashSet', vi: 'Tìm phần tử trùng trong O(n): từ so mọi cặp tới HashSet' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['O(n²) vs O(n log n) vs O(n)', 'HashSet.add returns false', 'Integer equals vs =='],
  moTa: {
    en: `<p>The starter ${c('Dup.firstRepeated(int[] a)')} compares every pair — correct, but O(n²). Rewrite it in O(n) on average with a ${c('HashSet<Integer>')}: return the first value whose <b>second occurrence</b> comes earliest when scanning left to right, or ${c('null')} when all values are different.</p>
<p>Example: ${c('{5, 1, 3, 1, 5}')} → 1 (index 3 is the earliest repeat; 5 repeats only at index 4).</p>`,
    vi: `<p>Hàm khởi đầu ${c('Dup.firstRepeated(int[] a)')} so mọi cặp — đúng nhưng O(n²). Viết lại trong O(n) trung bình bằng ${c('HashSet<Integer>')}: trả về giá trị có <b>lần xuất hiện thứ hai</b> sớm nhất khi quét trái sang phải, hoặc ${c('null')} khi mọi giá trị khác nhau.</p>
<p>Ví dụ: ${c('{5, 1, 3, 1, 5}')} → 1 (chỉ số 3 là lần lặp sớm nhất; 5 lặp ở chỉ số 4).</p>`,
  },
  yeuCau: { en: ['One left-to-right pass with a HashSet.', 'Return an Integer (null when there is no duplicate).'], vi: ['Một lượt quét trái sang phải với HashSet.', 'Trả về Integer (null khi không trùng).'] },
  dauVao: { en: 'One array per line ("-" = empty array); PERF runs the big test.', vi: 'Mỗi dòng một mảng ("-" = mảng rỗng); PERF chạy phép thử lớn.' },
  dauRa: { en: 'The first repeated value or null.', vi: 'Giá trị lặp đầu tiên hoặc null.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 different values', ms: 3000, can: 'O(n)', cham: 'O(n²)', en: 'All pairs of a million values are 5·10¹¹ comparisons.', vi: 'Mọi cặp của một triệu giá trị là 5·10¹¹ phép so sánh.' },
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.equals("PERF")) {
                final int n = 1000000;
                final int[] a = new int[n];
                for (int i = 0; i < n; i++) {
                    a[i] = (int) ((i * 7919L) % 1000003L); // a million different values, not sorted
                }
                final Object[] r = new Object[2];
                System.out.println(Kiem.hen("n = 1,000,000 without duplicate, then with one at the end", 3000, new Runnable() {
                    public void run() {
                        r[0] = Dup.firstRepeated(a);
                        int[] b = java.util.Arrays.copyOf(a, n + 1);
                        b[n] = a[n / 2];
                        r[1] = Dup.firstRepeated(b);
                    }
                }));
                System.out.println("results " + r[0] + " " + r[1]);
                continue;
            }
            int[] a = new int[0];
            if (!line.equals("-")) {
                String[] p = line.split("\\s+");
                a = new int[p.length];
                for (int i = 0; i < p.length; i++) {
                    a[i] = Integer.parseInt(p[i]);
                }
            }
            System.out.println(line + " -> " + Dup.firstRepeated(a));
        }
    }
}
`,
  },
  tep: {
    'Dup.java': j`
import java.util.HashSet;
import java.util.Set;

public class Dup {
    // The value whose second occurrence comes first (left to right), or null.
    static Integer firstRepeated(int[] a) {
        //>> for (int j = 0; j < a.length; j++) { // TODO: O(n^2) — rewrite with a HashSet ⏎     for (int i = 0; i < j; i++) { ⏎         if (a[i] == a[j]) { ⏎             return a[j]; ⏎         } ⏎     } ⏎ } ⏎ return null;
        Set<Integer> seen = new HashSet<>();
        for (int x : a) {
            if (!seen.add(x)) {
                return x; // add() is false: x was already there
            }
        }
        return null;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the earliest second occurrence wins', vi: 'lần xuất hiện thứ hai sớm nhất thắng' }, vao: '5 1 3 1 5\n1 2 3 2\n5 4 3\n7\n-\n' },
    { ten: { en: 'big equal values (Integer cache trap), negatives', vi: 'giá trị lớn bằng nhau (bẫy Integer cache), số âm' }, vao: '1000 2000 1000\n-1 -2 -3 -2 -1\n0 0\n2147483647 -2147483648 2147483647\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Walk the array once; before keeping a value, ask whether you have seen it.', vi: 'Duyệt mảng một lần; trước khi ghi nhớ một giá trị, hỏi xem đã gặp nó chưa.' },
    { en: 'HashSet.add(x) returns false when x is already in the set — that single call both tests and remembers.', vi: 'HashSet.add(x) trả về false khi x đã có trong tập — một lời gọi vừa kiểm vừa ghi nhớ.' },
  ],
  loiHayGap: [
    { en: 'Sorting first — the order of the original array is lost, so "first repeated" becomes "smallest repeated".', vi: 'Sắp xếp trước — mất thứ tự mảng gốc, nên "lặp đầu tiên" thành "lặp nhỏ nhất".' },
    { en: 'Comparing two Integer objects with == — true for -128..127 only, so 1000 and 1000 look different.', vi: 'So hai đối tượng Integer bằng == — chỉ đúng trong -128..127, nên 1000 và 1000 trông như khác nhau.' },
  ],
  giaiThich: { en: '<p>Each HashSet operation costs O(1) on average (hash, then look in one bucket), so one pass is O(n). The pairs version is n(n−1)/2 comparisons in the worst case (no duplicate): about 5·10¹¹ for a million values.</p>', vi: '<p>Mỗi thao tác HashSet tốn O(1) trung bình (băm rồi xem một ô), nên một lượt là O(n). Bản so cặp tốn n(n−1)/2 phép so sánh ở trường hợp xấu nhất (không trùng): khoảng 5·10¹¹ với một triệu giá trị.</p>' },
});

const de3 = deJava({
  id: 'csd201-0-5-flex-array',
  tieuDe: { en: 'A flexible array that doubles: amortized O(1) append', vi: 'Mảng co giãn gấp đôi: thêm cuối O(1) khấu hao' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['dynamic array', 'growth policy N+k vs 2N', 'amortized analysis', 'capacity vs size'],
  moTa: {
    en: `<p>${c('FlexArray')} keeps its elements in ${c('int[] a')} (capacity ${c('a.length')}, starting at 1) and the count in ${c('size')}. Complete:</p>
<ul><li>${c('void add(int x)')} — when the array is full, allocate a new one of <b>twice</b> the capacity, copy the elements (add 1 to ${c('copies')} for each element copied), then store ${c('x')};</li>
<li>${c('int get(int i)')} — the element at index i; an index outside ${c('0..size-1')} throws ${c('IndexOutOfBoundsException')} with the message ${c('"index i, size n"')}.</li></ul>
<p>The grader reads ${c('a.length')}, ${c('size')} and ${c('copies')} through reflection after the additions: for 1,000 additions the capacity must be 1,024 and copies 1 + 2 + … + 512 = 1,023.</p>`,
    vi: `<p>${c('FlexArray')} giữ phần tử trong ${c('int[] a')} (sức chứa ${c('a.length')}, bắt đầu bằng 1) và số phần tử trong ${c('size')}. Hoàn thiện: ${c('void add(int x)')} — khi đầy, cấp mảng mới sức chứa <b>gấp đôi</b>, chép phần tử sang (cộng 1 vào ${c('copies')} cho mỗi phần tử được chép), rồi ghi ${c('x')}; ${c('int get(int i)')} — phần tử ở chỉ số i; chỉ số ngoài ${c('0..size-1')} ném ${c('IndexOutOfBoundsException')} với thông điệp ${c('"index i, size n"')}.</p>
<p>Máy chấm đọc ${c('a.length')}, ${c('size')} và ${c('copies')} bằng reflection sau các lần thêm: 1.000 lần thêm thì sức chứa phải là 1.024 và copies = 1 + 2 + … + 512 = 1.023.</p>`,
  },
  yeuCau: { en: ['Grow by doubling (not by a constant) and copy with a loop (count each copied element).', 'Keep the field names a, size, copies — the grader reads them.'], vi: ['Nới bằng cách gấp đôi (không cộng hằng số) và chép bằng vòng lặp (đếm từng phần tử được chép).', 'Giữ tên trường a, size, copies — máy chấm đọc chúng.'] },
  dauVao: { en: 'Commands: ADD m (append 0..m-1), GET i, STATE, PERF.', vi: 'Lệnh: ADD m (thêm 0..m-1), GET i, STATE, PERF.' },
  dauRa: { en: 'Results and the internal state (capacity, size, copies).', vi: 'Kết quả và trạng thái bên trong (sức chứa, size, copies).' },
  main: 'KiemTra',
  hen: { n: '2,000,000 appends', ms: 3000, can: 'O(1) amortized per append', cham: 'O(n) per append (grow by a constant)', en: 'Growing by +1 or +10 copies about n²/2k elements — 10¹¹ copies here.', vi: 'Nới +1 hay +10 chép khoảng n²/2k phần tử — ở đây 10¹¹ lần chép.' },
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit): reads the real fields of your FlexArray by reflection.
public class KiemTra {
    static String state(FlexArray f) {
        int[] a = (int[]) Kiem.lay(f, "a");
        return "capacity " + (a == null ? "null" : String.valueOf(a.length)) + ", size " + Kiem.lay(f, "size") + ", copies " + Kiem.lay(f, "copies");
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        FlexArray f = new FlexArray();
        int next = 0;
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            if (p[0].equals("ADD")) {
                int m = Integer.parseInt(p[1]);
                for (int i = 0; i < m; i++) {
                    f.add(next++ * 3);
                }
                System.out.println("ADD " + m + " -> " + state(f));
            } else if (p[0].equals("GET")) {
                try {
                    System.out.println("GET " + p[1] + " -> " + f.get(Integer.parseInt(p[1])));
                } catch (IndexOutOfBoundsException e) {
                    System.out.println("GET " + p[1] + " -> " + Kiem.ten(e));
                }
            } else if (p[0].equals("STATE")) {
                System.out.println(state(f));
            } else {
                final FlexArray g = new FlexArray();
                System.out.println(Kiem.hen("2,000,000 appends", 3000, new Runnable() {
                    public void run() {
                        for (int i = 0; i < 2000000; i++) {
                            g.add(i);
                        }
                    }
                }));
                System.out.println(state(g) + ", last " + g.get(1999999));
            }
        }
    }
}
`,
  },
  tep: {
    'FlexArray.java': j`
public class FlexArray {
    private int[] a = new int[1];
    private int size = 0;
    private long copies = 0; // elements copied by all the resizes

    public void add(int x) {
        //>> // TODO: grow (double) when full, counting copies; then store x
        if (size == a.length) {
            int[] b = new int[2 * a.length];
            for (int i = 0; i < size; i++) {
                b[i] = a[i];
                copies++;
            }
            a = b;
        }
        a[size++] = x;
        //<<
    }

    public int get(int i) {
        //>> return 0; // TODO: check the index
        if (i < 0 || i >= size) {
            throw new IndexOutOfBoundsException("index " + i + ", size " + size);
        }
        return a[i];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the growth steps 1, 2, 4, 8 and 1,000 additions', vi: 'các bước nới 1, 2, 4, 8 và 1.000 lần thêm' }, vao: 'STATE\nADD 1\nADD 1\nADD 1\nADD 5\nGET 0\nGET 7\nGET 8\nGET -1\nADD 992\nGET 999\n' },
    { ten: { en: 'exactly full, then one more', vi: 'vừa đầy, rồi thêm một' }, vao: 'ADD 16\nSTATE\nADD 1\nGET 16\nGET 17\nADD 1007\nSTATE\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The array is full exactly when size == a.length. Then: new array of 2 * a.length, copy size elements, swap the reference.', vi: 'Mảng đầy đúng khi size == a.length. Khi đó: mảng mới 2 * a.length, chép size phần tử, đổi tham chiếu.' },
    { en: 'Doubling copies 1 + 2 + 4 + … + N/2 < N elements for N additions — less than one copy per addition on average.', vi: 'Gấp đôi chép 1 + 2 + 4 + … + N/2 < N phần tử cho N lần thêm — trung bình chưa tới một lần chép mỗi lần thêm.' },
  ],
  loiHayGap: [
    { en: 'Growing by a constant (a.length + 10): correct output, but the total copying is quadratic — the complexity check fails.', vi: 'Nới thêm hằng số (a.length + 10): output đúng nhưng tổng số lần chép là bậc hai — trượt kiểm độ phức tạp.' },
    { en: 'Checking i >= a.length in get(): the slots between size and the capacity hold leftovers, not elements.', vi: 'Kiểm i >= a.length trong get(): các ô giữa size và sức chứa là rác, không phải phần tử.' },
    { en: 'Using Arrays.copyOf and forgetting to count copies — the counter is part of the answer.', vi: 'Dùng Arrays.copyOf rồi quên đếm copies — bộ đếm là một phần đáp án.' },
  ],
  giaiThich: { en: '<p>With doubling, the copies of N additions add up to 1 + 2 + … + N/2 < N, so N additions cost less than 3N writes in total: amortized O(1) each. With a constant growth k, the copies are k + 2k + 3k + … ≈ N²/2k — O(N) per addition. java.util.ArrayList grows by 1.5×, which has the same amortized O(1).</p>', vi: '<p>Gấp đôi thì tổng số lần chép của N lần thêm là 1 + 2 + … + N/2 < N, nên N lần thêm tốn dưới 3N lần ghi: khấu hao O(1) mỗi lần. Nới thêm hằng k thì số lần chép là k + 2k + 3k + … ≈ N²/2k — O(N) mỗi lần thêm. java.util.ArrayList nới 1,5 lần, cũng khấu hao O(1).</p>' },
});

const CAR = j`
// GIVEN — do not change.
public class Car {
    String owner;
    int price;

    Car(String owner, int price) {
        this.owner = owner;
        this.price = price;
    }

    @Override
    public String toString() {
        return "(" + owner + "," + price + ")";
    }
}
`;

const de4 = deJava({
  id: 'csd201-0-5-car-shop',
  tieuDe: { en: 'CarList f1–f4 on an array: max, range count, stable sort, binary search', vi: 'CarList f1–f4 trên mảng: max, đếm theo khoảng, sắp ổn định, tìm nhị phân' },
  doKho: 'MEDIUM', phut: 30, dangBai: 'pe',
  khaiNiem: ['Collection ADT on an array', 'first maximum', 'stable insertion sort', 'binary search on a sorted list'],
  moTa: {
    en: `<p>The PE shape on the simplest structure: ${c('CarList')} keeps ${c('Car(owner, price)')} objects in ${c('Car[] a')} with a counter ${c('n')} (${c('addLast')} and ${c('traverse')} are given). Write:</p>
<ul><li>${c('Car f1MaxPrice()')} — the <b>first</b> car with the highest price; ${c('null')} when empty;</li>
<li>${c('int f2CountInRange(int lo, int hi)')} — cars with ${c('lo ≤ price ≤ hi')};</li>
<li>${c('void f3SortByPrice()')} — ascending by price, <b>stable</b> (cars with equal prices keep their order), insertion sort in place;</li>
<li>${c('int f4FindPrice(int price)')} — binary search on the sorted list: the index of <b>a</b> car with that price, or −1. Call it only after f3.</li></ul>`,
    vi: `<p>Dạng PE trên cấu trúc đơn giản nhất: ${c('CarList')} giữ các ${c('Car(owner, price)')} trong ${c('Car[] a')} với bộ đếm ${c('n')} (${c('addLast')}, ${c('traverse')} cho sẵn). Viết: ${c('f1MaxPrice()')} — xe <b>đầu tiên</b> có giá cao nhất, rỗng thì ${c('null')}; ${c('f2CountInRange(lo, hi)')} — số xe có ${c('lo ≤ price ≤ hi')}; ${c('f3SortByPrice()')} — tăng dần theo giá, <b>ổn định</b> (xe cùng giá giữ thứ tự), sắp chèn tại chỗ; ${c('f4FindPrice(price)')} — tìm nhị phân trên danh sách đã sắp: chỉ số của <b>một</b> xe có giá đó hoặc −1 (chỉ gọi sau f3).</p>`,
  },
  yeuCau: { en: ['Work on the array a[0..n-1] only — no java.util collections, no Arrays.sort.', 'Car.java is given.'], vi: ['Chỉ làm trên mảng a[0..n-1] — không collection của java.util, không Arrays.sort.', 'Car.java cho sẵn.'] },
  dauVao: { en: 'Commands: ADD owner price · F1 · F2 lo hi · F3 · F4 price · PRINT.', vi: 'Lệnh: ADD chủ giá · F1 · F2 lo hi · F3 · F4 giá · PRINT.' },
  dauRa: { en: 'The result of every command.', vi: 'Kết quả từng lệnh.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no Arrays.sort / Collections / ArrayList in CarList', vi: 'không Arrays.sort / Collections / ArrayList trong CarList', re: String.raw`\b(Arrays\s*\.\s*sort|Collections|ArrayList|LinkedList)\b`, file: 'CarList' }],
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        CarList t = new CarList();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            String cmd = p[0];
            if (cmd.equals("ADD")) {
                t.addLast(p[1], Integer.parseInt(p[2]));
                continue;
            }
            String r;
            if (cmd.equals("F1")) {
                Car x = t.f1MaxPrice();
                r = x == null ? "null" : x + " (same object as slot " + indexOf(t, x) + ")";
            } else if (cmd.equals("F2")) {
                r = String.valueOf(t.f2CountInRange(Integer.parseInt(p[1]), Integer.parseInt(p[2])));
            } else if (cmd.equals("F3")) {
                t.f3SortByPrice();
                r = t.traverse();
            } else if (cmd.equals("F4")) {
                int i = t.f4FindPrice(Integer.parseInt(p[1]));
                Car[] a = (Car[]) Kiem.lay(t, "a");
                r = i < 0 ? "-1" : "a car with price " + a[i].price;
            } else {
                r = t.traverse();
            }
            System.out.println(String.join(" ", p) + " -> " + r);
        }
    }

    static int indexOf(CarList t, Car x) {
        Car[] a = (Car[]) Kiem.lay(t, "a");
        for (int i = 0; i < a.length; i++) {
            if (a[i] == x) {
                return i;
            }
        }
        return -1;
    }
}
`,
  },
  tep: {
    'Car.java': CAR,
    'CarList.java': j`
import java.util.Arrays;

public class CarList {
    Car[] a = new Car[2];
    int n = 0;

    void addLast(String owner, int price) {
        if (n == a.length) {
            a = Arrays.copyOf(a, 2 * a.length);
        }
        a[n++] = new Car(owner, price);
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i < n; i++) {
            s.append(a[i]).append(' ');
        }
        return s.toString().trim();
    }

    // f1: the FIRST car with the highest price, null when empty
    Car f1MaxPrice() {
        //>> return null; // TODO
        if (n == 0) {
            return null;
        }
        Car best = a[0];
        for (int i = 1; i < n; i++) {
            if (a[i].price > best.price) {
                best = a[i];
            }
        }
        return best;
        //<<
    }

    // f2: number of cars with lo <= price <= hi
    int f2CountInRange(int lo, int hi) {
        //>> return 0; // TODO
        int c = 0;
        for (int i = 0; i < n; i++) {
            if (a[i].price >= lo && a[i].price <= hi) {
                c++;
            }
        }
        return c;
        //<<
    }

    // f3: insertion sort by price, ascending and stable
    void f3SortByPrice() {
        //>> // TODO
        for (int i = 1; i < n; i++) {
            Car x = a[i];
            int j = i - 1;
            while (j >= 0 && a[j].price > x.price) { // > (not >=) keeps equal prices in order
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = x;
        }
        //<<
    }

    // f4: binary search on the sorted list — index of a car with this price, or -1
    int f4FindPrice(int price) {
        //>> return -1; // TODO
        int left = 0;
        int right = n - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (a[mid].price == price) {
                return mid;
            }
            if (price > a[mid].price) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s seven cars', vi: 'bảy xe của bài' }, vao: 'F1\nADD Hoa 25\nADD Nam 12\nADD Lan 40\nADD Minh 18\nADD Tuan 33\nADD An 7\nADD Binh 40\nF1\nF2 12 33\nF2 41 99\nF3\nF4 33\nF4 7\nF4 26\n' },
    { ten: { en: 'equal prices stay in order; one car', vi: 'xe cùng giá giữ thứ tự; một xe' }, vao: 'ADD A 5\nADD B 3\nADD C 5\nADD D 3\nADD E 5\nF1\nF3\nF4 5\nF2 3 3\n', an: true },
    { ten: { en: 'single car, search misses on both sides', vi: 'một xe, tìm trượt cả hai phía' }, vao: 'ADD Solo 10\nF1\nF3\nF4 10\nF4 9\nF4 11\nF2 10 10\n', an: true },
  ],
  goiY: [
    { en: 'f1: keep the best so far and replace it only on a strictly higher price — that keeps the first maximum.', vi: 'f1: giữ xe tốt nhất tới giờ và chỉ thay khi giá cao hơn hẳn — như thế giữ được max đầu tiên.' },
    { en: 'f3: take a[i] out, shift every bigger car one slot right, drop it into the gap. Shift only on >, never on >=.', vi: 'f3: lấy a[i] ra, dời mọi xe lớn hơn sang phải một ô, thả vào chỗ trống. Chỉ dời khi >, không bao giờ khi >=.' },
  ],
  loiHayGap: [
    { en: 'f1 with >= — the LAST car with the highest price is returned.', vi: 'f1 dùng >= — trả về xe CUỐI có giá cao nhất.' },
    { en: 'Looping to a.length instead of n — the empty slots are null and throw NullPointerException.', vi: 'Lặp tới a.length thay vì n — các ô trống là null và ném NullPointerException.' },
    { en: 'An unstable sort (selection sort with swaps) — equal prices change order and the PRINT after F3 differs.', vi: 'Sắp không ổn định (sắp chọn có hoán đổi) — xe cùng giá đổi thứ tự và PRINT sau F3 khác.' },
  ],
  giaiThich: { en: '<p>f1 and f2 are one pass, O(n). Insertion sort is O(n²) in the worst case but stable because it only moves an element past strictly bigger ones. Binary search is O(log n) and needs the sorted order f3 produced.</p>', vi: '<p>f1 và f2 là một lượt, O(n). Sắp chèn O(n²) ở trường hợp xấu nhất nhưng ổn định vì chỉ đưa phần tử qua những phần tử lớn hơn hẳn. Tìm nhị phân O(log n) và cần thứ tự đã sắp của f3.</p>' },
});

export default moDun({ slug: 'csd201-on-ch0', ten: '0.5 🧪 Practice — complexity in code: prefix sums, duplicates, doubling, a PE-style CarList', de: [de1, de2, de3, de4] });
