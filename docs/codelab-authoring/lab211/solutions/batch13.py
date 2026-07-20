# Batch 13 — J1.S.P0006 (binary search) and J1.S.P0007 (undirected graph,
# adjacency matrix). P0006 is the direct counterpart of J1.S.P0010, the linear
# search in batch 8: same shape of program, opposite trade-off.
import re
from solkit import solution, SOLUTIONS


# The two labs share one validator. Both briefs print the question on its own
# line and take the answer on the next one, so the prompt uses println.
VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * The prompt is printed with println and not print, because both briefs' own
 * screens show the typed value on the line BELOW the question. Matching the
 * screen the marker diffs against is the cheapest mark in the assignment.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.println(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Value must be between " + min + " and " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                // parseInt is the check. Asking "does this look like a number?"
                // with your own loop over the characters means writing a second,
                // worse parser that will disagree with the first one one day.
                System.out.println("You must input a number.");
            }
        }
    }
}
'''


# ════════════════════════════════════════════════════════════════
# J1.S.P0006 — Binary search algorithm (70 LOC)
# ════════════════════════════════════════════════════════════════

P0006_BO = '''package bo;

import java.util.Arrays;
import java.util.Random;

/**
 * Builds the array, sorts it, and searches it. Nothing here prints.
 *
 * The number of comparisons is kept in a field instead of being returned,
 * because search() already owes the caller an index. An algorithm that cannot
 * report its own cost cannot be compared with another one honestly - and the
 * honest unit is the comparison, not the millisecond. A stopwatch around a Java
 * method measures the JIT deciding whether to compile it at least as much as it
 * measures the algorithm, and it gives a different answer every run.
 */
public class BinarySearchManager {

    private final Random random = new Random();

    private int probes;

    /**
     * size random values drawn from 1..size.
     *
     * Drawing from a range as narrow as the array is deliberate: duplicates
     * become the normal case rather than a curiosity, and duplicates are where
     * binary search behaves differently from the linear search of J1.S.P0010.
     */
    public int[] generate(int size) {
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = 1 + random.nextInt(size);
        }
        return array;
    }

    /**
     * Sorting is a precondition of the search, not a decoration.
     *
     * Arrays.sort on primitives is a tuned dual-pivot quicksort; hand-rolling a
     * bubble sort here would cost O(n^2) and teach nothing the exercise is
     * about. Note the accounting, though: sorting costs O(n log n), so sorting
     * an array once to run a SINGLE lookup is more expensive than the linear
     * scan it replaces. Binary search pays for itself when the same array is
     * searched many times.
     */
    public void sort(int[] array) {
        Arrays.sort(array);
    }

    /**
     * Binary search, iterative, exactly the steps in the brief's Guidelines.
     *
     * PRECONDITION: array is sorted ascending. That is not a style note, it is
     * the algorithm. On an unsorted array this method still returns fast and
     * still returns a plausible-looking number, which is what makes the mistake
     * so hard to catch - see the walkthrough for a measured run where four of
     * five values that ARE in the array are reported absent.
     *
     * INVARIANT: if key is in the array at all, its index lies in [low, high].
     * Every branch below preserves it - array[mid] &lt; key rules out every index
     * up to and including mid, so low may jump past it - and the loop ends only
     * when the window is empty, which then means the key was nowhere.
     *
     * MIDPOINT: low + (high - low) / 2, never (low + high) / 2. The two agree
     * until low + high passes Integer.MAX_VALUE, at which point the sum wraps
     * negative and mid indexes backwards. Measured, with low = 1500000000 and
     * high = 2000000000: (low + high) / 2 is -397483648 while
     * low + (high - low) / 2 is 1750000000.
     */
    public int search(int[] array, int key) {
        probes = 0;
        int low = 0;
        int high = array.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            probes++;
            if (array[mid] == key) {
                return mid;
            }
            if (array[mid] < key) {
                low = mid + 1;          // mid and everything left of it is too small
            } else {
                high = mid - 1;         // mid and everything right of it is too large
            }
        }
        return -1;                      // the window closed: the value is absent
    }

    public int getProbes() {
        return probes;
    }

    /** What the same lookup would have cost one element at a time. */
    public int linearProbes(int[] array, int key) {
        int count = 0;
        for (int i = 0; i < array.length; i++) {
            count++;
            if (array[i] == key) {
                break;
            }
        }
        return count;
    }

    /**
     * The FIRST index holding key, or -1 - a lower bound.
     *
     * search() lands on whichever matching cell the halving happens to hit, so
     * with duplicates it is an arbitrary one. J1.S.P0010's linear scan returns
     * the first by construction; binary search has to be asked. Walking left
     * from the hit would work but costs O(n) when the array is all one value,
     * throwing away the very thing binary search bought. This keeps halving:
     * on a match, do not stop - continue into the left half and remember.
     */
    public int firstIndex(int[] array, int key) {
        int low = 0;
        int high = array.length - 1;
        int found = -1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (array[mid] < key) {
                low = mid + 1;
            } else {
                if (array[mid] == key) {
                    found = mid;
                }
                high = mid - 1;
            }
        }
        return found;
    }

    /**
     * How many times key occurs.
     *
     * Equal values are adjacent in a sorted array, so counting forward from the
     * first one stops as soon as the run ends - it never scans the whole array.
     */
    public int count(int[] array, int key) {
        int first = firstIndex(array, key);
        if (first < 0) {
            return 0;
        }
        int total = 0;
        for (int i = first; i < array.length && array[i] == key; i++) {
            total++;
        }
        return total;
    }
}
'''

P0006_MAIN = '''package ui;

import bo.BinarySearchManager;
import java.util.Arrays;
import utils.Validator;

/** Screen only. */
public class Main {

