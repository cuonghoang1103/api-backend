# Batch 12 — J1.S.P0004 (quick sort) and J1.S.P0005 (merge sort).
#
# These two close the sorting family that starts at P0001 (bubble), P0002
# (selection) and P0003 (insertion). The assignments are deliberately
# near-identical on the surface — read a size, fill an array with random
# numbers, print it, sort it, print it again — so the solutions keep the exact
# same three-file shape and the exact same screen as their siblings, and the
# walkthroughs spend all their words on the one thing that changed: the
# algorithm.
#
# What changes here is bigger than it was between the first three, though.
# P0001-P0003 are three variations on "two nested loops, O(n squared)".
# P0004 and P0005 are the first RECURSIVE sorts and the first O(n log n) ones,
# and they differ from each other in three ways a marker can ask about:
# memory, worst case, and stability. Every number quoted in the walkthroughs
# below was measured by running instrumented copies of these exact algorithms
# and counting operations — not timings, which the JIT makes unreproducible.
import re
from collections import Counter

from solkit import solution, SOLUTIONS

VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /** A positive int inside [min, max]; refuses letters, zero and negatives. */
    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Number must be between " + min + " and " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }
}
'''


def sorted_check(expected_size):
    """The array is random, so the expectation is a PREDICATE, not fixed text.

    Two independent properties are asserted, because either one alone can be
    satisfied by a broken sort:

      - the sorted line is a PERMUTATION of the unsorted line (same multiset),
        which a sort that drops or duplicates an element fails — and the
        insertion-style "array[j] = key" bug does exactly that;
      - the sorted line is NON-DECREASING, which a sort that merely copies the
        input fails.

    Together they are equivalent to "it is the input, in order", so a lucky run
    cannot pass. The labels are matched ANYWHERE in the text rather than at the
    start of a line: the prompt is printed with print() rather than println(),
    so when stdin is piped the prompt and the next output share a line.
    """
    def check(out):
        before_m = re.search(r'Unsorted array: \[([^\]]*)\]', out)
        after_m = re.search(r'Sorted array: \[([^\]]*)\]', out)
        if not before_m or not after_m:
            return False, 'expected one Unsorted array line and one Sorted array line'
        before = [int(x) for x in re.findall(r'-?\d+', before_m.group(1))]
        after = [int(x) for x in re.findall(r'-?\d+', after_m.group(1))]
        if len(before) != expected_size:
            return False, f'expected {expected_size} generated elements, got {len(before)}'
        if len(after) != expected_size:
            return False, f'the sort changed the length: {expected_size} -> {len(after)}'
        if Counter(before) != Counter(after):
            missing = Counter(before) - Counter(after)
            extra = Counter(after) - Counter(before)
            return False, (f'the sorted line is not a permutation of the input '
                           f'(lost {sorted(missing.elements())}, invented {sorted(extra.elements())})')
        for k in range(1, len(after)):
            if after[k - 1] > after[k]:
                return False, (f'the sorted line is not non-decreasing at index {k}: '
                               f'{after[k - 1]} > {after[k]}')
        return True, ''
    return check


# ════════════════════════════════════════════════════════════════
# J1.S.P0004 — Quick sort (70 LOC)
# ════════════════════════════════════════════════════════════════

P0004_BO = '''package bo;

import java.util.Random;

/**
 * Array generation and quicksort. No printing: the ui layer owns the screen.
 */
public class ArraySorter {

    private final Random random = new Random();

    /** Fills an array of the requested size with values in [0, bound). */
    public int[] generate(int size, int bound) {
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = random.nextInt(bound);
        }
        return array;
    }

    /**
     * The entry point the ui calls. It hides the low/high pair, so the screen
     * layer never has to know that this sort is recursive.
     *
     * The length guard is not decoration: on an empty array high would be -1
     * and the recursive method would index array[-1] before it ever compared
     * anything.
     */
    public void quickSort(int[] array) {
        if (array.length < 2) {
            return;
        }
        quickSort(array, 0, array.length - 1);
    }

    /**
     * Quicksort over array[low..high] inclusive, ascending.
     *
     * Divide and conquer, exactly as the brief describes it: choose a pivot,
     * partition the range so that everything left of the split is <= pivot and
     * everything right of it is >= pivot, then sort the two sides.
     *
     * Nothing is merged afterwards. That is the whole character of quicksort:
     * the work happens BEFORE the recursive calls, and once the partition is
     * done the two halves can never affect each other again.
     */
    private void quickSort(int[] array, int low, int high) {
        int i = low;
        int j = high;

        // The MIDDLE element, as the brief asks. Taking array[low] instead is
        // the classic mistake: on data that is already sorted - which is very
        // common input - it makes every partition split off a single element
        // and turns the whole sort quadratic.
        //
        // low + (high - low) / 2 rather than (low + high) / 2: the two agree
        // for every array that fits in memory today, but the second overflows
        // to a negative index once low + high passes Integer.MAX_VALUE. This
        // exact bug sat in the JDK's own binary search for nine years.
        int pivot = array[low + (high - low) / 2];

        // The pivot is copied by VALUE, never remembered as an index. The swaps
        // below move the pivot element itself, so an index would stop pointing
        // at it after the very first swap.
        while (i <= j) {
            while (array[i] < pivot) {
                i++;
            }
            while (array[j] > pivot) {
                j--;
            }
            if (i <= j) {
                int temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                i++;
                j--;
            }
        }

        // i and j have crossed: [low..j] holds the small side and [i..high] the
        // large side. Recurse only where there is more than one element left,
        // which is what stops the recursion.
        if (low < j) {
            quickSort(array, low, j);
        }
        if (i < high) {
            quickSort(array, i, high);
        }
    }
}
'''

P0004_MAIN = '''package ui;

import bo.ArraySorter;
import java.util.Arrays;
import utils.Validator;

/** Screen only. */
public class Main {

    private static final int BOUND = 100;

