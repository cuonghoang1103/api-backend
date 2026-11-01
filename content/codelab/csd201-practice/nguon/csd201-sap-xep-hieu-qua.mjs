/** CSD201 · 6.2 — Sắp xếp hiệu quả: Shell sort (kiểm so với chèn O(n²)), sắp đối tượng theo hai khoá bằng Comparator, sắp trước rồi giải: cặp số gần nhau nhất (kiểm O(n log n)). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-6-2-shell-sort',
  tieuDe: { en: 'Shell sort with Knuth’s gaps 1, 4, 13, 40, …', vi: 'Shell sort với dãy bước Knuth 1, 4, 13, 40, …' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['h-sorting', 'insertion sort with a gap', 'gap sequence h = 3h + 1', 'sub-quadratic in practice'],
  moTa: {
    en: `<p>Complete ${c('static void shellSort(int[] a)')}: build the starting gap of Knuth’s sequence ${c('h = 1, 4, 13, 40, 121, …')} exactly as in Sedgewick’s code — ${c('h = 1; while (h < n / 3) h = 3 * h + 1;')} — h-sort the array (an insertion sort where each element moves in steps of h), then ${c('h = h / 3')} until h = 1 has been done. Also return the list of gaps used via ${c('static String gaps(int n)')} (e.g. ${c('"40 13 4 1"')} for n = 100).</p>
<p>The complexity check sorts two million values: plain insertion sort (the last pass alone, h = 1) would be 10¹² moves; with the earlier passes the final insertion sort has very little left to do.</p>`,
    vi: `<p>Hoàn thiện ${c('static void shellSort(int[] a)')}: dựng bước đầu của dãy Knuth ${c('h = 1, 4, 13, 40, 121, …')} đúng như code của Sedgewick — ${c('h = 1; while (h < n / 3) h = 3 * h + 1;')} — h-sort mảng (sắp chèn mà mỗi phần tử dời theo bước h), rồi ${c('h = h / 3')} cho tới khi đã làm h = 1. Trả thêm danh sách bước đã dùng qua ${c('static String gaps(int n)')} (vd ${c('"40 13 4 1"')} với n = 100).</p>
<p>Kiểm độ phức tạp sắp hai triệu giá trị: sắp chèn thuần (riêng lượt cuối h = 1) là 10¹² lần dời; nhờ các lượt trước, lượt chèn cuối gần như không còn việc gì.</p>`,
  },
  yeuCau: { en: ['In place; no library sort (rule R1).', 'Knuth gaps exactly as described.'], vi: ['Tại chỗ; không dùng sort thư viện (luật R1).', 'Đúng dãy bước Knuth như mô tả.'] },
  dauVao: { en: 'SORT values… / GAPS n / PERF.', vi: 'SORT các giá trị… / GAPS n / PERF.' },
  dauRa: { en: 'The sorted array, the gaps.', vi: 'Mảng đã sắp, các bước.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no library sort in Shell', vi: 'không sort thư viện trong Shell', re: String.raw`\.sort\s*\(|\bPriorityQueue\b`, file: 'Shell' }],
  hen: { n: '2,000,000', ms: 4000, can: 'about O(n^1.3) with Knuth gaps', cham: 'O(n²) (insertion sort only)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("SORT")) {
                    int[] a = new int[p.length - 1];
                    for (int i = 1; i < p.length; i++) {
                        a[i - 1] = n(i);
                    }
                    Shell.shellSort(a);
                    r = Arrays.toString(a);
                } else if (p[0].equals("GAPS")) {
                    r = Shell.gaps(n(1));
                } else {
                    final int[] a = Kiem.ngauNhien(2000000, 1000000000, 61);
                    r = Kiem.hen("shellSort of 2,000,000", 4000, new Runnable() {
                        public void run() {
                            Shell.shellSort(a);
                        }
                    });
                    boolean ok = true;
                    for (int i = 1; i < a.length; i++) {
                        ok &= a[i - 1] <= a[i];
                    }
                    r += ", sorted " + ok;
                }`,
    }),
  },
  tep: {
    'Shell.java': j`
public class Shell {

    static String gaps(int n) {
        //>> return ""; // TODO
        int h = 1;
        while (h < n / 3) {
            h = 3 * h + 1;
        }
        StringBuilder sb = new StringBuilder();
        for (; h >= 1; h /= 3) {
            sb.append(h).append(' ');
        }
        return sb.toString().trim();
        //<<
    }

    static void shellSort(int[] a) {
        //>> // TODO
        int n = a.length;
        int h = 1;
        while (h < n / 3) {
            h = 3 * h + 1;
        }
        for (; h >= 1; h /= 3) {
            for (int i = h; i < n; i++) { // insertion sort with step h
                int x = a[i];
                int j = i;
                while (j >= h && a[j - h] > x) {
                    a[j] = a[j - h];
                    j -= h;
                }
                a[j] = x;
            }
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small arrays and the gap lists', vi: 'mảng nhỏ và danh sách bước' }, vao: 'SORT 9 8 7 6 5 4 3 2 1 0\nSORT 3 1 2\nGAPS 100\nGAPS 10\nGAPS 2\n' },
    { ten: { en: 'duplicates, negatives, more gaps', vi: 'giá trị trùng, số âm, thêm các bước' }, vao: 'SORT 4 -1 4 0 -1 7 3 3\nGAPS 1000000\nGAPS 13\nGAPS 40\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Build the starting gap with while (h < n / 3) h = 3 * h + 1; then loop h = h / 3 down to 1.', vi: 'Dựng bước đầu bằng while (h < n / 3) h = 3 * h + 1; rồi lặp h = h / 3 xuống tới 1.' },
    { en: 'The inner part is insertion sort where "the previous element" is a[j − h].', vi: 'Phần trong là sắp chèn với "phần tử đứng trước" là a[j − h].' },
  ],
  loiHayGap: [
    { en: 'Stopping before h = 1 — the array is only h-sorted, not sorted.', vi: 'Dừng trước khi h = 1 — mảng chỉ h-sorted, chưa được sắp.' },
    { en: 'Using h = n/2, n/4, … (Shell’s original gaps) — correct, but a different gap list and much slower on bad inputs.', vi: 'Dùng h = n/2, n/4, … (dãy gốc của Shell) — đúng nhưng danh sách bước khác và chậm hơn nhiều với dữ liệu xấu.' },
  ],
  giaiThich: { en: '<p>Large gaps move elements far in few steps; each later pass works on an almost-sorted array, where insertion sort is fast. With Knuth’s gaps the worst case is O(n^1.5) and practice is around n^1.25 — far from the n² of insertion sort.</p>', vi: '<p>Bước lớn đưa phần tử đi xa chỉ với vài bước; mỗi lượt sau làm trên mảng gần như đã sắp, nơi sắp chèn chạy nhanh. Với dãy Knuth trường hợp xấu nhất O(n^1,5), thực tế khoảng n^1,25 — xa hẳn n² của sắp chèn.</p>' },
});

const de2 = deJava({
  id: 'csd201-6-2-comparator-two-keys',
  tieuDe: { en: 'Sort cars by price (high to low), then by owner (A to Z) — with a Comparator', vi: 'Sắp xe theo giá (cao xuống thấp), rồi theo chủ xe (A tới Z) — bằng Comparator' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['Comparator', 'thenComparing / two-key comparison', 'Collections.sort is stable (TimSort)'],
  moTa: {
    en: `<p>Complete in ${c('CarSort')}:</p>
<ul><li>${c('static void byPriceDescOwnerAsc(List<Car> cars)')} — price descending; equal prices: owner ascending (${c('compareTo')});</li>
<li>${c('static void byOwnerLength(List<Car> cars)')} — by the length of the owner’s name only; cars with equal lengths must keep their current order (rely on the <b>stability</b> of ${c('Collections.sort')}).</li></ul>
<p>Write the comparators yourself (a lambda or ${c('Comparator.comparing…')}); do not write a sorting loop.</p>`,
    vi: `<p>Hoàn thiện trong ${c('CarSort')}: ${c('byPriceDescOwnerAsc(cars)')} — giá giảm dần; giá bằng nhau thì chủ xe tăng dần (${c('compareTo')}); ${c('byOwnerLength(cars)')} — chỉ theo độ dài tên chủ xe; xe có độ dài bằng nhau phải giữ thứ tự hiện tại (dựa vào tính <b>ổn định</b> của ${c('Collections.sort')}).</p>
<p>Tự viết comparator (lambda hoặc ${c('Comparator.comparing…')}); không tự viết vòng lặp sắp xếp.</p>`,
  },
  yeuCau: { en: ['Use Collections.sort / List.sort with a Comparator.', 'Car is given.'], vi: ['Dùng Collections.sort / List.sort với Comparator.', 'Car cho sẵn.'] },
  dauVao: { en: 'Cars "owner price", then BY1 or BY2.', vi: 'Các xe "chủ giá", rồi BY1 hoặc BY2.' },
  dauRa: { en: 'The sorted list.', vi: 'Danh sách đã sắp.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        List<Car> cars = new ArrayList<>();',
      lenh: `                if (p[0].equals("BY1")) {
                    CarSort.byPriceDescOwnerAsc(cars);
                    r = cars.toString();
                } else if (p[0].equals("BY2")) {
                    CarSort.byOwnerLength(cars);
                    r = cars.toString();
                } else if (p[0].equals("CLEAR")) {
                    cars.clear();
                } else {
                    cars.add(new Car(p[0], n(1)));
                }`,
    }),
  },
  tep: {
    'Car.java': j`
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
`,
    'CarSort.java': j`
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class CarSort {

    static void byPriceDescOwnerAsc(List<Car> cars) {
        //>> // TODO
        Collections.sort(cars, (x, y) -> x.price != y.price ? Integer.compare(y.price, x.price) : x.owner.compareTo(y.owner));
        //<<
    }

    static void byOwnerLength(List<Car> cars) {
        //>> // TODO
        cars.sort(Comparator.comparingInt((Car x) -> x.owner.length())); // stable: equal lengths keep their order
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'two keys', vi: 'hai khoá' }, vao: 'Hoa 25\nNam 12\nLan 40\nAn 25\nBinh 40\nBY1\nBY2\n' },
    { ten: { en: 'equal owners and prices, stability after the first sort', vi: 'chủ và giá bằng nhau, ổn định sau lần sắp đầu' }, vao: 'Zed 5\nAmy 5\nBo 5\nAl 9\nCy 9\nBY2\nBY1\nBY2\n', an: true },
  ],
  goiY: [
    { en: 'Descending on an int key: Integer.compare(y.price, x.price) (swap the arguments).', vi: 'Giảm dần theo khoá int: Integer.compare(y.price, x.price) (đổi chỗ hai tham số).' },
    { en: 'Comparator.comparingInt(...) builds a one-key comparator; ties are left to stability.', vi: 'Comparator.comparingInt(...) dựng comparator một khoá; khi bằng nhau thì để tính ổn định lo.' },
  ],
  loiHayGap: [
    { en: 'y.price - x.price on large values overflows — prefer Integer.compare.', vi: 'y.price - x.price với giá trị lớn sẽ tràn — dùng Integer.compare.' },
    { en: 'Sorting twice (first by owner, then by price) with an unstable algorithm — the owner order is lost.', vi: 'Sắp hai lần (theo chủ rồi theo giá) bằng thuật toán không ổn định — mất thứ tự theo chủ.' },
  ],
  giaiThich: { en: '<p>Java sorts objects with TimSort, a stable merge sort: O(n log n), and equal elements keep their relative order. That is what makes "sort by the secondary key, then stable-sort by the primary key" work, and why a single comparator with two keys gives the same result.</p>', vi: '<p>Java sắp đối tượng bằng TimSort, một merge sort ổn định: O(n log n), phần tử bằng nhau giữ thứ tự tương đối. Nhờ đó "sắp theo khoá phụ, rồi sắp ổn định theo khoá chính" mới chạy đúng, và một comparator hai khoá cho cùng kết quả.</p>' },
});

const de3 = deJava({
  id: 'csd201-6-2-closest-pair',
  tieuDe: { en: 'Sort first, then solve: the two closest numbers in O(n log n)', vi: 'Sắp trước rồi giải: hai số gần nhau nhất trong O(n log n)' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['sorting as a preprocessing step', 'the closest pair is adjacent after sorting', 'O(n log n) vs O(n²)'],
  moTa: {
    en: `<p>Complete ${c('static String closest(int[] a)')} (n ≥ 2): the smallest difference between two values of a and the pair that achieves it, as ${c('"diff D: x y"')} with x ≤ y; if several pairs tie, the one with the smallest x. Comparing every pair is O(n²); after sorting a copy, the closest pair is always made of two <b>neighbours</b> — one pass.</p>`,
    vi: `<p>Hoàn thiện ${c('static String closest(int[] a)')} (n ≥ 2): hiệu nhỏ nhất giữa hai giá trị của a và cặp đạt hiệu đó, dạng ${c('"diff D: x y"')} với x ≤ y; nhiều cặp bằng nhau thì lấy cặp có x nhỏ nhất. So mọi cặp là O(n²); sau khi sắp một bản sao, cặp gần nhau nhất luôn là hai phần tử <b>kề nhau</b> — một lượt quét.</p>`,
  },
  yeuCau: { en: ['Sort a copy (Arrays.sort is allowed), then one pass.', 'Differences in long.'], vi: ['Sắp một bản sao (được dùng Arrays.sort), rồi một lượt.', 'Hiệu kiểu long.'] },
  dauVao: { en: 'One array per line; PERF.', vi: 'Mỗi dòng một mảng; PERF.' },
  dauRa: { en: 'The difference and the pair.', vi: 'Hiệu và cặp số.' },
  main: 'KiemTra',
  hen: { n: '1,000,000', ms: 3000, can: 'O(n log n)', cham: 'O(n²) (every pair)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[1000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = (int) ((i * 2654435761L) % 2000000011L) - 1000000000;
                    }
                    final String[] res = new String[1];
                    r = Kiem.hen("n = 1,000,000", 3000, new Runnable() {
                        public void run() {
                            res[0] = Pairs.closest(a);
                        }
                    }) + ", " + res[0];
                } else {
                    int[] a = new int[p.length];
                    for (int i = 0; i < p.length; i++) {
                        a[i] = n(i);
                    }
                    r = Pairs.closest(a);
                }`,
    }),
  },
  tep: {
    'Pairs.java': j`
import java.util.Arrays;

public class Pairs {

    static String closest(int[] a) {
        //>> return ""; // TODO
        int[] b = a.clone();
        Arrays.sort(b);
        int best = 1;
        for (int i = 2; i < b.length; i++) {
            if ((long) b[i] - b[i - 1] < (long) b[best] - b[best - 1]) {
                best = i; // strict <: the smallest x wins ties
            }
        }
        return "diff " + ((long) b[best] - b[best - 1]) + ": " + b[best - 1] + " " + b[best];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small examples, ties', vi: 'ví dụ nhỏ, bằng nhau' }, vao: '30 5 20 9 1\n4 2 1 3\n10 10\n' },
    { ten: { en: 'extreme values, negatives', vi: 'giá trị cực trị, số âm' }, vao: '-2147483648 2147483647\n-5 100 -7 50\n7 7 3 3\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'If x < y < z after sorting, then z − x > y − x: a non-adjacent pair is never closer than an adjacent one.', vi: 'Nếu x < y < z sau khi sắp thì z − x > y − x: cặp không kề nhau không bao giờ gần hơn cặp kề nhau.' },
    { en: 'Compute differences in long: 2147483647 − (−2147483648) overflows an int.', vi: 'Tính hiệu bằng long: 2147483647 − (−2147483648) tràn int.' },
  ],
  loiHayGap: [
    { en: 'Two nested loops over all pairs — O(n²), the complexity check fails.', vi: 'Hai vòng lồng qua mọi cặp — O(n²), trượt kiểm độ phức tạp.' },
    { en: 'Sorting the caller’s array in place — it was not asked for; sort a copy.', vi: 'Sắp luôn mảng của người gọi — đề không yêu cầu; hãy sắp một bản sao.' },
  ],
  giaiThich: { en: '<p>Many problems become easy on sorted data: duplicates are neighbours, the closest pair is adjacent, a value can be binary-searched. Paying O(n log n) once to sort and O(n) to scan beats O(n²) comparisons — a pattern worth recognising in exams and interviews.</p>', vi: '<p>Nhiều bài toán thành dễ trên dữ liệu đã sắp: giá trị trùng nằm cạnh nhau, cặp gần nhất kề nhau, có thể tìm nhị phân. Trả O(n log n) một lần để sắp và O(n) để quét thắng O(n²) phép so sánh — một khuôn đáng nhận ra trong phòng thi và phỏng vấn.</p>' },
});

export default moDun({ slug: 'csd201-sap-xep-hieu-qua', ten: '6.2 Efficient sorts: quick, merge, heap', de: [de1, de2, de3] });