    public static void main(String[] args) {
        BinarySearchManager manager = new BinarySearchManager();

        int size = Validator.getInt("Enter number of array:", 1, 100000);
        // The value being looked for is not restricted: a marker WILL type
        // something that cannot be in the array, and "not found" is half of
        // what the brief's own worked example is about.
        int key = Validator.getInt("Enter search value:", Integer.MIN_VALUE, Integer.MAX_VALUE);

        int[] array = manager.generate(size);
        manager.sort(array);
        System.out.println("Sorted array: " + Arrays.toString(array));

        int index = manager.search(array, key);
        int binary = manager.getProbes();
        int linear = manager.linearProbes(array, key);

        if (index < 0) {
            System.out.println(key + " is not in the array.");
        } else {
            System.out.println("Found " + key + " at index: " + index);
            int times = manager.count(array, key);
            if (times > 1) {
                System.out.println(key + " appears " + times
                        + " time(s), the first at index: " + manager.firstIndex(array, key));
            }
        }
        System.out.println("Binary search used " + binary
                + " comparison(s); a linear scan would have used " + linear + ".");
    }
}
'''


def _java_search(array, key):
    """The exact algorithm in BinarySearchManager.search, in Python.

    The expectation is recomputed rather than typed out, so a search that
    returned a plausible but wrong index - or that miscounted its own work -
    cannot slip through on a lucky run.
    """
    probes = 0
    low, high = 0, len(array) - 1
    while low <= high:
        mid = low + (high - low) // 2
        probes += 1
        if array[mid] == key:
            return mid, probes
        if array[mid] < key:
            low = mid + 1
        else:
            high = mid - 1
    return -1, probes


def _p0006_check(size, key, max_probes):
    def check(out):
        m = re.search(r'Sorted array: \[([^\]]*)\]', out)
        if not m:
            return False, 'expected the sorted array to be printed'
        array = [int(x) for x in re.findall(r'-?\d+', m.group(1))]
        if len(array) != size:
            return False, f'expected {size} elements, got {len(array)}'
        if array != sorted(array):
            return False, 'the "Sorted array" line is not sorted'
        if not all(1 <= v <= size for v in array):
            return False, f'values outside 1..{size}'

        index, probes = _java_search(array, key)
        if probes > max_probes:
            return False, f'{probes} probes on {size} elements: more than log2 allows'

        if index < 0:
            if not re.search(re.escape(f'{key} is not in the array.'), out):
                return False, f'{key} is absent from the array but was not reported missing'
        else:
            if not re.search(r'Found %d at index: (\d+)' % key, out):
                return False, f'{key} IS in the array but no "Found" line was printed'
            reported = int(re.search(r'Found %d at index: (\d+)' % key, out).group(1))
            if array[reported] != key:
                return False, f'array[{reported}]={array[reported]}, not {key}'
            if reported != index:
                return False, f'reported index {reported}, the algorithm reaches {index}'
            times = array.count(key)
            first = array.index(key)
            line = f'{key} appears {times} time(s), the first at index: {first}'
            if times > 1 and line not in out:
                return False, f'expected the duplicate line: {line}'
            if times == 1 and 'appears' in out:
                return False, 'reported duplicates for a value that occurs once'

        linear = array.index(key) + 1 if key in array else size
        cost = (f'Binary search used {probes} comparison(s); '
                f'a linear scan would have used {linear}.')
        if cost not in out:
            return False, f'expected the cost line: {cost}'
        return True, ''
    return check


solution(
    'J1.S.P0006',
    title_vi='Thuật toán tìm kiếm nhị phân',
    files=[('src/bo/BinarySearchManager.java', P0006_BO),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0006_MAIN)],
    main_class='ui.Main',
    runs=[
        # The brief's own screen: ten elements, look for 4.
        ('10\n4\n', _p0006_check(10, 4, 4)),
        # A value that cannot be in an array of values drawn from 1..10.
        ('10\n999\n', _p0006_check(10, 999, 4)),
        # The cost demonstration. 1000 elements: the search may never exceed
        # 10 probes, because 2^10 = 1024 > 1000. A linear scan that misses
        # takes all 1000.
        ('1000\n500\n', _p0006_check(1000, 500, 10)),
        # A one-element array - the boundary where low == high == mid and the
        # window closes in a single step either way.
        ('1\n1\n', _p0006_check(1, 1, 1)),
        # Non-numeric input, then out of range, then a real answer.
        ('abc\n0\n10\n4\n', _p0006_check(10, 4, 4)),
    ],
    explain_en='''<p><strong>The precondition is the whole exercise.</strong> Binary search does not