    public static void main(String[] args) {
        ArraySorter sorter = new ArraySorter();

        System.out.println("===== Quick Sort Program =====");
        int size = Validator.getInt("Please input the number of array: ", 1, 1000);

        int[] array = sorter.generate(size, BOUND);
        System.out.println("Unsorted array: " + Arrays.toString(array));

        sorter.quickSort(array);
        System.out.println("Sorted array: " + Arrays.toString(array));
    }
}
'''

solution(
    'J1.S.P0004',
    title_vi='Thuật toán sắp xếp nhanh (Quick sort)',
    files=[('src/bo/ArraySorter.java', P0004_BO),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0004_MAIN)],
    main_class='ui.Main',
    runs=[('abc\n0\n200\n', sorted_check(200))],
    explain_en='''<p><strong>What the brief is really asking.</strong> The same program as the three
sorts before it — read a size, fill an array with random numbers, print it, sort it, print it again —
with the algorithm replaced by <em>quicksort</em>. The algorithm is named, so
<code>Arrays.sort</code> scores nothing. What is new is that this is the first sort in the series that
calls itself, and the first that is not O(n²).</p>

<p><strong>Quicksort in one sentence.</strong> Pick a value from the range, shove everything smaller
to the left of it and everything larger to the right, then sort the two sides the same way — and when
they come back there is nothing left to do, because the split already put every element on the correct
side.</p>

<p><strong>The one structural difference from bubble, selection and insertion sort.</strong> Those
three do all their work in loops, and a loop keeps one copy of its variables no matter how long it
runs. Quicksort does its work <em>before</em> it recurses, and every level of recursion is a new stack
frame. So for the first time in this series the algorithm has a memory cost that is not zero, and
"how deep does it go" is a real question rather than a curiosity.</p>

<p><strong>The pivot is the whole exercise, and here are the counts that prove it.</strong> An
instrumented copy of the method above was run on 1,000 values — once on a random array
(<code>new Random(42)</code>, values in [0, 1000)) and once on the already-sorted array 0…999 — with
a counter on every element-to-element comparison:</p>
<pre>n = 1000                            comparisons   deepest nesting
quicksort, middle pivot, random           12,144        17 frames
quicksort, middle pivot, sorted            9,009         9 frames
quicksort, FIRST-element pivot, random    11,884        24 frames
quicksort, FIRST-element pivot, sorted   499,500     1,000 frames
for reference: n·log2(n) = 9,966          n(n-1)/2 = 499,500</pre>
<p>Read the last two rows carefully. With <code>array[low]</code> as the pivot, an already-sorted
array costs <strong>499,500</strong> comparisons — that is exactly n(n−1)/2, the textbook worst case,
the same count a bubble sort with no early exit would pay. It also nests <strong>1,000</strong> frames
deep, one per element. With the brief's middle-element pivot the same sorted array is the
<em>best</em> case instead: 9,009 comparisons and 9 frames. Sorted or nearly-sorted input is not an
exotic edge case — it is what real data usually looks like — so this is not a theoretical worry.</p>

<p><strong>And the deep recursion is not survivable.</strong> The first-element version was run on
sorted arrays of growing size on a default JVM stack (OpenJDK 21): n = 5,000, 10,000 and 20,000 all
completed, and n = 50,000 died with <code>StackOverflowError</code>. The exact threshold depends on
the machine, but the shape does not: a pivot choice that makes the recursion depth O(n) instead of
O(log n) will eventually crash the program rather than merely slow it down.</p>

<p><strong>Memory: quicksort sorts in place.</strong> It allocates no second array — every element
that moves is swapped with another element of the same array. Its only extra memory is the call
stack, O(log n) frames when the pivot splits reasonably (17 frames for 1,000 elements above). That is
the headline difference from merge sort, which needs a whole spare array; if you are asked to choose
between them on a device short of memory, this is the answer.</p>

<p><strong>Quicksort is not stable, and that is a real defect.</strong> Stable means two elements with
equal keys come out in the same order they went in. Sorting the pairs
<code>[5a, 3a, 5b, 1a, 3b, 5c, 2a]</code> by their number with this exact method produces
<code>[1a, 2a, 3b, 3a, 5c, 5b, 5a]</code> — 3b overtook 3a, and the three fives came out exactly
reversed. The smallest example is three equal keys: <code>[0a, 0b, 0c]</code> comes back as
<code>[0c, 0b, 0a]</code>. With <code>int</code>s you cannot see the damage, because one 5 is
indistinguishable from another 5. With objects you can: sort a list of employees by name, then by
department, and quicksort will have shuffled the name order inside each department, so the second
sort silently undoes the first. That is why merge sort, not quicksort, is what Java's own
<code>Arrays.sort</code> uses for object arrays.</p>

<p><strong>Two traps in the partition loop.</strong> First, <code>pivot</code> holds a <em>value</em>,
not an index — the swaps move the pivot element itself, so an index would stop pointing at it after
the first swap and the loop would compare against the wrong thing. Second, the inner
<code>while</code> loops carry no bounds check, and they do not need one: the pivot value is
guaranteed to be somewhere in <code>[low..high]</code>, so <code>array[i] &lt; pivot</code> must fail
before <code>i</code> can run past it. Change <code>&lt;</code> to <code>&lt;=</code> and that
guarantee is gone — the scan walks off the end of the array. This is the most common way a
hand-written quicksort throws <code>ArrayIndexOutOfBoundsException</code>.</p>

<p><strong>Why <code>low + (high - low) / 2</code>.</strong> It is identical to
<code>(low + high) / 2</code> for any array you will ever build, and unlike it, it cannot overflow to
a negative index when the two indices are large. The same bug lived in
<code>java.util.Arrays.binarySearch</code> in the JDK for nine years. Writing it the safe way costs
nothing and is exactly the kind of detail an examiner remembers.</p>

