# Batch 4 — J1.S.P0067 (string analysis) and J1.S.P0001 (bubble sort).
import re
from solkit import solution

# ════════════════════════════════════════════════════════════════
# J1.S.P0067 — Analyse the user input string (39 LOC)
# ════════════════════════════════════════════════════════════════

P0067_BO = r'''package bo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The two methods the brief names, with the exact return types it dictates:
 * a Map of number lists, and a Map of character buffers.
 *
 * A Map is the right shape here because one pass over the input produces
 * SEVERAL answers. Returning four separate lists would mean four public methods
 * each re-scanning the same string.
 */
public class AnalysisString {

    public static final String ALL = "all";
    public static final String EVEN = "even";
    public static final String ODD = "odd";
    public static final String SQUARE = "square";

    public static final String ALL_CHARS = "allChars";
    public static final String UPPER = "upper";
    public static final String LOWER = "lower";
    public static final String SPECIAL = "special";

    private static final Pattern NUMBER = Pattern.compile("\\d+");

    /** Required: public HashMap<String, List<Integer>> getNumber(String input) */
    public HashMap<String, List<Integer>> getNumber(String input) {
        List<Integer> all = new ArrayList<>();
        List<Integer> even = new ArrayList<>();
        List<Integer> odd = new ArrayList<>();
        List<Integer> square = new ArrayList<>();

        // \d+ takes RUNS of digits, so "321sdhkj22" gives 321 and 22 - not six
        // separate digits. That is what the brief's own screen shows.
        Matcher matcher = NUMBER.matcher(input == null ? "" : input);
        while (matcher.find()) {
            int value = Integer.parseInt(matcher.group());
            all.add(value);
            if (value % 2 == 0) {
                even.add(value);
            } else {
                odd.add(value);
            }
            if (isPerfectSquare(value)) {
                square.add(value);
            }
        }

        HashMap<String, List<Integer>> result = new HashMap<>();
        result.put(ALL, all);
        result.put(EVEN, even);
        result.put(ODD, odd);
        result.put(SQUARE, square);
        return result;
    }

    /**
     * A perfect square is a number whose square root is a whole number.
     *
     * The root is rounded and squared again rather than compared with its own
     * floor: sqrt of a large square can come back as 4.999999999999999, and
     * flooring that gives 4 instead of 5.
     */
    private boolean isPerfectSquare(int value) {
        if (value < 0) {
            return false;
        }
        long root = Math.round(Math.sqrt(value));
        return root * root == value;
    }

    /** Required: public HashMap<String, StringBuilder> getCharacter(String input) */
    public HashMap<String, StringBuilder> getCharacter(String input) {
        StringBuilder allChars = new StringBuilder();
        StringBuilder upper = new StringBuilder();
        StringBuilder lower = new StringBuilder();
        StringBuilder special = new StringBuilder();

        for (char c : (input == null ? "" : input).toCharArray()) {
            if (Character.isDigit(c)) {
                continue;            // digits were already handled by getNumber
            }
            allChars.append(c);
            if (Character.isUpperCase(c)) {
                upper.append(c);
            } else if (Character.isLowerCase(c)) {
                lower.append(c);
            } else {
                special.append(c);   // anything not a letter and not a digit
            }
        }

        HashMap<String, StringBuilder> result = new HashMap<>();
        result.put(ALL_CHARS, allChars);
        result.put(UPPER, upper);
        result.put(LOWER, lower);
        result.put(SPECIAL, special);
        return result;
    }
}
'''

P0067_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static String getNonEmpty(String message, String error) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println(error);
        }
    }
}
'''

P0067_MAIN = '''package ui;

import bo.AnalysisString;
import java.util.HashMap;
import java.util.List;
import utils.Validator;

/** Screen only: read the string, ask the analyser, print the eight answers. */
public class Main {