work on an array; it works on a <em>sorted</em> array. Delete the sort and the program still compiles,
still runs, still prints an index — and is wrong in a way nobody notices. This was measured, not
guessed: running exactly this search over the unsorted array <code>{9, 3, 7, 1, 5}</code> reports
<code>-1</code> for 9, for 3, for 1 and for 5 — four values that are all right there — and returns
index 2 for the value 7. It "found" 7 only because 7 happens to sit at the midpoint. A single test
against a value that landed in the middle would have passed and taught you nothing.</p>
<p><strong>Why the midpoint is <code>low + (high - low) / 2</code>.</strong> Everyone writes
<code>(low + high) / 2</code> first, and it is correct for every array you will hand in. It is also the
bug that sat inside <code>java.util.Arrays.binarySearch</code> in the JDK for nine years. The sum of
two valid <code>int</code> indexes can exceed <code>Integer.MAX_VALUE</code>, and Java does not raise
an error when it does — it wraps. Measured with <code>low = 1500000000</code> and
<code>high = 2000000000</code>: <code>(low + high) / 2</code> is <code>-397483648</code>, while
<code>low + (high - low) / 2</code> is <code>1750000000</code>. The second form only ever adds a
non-negative number that is smaller than <code>high</code>, so it cannot overflow.</p>
<p><strong>The loop invariant, which is what an examiner will ask you to state.</strong> <em>If the key
is in the array at all, its index is inside the window <code>[low, high]</code>.</em> It is true before
the first iteration, when the window is the whole array. Each branch preserves it: if
<code>array[mid] &lt; key</code> then every index up to and including <code>mid</code> holds something
too small, so nothing is lost by setting <code>low = mid + 1</code>; the mirror argument covers the
other side. The loop ends when <code>low &gt; high</code>, i.e. the window is empty — and by the
invariant, an empty window means the key was never there. That is why <code>return -1</code> is a
proof, not a guess.</p>
<p><strong>The cost, counted rather than timed.</strong> The program prints how many comparisons each
algorithm needed for the same lookup, because that is the only measurement that means anything. A
millisecond reading on the JVM measures the JIT deciding whether to compile the method, the garbage
collector, and the machine's mood; run it twice and it disagrees with itself. Comparisons are
deterministic. With 1000 elements, binary search never exceeds <strong>10</strong> comparisons — that
is not an estimate, it was measured by searching every key from 0 to 1001 in a sorted array of 1000
and taking the maximum. A linear scan that fails needs all <strong>1000</strong>. The ratio is
log₂(n): a million elements is 20 comparisons, as the brief's own background says.</p>
<p><strong>Sorting is not free, and that is the honest caveat.</strong> The sort costs O(n log n) —
more than the O(n) scan binary search is replacing. For a single lookup, linear search
(J1.S.P0010) wins. Binary search pays for itself when the array is searched repeatedly, or when it
arrives already sorted. Saying this out loud is worth more than either algorithm.</p>
<p><strong>Duplicates: <code>search</code> returns <em>an</em> index, not <em>the first</em>.</strong>
The array is drawn from 1..n, so repeats are the normal case. The halving lands on whichever matching
cell it reaches first, which may be the middle of a run of equal values — where J1.S.P0010's linear
scan returned the first by construction. <code>firstIndex</code> answers the stronger question by
<em>not</em> stopping on a match: it records the hit and keeps searching the left half. Walking left
from the hit instead would be O(n) on an array of identical values, throwing away exactly what binary
search bought.</p>
<p><strong>How this was verified.</strong> The array is random, so the test compares nothing against
fixed text. It reads the printed array back, checks it really is in ascending order, re-runs the same
binary search in the test harness, and requires the program's index, its duplicate report and
<em>both</em> of its comparison counts to match. Five runs cover it: the brief's screen, an absent
value, the 1000-element cost demonstration, a one-element array (where <code>low == high == mid</code>
and the window closes in one step), and a run that types <code>abc</code> and then <code>0</code>
before answering properly.</p>''',
    explain_vi='''<p><strong>Điều kiện tiên quyết chính là toàn bộ bài này.</strong> Tìm kiếm nhị phân
không chạy trên một mảng bất kỳ; nó chạy trên mảng <em>đã sắp xếp</em>. Bỏ bước sắp xếp đi thì chương
trình vẫn biên dịch, vẫn chạy, vẫn in ra một chỉ số — và sai theo kiểu không ai phát hiện được. Điều
này đã được đo chứ không phải đoán: chạy đúng phép tìm này trên mảng chưa sắp
<code>{9, 3, 7, 1, 5}</code> thì 9, 3, 1 và 5 đều bị báo <code>-1</code> — bốn giá trị nằm ngay trong
mảng — còn giá trị 7 lại trả về chỉ số 2. Nó "tìm thấy" 7 chỉ vì 7 tình cờ nằm đúng ở giữa. Một phép
thử duy nhất với giá trị rơi vào giữa sẽ qua trót lọt và chẳng dạy bạn điều gì.</p>
<p><strong>Vì sao điểm giữa là <code>low + (high - low) / 2</code>.</strong> Ai cũng viết
<code>(low + high) / 2</code> trước, và nó đúng với mọi mảng bạn sẽ nộp. Nó cũng chính là lỗi đã nằm
trong <code>java.util.Arrays.binarySearch</code> của JDK suốt chín năm. Tổng của hai chỉ số
<code>int</code> hợp lệ vẫn có thể vượt <code>Integer.MAX_VALUE</code>, và Java không báo lỗi khi điều
đó xảy ra — nó quay vòng. Đo thật với <code>low = 1500000000</code> và <code>high = 2000000000</code>:
<code>(low + high) / 2</code> ra <code>-397483648</code>, còn <code>low + (high - low) / 2</code> ra
<code>1750000000</code>. Dạng thứ hai chỉ cộng thêm một số không âm và nhỏ hơn <code>high</code>, nên
không thể tràn.</p>
<p><strong>Bất biến vòng lặp — thứ người chấm sẽ bắt bạn phát biểu.</strong> <em>Nếu giá trị cần tìm
có trong mảng, chỉ số của nó nằm trong cửa sổ <code>[low, high]</code>.</em> Nó đúng trước vòng lặp đầu
tiên, khi cửa sổ là cả mảng. Mỗi nhánh đều giữ được nó: nếu <code>array[mid] &lt; key</code> thì mọi chỉ
số tính đến <code>mid</code> đều chứa giá trị quá nhỏ, nên đặt <code>low = mid + 1</code> không làm mất
gì; nhánh còn lại đối xứng. Vòng lặp kết thúc khi <code>low &gt; high</code>, tức cửa sổ rỗng — và theo
bất biến, cửa sổ rỗng nghĩa là giá trị chưa từng có ở đó. Vì thế <code>return -1</code> là một chứng
minh, không phải một phỏng đoán.</p>
<p><strong>Chi phí: đếm, đừng bấm giờ.</strong> Chương trình in ra số phép so sánh mà mỗi thuật toán
cần cho cùng một lần tra, vì đó là phép đo duy nhất có ý nghĩa. Con số mili-giây trên JVM đo cả việc
JIT đang cân nhắc biên dịch phương thức, cả bộ dọn rác, cả tâm trạng của máy; chạy hai lần là hai kết
quả khác nhau. Số phép so sánh thì tất định. Với 1000 phần tử, tìm nhị phân không bao giờ vượt quá
<strong>10</strong> phép so sánh — đây không phải ước lượng, nó được đo bằng cách tìm mọi giá trị từ 0
đến 1001 trong một mảng 1000 phần tử đã sắp và lấy giá trị lớn nhất. Còn phép duyệt tuyến tính khi
không tìm thấy phải đi đủ <strong>1000</strong>. Tỉ lệ đó là log₂(n): một triệu phần tử là 20 phép so
sánh, đúng như phần Bối cảnh của đề đã nói.</p>
<p><strong>Sắp xếp không miễn phí, và đó là điều phải nói thật.</strong> Sắp xếp tốn O(n log n) — nhiều
hơn phép duyệt O(n) mà tìm nhị phân định thay thế. Với một lần tra duy nhất, tìm tuyến tính
(J1.S.P0010) mới là lựa chọn thắng. Tìm nhị phân chỉ hoàn vốn khi mảng được tra nhiều lần, hoặc khi nó
đến tay bạn đã sắp sẵn. Nói được điều này còn giá trị hơn cả hai thuật toán cộng lại.</p>
<p><strong>Giá trị trùng: <code>search</code> trả về <em>một</em> chỉ số, không phải <em>chỉ số đầu
tiên</em>.</strong> Mảng lấy giá trị trong 1..n nên trùng lặp là chuyện thường. Phép chia đôi dừng ở ô
khớp mà nó chạm tới trước, có thể là giữa một dãy các giá trị bằng nhau — trong khi phép duyệt tuyến
tính của J1.S.P0010 trả về cái đầu tiên một cách tự nhiên. <code>firstIndex</code> trả lời câu hỏi mạnh
hơn bằng cách <em>không</em> dừng khi gặp: nó ghi nhớ vị trí rồi tiếp tục tìm ở nửa trái. Nếu thay vào
đó lùi dần sang trái từ chỗ vừa gặp thì trên mảng toàn giá trị giống nhau sẽ tốn O(n), vứt bỏ đúng thứ
mà tìm nhị phân vừa mua được.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Mảng là ngẫu nhiên nên bài kiểm không so với bất kỳ văn bản
cố định nào. Nó đọc ngược lại mảng đã in, kiểm rằng mảng thật sự tăng dần, chạy lại đúng phép tìm nhị
phân đó trong bộ kiểm, rồi bắt chỉ số, dòng báo trùng lặp và <em>cả hai</em> số đếm phép so sánh của
chương trình phải khớp. Năm lần chạy phủ hết: màn hình của đề, một giá trị không có, phần trình diễn
chi phí với 1000 phần tử, mảng một phần tử (nơi <code>low == high == mid</code> và cửa sổ đóng lại sau
đúng một bước), và một lần gõ <code>abc</code> rồi <code>0</code> trước khi trả lời tử tế.</p>''',
    hints_en=[
        'Sort first. Binary search on an unsorted array does not fail loudly — it returns a wrong index or -1.',
        'Compute the midpoint as low + (high - low) / 2; (low + high) / 2 overflows for large indexes.',
        'The loop ends when low > high. State the invariant: the key, if present, is inside [low, high].',
        'Count comparisons instead of timing the run — a millisecond on the JVM measures the JIT, not you.',
        'With duplicates, the first hit is not the leftmost one. Keep halving into the left half to get it.',
    ],
    hints_vi=[
        'Sắp xếp trước. Tìm nhị phân trên mảng chưa sắp không báo lỗi ầm ĩ — nó trả về chỉ số sai hoặc -1.',
        'Tính điểm giữa bằng low + (high - low) / 2; (low + high) / 2 bị tràn khi chỉ số lớn.',
        'Vòng lặp dừng khi low > high. Hãy phát biểu bất biến: giá trị cần tìm, nếu có, nằm trong [low, high].',
        'Đếm số phép so sánh thay vì bấm giờ — mili-giây trên JVM đo JIT chứ không đo thuật toán của bạn.',
        'Khi có giá trị trùng, ô gặp đầu tiên không phải ô trái nhất. Cứ chia đôi tiếp về nửa trái để lấy nó.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0007 — Undirected graphs representation (70 LOC)
# ════════════════════════════════════════════════════════════════

P0007_GRAPH = '''package entity;