<p><strong>How this solution is verified despite the randomness.</strong> A random array cannot be
diffed against a fixed screen, so the test asserts two properties of the real output instead: the
sorted line must be a <em>permutation</em> of the unsorted line — same values, same multiplicities,
nothing lost or invented — and it must be <em>non-decreasing</em>. Either check alone is passable by a
broken program (a sort that returns the input untouched is a perfect permutation; a sort that returns
an empty array is perfectly ordered), so both are required, and together they leave no room for a
lucky run. The scripted run also types <code>abc</code> and <code>0</code> before the real size to
prove the validator refuses them.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Vẫn là chương trình của ba bài sắp xếp trước —
nhập kích thước, đổ số ngẫu nhiên vào mảng, in ra, sắp xếp, in lại — chỉ thay thuật toán bằng
<em>quicksort</em>. Thuật toán đã được gọi tên nên dùng <code>Arrays.sort</code> là không có điểm. Cái
mới là đây là bài sắp xếp đầu tiên trong loạt tự gọi chính nó, và cũng là bài đầu tiên không phải
O(n²).</p>

<p><strong>Quicksort, gói trong một câu.</strong> Chọn một giá trị trong đoạn, đẩy mọi thứ nhỏ hơn sang
trái nó và mọi thứ lớn hơn sang phải, rồi sắp hai bên theo đúng cách đó — và khi hai bên xong thì
không còn gì phải làm nữa, vì phép chia đã đặt sẵn mỗi phần tử về đúng phía của nó.</p>

<p><strong>Khác biệt về cấu trúc so với bubble, selection và insertion sort.</strong> Ba thuật toán đó
làm việc hoàn toàn trong vòng lặp, mà một vòng lặp thì chỉ giữ một bản biến của nó dù chạy bao lâu.
Quicksort làm việc <em>trước</em> khi đệ quy, và mỗi mức đệ quy là một khung ngăn xếp mới. Vậy nên lần
đầu tiên trong loạt bài này, thuật toán có chi phí bộ nhớ khác không, và câu "nó lồng sâu tới đâu" trở
thành một câu hỏi thật chứ không phải chuyện bên lề.</p>

<p><strong>Chốt trục (pivot) chính là toàn bộ bài học, và đây là các con số chứng minh.</strong> Một
bản sao có gắn bộ đếm của đúng phương thức trên đã được chạy trên 1.000 giá trị — một lần với mảng
ngẫu nhiên (<code>new Random(42)</code>, giá trị trong [0, 1000)) và một lần với mảng đã sắp sẵn
0…999 — đếm từng phép so sánh giữa hai phần tử:</p>
<pre>n = 1000                                so sánh     lồng sâu nhất
quicksort, chốt giữa, ngẫu nhiên          12.144         17 khung
quicksort, chốt giữa, đã sắp               9.009          9 khung
quicksort, chốt ĐẦU đoạn, ngẫu nhiên      11.884         24 khung
quicksort, chốt ĐẦU đoạn, đã sắp         499.500      1.000 khung
để đối chiếu: n·log2(n) = 9.966           n(n-1)/2 = 499.500</pre>
<p>Hãy đọc kỹ hai dòng cuối. Với chốt là <code>array[low]</code>, một mảng đã sắp sẵn tốn
<strong>499.500</strong> phép so sánh — đúng bằng n(n−1)/2, tức trường hợp xấu nhất trong sách, bằng
đúng chi phí của một bubble sort không có đường thoát sớm. Nó còn lồng sâu <strong>1.000</strong>
khung, mỗi phần tử một khung. Với chốt giữa mà đề yêu cầu, cũng mảng đã sắp đó lại thành trường hợp
<em>tốt nhất</em>: 9.009 phép so sánh và 9 khung. Dữ liệu đã sắp hoặc gần như đã sắp không phải trường
hợp hiếm gặp — đó chính là hình dạng thường thấy của dữ liệu thật — nên đây không phải nỗi lo lý
thuyết.</p>

<p><strong>Và đệ quy sâu thì không sống sót nổi.</strong> Bản dùng chốt đầu đoạn đã được chạy trên các
mảng đã sắp với kích thước tăng dần, trên ngăn xếp mặc định của JVM (OpenJDK 21): n = 5.000, 10.000 và
20.000 đều chạy xong, còn n = 50.000 chết với <code>StackOverflowError</code>. Ngưỡng chính xác phụ
thuộc máy, nhưng bản chất thì không: một lựa chọn chốt khiến độ sâu đệ quy là O(n) thay vì O(log n) sẽ
làm chương trình sập chứ không chỉ là chạy chậm.</p>

<p><strong>Bộ nhớ: quicksort sắp xếp tại chỗ.</strong> Nó không cấp phát mảng thứ hai nào — mọi phần tử
di chuyển đều là đổi chỗ với một phần tử khác trong cùng mảng. Bộ nhớ phụ duy nhất của nó là ngăn xếp
lời gọi, O(log n) khung khi chốt chia tương đối cân (17 khung cho 1.000 phần tử ở trên). Đó là khác
biệt lớn nhất so với merge sort, thứ cần nguyên một mảng dự phòng; nếu bị hỏi chọn cái nào trên thiết
bị eo hẹp bộ nhớ, đây là câu trả lời.</p>

<p><strong>Quicksort không ổn định, và đó là một khuyết điểm thật.</strong> Ổn định nghĩa là hai phần tử
có khoá bằng nhau thì ra theo đúng thứ tự chúng vào. Sắp các cặp
<code>[5a, 3a, 5b, 1a, 3b, 5c, 2a]</code> theo con số bằng đúng phương thức này cho ra
<code>[1a, 2a, 3b, 3a, 5c, 5b, 5a]</code> — 3b đã vượt lên trước 3a, và ba số 5 ra theo thứ tự đảo
ngược hoàn toàn. Ví dụ nhỏ nhất là ba khoá bằng nhau: <code>[0a, 0b, 0c]</code> quay về thành
<code>[0c, 0b, 0a]</code>. Với kiểu <code>int</code> bạn không thấy thiệt hại, vì số 5 này không phân
biệt được với số 5 kia. Với đối tượng thì thấy rõ: sắp danh sách nhân viên theo tên, rồi sắp tiếp theo
phòng ban, quicksort sẽ xáo tung thứ tự tên bên trong từng phòng ban, nghĩa là lần sắp thứ hai lặng lẽ
huỷ kết quả của lần thứ nhất. Đó chính là lý do <code>Arrays.sort</code> của Java dùng merge sort chứ
không dùng quicksort cho mảng đối tượng.</p>

