/** CSD201 · 6.1 — Sắp xếp cơ bản O(n²): chọn (đếm số lần đổi chỗ, in từng lượt), chèn (đếm số lần dời, in từng lượt), nổi bọt dừng sớm. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const MANG = `                int[] a = new int[p.length - 1];
                for (int i = 1; i < p.length; i++) {
                    a[i - 1] = n(i);
                }`;

const de1 = deJava({
  id: 'csd201-6-1-selection-trace',
  tieuDe: { en: 'Selection sort: the array after every pass, and the number of swaps', vi: 'Sắp xếp chọn: mảng sau mỗi lượt, và số lần đổi chỗ' },
  doKho: 'EASY', phut: 20, dangBai: 'pe',
  khaiNiem: ['find the minimum of a[i..n-1]', 'one swap per pass at most', 'not stable', 'exactly n(n−1)/2 comparisons'],
  moTa: {
    en: `<p>The PE loves "write the array after the k-th pass". Complete ${c('static String selection(int[] a)')}: for i = 0 … n−2, find the index m of the minimum of ${c('a[i..n-1]')} (the <b>first</b> minimum on ties), swap ${c('a[i]')} and ${c('a[m]')} only if m ≠ i, then append the whole array as one line ${c('"pass k: 3 1 2"')}. Return the lines followed by a last line ${c('"swaps S, comparisons C"')}.</p>`,
    vi: `<p>Đề PE rất thích "ghi mảng sau lượt thứ k". Hoàn thiện ${c('static String selection(int[] a)')}: với i = 0 … n−2, tìm chỉ số m của giá trị nhỏ nhất trong ${c('a[i..n-1]')} (giá trị nhỏ nhất <b>đầu tiên</b> nếu bằng nhau), chỉ đổi chỗ ${c('a[i]')} và ${c('a[m]')} khi m ≠ i, rồi nối cả mảng thành một dòng ${c('"pass k: 3 1 2"')}. Trả về các dòng đó, thêm dòng cuối ${c('"swaps S, comparisons C"')}.</p>`,
  },
  yeuCau: { en: ['Passes numbered from 1; one line per pass (n − 1 lines).', 'A comparison = one test a[j] < a[m].'], vi: ['Lượt đánh số từ 1; mỗi lượt một dòng (n − 1 dòng).', 'Một lần so sánh = một lần thử a[j] < a[m].'] },
  dauVao: { en: 'One array per line, prefixed by SORT.', vi: 'Mỗi dòng một mảng, bắt đầu bằng SORT.' },
  dauRa: { en: 'The passes and the counts.', vi: 'Các lượt và các số đếm.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ lenh: `${MANG}\n                r = "\\n" + Basic.selection(a);` }) },
  tep: {
    'Basic.java': j`
public class Basic {

    static String selection(int[] a) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        int swaps = 0, comparisons = 0;
        for (int i = 0; i < a.length - 1; i++) {
            int m = i;
            for (int j = i + 1; j < a.length; j++) {
                comparisons++;
                if (a[j] < a[m]) {
                    m = j;
                }
            }
            if (m != i) {
                int t = a[i];
                a[i] = a[m];
                a[m] = t;
                swaps++;
            }
            sb.append("pass ").append(i + 1).append(':');
            for (int x : a) {
                sb.append(' ').append(x);
            }
            sb.append('\n');
        }
        return sb.append("swaps ").append(swaps).append(", comparisons ").append(comparisons).toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example and a sorted array', vi: 'ví dụ của slide và một mảng đã sắp' }, vao: 'SORT 5 2 4 6 1 3\nSORT 1 2 3 4\n' },
    { ten: { en: 'duplicates, reversed, one element', vi: 'giá trị trùng, sắp ngược, một phần tử' }, vao: 'SORT 3 1 3 1\nSORT 4 3 2 1\nSORT 7\n', an: true },
  ],
  goiY: [
    { en: 'Use strict < when searching the minimum: the first minimum stays the candidate.', vi: 'Dùng < hẳn khi tìm giá trị nhỏ nhất: giá trị nhỏ nhất đầu tiên vẫn là ứng viên.' },
    { en: 'The comparisons do not depend on the data: (n−1) + (n−2) + … + 1 = n(n−1)/2.', vi: 'Số lần so sánh không phụ thuộc dữ liệu: (n−1) + (n−2) + … + 1 = n(n−1)/2.' },
  ],
  loiHayGap: [
    { en: 'Swapping inside the inner loop every time a smaller value is seen — that is not selection sort and the passes differ.', vi: 'Đổi chỗ ngay trong vòng trong mỗi khi gặp giá trị nhỏ hơn — đó không phải sắp chọn và các lượt khác đi.' },
    { en: 'Counting a swap when m == i.', vi: 'Đếm một lần đổi chỗ khi m == i.' },
  ],
  giaiThich: { en: '<p>After pass i the first i elements are the i smallest, in order. Selection sort always makes n(n−1)/2 comparisons (Θ(n²) even on sorted input) but at most n − 1 swaps — useful when writes are expensive. Swapping a far element over equal keys makes it unstable.</p>', vi: '<p>Sau lượt i, i phần tử đầu là i phần tử nhỏ nhất, đúng thứ tự. Sắp chọn luôn so sánh n(n−1)/2 lần (Θ(n²) cả khi dữ liệu đã sắp) nhưng đổi chỗ tối đa n − 1 lần — có ích khi ghi tốn kém. Đổi một phần tử ở xa qua các khoá bằng nhau làm nó không ổn định.</p>' },
});

const de2 = deJava({
  id: 'csd201-6-1-insertion-trace',
  tieuDe: { en: 'Insertion sort: passes, shifts — and why it is fast on almost sorted data', vi: 'Sắp xếp chèn: các lượt, số lần dời — và vì sao nhanh với dữ liệu gần như đã sắp' },
  doKho: 'EASY', phut: 20, dangBai: 'pe',
  khaiNiem: ['insert a[i] into the sorted prefix', 'shifts = number of inversions', 'stable', 'adaptive: O(n + inversions)'],
  moTa: {
    en: `<p>Complete ${c('static String insertion(int[] a)')}: for i = 1 … n−1, take ${c('x = a[i]')}, shift every element of the sorted prefix that is <b>greater</b> than x one slot right, put x into the gap, then append the line ${c('"pass i: …"')}. Return the lines and a last line ${c('"shifts S"')} — the total number of element moves to the right.</p>
<p>The number of shifts equals the number of inversions of the input: 0 for a sorted array, n(n−1)/2 for a reversed one.</p>`,
    vi: `<p>Hoàn thiện ${c('static String insertion(int[] a)')}: với i = 1 … n−1, lấy ${c('x = a[i]')}, dời mọi phần tử của đoạn đầu đã sắp mà <b>lớn hơn</b> x sang phải một ô, đặt x vào chỗ trống, rồi nối dòng ${c('"pass i: …"')}. Trả về các dòng và dòng cuối ${c('"shifts S"')} — tổng số lần dời phần tử sang phải.</p>
<p>Số lần dời bằng số nghịch thế của đầu vào: 0 với mảng đã sắp, n(n−1)/2 với mảng sắp ngược.</p>`,
  },
  yeuCau: { en: ['Shift on > only (stable).', 'Passes numbered from 1.'], vi: ['Chỉ dời khi > (ổn định).', 'Lượt đánh số từ 1.'] },
  dauVao: { en: 'SORT values… per line.', vi: 'SORT các giá trị… mỗi dòng.' },
  dauRa: { en: 'The passes and the shifts.', vi: 'Các lượt và số lần dời.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ lenh: `${MANG}\n                r = "\\n" + Insertion.insertion(a);` }) },
  tep: {
    'Insertion.java': j`
public class Insertion {

    static String insertion(int[] a) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        long shifts = 0;
        for (int i = 1; i < a.length; i++) {
            int x = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > x) {
                a[j + 1] = a[j];
                j--;
                shifts++;
            }
            a[j + 1] = x;
            sb.append("pass ").append(i).append(':');
            for (int v : a) {
                sb.append(' ').append(v);
            }
            sb.append('\n');
        }
        return sb.append("shifts ").append(shifts).toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example', vi: 'ví dụ của slide' }, vao: 'SORT 5 2 4 6 1 3\nSORT 1 2 3 5 4\n' },
    { ten: { en: 'reversed, duplicates, sorted', vi: 'ngược, trùng, đã sắp' }, vao: 'SORT 5 4 3 2 1\nSORT 2 1 2 1\nSORT 1 2 3\n', an: true },
  ],
  goiY: [
    { en: 'Keep x in a variable: the shifting overwrites a[i].', vi: 'Giữ x trong biến: việc dời sẽ ghi đè a[i].' },
    { en: 'while (j >= 0 && a[j] > x) { a[j+1] = a[j]; j--; } then a[j+1] = x.', vi: 'while (j >= 0 && a[j] > x) { a[j+1] = a[j]; j--; } rồi a[j+1] = x.' },
  ],
  loiHayGap: [
    { en: 'Shifting on >= — equal keys jump over each other (not stable) and the shift count grows.', vi: 'Dời khi >= — các khoá bằng nhau nhảy qua nhau (không ổn định) và số lần dời tăng.' },
    { en: 'Swapping neighbours instead of shifting — correct order, three assignments per step instead of one.', vi: 'Đổi chỗ hai phần tử kề nhau thay vì dời — thứ tự đúng nhưng ba phép gán mỗi bước thay vì một.' },
  ],
  giaiThich: { en: '<p>Each shift removes exactly one inversion, so insertion sort costs Θ(n + I) where I is the number of inversions: O(n) for nearly sorted data, Θ(n²) for reversed data. That is why TimSort uses it on short runs.</p>', vi: '<p>Mỗi lần dời xoá đúng một nghịch thế, nên sắp chèn tốn Θ(n + I) với I là số nghịch thế: O(n) với dữ liệu gần như đã sắp, Θ(n²) với dữ liệu ngược. Vì vậy TimSort dùng nó cho các đoạn ngắn.</p>' },
});

const de3 = deJava({
  id: 'csd201-6-1-bubble-early-exit',
  tieuDe: { en: 'Bubble sort that stops early: count the passes it really needs', vi: 'Bubble sort dừng sớm: đếm số lượt thật sự cần' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['adjacent swaps', 'the largest element bubbles to the end', 'stop when a pass makes no swap'],
  moTa: {
    en: `<p>Complete ${c('static int bubble(int[] a)')}: sort ascending by repeated passes that swap adjacent elements out of order; pass k only needs to look at ${c('a[0..n-k]')} (the last k − 1 places are final). Stop as soon as a pass makes <b>no</b> swap. Return the number of passes made (including the last, swap-free one; an array of 0 or 1 element needs 0 passes).</p>`,
    vi: `<p>Hoàn thiện ${c('static int bubble(int[] a)')}: sắp tăng bằng các lượt đổi chỗ hai phần tử kề nhau sai thứ tự; lượt k chỉ cần xét ${c('a[0..n-k]')} (k − 1 chỗ cuối đã cố định). Dừng ngay khi một lượt <b>không</b> đổi chỗ lần nào. Trả về số lượt đã làm (tính cả lượt cuối không đổi chỗ; mảng 0 hoặc 1 phần tử cần 0 lượt).</p>`,
  },
  yeuCau: { en: ['Early exit flag.', 'Shrink the scanned range each pass.'], vi: ['Có cờ dừng sớm.', 'Thu hẹp đoạn quét sau mỗi lượt.'] },
  dauVao: { en: 'SORT values… per line.', vi: 'SORT các giá trị… mỗi dòng.' },
  dauRa: { en: 'The sorted array and the number of passes.', vi: 'Mảng đã sắp và số lượt.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ lenh: `${MANG}\n                int k = Bubble.bubble(a);\n                r = Arrays.toString(a) + " in " + k + " pass(es)";` }) },
  tep: {
    'Bubble.java': j`
public class Bubble {

    static int bubble(int[] a) {
        //>> return 0; // TODO
        int passes = 0;
        for (int k = 1; k < a.length; k++) {
            passes++;
            boolean swapped = false;
            for (int j = 0; j < a.length - k; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
        return passes;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'sorted, one swap needed, reversed', vi: 'đã sắp, cần một lần đổi, sắp ngược' }, vao: 'SORT 1 2 3 4 5\nSORT 1 2 4 3 5\nSORT 5 4 3 2 1\n' },
    { ten: { en: 'a small value at the end (a "turtle"), one element', vi: 'giá trị nhỏ ở cuối ("con rùa"), một phần tử' }, vao: 'SORT 2 3 4 5 1\nSORT 9\nSORT 2 1\n', an: true },
  ],
  goiY: [
    { en: 'Reset swapped = false at the start of every pass; break after the pass if it stayed false.', vi: 'Đặt lại swapped = false ở đầu mỗi lượt; sau lượt nếu vẫn false thì break.' },
    { en: 'A small value at the end moves only one place per pass ("turtle"): 2 3 4 5 1 needs n − 1 passes.', vi: 'Giá trị nhỏ ở cuối chỉ dời một chỗ mỗi lượt ("con rùa"): 2 3 4 5 1 cần n − 1 lượt.' },
  ],
  loiHayGap: [
    { en: 'Running all n − 1 passes regardless — sorted input still costs Θ(n²).', vi: 'Luôn chạy đủ n − 1 lượt — dữ liệu đã sắp vẫn tốn Θ(n²).' },
    { en: 'j < a.length − 1 in every pass: correct but rescans the finished tail.', vi: 'j < a.length − 1 ở mọi lượt: đúng nhưng quét lại phần đuôi đã xong.' },
  ],
  giaiThich: { en: '<p>After pass k the k largest values are in their final places, so a pass on n − k elements suffices; a pass without swaps proves the array is sorted. Best case O(n) (one pass), worst case Θ(n²) — and it is stable because only strictly greater neighbours are swapped.</p>', vi: '<p>Sau lượt k, k giá trị lớn nhất đã ở chỗ cuối cùng, nên một lượt trên n − k phần tử là đủ; một lượt không đổi chỗ chứng minh mảng đã sắp. Tốt nhất O(n) (một lượt), xấu nhất Θ(n²) — và ổn định vì chỉ đổi khi phần tử kề lớn hơn hẳn.</p>' },
});

export default moDun({ slug: 'csd201-sap-xep-co-ban', ten: '6.1 Basic sorts (O(n²))', de: [de1, de2, de3] });