    public static void main(String[] args) {
        AnalysisString analyser = new AnalysisString();

        System.out.println("===== Analysis String program ====");
        String input = Validator.getNonEmpty("Input String: ", "Input must not be empty.");

        HashMap<String, List<Integer>> numbers = analyser.getNumber(input);
        HashMap<String, StringBuilder> characters = analyser.getCharacter(input);

        System.out.println("-----Result Analysis------");
        System.out.println("Number of characters: " + input.length());
        System.out.println("Perfect Square Numbers: " + numbers.get(AnalysisString.SQUARE));
        System.out.println("Odd Numbers: " + numbers.get(AnalysisString.ODD));
        System.out.println("Even Numbers: " + numbers.get(AnalysisString.EVEN));
        System.out.println("All Numbers: " + numbers.get(AnalysisString.ALL));
        System.out.println("Uppercase Characters: " + characters.get(AnalysisString.UPPER));
        System.out.println("Lowercase Characters: " + characters.get(AnalysisString.LOWER));
        System.out.println("Special Characters: " + characters.get(AnalysisString.SPECIAL));
        System.out.println("All Characters: " + characters.get(AnalysisString.ALL_CHARS));
    }
}
'''

solution(
    'J1.S.P0067',
    title_vi='Phân tích chuỗi người dùng nhập vào',
    files=[('src/bo/AnalysisString.java', P0067_BO),
           ('src/utils/Validator.java', P0067_VALIDATOR),
           ('src/ui/Main.java', P0067_MAIN)],
    main_class='ui.Main',
    runs=[
        # the brief's own input: every line matches the brief EXCEPT the perfect
        # squares, where the brief's sample is arithmetically impossible
        ('321sdhkjDFGH!@#$%^22fdsf3\n',
         '===== Analysis String program ====\n'
         'Input String: -----Result Analysis------\n'
         'Number of characters: 25\n'
         'Perfect Square Numbers: []\n'
         'Odd Numbers: [321, 3]\n'
         'Even Numbers: [22]\n'
         'All Numbers: [321, 22, 3]\n'
         'Uppercase Characters: DFGH\n'
         'Lowercase Characters: sdhkjfdsf\n'
         'Special Characters: !@#$%^\n'
         'All Characters: sdhkjDFGH!@#$%^fdsf'),
        # a string that really does contain perfect squares
        ('16abc25XY!9\n',
         '===== Analysis String program ====\n'
         'Input String: -----Result Analysis------\n'
         'Number of characters: 11\n'
         'Perfect Square Numbers: [16, 25, 9]\n'
         'Odd Numbers: [25, 9]\n'
         'Even Numbers: [16]\n'
         'All Numbers: [16, 25, 9]\n'
         'Uppercase Characters: XY\n'
         'Lowercase Characters: abc\n'
         'Special Characters: !\n'
         'All Characters: abcXY!'),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> One pass over a string, eight
answers out. The brief dictates both signatures, including the return types:
<code>HashMap&lt;String, List&lt;Integer&gt;&gt; getNumber(String)</code> and
<code>HashMap&lt;String, StringBuilder&gt; getCharacter(String)</code>.</p>
<p><strong>Why a Map is the right return type.</strong> One scan of the input produces four number
lists at once. Returning four separate values would mean four public methods, each walking the same
string again — four times the work and four chances for them to disagree. The Map lets one pass carry
every answer home. That is the design question an examiner will ask about this exercise.</p>
<p><strong>The regular expression matters more than it looks.</strong> <code>\\d+</code> matches
<em>runs</em> of digits, so <code>321sdhkj22</code> yields 321 and 22 — two numbers. Using
<code>\\d</code> without the plus would give five separate single digits and every list below would be
wrong. This is why the brief says "using Regular Expressions" rather than a character loop.</p>
<p><strong>A mistake in the brief you should raise with your examiner.</strong> The expected screen
prints <em>Perfect Square Numbers: [321, 22]</em>. Neither number is a perfect square — 17² is 289 and
18² is 324, so nothing squares to 321, and 22 sits between 16 and 25. The Guidelines section gives the
real rule: <em>"List square numbers (using Math.sqrt)"</em>. This solution implements the correct
definition, so that input prints an empty list, and the second test run uses
<code>16abc25XY!9</code> to show 16, 25 and 9 being found properly. Bringing this up is a point in
your favour, not a risk.</p>
<p><strong>Why the square test rounds instead of flooring.</strong> <code>Math.sqrt</code> returns a
<code>double</code>, and for a large square it can come back as 4.999999999999999. Flooring that gives
4 and the check fails on a number that really is a square. Rounding and squaring again is exact.</p>
<p><strong>Digits are skipped in getCharacter.</strong> They were already reported as numbers, and the
brief's own screen confirms it: <em>All Characters</em> shows
<code>sdhkjDFGH!@#$%^fdsf</code> with no digits in it.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Duyệt chuỗi một lượt, trả về tám kết quả. Đề áp
đặt cả hai chữ ký, kể cả kiểu trả về:
<code>HashMap&lt;String, List&lt;Integer&gt;&gt; getNumber(String)</code> và
<code>HashMap&lt;String, StringBuilder&gt; getCharacter(String)</code>.</p>
<p><strong>Vì sao Map là kiểu trả về đúng.</strong> Một lượt duyệt sinh ra bốn danh sách số cùng lúc.
Trả về bốn giá trị riêng lẻ nghĩa là bốn phương thức public, mỗi cái lại duyệt lại chính chuỗi đó —
gấp bốn lần công việc và bốn cơ hội để chúng mâu thuẫn nhau. Map cho phép một lượt duyệt mang về mọi
câu trả lời. Đó chính là câu hỏi thiết kế mà giám khảo sẽ hỏi ở bài này.</p>
<p><strong>Biểu thức chính quy quan trọng hơn vẻ ngoài của nó.</strong> <code>\\d+</code> khớp
<em>cụm</em> chữ số, nên <code>321sdhkj22</code> cho ra 321 và 22 — hai số. Dùng <code>\\d</code>
không có dấu cộng sẽ ra năm chữ số riêng lẻ và mọi danh sách bên dưới đều sai. Đó là lý do đề ghi
"using Regular Expressions" chứ không phải duyệt từng ký tự.</p>
<p><strong>Một lỗi trong đề mà bạn nên nêu với giám khảo.</strong> Màn hình mong đợi in
<em>Perfect Square Numbers: [321, 22]</em>. Không số nào trong đó là số chính phương — 17² = 289 và
18² = 324 nên không có số nào bình phương ra 321, còn 22 thì nằm giữa 16 và 25. Mục Guidelines mới nêu
luật thật: <em>"List square numbers (using Math.sqrt)"</em>. Lời giải này cài đặt theo định nghĩa
đúng, nên với chuỗi đó danh sách in ra là rỗng, và kịch bản chạy thứ hai dùng
<code>16abc25XY!9</code> để cho thấy 16, 25 và 9 được tìm ra chuẩn xác. Nêu chuyện này ra là điểm
cộng cho bạn, không phải rủi ro.</p>
<p><strong>Vì sao phép kiểm số chính phương dùng làm tròn chứ không lấy phần nguyên.</strong>
<code>Math.sqrt</code> trả về <code>double</code>, và với số lớn nó có thể ra 4.999999999999999. Lấy
phần nguyên sẽ được 4 và phép kiểm trượt trên một số vốn là chính phương. Làm tròn rồi bình phương lại
mới chính xác.</p>
<p><strong>Chữ số bị bỏ qua trong getCharacter.</strong> Chúng đã được báo cáo ở phần số rồi, và chính
màn hình trong đề xác nhận điều đó: <em>All Characters</em> hiện
<code>sdhkjDFGH!@#$%^fdsf</code>, không có chữ số nào.</p>''',
    hints_en=[
        'Use \\\\d+ with the plus — without it 321 becomes three separate digits and every list is wrong.',
        'One scan should fill all four number lists; that is why the brief returns a Map.',
        'A perfect square: round the square root, square it again, compare. Do not floor.',
        'Skip digits inside getCharacter — the brief\'s All Characters line has none in it.',
    ],
    hints_vi=[
        'Dùng \\\\d+ có dấu cộng — thiếu nó thì 321 thành ba chữ số riêng và mọi danh sách đều sai.',
        'Một lượt duyệt phải điền cả bốn danh sách số; đó là lý do đề trả về Map.',
        'Số chính phương: làm tròn căn bậc hai, bình phương lại rồi so sánh. Đừng lấy phần nguyên.',
        'Bỏ qua chữ số trong getCharacter — dòng All Characters của đề không có chữ số nào.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0001 — Bubble sort (40 LOC)
# ════════════════════════════════════════════════════════════════

P0001_BO = '''package bo;

import java.util.Random;

/**
 * Array generation and the sort itself. No printing: the ui layer owns the
 * screen, which is what lets this class be reused and tested.
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
     * Bubble sort, ascending.
     *
     * Two details the brief's own algorithm description asks for, and that an
     * examiner will look at:
     *   - the inner loop stops at length-1-i, because after i passes the last i
     *     elements are already in their final places;
     *   - the swapped flag ends the sort as soon as a whole pass changes
     *     nothing, which is the "if at least one swap has been done, repeat"
     *     rule stated in the brief.
     */
    public void bubbleSort(int[] array) {
        for (int i = 0; i < array.length - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < array.length - 1 - i; j++) {
                if (array[j] > array[j + 1]) {
                    int temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) {
                return;
            }
        }
    }
}
'''

P0001_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /**
     * A positive int inside [min, max]. The brief asks for "a positive decimal
     * number", so zero and negatives are refused as well as letters.
     */
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

P0001_MAIN = '''package ui;

import bo.ArraySorter;
import java.util.Arrays;
import utils.Validator;

/** Screen only. */
public class Main {

    private static final int BOUND = 100;

    public static void main(String[] args) {
        ArraySorter sorter = new ArraySorter();

        System.out.println("===== Bubble Sort Program =====");
        int size = Validator.getInt("Please input the number of array: ", 1, 1000);

        int[] array = sorter.generate(size, BOUND);
        System.out.println("Unsorted array: " + Arrays.toString(array));

        sorter.bubbleSort(array);
        System.out.println("Sorted array: " + Arrays.toString(array));
    }
}
'''


def _sorted_check(out):
    """The array is random, so assert the RELATIONSHIP instead of fixed text:
    the sorted line must be exactly the unsorted line, in order.

    The labels are matched ANYWHERE in the line, not at the start: the prompt is
    printed with print() rather than println(), so when input is piped the
    prompt and the result share a line.
    """
    before_m = re.search(r'Unsorted array: \[([^\]]*)\]', out)
    after_m = re.search(r'Sorted array: \[([^\]]*)\]', out)
    if not before_m or not after_m:
        return False, 'expected one Unsorted array line and one Sorted array line'
    before = [int(x) for x in re.findall(r'-?\d+', before_m.group(1))]
    after = [int(x) for x in re.findall(r'-?\d+', after_m.group(1))]
    if sorted(before) != after:
        return False, f'sorted line is not the unsorted one in order: {before} -> {after}'
    if len(before) != 8:
        return False, f'expected 8 elements, got {len(before)}'
    return True, ''


solution(
    'J1.S.P0001',
    title_vi='Thuật toán sắp xếp nổi bọt (Bubble sort)',
    files=[('src/bo/ArraySorter.java', P0001_BO),
           ('src/utils/Validator.java', P0001_VALIDATOR),
           ('src/ui/Main.java', P0001_MAIN)],
    main_class='ui.Main',
    runs=[
        ('abc\n-5\n8\n', _sorted_check),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Read a size, fill an array with
random numbers, print it, sort it with <em>bubble sort</em>, print it again. The algorithm is named,
so <code>Arrays.sort</code> scores nothing here — the point of the exercise is that you can write and
explain the loop.</p>
<p><strong>The two details in the loop that earn the mark.</strong> The inner loop stops at
<code>length - 1 - i</code>: after <em>i</em> passes, the last <em>i</em> elements are already in
their final places, so walking over them again is wasted work. The <code>swapped</code> flag
implements the brief's own wording — <em>"if at least one swap has been done, repeat step 1"</em> —
and turns the best case from O(n²) into O(n). Being able to say both sentences out loud is what the
examiner is checking.</p>
<p><strong>Why the sort takes an array and returns nothing.</strong> Java passes the array reference,
so the method sorts the caller's array in place. If an examiner asks "why is the return type void and
yet the array comes back sorted", that is the answer — and it is a favourite question.</p>
<p><strong>How this solution is verified despite the randomness.</strong> A random array cannot be
compared against a fixed expected screen, so the test asserts the <em>relationship</em> instead: the
sorted line must be exactly the unsorted line in ascending order. That is a stronger check than
eyeballing one lucky run, and it is the same trick you should use when testing your own work.</p>
<p><strong>Validation.</strong> The brief asks for "a positive decimal number", so
<code>getInt</code> refuses letters, zero and negatives. The test run types <code>abc</code> and
<code>-5</code> before a real value to prove it.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Đọc kích thước, đổ số ngẫu nhiên vào mảng, in
ra, sắp xếp bằng <em>bubble sort</em>, in lại. Thuật toán đã được gọi tên nên dùng
<code>Arrays.sort</code> ở đây là không có điểm — ý đồ của bài là bạn viết được và giải thích được
vòng lặp.</p>
<p><strong>Hai chi tiết trong vòng lặp giúp bạn có điểm.</strong> Vòng trong dừng ở
<code>length - 1 - i</code>: sau <em>i</em> lượt thì <em>i</em> phần tử cuối đã nằm đúng chỗ, duyệt
lại chúng là làm việc thừa. Cờ <code>swapped</code> cài đặt đúng câu chữ của đề —
<em>"if at least one swap has been done, repeat step 1"</em> — và biến trường hợp tốt nhất từ O(n²)
thành O(n). Nói to được cả hai câu đó chính là thứ giám khảo đang kiểm tra.</p>
<p><strong>Vì sao hàm sắp xếp nhận mảng mà không trả về gì.</strong> Java truyền tham chiếu của mảng,
nên phương thức sắp xếp ngay trên mảng của nơi gọi. Nếu giám khảo hỏi "sao kiểu trả về là void mà
mảng vẫn được sắp", đó là câu trả lời — và đây là câu hỏi tủ.</p>
<p><strong>Kiểm chứng thế nào khi có yếu tố ngẫu nhiên.</strong> Mảng ngẫu nhiên thì không thể so với
một màn hình cố định, nên bài kiểm khẳng định <em>quan hệ</em> thay vì nội dung: dòng đã sắp phải đúng
bằng dòng chưa sắp xếp theo thứ tự tăng dần. Đó là phép kiểm chặt hơn nhiều so với nhìn mắt một lần
chạy may mắn, và cũng là mẹo bạn nên dùng khi tự kiểm tra bài mình.</p>
<p><strong>Kiểm tra dữ liệu.</strong> Đề yêu cầu "a positive decimal number" nên <code>getInt</code>
từ chối cả chữ cái, số 0 và số âm. Kịch bản chạy gõ <code>abc</code> rồi <code>-5</code> trước khi gõ
giá trị thật để chứng minh điều đó.</p>''',
    hints_en=[
        'The brief names bubble sort, so the library sort is not an option here.',
        'Inner loop bound is length - 1 - i, not length - 1: the tail is already sorted.',
        'Add a swapped flag and return early when a pass changes nothing.',
        'To test a random program, check that the sorted line is the unsorted line in order — do not trust one lucky run.',
    ],
    hints_vi=[
        'Đề chỉ đích danh bubble sort nên không được dùng hàm sắp xếp của thư viện.',
        'Cận vòng trong là length - 1 - i, không phải length - 1: phần đuôi đã được sắp rồi.',
        'Thêm cờ swapped và thoát sớm khi cả một lượt không đổi chỗ gì.',
        'Muốn kiểm chương trình có ngẫu nhiên, hãy kiểm dòng đã sắp đúng bằng dòng chưa sắp theo thứ tự — đừng tin một lần chạy may mắn.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────
from solkit import SOLUTIONS

VI4 = {
 'J1.S.P0067': """<p><strong>Short Assignment · J1.S.P0067 · 39 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình phân tích chuỗi nhập vào và hiển thị các thông tin sau:</p>
<ul>
<li>Số lượng ký tự trong chuỗi.</li>
<li>Toàn bộ ký tự, ký tự viết hoa, ký tự viết thường.</li>
<li>Danh sách số, danh sách số chẵn, danh sách số lẻ, danh sách số chính phương.</li>
<li>Các ký tự đặc biệt.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình. Chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul><li>Phân tích và hiển thị kết quả rồi kết thúc chương trình.</li></ul>
<h3>Màn hình mong đợi</h3>
<pre>===== Analysis String program ====
Input String: 321sdhkjDFGH!@#$%^22fdsf3
-----Result Analysis------
Perfect Square Numbers: [321, 22]
Odd Numbers: [321, 3]
Even Numbers: [22]
All Numbers: [321, 22, 3]
Uppercase Characters: DFGH
Lowercase Characters: sdhkjfdsf
Special Characters: !@#$%^
All Characters: sdhkjDFGH!@#$%^fdsf</pre>
<p><em>Lưu ý: dòng “Perfect Square Numbers” trong ảnh mẫu của đề bị sai — 321 và 22 không phải số
chính phương. Mục Hướng dẫn mới nêu luật đúng: dùng <code>Math.sqrt</code>.</em></p>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt <code>getNumber</code> và <code>getCharacter</code>.</p>
<p>Tạo lớp <code>AnalysisString</code> chứa hai phương thức:</p>
<ul>
<li><code>public HashMap&lt;String, List&lt;Integer&gt;&gt; getNumber(String input)</code> — liệt kê
tất cả số (dùng biểu thức chính quy), số chẵn (<code>number % 2 == 0</code>), số lẻ
(<code>number % 2 != 0</code>), số chính phương (dùng <code>Math.sqrt</code>).</li>
<li><code>public HashMap&lt;String, StringBuilder&gt; getCharacter(String input)</code> — chuỗi toàn
bộ ký tự, ký tự đặc biệt (dùng biểu thức chính quy), ký tự hoa (dùng
<code>Character.isUpperCase()</code>), ký tự thường (ngược lại).</li>
</ul>""",

 'J1.S.P0001': """<p><strong>Short Assignment · J1.S.P0001 · 40 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3>
<p>Sắp xếp nổi bọt là thuật toán sắp xếp đơn giản và nổi tiếng. Trong thực tế nó hiếm khi được dùng;
công dụng chính của nó là để làm quen với các thuật toán sắp xếp. Bubble sort thuộc nhóm O(n²) nên
khá kém hiệu quả với khối lượng dữ liệu lớn. Bubble sort là thuật toán ổn định và thích nghi.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình cho phép người dùng nhập số phần tử của mảng. Sinh số nguyên ngẫu nhiên trong
khoảng cho trước. Hiển thị mảng trước và sau khi sắp xếp bằng bubble sort.</p>
<h3>Chi tiết chức năng</h3>
<ol>
<li><strong>Hiện màn hình yêu cầu nhập một số nguyên dương.</strong> Người dùng chạy chương trình,
chương trình hiện màn hình yêu cầu nhập một số nguyên dương. Nhập xong thì chuyển sang Chức năng 2.</li>
<li><strong>Hiển thị và sắp xếp mảng.</strong> Sinh số nguyên ngẫu nhiên cho từng phần tử. Hiển thị
mảng trước và sau khi sắp xếp.</li>
</ol>
<h3>Hướng dẫn — thuật toán</h3>
<ol>
<li>So sánh từng cặp phần tử kề nhau từ đầu mảng, nếu chúng ngược thứ tự thì đổi chỗ.</li>
<li>Nếu có ít nhất một lần đổi chỗ thì lặp lại bước 1.</li>
</ol>
<p>Hãy hình dung sau mỗi bước, các “bọt khí” lớn nổi dần lên mặt và nằm lại ở đó. Đến bước mà không
còn bọt nào di chuyển thì việc sắp xếp dừng lại.</p>
<p>Ví dụ: sắp xếp {5, 1, 12, -5, 16} bằng bubble sort.</p>""",
}
for s2 in SOLUTIONS:
    if s2['lab'] in VI4:
        s2['problemVi'] = VI4[s2['lab']]