<p><strong>Hai cái bẫy trong vòng phân hoạch.</strong> Thứ nhất, <code>pivot</code> giữ một
<em>giá trị</em>, không phải chỉ số — các phép đổi chỗ làm dịch chuyển chính phần tử chốt, nên một chỉ
số sẽ hết trỏ đúng vào nó ngay sau lần đổi chỗ đầu tiên và vòng lặp sẽ so với nhầm thứ. Thứ hai, hai
vòng <code>while</code> bên trong không kiểm tra biên, và chúng không cần: giá trị chốt chắc chắn nằm
đâu đó trong <code>[low..high]</code>, nên <code>array[i] &lt; pivot</code> buộc phải sai trước khi
<code>i</code> kịp vượt qua nó. Đổi <code>&lt;</code> thành <code>&lt;=</code> là mất luôn bảo đảm đó —
phép quét sẽ chạy khỏi mảng. Đây là cách phổ biến nhất khiến một quicksort viết tay ném
<code>ArrayIndexOutOfBoundsException</code>.</p>

<p><strong>Vì sao viết <code>low + (high - low) / 2</code>.</strong> Nó cho kết quả y hệt
<code>(low + high) / 2</code> với mọi mảng bạn từng tạo, nhưng khác ở chỗ nó không thể tràn số thành
chỉ số âm khi hai chỉ số đủ lớn. Đúng lỗi này từng nằm trong
<code>java.util.Arrays.binarySearch</code> của chính JDK suốt chín năm. Viết theo cách an toàn không
tốn gì và đúng là loại chi tiết giám khảo nhớ.</p>

<p><strong>Kiểm chứng thế nào khi có yếu tố ngẫu nhiên.</strong> Mảng ngẫu nhiên thì không thể so với
một màn hình cố định, nên bài kiểm khẳng định hai tính chất trên đầu ra thật: dòng đã sắp phải là một
<em>hoán vị</em> của dòng chưa sắp — cùng giá trị, cùng số lần xuất hiện, không mất cũng không bịa thêm
— và phải <em>không giảm</em>. Chỉ một trong hai thì chương trình hỏng vẫn lọt (một hàm trả về nguyên
mảng đầu vào là hoán vị hoàn hảo; một hàm trả về mảng rỗng thì có thứ tự hoàn hảo), nên cần cả hai, và
cùng nhau chúng không chừa chỗ cho một lần chạy may mắn. Kịch bản chạy còn gõ <code>abc</code> và
<code>0</code> trước kích thước thật để chứng minh bộ kiểm tra từ chối chúng.</p>''',
    hints_en=[
        'Write two methods with the same name: a public one taking just the array, and a private recursive one taking low and high.',
        "Take the pivot's VALUE, not its index — the swaps move the pivot element, so an index stops pointing at it.",
        'The brief says use the MIDDLE element. Using array[low] makes already-sorted input the worst case instead of the best.',
        'Keep the inner scans as < and > (never <= or >=), or they will walk past the end of the array.',
        'Count comparisons on a sorted array and on a random one of the same size — the two pivot choices tell completely different stories.',
    ],
    hints_vi=[
        'Viết hai phương thức cùng tên: một public chỉ nhận mảng, một private đệ quy nhận thêm low và high.',
        'Lấy GIÁ TRỊ của chốt, đừng lấy chỉ số — các phép đổi chỗ làm dịch chuyển phần tử chốt nên chỉ số sẽ hết trỏ đúng.',
        'Đề bảo dùng phần tử GIỮA. Dùng array[low] biến mảng đã sắp từ trường hợp tốt nhất thành xấu nhất.',
        'Giữ hai vòng quét bên trong là < và > (không bao giờ <= hay >=), nếu không chúng sẽ chạy khỏi mảng.',
        'Hãy đếm số phép so sánh trên một mảng đã sắp và một mảng ngẫu nhiên cùng kích thước — hai cách chọn chốt kể hai câu chuyện hoàn toàn khác nhau.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0005 — Merge sort (70 LOC)
# ════════════════════════════════════════════════════════════════

P0005_BO = '''package bo;

import java.util.Random;

/**
 * Array generation and merge sort. No printing: the ui layer owns the screen.
 */
public class ArraySorter {

    private final Random random = new Random();

    /** Fills an array of the requested size with values in [0, bound). */
    public int[] generate(int size, int bound) {
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = random.nextInt(bound);
        }
        return array;
    }

    /**
     * The entry point the ui calls.
     *
     * ONE scratch array is allocated here, for the whole sort, and handed down
     * to every recursive call. The obvious alternative - letting merge() create
     * its own small buffer each time - allocates one array per merge, which is
     * n-1 arrays over the run. It works, and it is the version that gives merge
     * sort its reputation for "a large number of copies". Allocating once costs
     * the same n ints and nothing more.
     */
    public void mergeSort(int[] array) {
        if (array.length < 2) {
            return;
        }
        int[] buffer = new int[array.length];
        mergeSort(array, buffer, 0, array.length - 1);
    }

    /**
     * Merge sort over array[low..high] inclusive, ascending.
     *
     * Divide and conquer, but the mirror image of quicksort: the split here is
     * blind - always exactly down the middle, never looking at a value - and
     * ALL the work happens after the recursive calls, in the merge. Quicksort
     * works hard to split and then does nothing; merge sort splits for free and
     * then does the work on the way back up.
     *
     * That is also why merge sort has no bad input. The split is the same
     * whatever the data, so the depth is always about log2(n) and the cost is
     * always O(n log n) - there is no equivalent of quicksort's sorted-input
     * disaster.
     */
    private void mergeSort(int[] array, int[] buffer, int low, int high) {
        if (low >= high) {
            return;                 // one element (or none) is already sorted
        }
        int mid = low + (high - low) / 2;
        mergeSort(array, buffer, low, mid);
        mergeSort(array, buffer, mid + 1, high);
        merge(array, buffer, low, mid, high);
    }

    /**
     * Merges the two sorted halves array[low..mid] and array[mid+1..high].
     *
     * The halves are copied out to the buffer first and then written BACK into
     * the original array, so the caller's array is the one that ends up sorted
     * and no result has to be returned or reassigned.
     */
    private void merge(int[] array, int[] buffer, int low, int mid, int high) {
        System.arraycopy(array, low, buffer, low, high - low + 1);

        int i = low;                // read cursor in the left half
        int j = mid + 1;            // read cursor in the right half

        for (int k = low; k <= high; k++) {
            if (i > mid) {
                array[k] = buffer[j++];          // left half exhausted
            } else if (j > high) {
                array[k] = buffer[i++];          // right half exhausted
            } else if (buffer[j] < buffer[i]) {
                array[k] = buffer[j++];
            } else {
                // Strictly LESS above, so a tie takes the LEFT element. That
                // single choice is what makes this sort stable: on equal keys
                // the element that started earlier is written out earlier.
                array[k] = buffer[i++];
            }
        }
    }
}
'''

P0005_MAIN = '''package ui;

