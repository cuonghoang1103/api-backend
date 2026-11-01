/** CSD201 · 6.4 — Merge sort & tính ổn định: trộn từ trên xuống in từng lần trộn, merge sort từ dưới lên không đệ quy (kiểm 2·10⁶), sắp bản ghi ổn định. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-6-4-merge-trace',
  tieuDe: { en: 'Top-down merge sort: every merge, in the order it happens', vi: 'Merge sort từ trên xuống: mọi lần trộn, theo đúng thứ tự xảy ra' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['divide at mid = (lo + hi) / 2', 'merge with a temporary array', 'take from the left on ties (stable)'],
  moTa: {
    en: `<p>Complete ${c('static void sort(int[] a, int lo, int hi, StringBuilder log)')}: if lo &lt; hi, sort ${c('a[lo..mid]')} and ${c('a[mid+1..hi]')} recursively (mid = (lo + hi) / 2), then merge them and append the line ${c('"merge [lo..hi]: …a[lo..hi]…"')}. Merging takes from the left half when values are equal. The grader also counts the comparisons made by your merges (static field ${c('comparisons')}).</p>`,
    vi: `<p>Hoàn thiện ${c('static void sort(int[] a, int lo, int hi, StringBuilder log)')}: nếu lo &lt; hi, sắp đệ quy ${c('a[lo..mid]')} và ${c('a[mid+1..hi]')} (mid = (lo + hi) / 2), rồi trộn và nối dòng ${c('"merge [lo..hi]: …a[lo..hi]…"')}. Khi bằng nhau, trộn lấy từ nửa trái. Máy chấm còn đếm số lần so sánh trong các lần trộn của bạn (trường static ${c('comparisons')}).</p>`,
  },
  yeuCau: { en: ['Merge with a temporary array.', 'comparisons: one per a[i] <= a[j] test.'], vi: ['Trộn bằng mảng tạm.', 'comparisons: mỗi lần thử a[i] <= a[j] tính một.'] },
  dauVao: { en: 'SORT values… per line.', vi: 'SORT các giá trị… mỗi dòng.' },
  dauRa: { en: 'Every merge, then the sorted array and the comparisons.', vi: 'Mọi lần trộn, rồi mảng đã sắp và số lần so sánh.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int[] a = new int[p.length - 1];
                for (int i = 1; i < p.length; i++) {
                    a[i - 1] = n(i);
                }
                StringBuilder log = new StringBuilder();
                Merge.comparisons = 0;
                Merge.sort(a, 0, a.length - 1, log);
                r = "\\n" + log + "sorted " + Arrays.toString(a) + ", comparisons " + Merge.comparisons;`,
    }),
  },
  tep: {
    'Merge.java': j`
public class Merge {
    static long comparisons;

    static void sort(int[] a, int lo, int hi, StringBuilder log) {
        //>> // TODO
        if (lo >= hi) {
            return;
        }
        int mid = (lo + hi) / 2;
        sort(a, lo, mid, log);
        sort(a, mid + 1, hi, log);
        int[] tmp = new int[hi - lo + 1];
        int i = lo, j = mid + 1, k = 0;
        while (i <= mid && j <= hi) {
            comparisons++;
            tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++]; // <=: the left one first on ties
        }
        while (i <= mid) {
            tmp[k++] = a[i++];
        }
        while (j <= hi) {
            tmp[k++] = a[j++];
        }
        System.arraycopy(tmp, 0, a, lo, tmp.length);
        log.append("merge [").append(lo).append("..").append(hi).append("]:");
        for (int x = lo; x <= hi; x++) {
            log.append(' ').append(a[x]);
        }
        log.append('\n');
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ 8-element example', vi: 'ví dụ 8 phần tử của slide' }, vao: 'SORT 38 27 43 3 9 82 10 1\nSORT 2 1 3\n' },
    { ten: { en: 'odd length, sorted, duplicates', vi: 'độ dài lẻ, đã sắp, giá trị trùng' }, vao: 'SORT 5 4 3 2 1\nSORT 1 2 3 4\nSORT 2 2 1 1\n', an: true },
  ],
  goiY: [
    { en: 'Merge: while both halves have elements, copy the smaller front (the left one on ties); then copy what is left of either half.', vi: 'Trộn: khi cả hai nửa còn phần tử, chép phần tử đầu nhỏ hơn (bằng nhau lấy bên trái); rồi chép phần còn lại của nửa nào còn.' },
    { en: 'Log the merge after copying tmp back into a[lo..hi].', vi: 'Ghi dòng log sau khi đã chép tmp trở lại a[lo..hi].' },
  ],
  loiHayGap: [
    { en: 'mid = (lo + hi + 1) / 2 — the halves differ and so does the trace.', vi: 'mid = (lo + hi + 1) / 2 — hai nửa khác đi và dấu vết cũng vậy.' },
    { en: 'Counting the copies of the leftover elements as comparisons.', vi: 'Đếm cả việc chép phần còn lại như là so sánh.' },
  ],
  giaiThich: { en: '<p>T(n) = 2T(n/2) + Θ(n) = Θ(n log n) in every case, with at most n − 1 comparisons per merge level. Taking from the left on equal keys keeps it stable — the property Java relies on to sort objects.</p>', vi: '<p>T(n) = 2T(n/2) + Θ(n) = Θ(n log n) ở mọi trường hợp, mỗi tầng trộn tối đa n − 1 lần so sánh. Lấy từ bên trái khi khoá bằng nhau giữ nó ổn định — tính chất Java dựa vào để sắp đối tượng.</p>' },
});

const de2 = deJava({
  id: 'csd201-6-4-bottom-up',
  tieuDe: { en: 'Bottom-up merge sort: no recursion, one buffer, two million values', vi: 'Merge sort từ dưới lên: không đệ quy, một bộ đệm, hai triệu giá trị' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['runs of width 1, 2, 4, …', 'one auxiliary array for the whole sort', 'O(n log n) without a call stack'],
  moTa: {
    en: `<p>Complete ${c('static void sort(int[] a)')}: merge adjacent runs of width 1, then 2, 4, 8, … until the width reaches n. Allocate the auxiliary array <b>once</b>. No recursion (rule R1) and no library sort.</p>`,
    vi: `<p>Hoàn thiện ${c('static void sort(int[] a)')}: trộn các đoạn kề nhau độ rộng 1, rồi 2, 4, 8, … tới khi độ rộng đạt n. Cấp phát mảng phụ <b>một lần</b>. Không đệ quy (luật R1) và không sort thư viện.</p>`,
  },
  yeuCau: { en: ['O(n log n), O(n) extra memory allocated once.', 'No recursion, no library sort.'], vi: ['O(n log n), O(n) bộ nhớ phụ cấp một lần.', 'Không đệ quy, không sort thư viện.'] },
  dauVao: { en: 'SORT values… / PERF.', vi: 'SORT các giá trị… / PERF.' },
  dauRa: { en: 'The sorted array.', vi: 'Mảng đã sắp.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no recursion in BottomUp', vi: 'không đệ quy trong BottomUp', rec: 'no', file: 'BottomUp' }, { id: 'R2', en: 'no library sort in BottomUp', vi: 'không sort thư viện trong BottomUp', re: String.raw`\.sort\s*\(|\bPriorityQueue\b`, file: 'BottomUp' }],
  hen: { n: '2,000,000', ms: 4000, can: 'O(n log n)', cham: 'O(n²) (insertion-based merging)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = Kiem.ngauNhien(2000000, 1000000000, 81);
                    r = Kiem.hen("2,000,000 values", 4000, new Runnable() {
                        public void run() {
                            BottomUp.sort(a);
                        }
                    });
                    boolean ok = true;
                    for (int i = 1; i < a.length; i++) {
                        ok &= a[i - 1] <= a[i];
                    }
                    r += ", sorted " + ok;
                } else {
                    int[] a = new int[p.length - 1];
                    for (int i = 1; i < p.length; i++) {
                        a[i - 1] = n(i);
                    }
                    BottomUp.sort(a);
                    r = Arrays.toString(a);
                }`,
    }),
  },
  tep: {
    'BottomUp.java': j`
public class BottomUp {

    static void sort(int[] a) {
        //>> // TODO
        int n = a.length;
        int[] tmp = new int[n];
        for (int width = 1; width < n; width *= 2) {
            for (int lo = 0; lo < n - width; lo += 2 * width) {
                int mid = lo + width - 1;
                int hi = Math.min(lo + 2 * width - 1, n - 1);
                int i = lo, j = mid + 1, k = lo;
                while (i <= mid && j <= hi) {
                    tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
                }
                while (i <= mid) {
                    tmp[k++] = a[i++];
                }
                while (j <= hi) {
                    tmp[k++] = a[j++];
                }
                System.arraycopy(tmp, lo, a, lo, hi - lo + 1);
            }
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'lengths that are not powers of two', vi: 'độ dài không phải luỹ thừa của 2' }, vao: 'SORT 38 27 43 3 9 82 10\nSORT 5 1 4 2 3\nSORT 2 1\n' },
    { ten: { en: 'empty-ish, duplicates', vi: 'gần rỗng, giá trị trùng' }, vao: 'SORT 7\nSORT 3 3 1 1 2 2\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'For a width w, the runs to merge start at lo = 0, 2w, 4w, …; the right run may be shorter (or missing) at the end.', vi: 'Với độ rộng w, các đoạn cần trộn bắt đầu ở lo = 0, 2w, 4w, …; đoạn phải có thể ngắn hơn (hoặc không có) ở cuối.' },
    { en: 'hi = min(lo + 2w − 1, n − 1) handles the short last run.', vi: 'hi = min(lo + 2w − 1, n − 1) xử lý đoạn cuối ngắn.' },
  ],
  loiHayGap: [
    { en: 'Allocating a new temporary array in every merge — correct but millions of allocations.', vi: 'Cấp phát mảng tạm mới ở mỗi lần trộn — đúng nhưng hàng triệu lần cấp phát.' },
    { en: 'Stopping when width == n/2 for odd n — the last element is never merged.', vi: 'Dừng khi width == n/2 với n lẻ — phần tử cuối không bao giờ được trộn.' },
  ],
  giaiThich: { en: '<p>log₂ n rounds, each merging every element once: Θ(n log n), with the auxiliary array reused. Without recursion it suits linked lists and external sorting, where runs on disk are merged pass by pass.</p>', vi: '<p>log₂ n vòng, mỗi vòng trộn mọi phần tử một lần: Θ(n log n), dùng lại mảng phụ. Không đệ quy nên hợp với danh sách liên kết và sắp xếp ngoài, nơi các đoạn trên đĩa được trộn từng lượt.</p>' },
});

const de3 = deJava({
  id: 'csd201-6-4-stable-records',
  tieuDe: { en: 'Stability: sort student records by grade, keeping the name order', vi: 'Tính ổn định: sắp bản ghi sinh viên theo điểm, giữ thứ tự tên' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['stable sort', 'sorting by a secondary key first, then the primary key', 'merge sort on objects'],
  moTa: {
    en: `<p>${c('Student(name, grade)')} records arrive already sorted by name. Complete ${c('static void byGradeDesc(Student[] s)')} with your own <b>merge sort</b> on the array (no library sort, rule R1): grade descending, and students with the same grade must stay in name order. The grader checks the order of the very objects it gave you.</p>`,
    vi: `<p>Các bản ghi ${c('Student(name, grade)')} đến đã được sắp theo tên. Hoàn thiện ${c('static void byGradeDesc(Student[] s)')} bằng <b>merge sort</b> tự viết trên mảng (không sort thư viện, luật R1): điểm giảm dần, sinh viên cùng điểm phải giữ thứ tự tên. Máy chấm kiểm thứ tự của chính các đối tượng nó đưa cho bạn.</p>`,
  },
  yeuCau: { en: ['Your own merge sort (stable).', 'Student is given.'], vi: ['Merge sort tự viết (ổn định).', 'Student cho sẵn.'] },
  dauVao: { en: 'Records "name grade", then GO.', vi: 'Các bản ghi "tên điểm", rồi GO.' },
  dauRa: { en: 'The sorted records with their original positions.', vi: 'Các bản ghi đã sắp kèm vị trí ban đầu.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no library sort in Records', vi: 'không sort thư viện trong Records', re: String.raw`\.sort\s*\(|\bTreeMap\b|\bPriorityQueue\b`, file: 'Records' }],
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        List<Student> list = new ArrayList<>();',
      lenh: `                if (p[0].equals("GO")) {
                    Student[] s = list.toArray(new Student[0]);
                    IdentityHashMap<Student, Integer> pos = new IdentityHashMap<>();
                    for (int i = 0; i < s.length; i++) {
                        pos.put(s[i], i);
                    }
                    Records.byGradeDesc(s);
                    StringBuilder sb = new StringBuilder();
                    for (Student x : s) {
                        sb.append(x.name).append('(').append(x.grade).append(")#").append(pos.get(x)).append(' ');
                    }
                    r = sb.toString().trim();
                    list.clear();
                } else {
                    list.add(new Student(p[0], Double.parseDouble(p[1])));
                }`,
    }),
  },
  tep: {
    'Student.java': j`
// GIVEN — do not change.
public class Student {
    String name;
    double grade;

    Student(String name, double grade) {
        this.name = name;
        this.grade = grade;
    }
}
`,
    'Records.java': j`
public class Records {

    static void byGradeDesc(Student[] s) {
        //>> // TODO: a stable merge sort, grade descending
        if (s.length > 1) {
            sort(s, new Student[s.length], 0, s.length - 1);
        }
        //<<
    }
    //>> // TODO: helper(s)

    private static void sort(Student[] s, Student[] tmp, int lo, int hi) {
        if (lo >= hi) {
            return;
        }
        int mid = (lo + hi) >>> 1;
        sort(s, tmp, lo, mid);
        sort(s, tmp, mid + 1, hi);
        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) {
            // take from the right only when it is STRICTLY better: equal grades keep their order
            tmp[k++] = s[j].grade > s[i].grade ? s[j++] : s[i++];
        }
        while (i <= mid) {
            tmp[k++] = s[i++];
        }
        while (j <= hi) {
            tmp[k++] = s[j++];
        }
        System.arraycopy(tmp, lo, s, lo, hi - lo + 1);
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'a class sorted by name', vi: 'một lớp đã sắp theo tên' }, vao: 'An 8.5\nBinh 7.0\nChi 8.5\nDung 9.0\nEm 7.0\nGiang 8.5\nGO\n' },
    { ten: { en: 'all equal, already in grade order, one student', vi: 'toàn bằng nhau, đã theo thứ tự điểm, một sinh viên' }, vao: 'A 5\nB 5\nC 5\nGO\nX 9\nY 8\nZ 7\nGO\nSolo 10\nGO\n', an: true },
  ],
  goiY: [
    { en: 'In the merge, take the right element only when its grade is strictly greater — on ties the left one (earlier name) comes first.', vi: 'Khi trộn, chỉ lấy phần tử bên phải khi điểm của nó lớn hơn hẳn — bằng nhau thì phần tử bên trái (tên đứng trước) ra trước.' },
    { en: 'This is "sort by the secondary key, then stable-sort by the primary key" — the input is already sorted by name.', vi: 'Đây là "sắp theo khoá phụ, rồi sắp ổn định theo khoá chính" — đầu vào đã sắp theo tên.' },
  ],
  loiHayGap: [
    { en: 'Using >= in the merge — equal grades swap their name order.', vi: 'Dùng >= khi trộn — điểm bằng nhau bị đảo thứ tự tên.' },
    { en: 'A selection sort with swaps — fast enough here, but not stable.', vi: 'Sắp chọn có hoán đổi — đủ nhanh ở đây nhưng không ổn định.' },
  ],
  giaiThich: { en: '<p>A stable sort never reorders equal keys, so the previous order (by name) survives inside each grade group. Merge sort is stable as long as ties take the left element; quick sort and heap sort are not.</p>', vi: '<p>Sắp xếp ổn định không bao giờ đổi thứ tự các khoá bằng nhau, nên thứ tự trước đó (theo tên) được giữ trong mỗi nhóm điểm. Merge sort ổn định miễn là khi bằng nhau lấy phần tử bên trái; quick sort và heap sort thì không.</p>' },
});

export default moDun({ slug: 'csd201-mergesort', ten: '6.4 Merge-sort & stability', de: [de1, de2, de3] });