import java.util.ArrayList;
import java.util.List;

/**
 * An undirected graph held as an adjacency matrix.
 *
 * The brief names the class AND the representation, so there is no choice about
 * what to build - but there is one to defend. A matrix costs V x V cells whether
 * the graph has one edge or all of them; adjacency lists cost V + E. Here, with
 * 5 vertices and 5 edges, that is 25 cells against 15 slots, and the gap only
 * widens: a road map with 1000 towns and 1000 roads is a million matrix cells,
 * of which 998000 are zero. The matrix earns its place when the graph is DENSE,
 * or when the question asked most often is exactly the one this program asks -
 * "is (u, v) an edge?" - which a matrix answers with one array read while lists
 * answer it by scanning a row.
 *
 * There is no bo package. A Graph IS its data together with its rules; a manager
 * class on top of it would do nothing but forward calls, and an empty layer in a
 * 70-line assignment loses a mark rather than earning one.
 */
public class Graph {

    /**
     * 1 means "there is an edge", 0 means "there is not".
     *
     * The brief's Guidelines sentence says the opposite - "contains 0, if there
     * is an edge between i-th and j-th vertices, and 1 otherwise" - but every
     * figure in the same brief contradicts it: the sample matrix has 1s exactly
     * where the drawing has lines, and the non-edge (1, 3) is highlighted as a
     * pair of ZEROS. The sentence is a typo for the usual convention. Follow the
     * figures, and say that you noticed.
     */
    private static final int EDGE = 1;

    private final int vertices;
    private final int[][] matrix;

    public Graph(int vertices) {
        this.vertices = vertices;
        // new int[n][n] is zero-filled by the language: an empty graph needs no
        // initialisation loop, and 0 already means "no edge".
        this.matrix = new int[vertices][vertices];
    }

    public int getVertices() {
        return vertices;
    }

    /**
     * Records the edge in BOTH cells.
     *
     * These two lines are the entire difference between a directed and an
     * undirected graph. Write only matrix[start][end] and the graph quietly
     * becomes directed: asking about (2, 5) answers yes and asking about (5, 2)
     * answers no, for a road that has no direction. The matrix of an undirected
     * graph is symmetric, and symmetry is not something you check afterwards -
     * it is something addEdge is responsible for never breaking.
     */
    public void addEdge(int start, int end) throws Exception {
        check(start);
        check(end);
        matrix[start - 1][end - 1] = EDGE;
        matrix[end - 1][start - 1] = EDGE;
    }

    /** One array read. This is the operation the matrix is good at. */
    public boolean isEdge(int start, int end) throws Exception {
        check(start);
        check(end);
        return matrix[start - 1][end - 1] == EDGE;
    }

