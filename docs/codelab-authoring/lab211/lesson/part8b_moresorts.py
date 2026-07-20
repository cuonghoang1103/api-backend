# Part 8b — the remaining named algorithms the briefs demand.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    h('Selection sort and insertion sort', 'Sắp xếp chọn và sắp xếp chèn')

    p('<p>P0002 names selection sort, P0003 names insertion sort. They look similar and examiners like '
      'asking you to tell them apart, so learn the one-line difference: <strong>selection looks for the '
      'smallest remaining item; insertion takes the next item and slides it back into place.</strong></p>',
      '<p>Đề P0002 chỉ định sắp xếp chọn, P0003 chỉ định sắp xếp chèn. Hai cái nhìn giống nhau và giám '
      'khảo thích bắt bạn phân biệt, nên hãy nhớ khác biệt một dòng: <strong>sắp xếp chọn đi tìm phần tử '
      'nhỏ nhất còn lại; sắp xếp chèn lấy phần tử kế tiếp rồi đẩy lùi nó về đúng chỗ.</strong></p>')

    code('Both algorithms, with a trace of what each pass does',
         'Cả hai thuật toán, kèm dấu vết từng lượt chạy',
         """import java.util.Arrays;

public class TwoSorts {

    /** Selection: find the minimum in the unsorted tail, swap it to the front. */
    public static void selection(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) min = j;
            }
            if (min != i) {                     // one swap per pass, at most
                int tmp = a[i]; a[i] = a[min]; a[min] = tmp;
            }
            System.out.println("pass " + (i + 1) + ": " + Arrays.toString(a));
        }
    }

    /** Insertion: hold a[i], shift bigger elements right, drop it in the gap. */
    public static void insertion(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {      // shift, do not swap
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 1, 12, -5, 16};
        selection(a);

        int[] b = {7, -5, 2, 16, 4};
        insertion(b);
        System.out.println("insertion: " + Arrays.toString(b));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        """pass 1: [-5, 1, 12, 5, 16]
pass 2: [-5, 1, 12, 5, 16]
pass 3: [-5, 1, 5, 12, 16]
pass 4: [-5, 1, 5, 12, 16]
insertion: [-5, 2, 4, 7, 16]""")

    p('<p>Pass 2 and pass 4 printed no change — the minimum was already in place, so no swap happened. '
      'That is the honest behaviour of selection sort and a good thing to point at when asked "how do '
      'you know it works".</p>',
      '<p>Lượt 2 và lượt 4 in ra không thay đổi gì — phần tử nhỏ nhất đã nằm đúng chỗ nên không có phép '
      'đổi nào. Đó là hành vi thật của sắp xếp chọn và là chỗ tốt để chỉ vào khi bị hỏi "làm sao em biết '
      'nó chạy đúng".</p>')

    h('Quicksort and merge sort', 'Sắp xếp nhanh và sắp xếp trộn')

    p('<p>P0004 and P0005. Both are divide-and-conquer and both are recursive; the difference is '
      '<em>where the work happens</em>. Quicksort does the work before recursing (partition), merge sort '
      'does it after (merge).</p>',
      '<p>Đề P0004 và P0005. Cả hai đều là chia-để-trị và đều dùng đệ quy; khác nhau ở <em>chỗ công việc '
      'diễn ra</em>. Quicksort làm việc trước khi đệ quy (phân hoạch), merge sort làm việc sau khi đệ quy '
      '(trộn).</p>')

    mermaid("""flowchart TD
    A[Array 5 1 12 -5 16] --> B{Quicksort}
    B --> C[Pick a pivot]
    C --> D[Smaller on the left, bigger on the right]
    D --> E[Recurse on each side]
    A --> F{Merge sort}
    F --> G[Split in half]
    G --> H[Sort each half]
    H --> I[Merge the two sorted halves]""")

    code('Quicksort and merge sort, complete',
         'Quicksort và merge sort, đầy đủ',
         """import java.util.Arrays;

public class FastSorts {

    // ---------- QUICKSORT ----------
    public static void quick(int[] a, int low, int high) {
        if (low >= high) return;                 // base case
        int p = partition(a, low, high);
        quick(a, low, p - 1);
        quick(a, p + 1, high);
    }

    private static int partition(int[] a, int low, int high) {
        int pivot = a[high];                     // last element as pivot
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (a[j] <= pivot) {
                i++;
                int t = a[i]; a[i] = a[j]; a[j] = t;
            }
        }
        int t = a[i + 1]; a[i + 1] = a[high]; a[high] = t;
        return i + 1;                            // final resting place of the pivot
    }

    // ---------- MERGE SORT ----------
    public static void merge(int[] a, int left, int right) {
        if (left >= right) return;               // base case
        int mid = (left + right) / 2;
        merge(a, left, mid);
        merge(a, mid + 1, right);
        combine(a, left, mid, right);
    }

    private static void combine(int[] a, int left, int mid, int right) {
        int[] tmp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;
        while (i <= mid && j <= right) {
            tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
        }
        while (i <= mid)   tmp[k++] = a[i++];    // leftovers on the left
        while (j <= right) tmp[k++] = a[j++];    // leftovers on the right
        System.arraycopy(tmp, 0, a, left, tmp.length);
    }

    public static void main(String[] args) {
        int[] a = {5, 1, 12, -5, 16, 2};
        quick(a, 0, a.length - 1);
        System.out.println("quick: " + Arrays.toString(a));

        int[] b = {5, 1, 12, -5, 16, 2};
        merge(b, 0, b.length - 1);
        System.out.println("merge: " + Arrays.toString(b));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        'quick: [-5, 1, 2, 5, 12, 16]\nmerge: [-5, 1, 2, 5, 12, 16]')

    table(['', 'Quicksort', 'Merge sort'],
          ['', 'Quicksort', 'Merge sort'],
          [['Extra memory', 'none — sorts in place', 'a temporary array per merge'],
           ['Worst case', 'O(n²) with a bad pivot', 'O(n log n) always'],
           ['Stable', 'no', 'yes'],
           ['Work happens', 'before the recursion', 'after the recursion']],
          [['Bộ nhớ thêm', 'không — sắp tại chỗ', 'một mảng tạm cho mỗi lần trộn'],
           ['Trường hợp xấu nhất', 'O(n²) nếu chọn chốt tệ', 'luôn O(n log n)'],
           ['Ổn định', 'không', 'có'],
           ['Công việc diễn ra', 'trước khi đệ quy', 'sau khi đệ quy']])

    h('Linear search — and why it still matters',
      'Tìm tuyến tính — và vì sao nó vẫn quan trọng')

    p('<p>Sixteen briefs search for something. Most of them search by <em>part</em> of a name, which '
      'binary search cannot do at all — you cannot halve your way to "contains \'le\'". Linear search is '
      'the right answer there, and saying so is better than reaching for the fancier algorithm.</p>',
      '<p>Mười sáu đề có chức năng tìm kiếm. Phần lớn tìm theo <em>một phần</em> của tên, thứ mà tìm nhị '
      'phân hoàn toàn không làm được — bạn không thể chia đôi để ra "chứa chữ \'le\'". Ở đó tìm tuyến '
      'tính mới là câu trả lời đúng, và nói được điều đó tốt hơn là với lấy thuật toán oai hơn.</p>')

    code('Linear search, two shapes', 'Tìm tuyến tính, hai dạng',
         """import java.util.*;

public class LinearSearch {

    /** Exact match on an int array — returns the index, or -1. */
    public static int indexOf(int[] a, int key) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == key) return i;         // stop at the FIRST hit
        }
        return -1;
    }

    /** Partial, case-insensitive match — what the CRUD briefs actually ask for. */
    public static List<String> searchByPart(List<String> names, String part) {
        List<String> found = new ArrayList<>();
        String needle = part.toLowerCase();
        for (String n : names) {
            if (n.toLowerCase().contains(needle)) found.add(n);
        }
        return found;
    }

    public static void main(String[] args) {
        System.out.println(indexOf(new int[]{4, 8, 15, 16}, 15));
        System.out.println(indexOf(new int[]{4, 8, 15, 16}, 99));

        List<String> names = List.of("Tran Binh", "Le Hoa", "Nguyen Le Minh");
        System.out.println(searchByPart(names, "le"));
        System.out.println(searchByPart(names, "zz"));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        '2\n-1\n[Le Hoa, Nguyen Le Minh]\n[]')

    p('<p>The last line is worth noticing: <strong>an empty result is not an error.</strong> Return the '
      'empty list and let the view say "no record found". Returning <code>null</code> here is how you '
      'plant a <code>NullPointerException</code> in your own demo.</p>',
      '<p>Dòng cuối đáng để ý: <strong>kết quả rỗng không phải là lỗi.</strong> Hãy trả về danh sách rỗng '
      'rồi để tầng hiển thị nói "không tìm thấy bản ghi". Trả về <code>null</code> ở đây chính là cách bạn '
      'tự gài một <code>NullPointerException</code> vào buổi demo của mình.</p>')

    practice([
        (251, 'Collections framework and data structures', 'Collections và cấu trúc dữ liệu',
         'List, Map, Set and the algorithms over them — 10 exercises',
         'List, Map, Set và các thuật toán trên chúng — 10 bài'),
    ])
