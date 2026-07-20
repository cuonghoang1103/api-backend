# Part 8 — the algorithms the briefs make you implement by hand.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(10, 'Algorithms you must write yourself',
         'Thuật toán bạn phải tự viết',
         'Seven briefs forbid the library and name the algorithm',
         'Bảy đề cấm dùng thư viện và chỉ đích danh thuật toán')

    p('<p>Seven briefs forbid <code>Collections.sort</code> and name the algorithm: bubble, selection, '
      'insertion, quick, merge. Two more name a search: linear and binary. The point is not the code — '
      'it is that you can explain <em>why</em> it works and <em>what it costs</em>.</p>'
      '<p>Learn this table first. It answers most algorithm questions in a defence.</p>',
      '<p>Bảy đề cấm dùng <code>Collections.sort</code> và chỉ đích danh thuật toán: bubble, selection, '
      'insertion, quick, merge. Hai đề nữa chỉ định thuật toán tìm kiếm: tuyến tính và nhị phân. Vấn đề '
      'không nằm ở đoạn code — mà ở chỗ bạn giải thích được <em>vì sao</em> nó chạy đúng và '
      '<em>nó tốn bao nhiêu</em>.</p>'
      '<p>Hãy học thuộc bảng này trước. Nó trả lời gần hết các câu hỏi về thuật toán khi vấn đáp.</p>')

    table(['Algorithm', 'Idea in one line', 'Typical cost', 'Brief'],
          ['Thuật toán', 'Ý tưởng một dòng', 'Chi phí', 'Đề'],
          [['Bubble sort', 'swap neighbours until nothing swaps', 'O(n²)', 'P0001, P0053'],
           ['Selection sort', 'find the smallest, put it at the front', 'O(n²)', 'P0002'],
           ['Insertion sort', 'insert each item into the sorted left part', 'O(n²)', 'P0003'],
           ['Quicksort', 'pick a pivot, split around it, recurse', 'O(n log n)', 'P0004'],
           ['Merge sort', 'split in half, sort each, merge', 'O(n log n)', 'P0005'],
           ['Linear search', 'check every element', 'O(n)', 'P0010'],
           ['Binary search', 'halve a SORTED array each step', 'O(log n)', 'P0006']],
          [['Sắp xếp nổi bọt', 'đổi chỗ hai phần tử kề nhau tới khi không còn đổi', 'O(n²)', 'P0001, P0053'],
           ['Sắp xếp chọn', 'tìm phần tử nhỏ nhất, đưa lên đầu', 'O(n²)', 'P0002'],
           ['Sắp xếp chèn', 'chèn từng phần tử vào phần đã sắp bên trái', 'O(n²)', 'P0003'],
           ['Sắp xếp nhanh', 'chọn chốt, chia hai bên, đệ quy', 'O(n log n)', 'P0004'],
           ['Sắp xếp trộn', 'chia đôi, sắp mỗi nửa, rồi trộn', 'O(n log n)', 'P0005'],
           ['Tìm tuyến tính', 'duyệt qua mọi phần tử', 'O(n)', 'P0010'],
           ['Tìm nhị phân', 'mỗi bước bỏ đi một nửa mảng ĐÃ SẮP', 'O(log n)', 'P0006']])

    h('What O(n²) actually means to you',
      'O(n²) thật ra có nghĩa gì với bạn')

    p('<p>Do not recite the definition — say what it costs. If a list of 10 items takes 100 comparisons, '
      'then 100 items takes 10,000, and 1,000 items takes 1,000,000. Ten times the data, a hundred times '
      'the work. O(n log n) turns that 1,000,000 into roughly 10,000. That is the whole reason quicksort '
      'exists.</p>',
      '<p>Đừng đọc thuộc định nghĩa — hãy nói nó tốn bao nhiêu. Nếu 10 phần tử tốn 100 phép so sánh, thì '
      '100 phần tử tốn 10.000, và 1.000 phần tử tốn 1.000.000. Dữ liệu gấp mười lần, công việc gấp một '
      'trăm lần. O(n log n) biến con số 1.000.000 đó thành khoảng 10.000. Đó chính là toàn bộ lý do tồn '
      'tại của quicksort.</p>')

    h('Bubble sort, with the optimisation examiners ask about',
      'Sắp xếp nổi bọt, kèm phần tối ưu mà giám khảo hay hỏi')

    code('Bubble sort — and why the swapped flag matters',
         'Sắp xếp nổi bọt — và vì sao cần cờ swapped',
         """import java.util.Arrays;

public class BubbleSort {

    public static void sort(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            boolean swapped = false;

            // after i passes the last i items are already in place
            for (int j = 0; j < a.length - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int tmp = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = tmp;
                    swapped = true;
                }
            }
            if (!swapped) {
                return;        // already sorted - stop early
            }
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 1, 12, -5, 16};
        sort(a);
        System.out.println(Arrays.toString(a));

        int[] already = {1, 2, 3, 4, 5};
        sort(already);                      // one pass, no swaps, returns
        System.out.println(Arrays.toString(already));
    }
}""",
         src_vi="""import java.util.Arrays;

public class BubbleSort {

    public static void sort(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            boolean coDoiCho = false;

            // sau i luot thi i phan tu cuoi da dung vi tri -> khong duyet lai
            for (int j = 0; j < a.length - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int tam = a[j];              // doi cho hai phan tu ke nhau
                    a[j] = a[j + 1];
                    a[j + 1] = tam;
                    coDoiCho = true;
                }
            }
            if (!coDoiCho) {
                return;        // ca luot khong doi cho nao -> mang da sap xong
            }
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 1, 12, -5, 16};
        sort(a);
        System.out.println(Arrays.toString(a));

        int[] daSap = {1, 2, 3, 4, 5};
        sort(daSap);                     // chi 1 luot, khong doi cho, thoat luon
        System.out.println(Arrays.toString(daSap));
    }
}""")

    out('Real output', 'Kết quả chạy thật', '[-5, 1, 5, 12, 16]\n[1, 2, 3, 4, 5]')

    p('<p>Two details worth stating out loud in a defence: the inner loop stops at '
      '<code>length - 1 - i</code> because each pass parks one more element at the end, and the '
      '<code>swapped</code> flag turns the best case from O(n²) into O(n).</p>',
      '<p>Hai chi tiết đáng nói to trong buổi vấn đáp: vòng lặp trong dừng ở '
      '<code>length - 1 - i</code> vì mỗi lượt lại đưa thêm một phần tử về đúng chỗ ở cuối, và cờ '
      '<code>swapped</code> biến trường hợp tốt nhất từ O(n²) thành O(n).</p>')

    h('Binary search — and its one precondition',
      'Tìm kiếm nhị phân — và điều kiện tiên quyết duy nhất')

    code('Binary search on a sorted array',
         'Tìm nhị phân trên mảng đã sắp xếp',
         """public class BinarySearch {

    /** Returns the index of key, or -1 when absent. The array MUST be sorted. */
    public static int search(int[] a, int key) {
        int low = 0;
        int high = a.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;    // avoids overflow on huge arrays

            if (a[mid] == key)      return mid;
            else if (a[mid] < key)  low  = mid + 1;   // discard the left half
            else                    high = mid - 1;   // discard the right half
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {-1, 5, 6, 18, 19, 25, 46, 78, 102, 114};
        System.out.println(search(a, 6));      // 2
        System.out.println(search(a, 103));    // -1

        int[] unsorted = {5, 1, 12};
        System.out.println(search(unsorted, 5));   // 5 IS there - still reports -1
    }
}""")

    out('Real output', 'Kết quả chạy thật', '2\n-1\n-1')

    p('<p>Look at the last line. <code>5</code> is the very first element of that array, and binary '
      'search still returned <code>-1</code> — because the array was not sorted, so halving threw away '
      'the half that held the answer. It did not crash and it did not warn you. '
      '<strong>Sort first, always.</strong> This exact scenario is a standard defence question and now '
      'you have run it.</p>',
      '<p>Nhìn dòng cuối. Số <code>5</code> nằm ngay ở vị trí đầu tiên của mảng, vậy mà tìm nhị phân vẫn '
      'trả về <code>-1</code> — vì mảng chưa sắp xếp nên bước chia đôi đã vứt đi đúng nửa chứa đáp án. Nó '
      'không báo lỗi và cũng không cảnh báo gì. <strong>Luôn sắp xếp '
      'trước.</strong> Đúng tình huống này là câu hỏi vấn đáp kinh điển, và giờ bạn đã tự chạy nó.</p>')

    h('Recursion — three briefs need it', 'Đệ quy — ba đề cần đến')

    p('<p>Every recursive method needs two things: a <strong>base case</strong> that returns without '
      'recursing, and a step that moves <em>towards</em> that base case. Miss either and you get '
      '<code>StackOverflowError</code>.</p>',
      '<p>Mọi hàm đệ quy đều cần hai thứ: một <strong>trường hợp cơ sở</strong> trả về mà không gọi lại '
      'chính nó, và một bước tiến <em>về phía</em> trường hợp cơ sở đó. Thiếu một trong hai là bạn nhận '
      '<code>StackOverflowError</code>.</p>')

    code('Fibonacci two ways, and why one is unusable',
         'Fibonacci hai cách, và vì sao một cách không dùng được',
         """public class Fib {

    /** Recursive: matches the definition, but recomputes the same values endlessly. */
    public static long slow(int n) {
        if (n <= 1) return n;                 // base case
        return slow(n - 1) + slow(n - 2);
    }

    /** Iterative: one pass, O(n). Use this in the assignment. */
    public static long fast(int n) {
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            long next = a + b;
            a = b;
            b = next;
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println(slow(20) + " " + fast(20));

        long t0 = System.nanoTime();
        slow(32);
        long recursiveMs = (System.nanoTime() - t0) / 1_000_000;

        t0 = System.nanoTime();
        fast(32);
        long iterativeMs = (System.nanoTime() - t0) / 1_000_000;

        System.out.println("recursive took longer: " + (recursiveMs > iterativeMs));
        System.out.println("fib(90) = " + fast(90));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        '6765 6765\nrecursive took longer: true\nfib(90) = 2880067194370816120')

    p('<p><code>slow(32)</code> makes over two million calls to compute a number '
      '<code>fast</code> gets in 32 steps. Say that in the defence and the follow-up question usually '
      'stops there.</p>',
      '<p><code>slow(32)</code> thực hiện hơn hai triệu lời gọi để tính ra con số mà <code>fast</code> '
      'lấy được sau 32 bước. Nói câu đó lúc vấn đáp thì câu hỏi tiếp theo thường dừng lại ở đó.</p>')

    h('Number bases — three briefs', 'Hệ cơ số — ba đề')

    code('Converting between bases, by hand and by library',
         'Chuyển hệ cơ số, tự viết và bằng thư viện',
         """public class Bases {

    /** Decimal to any base, the algorithm the brief wants you to show. */
    public static String toBase(int value, int base) {
        if (value == 0) return "0";
        String digits = "0123456789ABCDEF";
        StringBuilder sb = new StringBuilder();
        while (value > 0) {
            sb.insert(0, digits.charAt(value % base));   // remainder = next digit
            value = value / base;                        // integer division
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(toBase(255, 2));      // 11111111
        System.out.println(toBase(255, 16));     // FF

        // the library equivalents, for checking your own answer
        System.out.println(Integer.toBinaryString(255));
        System.out.println(Integer.toHexString(255).toUpperCase());
        System.out.println(Integer.parseInt("FF", 16));
    }
}""")

    out('Real output', 'Kết quả chạy thật', '11111111\nFF\n11111111\nFF\n255')