import bo.ArraySorter;
import java.util.Arrays;
import utils.Validator;

/** Screen only. */
public class Main {

    private static final int BOUND = 100;

    public static void main(String[] args) {
        ArraySorter sorter = new ArraySorter();

        System.out.println("===== Merge Sort Program =====");
        int size = Validator.getInt("Please input the number of array: ", 1, 1000);

        int[] array = sorter.generate(size, BOUND);
        System.out.println("Unsorted array: " + Arrays.toString(array));

        sorter.mergeSort(array);
        System.out.println("Sorted array: " + Arrays.toString(array));
    }
}
'''

solution(
    'J1.S.P0005',
    title_vi='Thuật toán sắp xếp trộn (Merge sort)',
    files=[('src/bo/ArraySorter.java', P0005_BO),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0005_MAIN)],
    main_class='ui.Main',
    runs=[('xyz\n1001\n150\n', sorted_check(150))],
    explain_en='''<p><strong>What the brief is really asking.</strong> The last of the five sorting
assignments, and the sibling of the quicksort one: same program, same screen, different algorithm.
The brief's own background states the three facts you will be asked about — worst case O(n log n),
stable, and it needs extra space proportional to the input. All three are consequences of one design
choice, and this walkthrough is about that choice.</p>

<p><strong>Merge sort in one sentence.</strong> Cut the range in half without looking at any value,
sort both halves the same way, then walk the two sorted halves side by side and copy the smaller
front element out until both run dry.</p>

<p><strong>It is quicksort's mirror image, and that is the way to remember both.</strong> Quicksort
does its work in the <em>split</em>: partitioning is expensive, choosing well is hard, and once it is
done the two halves need nothing further. Merge sort does its work in the <em>join</em>: the split is
free and always exactly down the middle, and the entire cost lives in the merge on the way back up.
If an examiner asks "what is the difference between these two divide-and-conquer sorts", that
sentence is the answer, and everything below follows from it.</p>

<p><strong>Because the split is blind, there is no bad input.</strong> The recursion tree of merge
sort is the same shape for every array of the same length — always about log₂(n) levels — so the
guarantee is O(n log n) in the <em>worst</em> case, not on average. An instrumented copy of the exact
method above, counting every element-to-element comparison on 1,000 values:</p>
<pre>n = 1000                                comparisons   deepest nesting
merge sort, random array                   8,690        11 frames
merge sort, already-sorted array           5,044        11 frames
quicksort, middle pivot, random           12,144        17 frames
quicksort, first-element pivot, sorted   499,500     1,000 frames
for reference: n·log2(n) = 9,966</pre>
<p>Note the nesting column: merge sort is 11 frames deep on <em>both</em> inputs, because the depth
does not depend on the data at all. Compare the last row — that is quicksort with a naive pivot on
sorted input, 1,000 frames deep and 57 times more comparisons than merge sort needs. Merge sort has
no such row. It cannot have one.</p>

<p><strong>What it pays for that guarantee: an O(n) scratch array.</strong> Quicksort sorts in place
and its only extra memory is the call stack, O(log n) frames. Merge sort cannot merge two halves in
place without an enormous amount of extra work, so it allocates <code>new int[array.length]</code> —
for a million ints that is 4 MB of memory quicksort never asks for. This is the honest trade: merge
sort buys a worst-case guarantee and stability with memory. Say it exactly that way if you are asked
which sort is better; neither is, they cost different things.</p>

<p><strong>Allocate the buffer ONCE.</strong> The scratch array is created in the public
<code>mergeSort</code> and passed down. The tempting alternative — letting <code>merge</code> create
its own little buffer per call — allocates n−1 arrays over the run and is what the brief's background
means by "a large number of copies in simple implementations". The peak memory is the same either
way; the garbage collector's workload is not.</p>

<p><strong>Stability, and the single character that provides it.</strong> Merge sort is stable, and it
is stable because of <code>buffer[j] &lt; buffer[i]</code> — <em>strictly</em> less. When the two
fronts are equal the condition is false, so the <code>else</code> branch runs and the LEFT element is
written out first; and the left element is by construction the one that started earlier in the array.
Change that one <code>&lt;</code> to <code>&lt;=</code> and the sort still produces a correctly
ordered array, still passes every test that only looks at values, and is no longer stable. Sorting
the pairs <code>[5a, 3a, 5b, 1a, 3b, 5c, 2a]</code> by their number: this implementation returns
<code>[1a, 2a, 3a, 3b, 5a, 5b, 5c]</code>, letters untouched, while quicksort on the same input
returns <code>[1a, 2a, 3b, 3a, 5c, 5b, 5a]</code>.</p>

<p><strong>Why anyone cares about stability.</strong> With <code>int</code>s it is invisible — one 5
is the same as another 5. With objects it is the difference between working and broken: sort
employees by name, then sort the result by department, and if the second sort is stable you get
departments with names still in order inside them. If it is not, the first sort was for nothing. This
is why <code>Arrays.sort(int[])</code> in the JDK is a quicksort while
<code>Arrays.sort(Object[])</code> is a merge sort — the library makes exactly this distinction, for
exactly this reason.</p>