    /**
     * Every vertex one hop away, in label order.
     *
     * And this is the operation the matrix is bad at: it walks all V cells of
     * the row even when the vertex has one neighbour. Adjacency lists would
     * return the answer without touching a single absent edge. Printing the
     * neighbours of both endpoints is also how the program proves its own
     * symmetry on screen.
     */
    public List<Integer> neighbours(int vertex) throws Exception {
        check(vertex);
        List<Integer> result = new ArrayList<>();
        for (int j = 0; j < vertices; j++) {
            if (matrix[vertex - 1][j] == EDGE) {
                result.add(j + 1);
            }
        }
        return result;
    }

    /**
     * Vertices are labelled 1..V on screen and indexed 0..V-1 in the array.
     * Every public method subtracts one, and this is the single place the range
     * is enforced - one off-by-one to get right instead of one per method.
     */
    private void check(int vertex) throws Exception {
        if (vertex < 1 || vertex > vertices) {
            throw new Exception("Vertex must be between 1 and " + vertices + ".");
        }
    }

    /** The matrix laid out as the brief draws it, with labelled headers. */
    @Override
    public String toString() {
        StringBuilder text = new StringBuilder("   ");
        for (int j = 1; j <= vertices; j++) {
            text.append(String.format("%3d", j));
        }
        for (int i = 0; i < vertices; i++) {
            text.append(String.format("%n%3d", i + 1));
            for (int j = 0; j < vertices; j++) {
                text.append(String.format("%3d", matrix[i][j]));
            }
        }
        return text.toString();
    }
}
'''

P0007_MAIN = '''package ui;

import entity.Graph;
import utils.Validator;

/** Screen only: builds the brief's own graph, then answers one question about it. */
public class Main {

    private static final int VERTICES = 5;

    /**
     * The graph drawn in the brief: 1-4, 2-4, 2-5, 3-5, 4-5.
     *
     * Each edge is listed ONCE. Listing (2,5) and (5,2) separately would work,
     * but it would move the responsibility for symmetry out of Graph and into
     * this table, where the next person to add an edge will forget it.
     */
    private static final int[][] EDGES = {{1, 4}, {2, 4}, {2, 5}, {3, 5}, {4, 5}};

    public static void main(String[] args) {
        Graph graph = new Graph(VERTICES);
        try {
            for (int[] edge : EDGES) {
                graph.addEdge(edge[0], edge[1]);
            }
            System.out.println("Adjacency matrix (1 = edge, 0 = no edge):");
            System.out.println(graph);

            int start = Validator.getInt("Enter the start point:", 1, VERTICES);
            int end = Validator.getInt("Enter the end point:", 1, VERTICES);

            // Both rows are printed on purpose: an undirected graph that forgot
            // the mirror cell would list the neighbour on one side only, and
            // that is invisible if you only ever look at one endpoint.
            System.out.println("Neighbours of " + start + ": " + graph.neighbours(start));
            System.out.println("Neighbours of " + end + ": " + graph.neighbours(end));

            // The brief's screen reads "This is  an edge" - with two spaces. It
            // is copied here character for character, because the marker diffs
            // the screen and does not care whose typo it is.
            System.out.println(graph.isEdge(start, end) ? "This is  an edge" : "This is  not an edge");
        } catch (Exception e) {
            // The validator already keeps the input inside 1..5, so Graph's own
            // range check can only fire if someone reuses the class elsewhere.
            // It stays anyway: a class defends its own invariants.
            System.out.println(e.getMessage());
        }
    }
}
'''

P0007_MATRIX = '''Adjacency matrix (1 = edge, 0 = no edge):
     1  2  3  4  5
  1  0  0  0  1  0
  2  0  0  0  1  1
  3  0  0  0  0  1
  4  1  1  0  0  1
  5  0  1  1  1  0
Enter the start point:
Enter the end point:
'''


solution(
    'J1.S.P0007',
    title_vi='Biểu diễn đồ thị vô hướng',
    files=[('src/entity/Graph.java', P0007_GRAPH),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0007_MAIN)],
    main_class='ui.Main',
    runs=[
        # The brief's own screen: (2, 5) is an edge.
        ('2\n5\n', P0007_MATRIX +
         'Neighbours of 2: [4, 5]\n'
         'Neighbours of 5: [2, 3, 4]\n'
         'This is  an edge'),
        # The SAME edge asked backwards. Same answer, and 2 appears in 5's
        # neighbour list exactly as 5 appears in 2's: that is the symmetry.
        ('5\n2\n', P0007_MATRIX +
         'Neighbours of 5: [2, 3, 4]\n'
         'Neighbours of 2: [4, 5]\n'
         'This is  an edge'),
        # (1, 3) - the non-edge the brief highlights as a pair of zeros.
        ('1\n3\n', P0007_MATRIX +
         'Neighbours of 1: [4]\n'
         'Neighbours of 3: [5]\n'
         'This is  not an edge'),
        # A loop: the diagonal is all zeros, so a vertex is not its own neighbour.
        ('4\n4\n', P0007_MATRIX +
         'Neighbours of 4: [1, 2, 5]\n'
         'Neighbours of 4: [1, 2, 5]\n'
         'This is  not an edge'),
        # Rubbish, then a vertex that does not exist, then a real question.
        ('two\n9\n1\n4\n', P0007_MATRIX.replace(
            'Enter the start point:\n',
            'Enter the start point:\nYou must input a number.\n'
            'Enter the start point:\nValue must be between 1 and 5.\n'
            'Enter the start point:\n') +
         'Neighbours of 1: [4]\n'
         'Neighbours of 4: [1, 2, 5]\n'
         'This is  an edge'),
    ],
    explain_en='''<p><strong>The brief contradicts itself, and the figures win.</strong> The Guidelines
