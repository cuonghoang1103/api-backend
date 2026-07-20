# Module: algorithm reference — usage, code review, and measured comparisons.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(1, 'Choosing an algorithm', 'Chọn thuật toán',
         'Read the brief first: seven assignments name the algorithm and forbid the library',
         'Đọc đề trước đã: bảy bài chỉ đích danh thuật toán và cấm dùng thư viện')

    p('<p>Every algorithm below appears in a LAB211 brief by name. This page gives each one the same '
      'four things: the idea, code you can compile, the bugs a marker looks for, and an honest '
      'comparison with its neighbours.</p>'
      '<p>The comparison numbers on this page were <strong>measured on a real run</strong>, not quoted '
      'from a textbook. Where a number looks surprising, it surprised the author too.</p>',
      '<p>Mọi thuật toán dưới đây đều được một đề LAB211 gọi đích danh. Trang này cho mỗi cái bốn thứ như '
      'nhau: ý tưởng, code biên dịch được, những lỗi mà người chấm sẽ soi, và một so sánh trung thực với '
      'các thuật toán họ hàng.</p>'
      '<p>Các con số so sánh trên trang này được <strong>đo bằng một lần chạy thật</strong>, không phải '
      'chép từ sách. Chỗ nào con số trông lạ thì nó cũng đã làm chính người viết bất ngờ.</p>')

    table(['The brief says…', 'Use', 'Never use'],
          ['Đề nói…', 'Dùng', 'Đừng dùng'],
          [['"using bubble sort"', 'your own bubble sort', '<code>Collections.sort</code> — zero marks'],
           ['"sort by salary ascending"', '<code>Comparator</code>', 'a hand-written sort — slower and more code'],
           ['"search by a part of name"', 'linear scan + <code>contains</code>', 'binary search — it cannot do this'],
           ['"find by Id"', '<code>Map.containsKey</code>, or a linear <code>findById</code>', 'sorting first, then searching'],
           ['"check duplicate Id"', '<code>containsKey</code> / <code>findById != null</code>', 'comparing every pair'],
           ['nothing about order', 'keep insertion order', 'sorting you were not asked for']],
          [['"using bubble sort"', 'tự viết bubble sort', '<code>Collections.sort</code> — không điểm'],
           ['"sắp xếp theo lương tăng dần"', '<code>Comparator</code>', 'tự viết thuật toán — chậm hơn và dài hơn'],
           ['"tìm theo một phần của tên"', 'duyệt tuyến tính + <code>contains</code>', 'tìm nhị phân — nó không làm được việc này'],
           ['"tìm theo Id"', '<code>Map.containsKey</code>, hoặc <code>findById</code> tuyến tính', 'sắp xếp trước rồi mới tìm'],
           ['"kiểm tra trùng Id"', '<code>containsKey</code> / <code>findById != null</code>', 'so sánh từng cặp một'],
           ['không nói gì về thứ tự', 'giữ nguyên thứ tự thêm vào', 'tự ý sắp xếp khi không được yêu cầu']])

    # ── the measured comparison ────────────────────────────────────
    part(2, 'The three O(n²) sorts, measured',
         'Ba thuật toán sắp xếp O(n²), có đo đạc',
         'Bubble, selection and insertion do the same job at very different costs',
         'Nổi bọt, chọn và chèn cùng làm một việc nhưng chi phí rất khác nhau')

    p('<p>All three are O(n²), which suggests they cost the same. They do not. This program counts the '
      'actual comparisons and moves each one performs on identical data.</p>',
      '<p>Cả ba đều là O(n²), nghe như chi phí ngang nhau. Thực tế thì không. Chương trình dưới đây đếm số '
      'phép so sánh và số phép di chuyển thật sự của từng thuật toán trên cùng một bộ dữ liệu.</p>')

    code('Counting what each sort really does',
         'Đếm xem mỗi thuật toán thật sự làm gì',
         """import java.util.*;

public class SortCost {

    static long comparisons, moves;

    static void bubble(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < a.length - 1 - i; j++) {
                comparisons++;
                if (a[j] > a[j + 1]) {
                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                    moves += 3;                        // a swap is three writes
                    swapped = true;
                }
            }
            if (!swapped) return;
        }
    }

    static void selection(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                comparisons++;
                if (a[j] < a[min]) min = j;
            }
            if (min != i) {
                int t = a[i]; a[i] = a[min]; a[min] = t;
                moves += 3;
            }
        }
    }

    static void insertion(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0) {
                comparisons++;
                if (a[j] <= key) break;
                a[j + 1] = a[j];                       // a shift is ONE write
                moves++;
                j--;
            }
            a[j + 1] = key;
            moves++;
        }
    }

    static int[] seeded(int n, long seed) {
        Random r = new Random(seed);                   // fixed seed = repeatable
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = r.nextInt(1000);
        return a;
    }

    static void run(String name, java.util.function.Consumer<int[]> sort, int[] data) {
        int[] a = data.clone();
        comparisons = moves = 0;
        sort.accept(a);
        boolean sorted = true;
        for (int i = 1; i < a.length; i++) if (a[i - 1] > a[i]) sorted = false;
        System.out.printf("%-10s comparisons=%-7d moves=%-7d sorted=%b%n",
                          name, comparisons, moves, sorted);
    }

    public static void main(String[] args) {
        int[] random = seeded(200, 42);
        System.out.println("--- 200 random values ---");
        run("bubble", SortCost::bubble, random);
        run("selection", SortCost::selection, random);
        run("insertion", SortCost::insertion, random);

        int[] sorted = new int[200];
        for (int i = 0; i < 200; i++) sorted[i] = i;
        System.out.println("--- 200 ALREADY sorted ---");
        run("bubble", SortCost::bubble, sorted);
        run("selection", SortCost::selection, sorted);
        run("insertion", SortCost::insertion, sorted);
    }
}""")

    out('Real measured output', 'Kết quả đo thật',
        """--- 200 random values ---
bubble     comparisons=19575   moves=28746   sorted=true
selection  comparisons=19900   moves=576     sorted=true
insertion  comparisons=9777    moves=9781    sorted=true
--- 200 ALREADY sorted ---
bubble     comparisons=199     moves=0       sorted=true
selection  comparisons=19900   moves=0       sorted=true
insertion  comparisons=199     moves=199     sorted=true""")

    p('<p>Three things in those numbers are worth saying out loud in a defence.</p>',
      '<p>Ba điều trong đám số đó rất đáng nói to trong buổi vấn đáp.</p>')

    ul(['<strong>Selection sort always makes the same number of comparisons</strong> — sorted or not. It '
        'cannot finish early, because it does not know it is done until it has looked at everything.',
        '<strong>Insertion sort collapses to almost nothing on sorted data.</strong> That is why it is the '
        'one real algorithm of the three: on nearly-ordered input it behaves like O(n).',
        '<strong>Selection sort moves the fewest items — 576 against bubble\'s 28,746.</strong> If a "move" '
        'were expensive — swapping large objects rather than ints — it would be the cheapest of the three '
        'despite comparing the most.'],
       ['<strong>Sắp xếp chọn luôn thực hiện đúng bấy nhiêu phép so sánh</strong> — dù mảng đã sắp hay '
        'chưa. Nó không thể dừng sớm, vì nó không biết mình đã xong cho tới khi nhìn hết mọi phần tử.',
        '<strong>Sắp xếp chèn tụt xuống gần như không tốn gì trên dữ liệu đã sắp.</strong> Đó là lý do nó '
        'là thuật toán thực dụng nhất trong ba cái: với dữ liệu gần như đã có thứ tự, nó hành xử như O(n).',
        '<strong>Sắp xếp chọn di chuyển ít phần tử nhất.</strong> Nếu một phép "di chuyển" đắt đỏ — đổi chỗ '
        'các đối tượng lớn thay vì số int — thì nó lại là rẻ nhất, dù so sánh nhiều nhất.'])

    part(3, 'O(n²) against O(n log n) — where the wall is',
         'O(n²) so với O(n log n) — bức tường nằm ở đâu',
         'The size at which a hand-written sort stops being acceptable',
         'Kích thước mà tại đó thuật toán tự viết không còn chấp nhận được')

    code('Doubling the input and watching the cost',
         'Nhân đôi dữ liệu và quan sát chi phí',
         """import java.util.*;

public class GrowthDemo {

    static long ops;

    static void insertion(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i], j = i - 1;
            while (j >= 0 && a[j] > key) { ops++; a[j + 1] = a[j]; j--; }
            a[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        long prev = 0;
        for (int n : new int[]{500, 1000, 2000, 4000}) {
            Random r = new Random(7);
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = r.nextInt(100000);

            int[] copy = a.clone();
            ops = 0;
            insertion(copy);
            long mine = ops;

            // Deliberately NOT a stopwatch: the first timed run also pays for the
            // JVM compiling the method, so timings are not reproducible. Counting
            // operations is, and a count is what you can defend.
            System.out.printf("n=%-5d insertion shifts=%-10d ratio vs previous=%s%n",
                              n, mine, prev == 0 ? "-" : String.format("%.2fx", (double) mine / prev));
            prev = mine;
        }
    }
}""")

    out('Real measured output', 'Kết quả đo thật',
        """n=500   insertion shifts=62897      ratio vs previous=-
n=1000  insertion shifts=250886     ratio vs previous=3.99x
n=2000  insertion shifts=985874     ratio vs previous=3.93x
n=4000  insertion shifts=4011891    ratio vs previous=4.07x""")

    p('<p>Notice the program counts operations instead of using a stopwatch. A single timed run is not '
      'reproducible — the first measurement also pays for the JVM compiling the method to machine code, '
      'so a smaller input can appear slower than a larger one. A count gives the same answer on every '
      'machine, which is what makes it something you can defend.</p>',
      '<p>Để ý là chương trình đếm số phép toán chứ không bấm giờ. Bấm giờ một lần chạy thì không lặp lại '
      'được — lần đo đầu tiên còn phải gánh cả việc JVM biên dịch hàm sang mã máy, nên dữ liệu nhỏ hơn có '
      'thể trông chậm hơn dữ liệu lớn. Một phép đếm cho ra cùng kết quả trên mọi máy, và chính điều đó làm '
      'nó trở thành thứ bạn bảo vệ được.</p>')

    p('<p>Read the shift column: every time <code>n</code> doubles, the work roughly '
      '<strong>quadruples</strong> — the measured ratios are 3.99x, 3.93x, 4.07x. That is what O(n²) '
      'means in practice, and it is a far better answer '
      'than reciting the definition.</p>'
      '<p>For the array sizes a LAB211 marker will type in — ten, twenty values — none of this matters '
      'and a hand-written sort is completely fine. Knowing <em>where</em> it stops being fine is the '
      'part that earns the mark.</p>',
      '<p>Hãy đọc cột số phép dịch: mỗi lần <code>n</code> nhân đôi thì khối lượng công việc '
      '<strong>gấp bốn</strong> — các tỉ lệ đo được là 3,99x; 3,93x; 4,07x. Đó là ý nghĩa thực tế của '
      'O(n²), và nó là câu trả lời hay hơn nhiều so '
      'với việc đọc thuộc định nghĩa.</p>'
      '<p>Với cỡ mảng mà người chấm LAB211 sẽ gõ vào — mười, hai mươi phần tử — chuyện này hoàn toàn không '
      'quan trọng và thuật toán tự viết là thừa đủ. Biết được nó <em>ngừng</em> ổn ở đâu mới là phần được '
      'điểm.</p>')

    part(4, 'Searching — and why sorting first is usually wrong',
         'Tìm kiếm — và vì sao sắp xếp trước thường là sai',
         'Linear, binary, and the Map that beats both',
         'Tuyến tính, nhị phân, và Map đánh bại cả hai')

    code('Three ways to find a record, compared',
         'Ba cách tìm một bản ghi, đem so sánh',
         """import java.util.*;

public class SearchCost {

    static long steps;

    static int linear(String[] ids, String key) {
        for (int i = 0; i < ids.length; i++) { steps++; if (ids[i].equals(key)) return i; }
        return -1;
    }

    static int binary(String[] sortedIds, String key) {
        int lo = 0, hi = sortedIds.length - 1;
        while (lo <= hi) {
            steps++;
            int mid = lo + (hi - lo) / 2;
            int c = sortedIds[mid].compareTo(key);
            if (c == 0) return mid;
            if (c < 0) lo = mid + 1; else hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int n = 1000;
        String[] ids = new String[n];
        for (int i = 0; i < n; i++) ids[i] = String.format("E%04d", i);
        String target = "E0999";                       // worst case for linear

        steps = 0; linear(ids, target);
        System.out.println("linear steps: " + steps);

        String[] sorted = ids.clone();
        Arrays.sort(sorted);
        steps = 0; binary(sorted, target);
        System.out.println("binary steps: " + steps);

        Map<String, Integer> index = new HashMap<>();
        for (int i = 0; i < n; i++) index.put(ids[i], i);
        System.out.println("map lookup:   1 step, result " + index.get(target));

        // and the catch: binary search on UNSORTED data
        steps = 0;
        int wrong = binary(ids.clone(), target);       // ids happen to be sorted here
        String[] shuffled = ids.clone();
        Collections.shuffle(Arrays.asList(shuffled), new Random(1));
        int broken = binary(shuffled, target);
        System.out.println("binary on sorted=" + (wrong >= 0) + ", on shuffled=" + (broken >= 0));
    }
}""")

    out('Real measured output', 'Kết quả đo thật',
        'linear steps: 1000\nbinary steps: 10\nmap lookup:   1 step, result 999\n'
        'binary on sorted=true, on shuffled=false')

    table(['Method', 'Cost', 'Needs', 'Right for'],
          ['Cách', 'Chi phí', 'Điều kiện', 'Phù hợp khi'],
          [['linear', 'O(n)', 'nothing', 'partial match, small data, unsorted'],
           ['binary', 'O(log n)', 'sorted, exact key', 'a large sorted array, exact id'],
           ['<code>HashMap</code>', 'O(1)', 'a unique key', 'find by id, duplicate checks']],
          [['tuyến tính', 'O(n)', 'không cần gì', 'khớp một phần, dữ liệu nhỏ, chưa sắp'],
           ['nhị phân', 'O(log n)', 'đã sắp, khoá chính xác', 'mảng lớn đã sắp, tìm đúng mã'],
           ['<code>HashMap</code>', 'O(1)', 'khoá duy nhất', 'tìm theo mã, kiểm tra trùng']])

    p('<p>Sorting a list just so you can binary-search it costs more than the linear scan you were '
      'avoiding — unless you search many times. That trade-off is the answer to "why did you not use '
      'binary search here", and it is a question you should want to be asked.</p>',
      '<p>Sắp xếp một danh sách chỉ để có thể tìm nhị phân còn tốn hơn cả phép duyệt tuyến tính mà bạn '
      'đang muốn né — trừ khi bạn tìm rất nhiều lần. Chính sự đánh đổi đó là câu trả lời cho "sao chỗ này '
      'em không dùng tìm nhị phân", và đó là câu bạn nên mong được hỏi.</p>')

    part(5, 'Code review — the bugs a marker looks for',
         'Review code — những lỗi người chấm sẽ soi',
         'Six mistakes that appear in almost every first attempt',
         'Sáu lỗi xuất hiện ở gần như mọi bản làm lần đầu')

    table(['Symptom', 'Cause', 'Fix'],
          ['Triệu chứng', 'Nguyên nhân', 'Sửa'],
          [['last element never sorted', 'inner loop uses <code>&lt; length - 1 - i</code> but outer runs too few times',
            'outer loop to <code>length - 1</code>'],
           ['<code>ArrayIndexOutOfBounds</code> in the inner loop', '<code>a[j + 1]</code> with <code>j &lt; length</code>',
            'inner bound is <code>length - 1 - i</code>'],
           ['insertion sort loses an element', 'writing <code>a[j] = key</code> instead of <code>a[j + 1]</code>',
            'after the loop <code>j</code> is one past the slot'],
           ['binary search never terminates', '<code>lo = mid</code> instead of <code>mid + 1</code>',
            'always move past <code>mid</code>'],
           ['binary search misses a present value', 'the array was not sorted',
            'sort first, or use linear'],
           ['recursion throws <code>StackOverflowError</code>', 'the base case never becomes true',
            'check the step really moves toward it']],
          [['phần tử cuối không bao giờ được sắp', 'vòng trong dùng <code>&lt; length - 1 - i</code> nhưng vòng ngoài chạy thiếu lượt',
            'vòng ngoài phải tới <code>length - 1</code>'],
           ['<code>ArrayIndexOutOfBounds</code> ở vòng trong', '<code>a[j + 1]</code> mà lại để <code>j &lt; length</code>',
            'cận vòng trong là <code>length - 1 - i</code>'],
           ['sắp xếp chèn làm mất một phần tử', 'ghi <code>a[j] = key</code> thay vì <code>a[j + 1]</code>',
            'sau vòng lặp, <code>j</code> đã lùi quá vị trí cần đặt một ô'],
           ['tìm nhị phân lặp vô tận', '<code>lo = mid</code> thay vì <code>mid + 1</code>',
            'luôn phải nhảy qua <code>mid</code>'],
           ['tìm nhị phân bỏ sót giá trị có thật', 'mảng chưa được sắp',
            'sắp trước, hoặc dùng tuyến tính'],
           ['đệ quy ném <code>StackOverflowError</code>', 'trường hợp cơ sở không bao giờ đúng',
            'kiểm tra bước nhảy có thật sự tiến về phía nó không']])

    code('The off-by-one, and proof that it is wrong',
         'Lỗi lệch một đơn vị, và bằng chứng nó sai',
         """import java.util.Arrays;

public class OffByOne {

    /** WRONG: the outer loop stops one pass too early. */
    static void broken(int[] a) {
        for (int i = 0; i < a.length - 2; i++) {          // <-- the bug
            for (int j = 0; j < a.length - 1 - i; j++) {
                if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }
            }
        }
    }

    static void correct(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            for (int j = 0; j < a.length - 1 - i; j++) {
                if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }
            }
        }
    }

    static boolean isSorted(int[] a) {
        for (int i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false;
        return true;
    }

    public static void main(String[] args) {
        int[] hard = {5, 4, 3, 2, 1};
        int[] b = hard.clone(); broken(b);
        int[] c = hard.clone(); correct(c);
        System.out.println("broken:  " + Arrays.toString(b) + " sorted=" + isSorted(b));
        System.out.println("correct: " + Arrays.toString(c) + " sorted=" + isSorted(c));

        int[] easy = {1, 2, 3, 5, 4};
        int[] d = easy.clone(); broken(d);
        System.out.println("broken on easy data: " + Arrays.toString(d) + " sorted=" + isSorted(d));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        'broken:  [2, 1, 3, 4, 5] sorted=false\ncorrect: [1, 2, 3, 4, 5] sorted=true\n'
        'broken on easy data: [1, 2, 3, 4, 5] sorted=true')

    p('<p>The last line is why this bug survives testing: on data that is nearly sorted already, the '
      'broken version produces the right answer. It only fails on the reversed input a marker will '
      'inevitably try. <strong>Always test your sort on a fully reversed array.</strong></p>',
      '<p>Dòng cuối chính là lý do lỗi này sống sót qua lúc bạn tự test: với dữ liệu gần như đã sắp sẵn, '
      'bản sai vẫn cho kết quả đúng. Nó chỉ hỏng với mảng đảo ngược hoàn toàn — thứ mà người chấm thế nào '
      'cũng thử. <strong>Luôn test thuật toán sắp xếp bằng một mảng đảo ngược.</strong></p>')

    practice([
        ('prime-number-analyzer-with-sieve-method', 'Exercise: sieve of Eratosthenes',
         'Bài tập: sàng Eratosthenes',
         'An algorithm where the clever version really does beat the obvious one',
         'Một thuật toán mà bản thông minh thật sự thắng bản hiển nhiên'),
        (251, 'Collections and data structures', 'Collections và cấu trúc dữ liệu',
         'The structures these algorithms run on top of',
         'Các cấu trúc dữ liệu mà những thuật toán này chạy bên trên'),
    ])