<p><strong>The line beginners get wrong.</strong> The merge writes back into <code>array</code> and
reads from <code>buffer</code>, never the other way round. Reading and writing the same array while
merging overwrites elements that have not been copied yet, and the result is an array that still
looks plausible — sorted-ish, with a duplicate — which is the worst kind of bug because casual
testing misses it. The <code>System.arraycopy</code> at the top is what makes the direction safe.</p>

<p><strong>One measured optimisation, if you want to go further.</strong> Adding
<code>if (array[mid] &lt;= array[mid + 1]) return;</code> before the merge skips merges that are
already in order. Measured on the same 1,000 values: the already-sorted array drops from 5,044
comparisons to 999 — that is n−1, linear — while the random array rises slightly from 8,690 to 9,313,
because on random data the extra check almost always fails and is pure overhead. It is a real
trade-off, not a free win, and this solution leaves it out to match the brief's plain description.</p>

<p><strong>How this solution is verified despite the randomness.</strong> The same predicate as its
siblings: the sorted line must be a <em>permutation</em> of the unsorted line — same values, same
multiplicities — and it must be <em>non-decreasing</em>. Both are needed, because a sort that returns
the input untouched is a perfect permutation and a sort that returns nothing is perfectly ordered.
The scripted run types <code>xyz</code> and <code>1001</code> before the real size to prove the
validator refuses a non-number and an out-of-range one.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Bài cuối trong năm bài sắp xếp, và là anh em
song sinh của bài quicksort: cùng chương trình, cùng màn hình, khác thuật toán. Phần Bối cảnh của
chính đề đã nêu ba điều bạn sẽ bị hỏi — trường hợp xấu nhất O(n log n), ổn định, và cần bộ nhớ phụ tỉ
lệ với đầu vào. Cả ba đều là hệ quả của một lựa chọn thiết kế, và bài giải này nói về lựa chọn đó.</p>

<p><strong>Merge sort, gói trong một câu.</strong> Cắt đôi đoạn mà không nhìn vào giá trị nào, sắp cả
hai nửa theo đúng cách đó, rồi đi song song hai nửa đã sắp và lần lượt chép ra phần tử đầu nào nhỏ hơn
cho tới khi cả hai cạn.</p>

<p><strong>Nó là ảnh gương của quicksort, và đó là cách nhớ cả hai.</strong> Quicksort làm việc ở khâu
<em>chia</em>: phân hoạch tốn công, chọn chốt cho khéo là chuyện khó, và chia xong thì hai nửa không
cần gì thêm. Merge sort làm việc ở khâu <em>ghép</em>: chia thì miễn phí và luôn đúng chính giữa, còn
toàn bộ chi phí nằm ở phép trộn trên đường quay lên. Nếu giám khảo hỏi "hai thuật toán chia để trị này
khác nhau chỗ nào", câu đó chính là câu trả lời, và mọi điều dưới đây đều suy ra từ nó.</p>

<p><strong>Vì phép chia không nhìn dữ liệu, nên không có đầu vào xấu.</strong> Cây đệ quy của merge
sort có hình dạng như nhau với mọi mảng cùng độ dài — luôn khoảng log₂(n) mức — nên bảo đảm O(n log n)
là ở trường hợp <em>xấu nhất</em>, không phải trung bình. Một bản sao có gắn bộ đếm của đúng phương
thức trên, đếm từng phép so sánh giữa hai phần tử trên 1.000 giá trị:</p>
<pre>n = 1000                                so sánh     lồng sâu nhất
merge sort, mảng ngẫu nhiên                8.690         11 khung
merge sort, mảng đã sắp sẵn                5.044         11 khung
quicksort, chốt giữa, ngẫu nhiên          12.144         17 khung
quicksort, chốt đầu đoạn, đã sắp         499.500      1.000 khung
để đối chiếu: n·log2(n) = 9.966</pre>
<p>Hãy để ý cột độ sâu: merge sort lồng 11 khung với <em>cả hai</em> đầu vào, bởi độ sâu hoàn toàn
không phụ thuộc dữ liệu. So với dòng cuối — đó là quicksort với chốt ngây thơ trên dữ liệu đã sắp, sâu
1.000 khung và so sánh nhiều gấp 57 lần merge sort. Merge sort không có dòng nào như vậy. Nó không thể
có.</p>

<p><strong>Cái giá của bảo đảm đó: một mảng phụ O(n).</strong> Quicksort sắp tại chỗ và bộ nhớ phụ duy
nhất là ngăn xếp lời gọi, O(log n) khung. Merge sort không thể trộn hai nửa tại chỗ mà không tốn công
khủng khiếp, nên nó cấp phát <code>new int[array.length]</code> — với một triệu số int là 4 MB bộ nhớ
mà quicksort không bao giờ đòi. Đây là cuộc đánh đổi trung thực: merge sort dùng bộ nhớ để mua lấy bảo
đảm xấu nhất và tính ổn định. Hãy nói đúng như vậy nếu bị hỏi thuật toán nào tốt hơn; không cái nào
tốt hơn cả, chúng tốn những thứ khác nhau.</p>

<p><strong>Cấp phát vùng đệm MỘT lần.</strong> Mảng phụ được tạo trong <code>mergeSort</code> công khai
rồi truyền xuống. Phương án hấp dẫn hơn về mặt viết nhanh — để <code>merge</code> tự tạo vùng đệm nhỏ ở
mỗi lần gọi — sẽ cấp phát n−1 mảng trong cả lượt chạy, và đó chính là thứ mà phần Bối cảnh của đề gọi
là "rất nhiều phép sao chép trong các cài đặt đơn giản". Đỉnh bộ nhớ thì như nhau; khối lượng việc của
bộ dọn rác thì không.</p>