sentence reads: "Each cell aij of an adjacency matrix contains 0, if there is an edge between i-th and
j-th vertices, and 1 otherwise." That is backwards. Every picture in the same brief says the opposite:
the sample matrix carries 1s exactly where the drawing has lines, and the highlighted <em>non</em>-edge
(1, 3) is shown as a pair of <strong>zeros</strong>. It is a typo for the ordinary convention, and this
solution follows the figures — <code>1 = edge</code>. Say that you noticed when you are asked; spotting
a contradiction in a specification is a mark, not a risk.</p>
<p><strong>Matrix or lists — the choice the brief made for you, and why it is defensible.</strong> An
adjacency matrix costs V × V cells no matter how many edges exist. Adjacency lists cost V + E. For this
graph — 5 vertices, 5 edges — that is 25 cells against about 15 slots, which hardly matters. It starts
to matter fast: a road network of 1000 towns joined by 1000 roads needs a million matrix cells, 998000
of them zero, against 3000 list entries. So the matrix is the right shape for a <em>dense</em> graph,
or when the dominant question is the one this program asks — "is (u, v) an edge?" — which the matrix
answers with a single array read, O(1), while adjacency lists have to scan a row. Listing neighbours is
the reverse: the matrix walks all V cells of the row even for a vertex with one neighbour, while a list
hands the answer over directly. Pick the representation from the question you ask most, not from
habit.</p>
<p><strong>Undirected means every edge is written twice, and that is <code>addEdge</code>'s job.</strong>
<code>matrix[start][end]</code> and <code>matrix[end][start]</code> are both set in the same method. Set
only the first and the graph silently becomes directed: "is (2, 5) an edge?" answers yes while "is
(5, 2) an edge?" answers no, for a road that has no direction. The matrix of an undirected graph is
symmetric, and symmetry is not a property you verify afterwards — it is an invariant one method is
responsible for never breaking. Note too that <code>EDGES</code> in <code>Main</code> lists each edge
once: putting both directions in that table would move the responsibility to the caller, where the next
person to add an edge will forget half of it.</p>
<p><strong>The program proves the symmetry on screen rather than claiming it.</strong> After the two
points are read it prints the neighbours of <em>both</em> endpoints. Run it with 2 then 5 and you get
<code>Neighbours of 2: [4, 5]</code> and <code>Neighbours of 5: [2, 3, 4]</code> — 5 is in 2's row and 2
is in 5's row. Run it with 5 then 2 and the same two lists come back swapped, with the same verdict. A
half-written edge cannot survive that pair of runs.</p>
<p><strong>Labels 1..5, indexes 0..4.</strong> The brief numbers vertices from 1 and Java numbers arrays
from 0, so exactly one subtraction is needed — and it lives inside <code>Graph</code>, next to a single
private <code>check</code> that enforces the range. A program that scatters <code>- 1</code> through the
UI is a program that will one day be off by one in only one of those places.</p>
<p><strong>Three files, no <code>bo</code>, and that is on purpose.</strong> A <code>Graph</code> is its
data and its rules in one object; a <code>GraphManager</code> wrapped around it would only forward
calls. The layers used are <code>entity</code> (the structure), <code>utils</code> (every keyboard read)
and <code>ui</code> (the screen) — the shape that small assignments were actually marked on.</p>
<p><strong>The screen's typo is copied exactly.</strong> The brief's expected output is
<code>This is  an edge</code> — with two spaces between "is" and "an", which is what you get from
concatenating <code>"This is "</code> with <code>" an edge"</code>. The marker diffs the screen
character by character, so the double space is reproduced rather than tidied up.</p>
<p><strong>How this was verified.</strong> Five scripted runs, each diffed against the console for the
whole program including the printed matrix — which is compared against the matrix drawn in the brief,
cell for cell. The runs are: the brief's own (2, 5); the same edge asked backwards as (5, 2); the
non-edge (1, 3) that the brief highlights; (4, 4), which checks the diagonal is still zero because no
loops were added; and a run that types <code>two</code> and then <code>9</code> before giving a real
answer, to show the validator refuses both.</p>''',
    explain_vi='''<p><strong>Đề tự mâu thuẫn, và các hình vẽ mới là đúng.</strong> Câu trong phần Hướng
