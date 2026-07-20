# Batch 5 — J1.S.P0002 (selection sort) and J1.S.P0003 (insertion sort).
#
# These two share the shape of P0001 on purpose: the assignments are deliberately
# near-identical so the student's attention lands on the ALGORITHM. The solutions
# keep the same layout, and the walkthroughs concentrate on what makes each sort
# different from the other two.
import re
from solkit import solution

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
    """Assert the relationship, not fixed text — the array is random."""
    def check(out):
        before_m = re.search(r'Unsorted array: \[([^\]]*)\]', out)
        after_m = re.search(r'Sorted array: \[([^\]]*)\]', out)
        if not before_m or not after_m:
            return False, 'expected one Unsorted array line and one Sorted array line'
        before = [int(x) for x in re.findall(r'-?\d+', before_m.group(1))]
        after = [int(x) for x in re.findall(r'-?\d+', after_m.group(1))]
        if len(before) != expected_size:
            return False, f'expected {expected_size} elements, got {len(before)}'
        if sorted(before) != after:
            return False, f'sorted line is not the unsorted one in order: {before} -> {after}'
        return True, ''
    return check


# ════════════════════════════════════════════════════════════════
# J1.S.P0002 — Selection sort (40 LOC)
# ════════════════════════════════════════════════════════════════

P0002_BO = '''package bo;

import java.util.Random;

/** Array generation and selection sort. No printing. */
public class ArraySorter {

    private final Random random = new Random();

    public int[] generate(int size, int bound) {
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = random.nextInt(bound);
        }
        return array;
    }

    /**
     * Selection sort, ascending.
     *
     * The idea in one sentence: the part left of i is already final, so find the
     * smallest value in what remains and swap it into position i.
     *
     * Note there is exactly ONE swap per pass, and it happens AFTER the inner
     * loop has finished looking. That is the whole difference from bubble sort,
     * which swaps every time it meets a pair out of order.
     */
    public void selectionSort(int[] array) {
        for (int i = 0; i < array.length - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < array.length; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;            // remember WHERE, do not swap yet
                }
            }
            if (minIndex != i) {
                int temp = array[i];
                array[i] = array[minIndex];
                array[minIndex] = temp;
            }
        }
    }
}
'''

P0002_MAIN = '''package ui;

import bo.ArraySorter;
import java.util.Arrays;
import utils.Validator;

/** Screen only. */
public class Main {

    private static final int BOUND = 100;

    public static void main(String[] args) {
        ArraySorter sorter = new ArraySorter();

        System.out.println("===== Selection Sort Program =====");
        int size = Validator.getInt("Please input the number of array: ", 1, 1000);

        int[] array = sorter.generate(size, BOUND);
        System.out.println("Unsorted array: " + Arrays.toString(array));

        sorter.selectionSort(array);
        System.out.println("Sorted array: " + Arrays.toString(array));
    }
}
'''