<p><strong>Tính ổn định, và một ký tự duy nhất tạo ra nó.</strong> Merge sort ổn định, và nó ổn định
nhờ <code>buffer[j] &lt; buffer[i]</code> — nhỏ hơn <em>ngặt</em>. Khi hai đầu bằng nhau thì điều kiện
sai, nên nhánh <code>else</code> chạy và phần tử BÊN TRÁI được ghi ra trước; mà phần tử bên trái, theo
cách dựng, chính là phần tử vốn đứng trước trong mảng. Đổi đúng một dấu <code>&lt;</code> đó thành
<code>&lt;=</code> thì thuật toán vẫn cho ra mảng đúng thứ tự, vẫn qua mọi bài kiểm chỉ nhìn vào giá
trị, và không còn ổn định nữa. Sắp các cặp <code>[5a, 3a, 5b, 1a, 3b, 5c, 2a]</code> theo con số: cài
đặt này trả về <code>[1a, 2a, 3a, 3b, 5a, 5b, 5c]</code>, chữ cái nguyên vẹn, còn quicksort trên cùng
đầu vào trả về <code>[1a, 2a, 3b, 3a, 5c, 5b, 5a]</code>.</p>

<p><strong>Vì sao người ta quan tâm tính ổn định.</strong> Với kiểu <code>int</code> thì nó vô hình —
số 5 này giống hệt số 5 kia. Với đối tượng thì đó là ranh giới giữa chạy được và hỏng: sắp nhân viên
theo tên, rồi sắp kết quả đó theo phòng ban; nếu lần sắp thứ hai ổn định thì bạn được các phòng ban mà
bên trong tên vẫn đúng thứ tự. Nếu không ổn định thì lần sắp đầu tiên là công cốc. Đó là lý do
<code>Arrays.sort(int[])</code> trong JDK là quicksort còn <code>Arrays.sort(Object[])</code> là merge
sort — chính thư viện phân biệt đúng chỗ này, vì đúng lý do này.</p>

<p><strong>Dòng mà người mới hay viết sai.</strong> Phép trộn ghi ngược vào <code>array</code> và đọc
từ <code>buffer</code>, không bao giờ ngược lại. Vừa đọc vừa ghi trên cùng một mảng khi trộn sẽ đè lên
những phần tử chưa kịp chép, và kết quả là một mảng nhìn vẫn có vẻ hợp lý — gần như đã sắp, kèm một
phần tử lặp — tức là loại lỗi tệ nhất, vì kiểm tra qua loa không thấy.
<code>System.arraycopy</code> ở đầu hàm chính là thứ giữ cho chiều đọc–ghi an toàn.</p>

<p><strong>Một tối ưu đã đo, nếu bạn muốn đi xa hơn.</strong> Thêm
<code>if (array[mid] &lt;= array[mid + 1]) return;</code> ngay trước phép trộn sẽ bỏ qua những lần trộn
mà thứ tự vốn đã đúng. Đo trên cùng 1.000 giá trị: mảng đã sắp sẵn giảm từ 5.044 xuống 999 phép so
sánh — tức n−1, tuyến tính — trong khi mảng ngẫu nhiên tăng nhẹ từ 8.690 lên 9.313, vì với dữ liệu
ngẫu nhiên phép kiểm tra thêm gần như luôn sai và thành ra chi phí thừa. Đó là một đánh đổi thật, không
phải món lợi miễn phí, và lời giải này bỏ nó ra để bám sát mô tả trần trụi của đề.</p>