dẫn viết: "Mỗi ô aij của ma trận kề chứa 0 nếu có cạnh giữa đỉnh thứ i và đỉnh thứ j, và chứa 1 nếu
ngược lại." Câu đó ngược. Mọi hình trong chính đề đều nói điều ngược lại: ma trận mẫu mang số 1 đúng ở
những chỗ hình vẽ có đường nối, còn cặp <em>không</em> phải cạnh (1, 3) được tô đậm bằng hai số
<strong>0</strong>. Đó là lỗi đánh máy của quy ước thông thường, và lời giải này theo các hình —
<code>1 = có cạnh</code>. Hãy nói ra là bạn đã để ý; phát hiện mâu thuẫn trong đặc tả là điểm cộng, không
phải rủi ro.</p>
<p><strong>Ma trận hay danh sách kề — lựa chọn đề đã chọn thay bạn, và vì sao nó có lý.</strong> Ma trận
kề tốn V × V ô bất kể có bao nhiêu cạnh. Danh sách kề tốn V + E. Với đồ thị này — 5 đỉnh, 5 cạnh — là 25
ô so với khoảng 15 chỗ, chẳng đáng kể. Nhưng khoảng cách phình rất nhanh: mạng đường bộ 1000 thị trấn
nối bằng 1000 con đường cần một triệu ô ma trận, trong đó 998000 ô là số 0, so với 3000 phần tử danh
sách. Vậy ma trận là hình dạng đúng cho đồ thị <em>dày</em>, hoặc khi câu hỏi hay được đặt ra nhất chính
là câu chương trình này hỏi — "(u, v) có phải một cạnh không?" — mà ma trận trả lời bằng một phép đọc
mảng, O(1), còn danh sách kề phải duyệt cả một hàng. Liệt kê đỉnh kề thì ngược lại: ma trận phải đi hết
V ô của hàng ngay cả với đỉnh chỉ có một hàng xóm, còn danh sách đưa ra câu trả lời ngay. Hãy chọn cách
biểu diễn theo câu hỏi bạn hỏi nhiều nhất, đừng chọn theo thói quen.</p>
<p><strong>Vô hướng nghĩa là mỗi cạnh phải ghi hai lần, và đó là việc của <code>addEdge</code>.</strong>
<code>matrix[start][end]</code> và <code>matrix[end][start]</code> cùng được đặt trong một phương thức.
Chỉ đặt cái đầu thì đồ thị lặng lẽ trở thành có hướng: hỏi (2, 5) thì trả lời có, hỏi (5, 2) thì trả lời
không, cho một con đường vốn không có chiều. Ma trận của đồ thị vô hướng là ma trận đối xứng, và tính
đối xứng không phải thứ đi kiểm tra sau — nó là bất biến mà một phương thức có trách nhiệm không bao giờ
phá vỡ. Cũng để ý: mảng <code>EDGES</code> trong <code>Main</code> liệt kê mỗi cạnh đúng một lần; đưa cả
hai chiều vào bảng đó sẽ đẩy trách nhiệm sang phía gọi, nơi người thêm cạnh tiếp theo chắc chắn sẽ quên
mất một nửa.</p>
<p><strong>Chương trình chứng minh tính đối xứng ngay trên màn hình thay vì nói suông.</strong> Sau khi
đọc hai điểm, nó in danh sách đỉnh kề của <em>cả hai</em> đầu mút. Chạy với 2 rồi 5 sẽ ra
<code>Neighbours of 2: [4, 5]</code> và <code>Neighbours of 5: [2, 3, 4]</code> — 5 nằm trong hàng của 2
và 2 nằm trong hàng của 5. Chạy với 5 rồi 2 thì hai danh sách đó đổi chỗ, kết luận vẫn thế. Một cạnh chỉ
ghi một nửa không thể sống sót qua cặp lần chạy này.</p>
<p><strong>Nhãn 1..5, chỉ số 0..4.</strong> Đề đánh số đỉnh từ 1 còn Java đánh số mảng từ 0, nên cần đúng
một phép trừ — và nó nằm bên trong <code>Graph</code>, cạnh một hàm <code>check</code> private duy nhất
lo việc chặn khoảng. Chương trình rải <code>- 1</code> khắp phần giao diện là chương trình sẽ có ngày
lệch một đơn vị ở đúng một chỗ trong số đó.</p>
<p><strong>Ba tệp, không có <code>bo</code>, và đó là chủ ý.</strong> Một <code>Graph</code> là dữ liệu
và luật của chính nó trong cùng một đối tượng; một <code>GraphManager</code> bọc quanh chỉ để chuyển
tiếp lời gọi. Các tầng dùng ở đây là <code>entity</code> (cấu trúc), <code>utils</code> (mọi thao tác đọc
bàn phím) và <code>ui</code> (màn hình) — đúng hình dạng mà các bài nhỏ đã thật sự được chấm.</p>
<p><strong>Lỗi đánh máy trên màn hình được chép nguyên.</strong> Kết quả mong đợi của đề là
<code>This is  an edge</code> — hai dấu cách giữa "is" và "an", đúng thứ bạn nhận được khi nối
<code>"This is "</code> với <code>" an edge"</code>. Người chấm so từng ký tự, nên dấu cách thừa được
giữ nguyên chứ không được dọn.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Năm lần chạy theo kịch bản, mỗi lần so toàn bộ màn hình kể cả
ma trận in ra — và ma trận đó được đối chiếu với ma trận vẽ trong đề, từng ô một. Các lần chạy gồm: cặp
(2, 5) của chính đề; đúng cạnh đó hỏi ngược thành (5, 2); cặp không phải cạnh (1, 3) mà đề tô đậm;
(4, 4) để kiểm rằng đường chéo vẫn toàn 0 vì không có khuyên nào được thêm; và một lần gõ
<code>two</code> rồi <code>9</code> trước khi trả lời tử tế, để thấy bộ kiểm tra từ chối cả hai.</p>''',
    hints_en=[
        "Follow the brief's pictures, not its sentence: 1 means an edge, 0 means no edge.",
        'addEdge must set matrix[u][v] AND matrix[v][u] — that is what "undirected" means.',
        'Vertices are 1..V on screen and 0..V-1 in the array. Do the -1 in one place only.',
        'new int[n][n] is already all zeros; you do not need a loop to build an empty graph.',
        'Prove the symmetry: print the neighbours of both endpoints and ask the same edge backwards.',
    ],
    hints_vi=[
        'Theo hình vẽ của đề chứ đừng theo câu chữ: 1 là có cạnh, 0 là không có cạnh.',
        'addEdge phải đặt matrix[u][v] VÀ matrix[v][u] — đó chính là nghĩa của "vô hướng".',
        'Đỉnh đánh số 1..V trên màn hình và 0..V-1 trong mảng. Chỉ trừ 1 ở đúng một chỗ.',
        'new int[n][n] vốn đã toàn số 0; không cần vòng lặp nào để dựng đồ thị rỗng.',
        'Hãy chứng minh tính đối xứng: in đỉnh kề của cả hai đầu mút và hỏi ngược lại cùng một cạnh.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────

VI = {
 'J1.S.P0006': '''<p><strong>Short Assignment · J1.S.P0006 · 70 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3>