solution(
    'J1.S.P0002',
    title_vi='Thuật toán sắp xếp chọn (Selection sort)',
    files=[('src/bo/ArraySorter.java', P0002_BO),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0002_MAIN)],
    main_class='ui.Main',
    runs=[('abc\n0\n10\n', sorted_check(10))],
    explain_en='''<p><strong>What the brief is really asking.</strong> The same program as the bubble
sort assignment with one part replaced: the algorithm must be <em>selection sort</em>. Examiners often
set two of these together and then ask you to tell them apart, so the difference is the thing to
learn.</p>
<p><strong>Selection sort in one sentence.</strong> Everything left of <code>i</code> is already
final; look through what remains, find the smallest, and swap it into position <code>i</code>.</p>
<p><strong>The difference from bubble sort, stated precisely.</strong> Bubble sort swaps every time it
meets a pair in the wrong order. Selection sort only remembers <em>where</em> the smallest value is —
<code>minIndex = j</code>, not a swap — and performs at most ONE swap per pass, after the inner loop
has finished. On 200 random values that is 576 moves against bubble sort's 28,746: fifty times fewer.
If a move were expensive, say swapping large objects rather than ints, selection sort would be the
cheaper algorithm despite comparing more.</p>
<p><strong>What it cannot do.</strong> Selection sort has no early exit. Even on an already-sorted
array it still performs every comparison, because it cannot know the minimum is already in place
until it has looked at everything. Bubble and insertion sort both finish early on sorted input;
selection sort never does. That is a favourite examiner question and the honest answer is "it always
costs the same".</p>
<p><strong>Why <code>if (minIndex != i)</code>.</strong> When the smallest value is already in place,
swapping it with itself is three pointless writes. The guard is not required for correctness — it is
there because you should be able to say why it is there.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Vẫn là chương trình của bài bubble sort, chỉ thay
đúng một phần: thuật toán phải là <em>sắp xếp chọn</em>. Giám khảo thường ra hai bài này cùng lúc rồi
bắt phân biệt, nên chính chỗ khác nhau mới là thứ cần học.</p>
<p><strong>Sắp xếp chọn, gói trong một câu.</strong> Mọi thứ bên trái <code>i</code> đã yên vị; hãy
duyệt phần còn lại, tìm phần tử nhỏ nhất, rồi đổi nó về vị trí <code>i</code>.</p>
<p><strong>Khác bubble sort ở đâu, nói cho chính xác.</strong> Bubble sort đổi chỗ mỗi lần gặp một cặp
sai thứ tự. Sắp xếp chọn chỉ ghi nhớ <em>vị trí</em> của phần tử nhỏ nhất — <code>minIndex = j</code>,
không phải đổi chỗ — và thực hiện nhiều nhất MỘT lần đổi chỗ cho mỗi lượt, sau khi vòng trong đã duyệt
xong. Trên 200 giá trị ngẫu nhiên, con số là 576 phép di chuyển so với 28.746 của bubble sort: ít hơn
năm mươi lần. Nếu một phép di chuyển tốn kém — chẳng hạn đổi chỗ các đối tượng lớn thay vì số int —
thì sắp xếp chọn lại là thuật toán rẻ hơn, dù nó so sánh nhiều hơn.</p>
<p><strong>Điều nó không làm được.</strong> Sắp xếp chọn không có đường thoát sớm. Ngay cả với mảng đã
sắp sẵn nó vẫn thực hiện đủ mọi phép so sánh, vì nó không thể biết phần tử nhỏ nhất đã đúng chỗ cho
tới khi nhìn hết. Bubble sort và insertion sort đều kết thúc sớm với dữ liệu đã sắp; sắp xếp chọn thì
không bao giờ. Đây là câu hỏi tủ của giám khảo và câu trả lời trung thực là "nó luôn tốn như nhau".</p>
<p><strong>Vì sao có <code>if (minIndex != i)</code>.</strong> Khi phần tử nhỏ nhất vốn đã đúng chỗ,
đổi chỗ nó với chính nó là ba lần ghi vô ích. Câu lệnh này không bắt buộc để chạy đúng — nó ở đó vì
bạn nên giải thích được vì sao nó ở đó.</p>''',
    hints_en=[
        'Selection sort remembers an INDEX in the inner loop and swaps once after it, not on every comparison.',
        'The outer loop only needs to reach length - 1: the last element has nowhere left to go.',
        'Guard the swap with minIndex != i so an already-correct element is not swapped with itself.',
        'Be ready to say why selection sort cannot finish early on sorted input.',
    ],
    hints_vi=[
        'Sắp xếp chọn ghi nhớ CHỈ SỐ trong vòng trong rồi mới đổi chỗ một lần sau đó, không đổi ở mỗi phép so sánh.',
        'Vòng ngoài chỉ cần chạy tới length - 1: phần tử cuối không còn chỗ nào để đi.',
        'Bọc phép đổi chỗ bằng minIndex != i để phần tử vốn đã đúng chỗ không bị đổi với chính nó.',
        'Chuẩn bị sẵn câu trả lời vì sao sắp xếp chọn không thể kết thúc sớm với mảng đã sắp.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0003 — Insertion sort (40 LOC)
# ════════════════════════════════════════════════════════════════

P0003_BO = '''package bo;

import java.util.Random;

/** Array generation and insertion sort. No printing. */
public class ArraySorter {

    private final Random random = new Random();

    public int[] generate(int size, int bound) {
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = random.nextInt(bound);
        }
        return array;
    }

    /**
     * Insertion sort, ascending.
     *
     * The idea in one sentence: the left part is already sorted, so lift the
     * next value out, slide everything bigger one place right, and drop it into
     * the gap.
     *
     * Note it SHIFTS rather than swaps. A swap is three writes; a shift is one.
     * That is why insertion sort moves far less data than bubble sort even
     * though both are O(n squared).
     */
    public void insertionSort(int[] array) {
        for (int i = 1; i < array.length; i++) {
            int key = array[i];          // lift the value out - the gap is at i
            int j = i - 1;

            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j]; // slide right; the gap moves down to j
                j--;
            }
            array[j + 1] = key;          // j went one too far, so the gap is j+1
        }
    }
}
'''

P0003_MAIN = '''package ui;

import bo.ArraySorter;
import java.util.Arrays;
import utils.Validator;

/** Screen only. */
public class Main {

    private static final int BOUND = 100;

    public static void main(String[] args) {
        ArraySorter sorter = new ArraySorter();

        System.out.println("===== Insertion Sort Program =====");
        int size = Validator.getInt("Please input the number of array: ", 1, 1000);

        int[] array = sorter.generate(size, BOUND);
        System.out.println("Unsorted array: " + Arrays.toString(array));

        sorter.insertionSort(array);
        System.out.println("Sorted array: " + Arrays.toString(array));
    }
}
'''

solution(
    'J1.S.P0003',
    title_vi='Thuật toán sắp xếp chèn (Insertion sort)',
    files=[('src/bo/ArraySorter.java', P0003_BO),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0003_MAIN)],
    main_class='ui.Main',
    runs=[('abc\n1001\n12\n', sorted_check(12))],
    explain_en='''<p><strong>What the brief is really asking.</strong> The third of the three O(n²)
sorts, and the only one of them that is genuinely useful in practice. The brief's own background says
so: it is used to improve quicksort on small sub-arrays.</p>
<p><strong>Insertion sort in one sentence.</strong> The part left of <code>i</code> is already sorted,
so lift <code>array[i]</code> out into <code>key</code>, slide every bigger element one place right,
and drop <code>key</code> into the gap that opens up.</p>
<p><strong>The line everyone gets wrong.</strong> After the <code>while</code> loop,
<code>j</code> has gone one position too far — the loop only stops when <code>array[j]</code> is
<em>not</em> bigger than the key, or when <code>j</code> falls off the front. So the key belongs at
<code>array[j + 1]</code>, never <code>array[j]</code>. Writing <code>array[j] = key</code> loses one
element and duplicates another, and because the array still looks plausible it is a bug that survives
casual testing.</p>
<p><strong>Shift, not swap — and why it matters.</strong> A swap writes three times; a shift writes
once. On 200 random values insertion sort performs about 9,781 moves against bubble sort's 28,746.
Both are O(n²), which is exactly the point: the big-O is the same and the real cost is not.</p>
<p><strong>Its best case is the reason it exists.</strong> On data that is already sorted the
<code>while</code> condition fails immediately every time, so the algorithm makes one comparison per
element and finishes in O(n) — 199 comparisons on 200 sorted values, against selection sort's 19,900.
On nearly-ordered input insertion sort is very hard to beat, and that is the answer to "when would you
actually use this".</p>
<p><strong>The loop starts at 1, not 0.</strong> A single element is already a sorted list, so there
is nothing to insert on the first pass.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Bài thứ ba trong ba thuật toán O(n²), và là bài
duy nhất trong nhóm thật sự hữu dụng trong thực tế. Chính phần Bối cảnh của đề đã nói vậy: nó được
dùng để cải thiện quicksort trên các mảng con nhỏ.</p>
<p><strong>Sắp xếp chèn, gói trong một câu.</strong> Phần bên trái <code>i</code> đã có thứ tự, nên hãy
nhấc <code>array[i]</code> ra thành <code>key</code>, đẩy mọi phần tử lớn hơn sang phải một ô, rồi thả
<code>key</code> vào khoảng trống vừa mở ra.</p>
<p><strong>Dòng mà ai cũng viết sai.</strong> Sau vòng <code>while</code>, biến <code>j</code> đã lùi
quá một vị trí — vòng lặp chỉ dừng khi <code>array[j]</code> <em>không</em> lớn hơn key, hoặc khi
<code>j</code> rơi khỏi đầu mảng. Vậy nên key phải nằm ở <code>array[j + 1]</code>, không bao giờ là
<code>array[j]</code>. Viết <code>array[j] = key</code> sẽ làm mất một phần tử và nhân đôi một phần tử
khác, mà vì mảng nhìn vẫn có vẻ hợp lý nên đây là lỗi sống sót qua kiểu test qua loa.</p>
<p><strong>Đẩy chứ không đổi chỗ — và vì sao điều đó quan trọng.</strong> Một phép đổi chỗ ghi ba lần;
một phép đẩy chỉ ghi một lần. Trên 200 giá trị ngẫu nhiên, sắp xếp chèn thực hiện khoảng 9.781 phép di
chuyển so với 28.746 của bubble sort. Cả hai đều là O(n²), và đó chính là điểm mấu chốt: big-O giống
nhau còn chi phí thật thì không.</p>
<p><strong>Trường hợp tốt nhất chính là lý do nó tồn tại.</strong> Với dữ liệu đã sắp sẵn, điều kiện
<code>while</code> sai ngay lập tức ở mọi lượt, nên thuật toán chỉ tốn một phép so sánh cho mỗi phần
tử và kết thúc trong O(n) — 199 phép so sánh trên 200 giá trị đã sắp, so với 19.900 của sắp xếp chọn.
Với dữ liệu gần như có thứ tự, sắp xếp chèn rất khó bị đánh bại, và đó là câu trả lời cho "khi nào thì
thật sự dùng cái này".</p>
<p><strong>Vòng lặp bắt đầu từ 1, không phải 0.</strong> Một phần tử đơn lẻ vốn đã là một danh sách có
thứ tự, nên lượt đầu tiên không có gì để chèn.</p>''',
    hints_en=[
        'Start the outer loop at 1 — one element is already a sorted list.',
        'Shift bigger elements right instead of swapping; a shift is one write, a swap is three.',
        'After the while loop the key goes at array[j + 1], not array[j]. j has moved one too far.',
        'Test with an already-sorted array too: insertion sort should finish almost immediately.',
    ],
    hints_vi=[
        'Bắt đầu vòng ngoài từ 1 — một phần tử đơn lẻ vốn đã là danh sách có thứ tự.',
        'Hãy đẩy các phần tử lớn hơn sang phải thay vì đổi chỗ; một phép đẩy ghi một lần, đổi chỗ ghi ba lần.',
        'Sau vòng while, key nằm ở array[j + 1], không phải array[j]. Biến j đã lùi quá một ô.',
        'Nhớ test thêm với mảng đã sắp sẵn: sắp xếp chèn phải kết thúc gần như tức thì.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────
from solkit import SOLUTIONS

_INTRO = {
 'J1.S.P0002': ('Sắp xếp chọn là thuật toán sắp xếp đơn giản, thuộc nhóm O(n²) nên kém hiệu quả với '
                'dữ liệu lớn. Sắp xếp chọn có đặc điểm nổi bật là số phép ghi vào bộ nhớ rất ít.',
                'Selection sort', 'sắp xếp chọn',
                ['Tìm phần tử nhỏ nhất trong phần chưa sắp của mảng.',
                 'Đổi chỗ nó với phần tử đầu tiên của phần chưa sắp.',
                 'Lặp lại với phần còn lại của mảng.']),
 'J1.S.P0003': ('Sắp xếp chèn thuộc nhóm O(n²). Khác với nhiều thuật toán cùng độ phức tạp, nó thật sự '
                'được dùng trong thực tế để sắp các mảng nhỏ — chẳng hạn để cải thiện quicksort. Cách '
                'làm của nó giống hệt cách người ta xếp bài trên tay.',
                'Insertion sort', 'sắp xếp chèn',
                ['Mảng được chia làm hai phần: phần đã sắp bên trái và phần chưa sắp bên phải.',
                 'Lấy phần tử đầu tiên của phần chưa sắp.',
                 'Chèn nó vào đúng vị trí trong phần đã sắp, bằng cách đẩy các phần tử lớn hơn sang phải.']),
}

for s in SOLUTIONS:
    if s['lab'] not in _INTRO:
        continue
    bg, name_en, name_vi, steps = _INTRO[s['lab']]
    loc = '40 LOC · 1 slot'
    s['problemVi'] = (
        f'<p><strong>Short Assignment · {s["lab"]} · {loc}</strong></p>'
        f'<h3>Bối cảnh</h3><p>{bg}</p>'
        '<h3>Đặc tả chương trình</h3>'
        '<p>Thiết kế chương trình cho phép người dùng nhập số phần tử của mảng. Sinh số nguyên ngẫu '
        f'nhiên trong khoảng cho trước. Hiển thị mảng trước và sau khi sắp xếp bằng {name_vi} '
        f'({name_en}).</p>'
        '<h3>Chi tiết chức năng</h3>'
        '<ol><li><strong>Hiện màn hình yêu cầu nhập một số nguyên dương.</strong> Người dùng chạy '
        'chương trình, chương trình hiện màn hình yêu cầu nhập một số nguyên dương. Nhập xong thì '
        'chuyển sang Chức năng 2.</li>'
        '<li><strong>Hiển thị và sắp xếp mảng.</strong> Sinh số nguyên ngẫu nhiên cho từng phần tử. '
        'Hiển thị mảng trước và sau khi sắp xếp.</li></ol>'
        '<h3>Hướng dẫn — thuật toán</h3><ol>'
        + ''.join(f'<li>{x}</li>' for x in steps) +
        '</ol>')