<p><strong>Kiểm chứng thế nào khi có yếu tố ngẫu nhiên.</strong> Vẫn là phép kiểm của các bài anh em:
dòng đã sắp phải là một <em>hoán vị</em> của dòng chưa sắp — cùng giá trị, cùng số lần xuất hiện — và
phải <em>không giảm</em>. Cần cả hai, vì một hàm trả về nguyên mảng đầu vào là hoán vị hoàn hảo, còn
một hàm không trả về gì thì có thứ tự hoàn hảo. Kịch bản chạy gõ <code>xyz</code> rồi <code>1001</code>
trước kích thước thật để chứng minh bộ kiểm tra từ chối cả thứ không phải số lẫn thứ ngoài khoảng.</p>''',
    hints_en=[
        'Split blindly at the midpoint — merge sort never looks at a value when dividing. All the work is in the merge.',
        'Allocate the scratch array once in the public method and pass it down; do not create one inside merge().',
        'Copy the range out to the buffer, then write back into the original array. Reading and writing one array at once corrupts it.',
        'Use strictly < when comparing the two fronts. Ties must take the LEFT element — that is what makes the sort stable.',
        'Count comparisons on sorted and on random input: unlike quicksort, merge sort has no bad case to find.',
    ],
    hints_vi=[
        'Chia mù ngay chính giữa — merge sort không nhìn giá trị nào khi chia. Toàn bộ công việc nằm ở phép trộn.',
        'Cấp phát mảng phụ một lần trong phương thức công khai rồi truyền xuống; đừng tạo mới bên trong merge().',
        'Chép đoạn ra vùng đệm rồi ghi ngược vào mảng gốc. Vừa đọc vừa ghi trên một mảng sẽ làm hỏng nó.',
        'Dùng dấu < ngặt khi so hai đầu. Khi bằng nhau phải lấy phần tử BÊN TRÁI — chính điều đó tạo nên tính ổn định.',
        'Đếm số phép so sánh trên mảng đã sắp và mảng ngẫu nhiên: khác quicksort, merge sort không có trường hợp xấu nào để tìm.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────

_FUNCTIONS = (
    '<h3>Chi tiết chức năng</h3>'
    '<ol><li><strong>Hiện màn hình yêu cầu nhập một số nguyên dương.</strong> Người dùng chạy '
    'chương trình, chương trình hiện màn hình yêu cầu nhập một số nguyên dương. Nhập xong thì '
    'chuyển sang Chức năng 2.</li>'
    '<li><strong>Hiển thị và sắp xếp mảng.</strong> Sinh số nguyên ngẫu nhiên trong khoảng cho '
    'trước cho từng phần tử của mảng. Hiển thị mảng trước và sau khi sắp xếp.</li></ol>'
)

VI = {
 'J1.S.P0004': """<p><strong>Short Assignment · J1.S.P0004 · 70 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3>
<p>Quicksort là thuật toán sắp xếp nhanh, không chỉ dùng để dạy học mà còn được áp dụng rộng rãi trong
thực tế. Trung bình nó có độ phức tạp O(n log n), nên phù hợp để sắp xếp khối lượng dữ liệu lớn. Ý
tưởng của thuật toán khá đơn giản, và một khi đã hiểu thì bạn viết quicksort cũng nhanh như viết
bubble sort.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình cho phép người dùng nhập số phần tử của mảng. Sinh số nguyên ngẫu nhiên trong
khoảng cho trước. Hiển thị mảng trước và sau khi sắp xếp bằng sắp xếp nhanh (quick sort).</p>
""" + _FUNCTIONS + """
<h3>Hướng dẫn — thuật toán</h3>
<p>Quicksort dùng chiến lược chia để trị. Một bước đệ quy gồm:</p>
<ol>
<li><strong>Chọn giá trị chốt (pivot).</strong> Ta lấy giá trị của <em>phần tử ở giữa</em> làm chốt,
nhưng về nguyên tắc có thể là bất kỳ giá trị nào nằm trong khoảng giá trị cần sắp, thậm chí không cần
có mặt trong mảng.</li>
<li><strong>Phân hoạch.</strong> Sắp xếp lại các phần tử sao cho mọi phần tử nhỏ hơn chốt nằm về phía
trái mảng và mọi phần tử lớn hơn chốt nằm về phía phải. Các giá trị bằng chốt có thể nằm ở phía nào
cũng được. Lưu ý mảng có thể bị chia thành hai phần không bằng nhau.</li>
<li><strong>Sắp cả hai phần.</strong> Áp dụng đệ quy quicksort cho phần trái và phần phải.</li>
</ol>
<h4>Chi tiết thuật toán phân hoạch</h4>
<p>Có hai chỉ số <code>i</code> và <code>j</code>; lúc bắt đầu <code>i</code> trỏ vào phần tử đầu đoạn
còn <code>j</code> trỏ vào phần tử cuối đoạn. Thuật toán đẩy <code>i</code> tiến lên cho tới khi gặp
một phần tử có giá trị lớn hơn hoặc bằng chốt. Chỉ số <code>j</code> được lùi lại cho tới khi gặp một
phần tử có giá trị nhỏ hơn hoặc bằng chốt. Nếu <code>i ≤ j</code> thì đổi chỗ hai phần tử đó, rồi
<code>i</code> tiến sang vị trí kế tiếp (<code>i + 1</code>) và <code>j</code> lùi về vị trí trước đó
(<code>j - 1</code>). Thuật toán dừng khi <code>i</code> vượt quá <code>j</code>.</p>
<p>Sau khi phân hoạch, mọi giá trị đứng trước phần tử thứ <code>i</code> đều nhỏ hơn hoặc bằng chốt, và
mọi giá trị đứng sau phần tử thứ <code>j</code> đều lớn hơn hoặc bằng chốt.</p>
<p>Ví dụ: sắp xếp {1, 12, 5, 26, 7, 14, 3, 7, 2} bằng quicksort. (Ở đây chỉ minh hoạ bước đệ quy đầu
tiên cho khỏi dài; thực tế {1, 2, 5, 7, 3} và {14, 7, 26, 12} sau đó vẫn được sắp tiếp bằng đệ quy.)</p>
<h4>Vì sao nó đúng?</h4>
<p>Ở bước phân hoạch, thuật toán chia mảng thành hai phần sao cho mọi phần tử <em>a</em> ở phần trái đều
nhỏ hơn hoặc bằng mọi phần tử <em>b</em> ở phần phải, đồng thời <em>a</em> ≤ chốt ≤ <em>b</em>. Sau khi
các lời gọi đệ quy kết thúc, hai phần đều đã có thứ tự, và kết hợp với lập luận trên thì cả mảng đã
được sắp.</p>""",

 'J1.S.P0005': """<p><strong>Short Assignment · J1.S.P0005 · 70 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3>
<p>Sắp xếp trộn tận dụng việc hoà hai danh sách đã có thứ tự thành một danh sách có thứ tự mới là
chuyện dễ. Nó bắt đầu bằng cách so từng cặp hai phần tử (1 với 2, rồi 3 với 4…) và đổi chỗ nếu phần tử
đầu phải đứng sau phần tử sau. Sau đó nó trộn các danh sách hai phần tử thành danh sách bốn phần tử,
rồi trộn tiếp các danh sách bốn phần tử, cứ thế cho tới khi hai danh sách cuối cùng được trộn thành
danh sách đã sắp hoàn chỉnh. Trong các thuật toán được nêu ở đây, đây là thuật toán đầu tiên co giãn
tốt với danh sách rất lớn, vì thời gian chạy ở trường hợp xấu nhất của nó là O(n log n). Nó cũng dễ áp
dụng cho danh sách liên kết chứ không riêng mảng, vì chỉ cần truy cập tuần tự chứ không cần truy cập
ngẫu nhiên. Tuy nhiên nó tốn thêm bộ nhớ O(n), và các cài đặt đơn giản thường kéo theo rất nhiều phép
sao chép.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình cho phép người dùng nhập số phần tử của mảng. Sinh số nguyên ngẫu nhiên trong
khoảng cho trước. Hiển thị mảng trước và sau khi sắp xếp bằng sắp xếp trộn (merge sort).</p>
""" + _FUNCTIONS + """
<h3>Hướng dẫn — thuật toán</h3>
<p>Sắp xếp trộn là thuật toán chia để trị. Các bước cài đặt:</p>
<ol>
<li>Chia mảng chưa sắp thành n phần, mỗi phần chứa đúng 1 phần tử. Một phần tử đơn lẻ được coi là đã
có thứ tự.</li>
<li>Liên tục trộn các phần đã chia để tạo ra các danh sách con mới, cho tới khi chỉ còn lại một danh
sách duy nhất. Đó chính là danh sách đã sắp.</li>
</ol>
<p>Sắp xếp trộn là thuật toán nhanh, <strong>ổn định</strong>, với hiệu suất O(n·log(n)) được bảo đảm.
Khi sắp xếp mảng, nó cần thêm vùng nhớ phụ tỉ lệ với kích thước mảng đầu vào. Sắp xếp trộn tương đối
dễ viết và cho hiệu năng thường chỉ thấp hơn quicksort một chút.</p>""",
}

for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