<p>Thông thường, để tìm một giá trị trong mảng chưa sắp xếp, ta phải xem lần lượt từng phần tử cho tới
khi gặp giá trị cần tìm. Nếu giá trị đó không có trong mảng, ta phải duyệt hết mọi phần tử. Trung bình,
chi phí của thuật toán này tỉ lệ với độ dài của mảng.</p>
<p>Tình hình thay đổi hẳn khi mảng đã được sắp xếp. Nếu biết mảng đã sắp, ta có thể tận dụng khả năng
truy cập ngẫu nhiên để tìm ra giá trị rất nhanh. Chi phí tìm kiếm giảm xuống còn logarit cơ số 2 của độ
dài mảng. Để dễ hình dung: log2(1 000 000) ≈ 20. Nghĩa là trong trường hợp xấu nhất, thuật toán chỉ cần
20 bước để tìm ra một giá trị trong mảng đã sắp gồm một triệu phần tử — hoặc để khẳng định rằng giá trị
đó không có trong mảng.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình cho phép người dùng nhập số phần tử của mảng. Sinh số nguyên ngẫu nhiên trong
khoảng đã nhập. Sau đó cho người dùng nhập số cần tìm. Hiển thị mảng đã sắp xếp và vị trí của số cần
tìm trong mảng.</p>
<h3>Chi tiết chức năng</h3>
<ol>
<li><strong>Hiện màn hình yêu cầu nhập một số nguyên dương.</strong> Người dùng chạy chương trình,
chương trình hỏi số phần tử của mảng và số cần tìm. Nhập xong thì thực hiện Chức năng 2.</li>
<li><strong>Hiển thị vị trí tìm được.</strong> Sinh số nguyên ngẫu nhiên cho từng phần tử, sắp xếp
mảng, rồi hiển thị vị trí của số cần tìm trong mảng.</li>
</ol>
<h3>Màn hình mong đợi</h3>
<pre>Enter number of array:
10
Enter search value:
4
Sorted array: [1, 1, 1, 1, 3, 4, 6, 8, 9, 9]
Found 4 at index: 5</pre>
<h3>Hướng dẫn</h3>
<h4>Thuật toán</h4>
<p>Thuật toán khá đơn giản. Có thể cài bằng đệ quy hoặc bằng vòng lặp:</p>
<ol>
<li>Lấy phần tử ở giữa.</li>
<li>Nếu phần tử ở giữa bằng giá trị cần tìm, thuật toán dừng.</li>
<li>Ngược lại, có hai khả năng:
<ul>
<li>Giá trị cần tìm <strong>nhỏ hơn</strong> phần tử giữa. Khi đó quay lại bước 1 với phần mảng
<em>trước</em> phần tử giữa.</li>
<li>Giá trị cần tìm <strong>lớn hơn</strong> phần tử giữa. Khi đó quay lại bước 1 với phần mảng
<em>sau</em> phần tử giữa.</li>
</ul>
</li>
</ol>
<p>Giờ phải xác định khi nào thì dừng lặp. Trường hợp thứ nhất là khi đã tìm thấy phần tử. Trường hợp
thứ hai là khi mảng con không còn phần tử nào — khi đó ta kết luận giá trị cần tìm không có trong
mảng.</p>
<h4>Ví dụ</h4>
<p><strong>Ví dụ 1.</strong> Tìm 6 trong {-1, 5, 6, 18, 19, 25, 46, 78, 102, 114}.</p>
<pre>Bước 1 (phần tử giữa là 19 &gt; 6):    -1  5  6  18  19  25  46  78  102  114
Bước 2 (phần tử giữa là 5 &lt; 6):     -1  5  6  18  19  25  46  78  102  114
Bước 3 (phần tử giữa là 6 == 6):    -1  5  6  18  19  25  46  78  102  114</pre>
<p><strong>Ví dụ 2.</strong> Tìm 103 trong {-1, 5, 6, 18, 19, 25, 46, 78, 102, 114}.</p>
<pre>Bước 1 (phần tử giữa là 19 &lt; 103):  -1  5  6  18  19  25  46  78  102  114
Bước 2 (phần tử giữa là 78 &lt; 103):  -1  5  6  18  19  25  46  78  102  114
Bước 3 (phần tử giữa là 102 &lt; 103): -1  5  6  18  19  25  46  78  102  114
Bước 4 (phần tử giữa là 114 &gt; 103): -1  5  6  18  19  25  46  78  102  114
Bước 5 (giá trị cần tìm không có):  -1  5  6  18  19  25  46  78  102  114</pre>''',

 'J1.S.P0007': '''<p><strong>Short Assignment · J1.S.P0007 · 70 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3>
<p>Đồ thị là một cấu trúc được dùng rất rộng rãi trong khoa học máy tính và trong nhiều loại ứng dụng.
Đồ thị dùng để lưu và phân tích siêu dữ liệu — tức là các mối liên kết có trong dữ liệu. Ví dụ, hãy nghĩ
tới các thành phố trong một quốc gia: mạng lưới đường bộ nối chúng lại với nhau có thể được biểu diễn
bằng một đồ thị rồi đem ra phân tích.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình sinh ra một đồ thị theo hướng dẫn bên dưới. Chương trình yêu cầu người dùng
nhập hai đỉnh và xác định xem đó có phải là một cạnh của đồ thị hay không. Hãy xây dựng lớp
<code>Graph</code> dùng <strong>ma trận kề</strong> để biểu diễn đồ thị theo hướng dẫn bên dưới.</p>
<h3>Màn hình mong đợi</h3>
<pre>Enter the start point:
2
Enter the end point:
5
This is  an edge</pre>
<h3>Hướng dẫn</h3>
<h4>Ma trận kề</h4>
<p>Mỗi ô a<sub>ij</sub> của ma trận kề chứa 0 nếu có cạnh giữa đỉnh thứ i và đỉnh thứ j, và chứa 1 nếu
ngược lại.</p>
<p><strong>Lưu ý:</strong> câu trên là nguyên văn của đề, nhưng nó <em>ngược</em> với mọi hình minh hoạ
trong chính đề — ma trận mẫu ghi số 1 đúng ở những chỗ có cạnh, còn cặp (1, 3) không phải cạnh thì được
tô đậm bằng hai số 0. Hãy làm theo hình: <strong>1 là có cạnh, 0 là không có cạnh</strong>.</p>
<p>Đồ thị trong ví dụ có 5 đỉnh và 5 cạnh: (1, 4), (2, 4), (2, 5), (3, 5), (4, 5). Ma trận kề của nó
là:</p>
<pre>     1  2  3  4  5
  1  0  0  0  1  0
  2  0  0  0  1  1
  3  0  0  0  0  1
  4  1  1  0  0  1
  5  0  1  1  1  0</pre>
<p>Đồ thị trong ví dụ là <strong>vô hướng</strong>. Điều đó có nghĩa là ma trận kề của nó
<strong>đối xứng</strong>: trong đồ thị vô hướng, nếu có cạnh (2, 5) thì cũng có cạnh (5, 2). Đó cũng là
lý do vì sao mỗi cạnh chiếm <em>hai</em> ô trong ví dụ. Khuyên (cạnh nối một đỉnh với chính nó), nếu đồ
thị cho phép, sẽ nằm trên đường chéo của ma trận kề.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
