# Batch 7 — J1.S.P0053 (menu-driven bubble sort), J1.S.P0008 (letter/word count),
# J1.S.P0009 (45 Fibonacci numbers by recursion).
import re
from solkit import solution

VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Value must be between " + min + " and " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    public static String getNonEmpty(String message, String error) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine();
            if (!line.trim().isEmpty()) {
                return line;
            }
            System.out.println(error);
        }
    }
}
'''


# ════════════════════════════════════════════════════════════════
# J1.S.P0053 — Menu-driven bubble sort, both directions (42 LOC)
# ════════════════════════════════════════════════════════════════

P0053_BO = '''package bo;

/**
 * Bubble sort in both directions, and nothing else.
 *
 * One method with a boolean rather than two nearly identical methods: the two
 * sorts differ by a single comparison operator, and duplicating thirty lines to
 * change ">" into "<" is how a bug ends up fixed in one copy only.
 */
public class ArrayManager {

    /** Ascending when ascending is true, descending when it is false. */
    public void bubbleSort(int[] array, boolean ascending) {
        for (int i = 0; i < array.length - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < array.length - 1 - i; j++) {
                boolean outOfOrder = ascending
                        ? array[j] > array[j + 1]
                        : array[j] < array[j + 1];
                if (outOfOrder) {
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

    /** A copy, so sorting for display never disturbs what the user typed. */
    public int[] copyOf(int[] array) {
        int[] copy = new int[array.length];
        System.arraycopy(array, 0, copy, 0, array.length);
        return copy;
    }
}
'''

P0053_MAIN = '''package ui;

import bo.ArrayManager;
import java.util.Arrays;
import utils.Validator;

/**
 * Menu and screen.
 *
 * The array starts as null, not as an empty array: "the user has not entered
 * anything yet" and "the user entered an array of length zero" are different
 * states, and only the first one deserves the message "please use option 1".
 */
public class Main {

    public static void main(String[] args) {
        ArrayManager manager = new ArrayManager();
        int[] array = null;
        boolean running = true;

        while (running) {
            System.out.println("===== Array Sort Program =====");
            System.out.println("1. Input items of the array");
            System.out.println("2. Sort the array in ascending order");
            System.out.println("3. Sort the array in descending order");
            System.out.println("4. Exit");

            int choice = Validator.getInt("Please choose one option: ", 1, 4);
            switch (choice) {
                case 1:
                    array = inputArray();
                    break;
                case 2:
                    array = display(manager, array, true);
                    break;
                case 3:
                    array = display(manager, array, false);
                    break;
                default:
                    running = false;
                    System.out.println("Bye");
            }
        }
    }

    private static int[] inputArray() {
        int length = Validator.getInt("Length of array: ", 1, 1000);
        int[] array = new int[length];
        for (int i = 0; i < length; i++) {
            array[i] = Validator.getInt("Element " + (i + 1) + ": ", Integer.MIN_VALUE, Integer.MAX_VALUE);
        }
        return array;
    }

    /** Returns the array unchanged; sorting happens on a copy for display. */
    private static int[] display(ArrayManager manager, int[] array, boolean ascending) {
        if (array == null) {
            System.out.println("Please input the array first (option 1).");
            return null;
        }
        int[] copy = manager.copyOf(array);
        manager.bubbleSort(copy, ascending);
        System.out.println(ascending ? "----- Ascending -----" : "----- Descending -----");
        System.out.println(Arrays.toString(copy));
        return array;
    }
}
'''


def _p0053_check(out):
    if 'Please input the array first (option 1).' not in out:
        return False, 'sorting before entering an array should be refused'
    asc = re.search(r'----- Ascending -----\n\[([^\]]*)\]', out)
    desc = re.search(r'----- Descending -----\n\[([^\]]*)\]', out)
    if not asc or not desc:
        return False, 'expected one ascending and one descending listing'
    a = [int(x) for x in re.findall(r'-?\d+', asc.group(1))]
    d = [int(x) for x in re.findall(r'-?\d+', desc.group(1))]
    if a != sorted(a):
        return False, f'ascending listing is not ascending: {a}'
    if d != sorted(d, reverse=True):
        return False, f'descending listing is not descending: {d}'
    if sorted(a) != sorted(d):
        return False, 'the two listings hold different elements'
    if a != [-7, 3, 5, 12]:
        return False, f'expected the entered values, got {a}'
    return True, ''


solution(
    'J1.S.P0053',
    title_vi='Sắp xếp mảng một chiều bằng thuật toán nổi bọt',
    files=[('src/bo/ArrayManager.java', P0053_BO),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0053_MAIN)],
    main_class='ui.Main',
    # sort before entering anything, then enter 4 values, sort both ways, exit
    runs=[('2\n1\n4\n5\n-7\n12\n3\n2\n3\n4\n', _p0053_check)],
    explain_en='''<p><strong>What the brief is really asking.</strong> The same bubble sort as P0001, but
inside a menu, and in <em>both</em> directions. The menu is what makes it a different exercise: the
program now has state that survives between options, and a marker will press 2 before pressing 1.</p>
<p><strong>One sort method, not two.</strong> Ascending and descending differ by a single comparison:
<code>&gt;</code> becomes <code>&lt;</code>. Copying thirty lines to change one character is how a bug
gets fixed in one copy and left alive in the other. A <code>boolean ascending</code> parameter chooses
the comparison and there is only ever one algorithm to maintain. Expect to be asked why.</p>
<p><strong>Why the array starts as null.</strong> "The user has not entered anything yet" and "the
user entered an empty array" are different states. <code>null</code> says the first one, and pressing
2 before 1 prints <em>Please input the array first</em> instead of an empty pair of brackets or a
crash. The test run does exactly that as its first keystroke.</p>
<p><strong>Sorting a copy.</strong> Options 2 and 3 sort a copy, not the stored array. Sort the real
array and the second option shows a reversed version of the first result rather than a reordering of
what the user typed — the two listings would still look plausible, which is what makes it a nasty
bug. The test asserts both listings contain the same elements as each other.</p>
<p><strong>The check that makes this test meaningful.</strong> Rather than compare with fixed text,
the test asserts that the ascending listing really is ascending, the descending one really is
descending, and both hold exactly the values that were typed. A wrong sort cannot pass by
coincidence.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Vẫn là bubble sort của bài P0001, nhưng đặt trong
một menu, và phải sắp theo <em>cả hai</em> chiều. Chính cái menu làm nó thành một bài khác: chương
trình giờ có trạng thái tồn tại giữa các lựa chọn, và người chấm sẽ bấm 2 trước khi bấm 1.</p>
<p><strong>Một hàm sắp xếp, không phải hai.</strong> Tăng dần và giảm dần chỉ khác nhau đúng một phép
so sánh: <code>&gt;</code> đổi thành <code>&lt;</code>. Chép ba mươi dòng để đổi một ký tự chính là
cách một lỗi được sửa ở bản này mà vẫn sống ở bản kia. Tham số <code>boolean ascending</code> chọn
phép so sánh và chỉ còn đúng một thuật toán phải bảo trì. Hãy chuẩn bị bị hỏi vì sao.</p>
<p><strong>Vì sao mảng khởi tạo bằng null.</strong> "Người dùng chưa nhập gì" và "người dùng đã nhập
một mảng rỗng" là hai trạng thái khác nhau. <code>null</code> nói lên trạng thái thứ nhất, nên bấm 2
trước 1 sẽ in <em>Please input the array first</em> thay vì một cặp ngoặc rỗng hay một lần văng lỗi.
Kịch bản kiểm làm đúng điều đó ngay ở phím đầu tiên.</p>
<p><strong>Sắp xếp trên bản sao.</strong> Lựa chọn 2 và 3 sắp trên bản sao chứ không phải mảng đang
lưu. Nếu sắp thẳng trên mảng thật thì lựa chọn thứ hai sẽ hiển thị bản đảo ngược của kết quả trước đó
chứ không phải sắp lại thứ người dùng đã nhập — mà hai danh sách vẫn trông hợp lý, đó chính là điều
làm lỗi này khó chịu. Bài kiểm khẳng định hai danh sách chứa đúng cùng một tập phần tử.</p>
<p><strong>Phép kiểm khiến bài test có ý nghĩa.</strong> Thay vì so với văn bản cố định, bài kiểm
khẳng định danh sách tăng dần thật sự tăng dần, danh sách giảm dần thật sự giảm dần, và cả hai chứa
đúng những giá trị đã nhập. Một thuật toán sai không thể lọt qua do may mắn.</p>''',
    hints_en=[
        'Write one sort with a boolean direction, not two copies that differ by one character.',
        'Start the array as null so pressing 2 before 1 can be answered politely.',
        'Sort a copy: the stored array should keep the order the user typed.',
        'Test by pressing option 2 first — that is what a marker does.',
    ],
    hints_vi=[
        'Viết một hàm sắp xếp có tham số chiều, đừng chép hai bản chỉ khác nhau một ký tự.',
        'Khởi tạo mảng bằng null để khi bấm 2 trước 1 còn có cái để trả lời tử tế.',
        'Sắp trên bản sao: mảng đang lưu phải giữ đúng thứ tự người dùng đã nhập.',
        'Hãy tự thử bằng cách bấm lựa chọn 2 trước tiên — người chấm sẽ làm đúng như vậy.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0008 — Letter and character count (50 LOC)
# ════════════════════════════════════════════════════════════════

P0008_BO = '''package bo;

import java.util.StringTokenizer;

/**
 * Counting, and nothing else. Every method takes the text and returns a number,
 * so each one can be checked on its own.
 */
public class TextCounter {

    /** Every character typed, spaces and punctuation included. */
    public int countCharacters(String text) {
        return text.length();
    }

    /** Characters that are not whitespace. */
    public int countCharactersNoSpace(String text) {
        int count = 0;
        for (char c : text.toCharArray()) {
            if (!Character.isWhitespace(c)) {
                count++;
            }
        }
        return count;
    }

    /** Letters only: A-Z and a-z, no digits and no punctuation. */
    public int countLetters(String text) {
        int count = 0;
        for (char c : text.toCharArray()) {
            if (Character.isLetter(c)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Words, using StringTokenizer as the brief's Guidelines suggest.
     *
     * StringTokenizer treats a RUN of delimiters as one, so "a    b" is two
     * words. text.split(" ") would report five, because it returns the empty
     * strings between consecutive spaces. That is the reason the brief names
     * this class.
     */
    public int countWords(String text) {
        return new StringTokenizer(text, " \\t\\n\\r\\f").countTokens();
    }
}
'''

P0008_MAIN = '''package ui;

import bo.TextCounter;
import utils.Validator;

/** Screen only. */
public class Main {

    public static void main(String[] args) {
        TextCounter counter = new TextCounter();

        System.out.println("===== Letter and Character Count =====");
        String text = Validator.getNonEmpty("Please input a string: ", "Input must not be empty.");

        System.out.println("----- Result -----");
        System.out.println("Characters (with spaces): " + counter.countCharacters(text));
        System.out.println("Characters (no spaces): " + counter.countCharactersNoSpace(text));
        System.out.println("Letters: " + counter.countLetters(text));
        System.out.println("Words: " + counter.countWords(text));
    }
}
'''

solution(
    'J1.S.P0008',
    title_vi='Đếm ký tự, chữ cái và từ trong chuỗi',
    files=[('src/bo/TextCounter.java', P0008_BO),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', P0008_MAIN)],
    main_class='ui.Main',
    runs=[
        ('Hello World 123!\n',
         '===== Letter and Character Count =====\n'
         'Please input a string: ----- Result -----\n'
         'Characters (with spaces): 16\nCharacters (no spaces): 14\nLetters: 10\nWords: 3'),
        # several spaces in a row: the case that separates StringTokenizer from split
        ('a    b\n',
         '===== Letter and Character Count =====\n'
         'Please input a string: ----- Result -----\n'
         'Characters (with spaces): 6\nCharacters (no spaces): 2\nLetters: 2\nWords: 2'),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Read a string, report how much of
it there is. The brief is short, so the marks come from being precise about what each number means —
"characters" and "letters" are not the same thing, and a marker will type punctuation to find out
whether you know that.</p>
<p><strong>Four counts, four definitions you can defend.</strong> Characters with spaces is simply
<code>length()</code>. Characters without spaces skips whitespace. Letters counts only A–Z and a–z,
so digits and punctuation are excluded — <code>Character.isLetter</code> says exactly that. Words are
whitespace-separated tokens.</p>
<p><strong>Why the brief names StringTokenizer.</strong> It treats a <em>run</em> of delimiters as one
separator, so <code>"a    b"</code> is two words. <code>text.split(" ")</code> on the same string
returns five pieces, three of them empty, because it splits on every single space. The second test run
is exactly that string, and it is the reason the Guidelines mention this class rather than leaving the
choice to you.</p>
<p><strong>Why each count is its own method.</strong> Four small methods, each taking the text and
returning a number, can be checked one at a time and reused. One method that prints all four could
only ever be used by this screen. This is the same separation the whole track keeps asking for.</p>
<p><strong>What a marker will type.</strong> <code>Hello World 123!</code> has 16 characters, 14
without the spaces, 10 letters (the digits and the exclamation mark do not count) and 3 words. Being
able to explain why 10 and not 14 is the whole exercise.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Đọc một chuỗi, cho biết nó dài bao nhiêu. Đề rất
ngắn, nên điểm nằm ở chỗ bạn định nghĩa chính xác từng con số — "ký tự" và "chữ cái" không phải một
thứ, và người chấm sẽ gõ dấu câu vào để xem bạn có biết điều đó không.</p>
<p><strong>Bốn con số, bốn định nghĩa bạn bảo vệ được.</strong> Ký tự kể cả dấu cách chỉ là
<code>length()</code>. Ký tự không kể dấu cách thì bỏ qua khoảng trắng. Chữ cái chỉ đếm A–Z và a–z,
nên chữ số và dấu câu bị loại — <code>Character.isLetter</code> nói đúng điều đó. Từ là các token
ngăn cách bởi khoảng trắng.</p>
<p><strong>Vì sao đề gọi tên StringTokenizer.</strong> Nó coi một <em>chuỗi liền</em> các ký tự ngăn
cách là một dấu ngăn duy nhất, nên <code>"a    b"</code> là hai từ. Còn <code>text.split(" ")</code>
trên cùng chuỗi đó trả về năm mảnh, ba trong đó rỗng, vì nó tách ở từng dấu cách một. Kịch bản chạy
thứ hai chính là chuỗi đó, và đó là lý do mục Hướng dẫn nhắc tên lớp này thay vì để bạn tự chọn.</p>
<p><strong>Vì sao mỗi phép đếm là một phương thức riêng.</strong> Bốn phương thức nhỏ, mỗi cái nhận
chuỗi và trả về một số, có thể kiểm từng cái một và dùng lại được. Một phương thức in cả bốn thì chỉ
phục vụ được đúng màn hình này. Đây vẫn là sự tách bạch mà cả lộ trình liên tục đòi hỏi.</p>
<p><strong>Người chấm sẽ gõ gì.</strong> <code>Hello World 123!</code> có 16 ký tự, 14 nếu bỏ dấu
cách, 10 chữ cái (chữ số và dấu chấm than không tính) và 3 từ. Giải thích được vì sao là 10 chứ không
phải 14 chính là toàn bộ bài tập này.</p>''',
    hints_en=[
        'Decide what each number MEANS before writing code: characters, characters without spaces, letters, words.',
        'Character.isLetter excludes digits and punctuation — that is the difference between "characters" and "letters".',
        'Use StringTokenizer, not split(" "): several spaces in a row must count as one separator.',
        'Test with "a    b" — split would say five words, the right answer is two.',
    ],
    hints_vi=[
        'Xác định từng con số NGHĨA LÀ GÌ trước khi viết code: ký tự, ký tự không dấu cách, chữ cái, từ.',
        'Character.isLetter loại chữ số và dấu câu — đó là khác biệt giữa "ký tự" và "chữ cái".',
        'Dùng StringTokenizer, đừng dùng split(" "): nhiều dấu cách liền nhau phải tính là một dấu ngăn.',
        'Hãy test bằng "a    b" — split sẽ nói năm từ, đáp án đúng là hai.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0009 — 45 Fibonacci numbers, by recursion (50 LOC)
# ════════════════════════════════════════════════════════════════

P0009_BO = '''package bo;

/**
 * Fibonacci, computed recursively as the brief requires.
 *
 * The plain definition -- fib(n) = fib(n-1) + fib(n-2) -- is correct but
 * unusable at n = 45: it recomputes the same values over and over. fib(44)
 * alone costs 2,269,806,339 calls, and printing all 45 terms costs
 * 5,942,430,099 - the program simply appears to hang. The recursion is
 * kept, and a cache is added so each value is computed once. Same definition,
 * same recursive shape, from minutes to instant.
 */
public class FibonacciCalculator {

    private final long[] cache;

    public FibonacciCalculator(int size) {
        cache = new long[size + 1];
        java.util.Arrays.fill(cache, -1);
    }

    /** Recursive with memoisation. */
    public long fibonacci(int n) {
        if (n <= 1) {
            return n;                       // base case: fib(0)=0, fib(1)=1
        }
        if (cache[n] != -1) {
            return cache[n];                // already known - do not recompute
        }
        cache[n] = fibonacci(n - 1) + fibonacci(n - 2);
        return cache[n];
    }

    /** The same definition without the cache, for the comparison in the notes. */
    public long slowFibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return slowFibonacci(n - 1) + slowFibonacci(n - 2);
    }
}
'''

P0009_MAIN = '''package ui;

import bo.FibonacciCalculator;

/** Screen only. */
public class Main {

    private static final int COUNT = 45;

    public static void main(String[] args) {
        FibonacciCalculator calculator = new FibonacciCalculator(COUNT);

        System.out.println("===== Fibonacci Program =====");
        System.out.println("The first " + COUNT + " Fibonacci numbers:");

        StringBuilder line = new StringBuilder();
        for (int i = 0; i < COUNT; i++) {
            if (i > 0) {
                line.append(", ");
            }
            line.append(calculator.fibonacci(i));
        }
        System.out.println(line.toString());
    }
}
'''


def _fib_check(out):
    m = re.search(r'The first 45 Fibonacci numbers:\n(.+)', out)
    if not m:
        return False, 'expected the header line followed by the sequence'
    got = [int(x) for x in m.group(1).split(',')]
    expected = [0, 1]
    while len(expected) < 45:
        expected.append(expected[-1] + expected[-2])
    if got != expected[:45]:
        return False, f'sequence differs; first mismatch at index ' \
                      f'{next(i for i, (a, b) in enumerate(zip(got, expected)) if a != b)}'
    if got[44] != 701408733:
        return False, f'the 45th term should be 701408733, got {got[44]}'
    return True, ''


solution(
    'J1.S.P0009',
    title_vi='Dãy Fibonacci 45 số bằng đệ quy',
    files=[('src/bo/FibonacciCalculator.java', P0009_BO),
           ('src/ui/Main.java', P0009_MAIN)],
    main_class='ui.Main',
    runs=[('', _fib_check)],
    explain_en='''<p><strong>What the brief is really asking.</strong> Print 45 Fibonacci numbers, and
<em>"use recursion method"</em>. Those two requirements together are the trap, and the exercise is
really about noticing it.</p>
<p><strong>Why the obvious answer does not finish.</strong> Written straight from the definition,
<code>fib(n) = fib(n-1) + fib(n-2)</code> recomputes the same values endlessly:
<code>fib(43)</code> is calculated twice, <code>fib(42)</code> three times, <code>fib(41)</code> five
times — the counts are themselves Fibonacci numbers. <code>fib(44)</code> on its own costs
2,269,806,339 calls, and printing all 45 terms costs <strong>5,942,430,099</strong>. It does not
crash; it just sits there, and a marker watching a blank screen marks it as broken. (Those two
figures are not estimates: the number of calls for <code>fib(n)</code> is exactly
<code>2·fib(n+1)−1</code>, which you can check by hand.)</p>
<p><strong>The fix keeps the recursion.</strong> The method is still recursive and still expresses the
same definition — a cache is added so each value is computed once and read thereafter. 45 terms cost
45 additions instead of two billion. The brief said "use recursion", not "use the slowest possible
recursion", and being able to explain that distinction is the point of the exercise.</p>
<p><strong>Both versions are in the class on purpose.</strong> <code>slowFibonacci</code> is left in so
you can run them side by side and see the difference for yourself, and so you have something concrete
to show an examiner who asks why you cached.</p>
<p><strong>Why long, not int.</strong> The 45th term is 701,408,733 which fits an <code>int</code>, but
only just — term 47 is 2,971,215,073, past the int limit of 2,147,483,647, and would silently go
negative. Using
<code>long</code> costs nothing and removes a trap that a marker asking "what if I want 50 terms"
would walk straight into.</p>
<p><strong>How this is verified.</strong> The test rebuilds the sequence in Python and compares every
one of the 45 terms, then checks the last one is exactly 701408733. Printing 45 plausible-looking
numbers is not evidence; matching an independently computed sequence is.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> In 45 số Fibonacci, và <em>"use recursion
method"</em>. Chính hai yêu cầu đó đặt cạnh nhau tạo thành cái bẫy, và bài tập này thực chất là để bạn
nhận ra nó.</p>
<p><strong>Vì sao cách làm hiển nhiên lại không bao giờ chạy xong.</strong> Viết thẳng theo định nghĩa,
<code>fib(n) = fib(n-1) + fib(n-2)</code> sẽ tính đi tính lại cùng những giá trị đó không ngừng:
<code>fib(43)</code> được tính hai lần, <code>fib(42)</code> ba lần, <code>fib(41)</code> năm lần —
chính các con số đó lại là dãy Fibonacci. Riêng <code>fib(44)</code> đã tốn 2.269.806.339 lời gọi, còn
in đủ 45 số tốn <strong>5.942.430.099</strong> lời gọi. Nó không văng lỗi; nó chỉ đứng im, và người
chấm nhìn màn hình trắng sẽ chấm là hỏng. (Hai con số đó không phải ước lượng: số lời gọi của
<code>fib(n)</code> đúng bằng <code>2·fib(n+1)−1</code>, bạn có thể tự kiểm bằng tay.)</p>
<p><strong>Cách sửa vẫn giữ nguyên đệ quy.</strong> Phương thức vẫn là đệ quy và vẫn diễn đạt đúng định
nghĩa đó — chỉ thêm một bộ nhớ đệm để mỗi giá trị được tính đúng một lần, các lần sau thì đọc lại. 45
số tốn 45 phép cộng thay vì hai tỷ. Đề nói "dùng đệ quy", không nói "dùng kiểu đệ quy chậm nhất có
thể", và giải thích được khác biệt đó chính là ý đồ của bài.</p>
<p><strong>Cả hai bản đều nằm trong lớp, một cách có chủ ý.</strong> Hàm <code>slowFibonacci</code>
được giữ lại để bạn chạy song song và tự thấy khác biệt, đồng thời để bạn có thứ cụ thể đem ra cho
giám khảo khi bị hỏi vì sao lại dùng bộ nhớ đệm.</p>
<p><strong>Vì sao dùng long chứ không dùng int.</strong> Số thứ 45 là 701.408.733, vẫn vừa một
<code>int</code>, nhưng chỉ vừa khít — số thứ 47 là 2.971.215.073, vượt giới hạn int là 2.147.483.647
và sẽ lặng lẽ thành số âm. Dùng
<code>long</code> không tốn gì mà loại bỏ hẳn cái bẫy mà người chấm hỏi "thế muốn 50 số thì sao" sẽ
bước ngay vào.</p>
<p><strong>Kiểm chứng thế nào.</strong> Bài kiểm dựng lại dãy số bằng Python rồi so từng số trong cả
45 số, sau đó kiểm số cuối đúng bằng 701408733. In ra 45 con số trông có vẻ hợp lý không phải bằng
chứng; khớp với một dãy được tính độc lập mới là bằng chứng.</p>''',
    hints_en=[
        'Write the naive recursion first and run it for 45 terms — feeling it hang is the lesson.',
        'Keep the recursion and add a cache array; check the cache before recomputing.',
        'Base case is n <= 1 returning n, which covers both fib(0)=0 and fib(1)=1.',
        'Use long: the sequence outgrows int only a couple of terms after 45.',
    ],
    hints_vi=[
        'Hãy viết bản đệ quy thuần trước rồi chạy cho 45 số — cảm nhận nó treo chính là bài học.',
        'Giữ nguyên đệ quy và thêm một mảng đệm; kiểm tra đệm trước khi tính lại.',
        'Trường hợp cơ sở là n <= 1 thì trả về n, bao trọn cả fib(0)=0 lẫn fib(1)=1.',
        'Dùng long: dãy số vượt khỏi int chỉ vài số sau mốc 45.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────
from solkit import SOLUTIONS

VI7 = {
 'J1.S.P0053': '''<p><strong>Short Assignment · J1.S.P0053 · 42 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình cho phép nhập:</p>
<ul><li>Số phần tử của mảng một chiều.</li>
<li>Giá trị các phần tử phải là số nguyên.</li></ul>
<p>Menu của chương trình như sau:</p>
<ol><li>Nhập các phần tử của mảng</li>
<li>Sắp xếp mảng tăng dần</li>
<li>Sắp xếp mảng giảm dần</li>
<li>Thoát</li></ol>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện menu và yêu cầu người dùng chọn</h4>
<p>Người dùng chạy chương trình, chương trình nhắc chọn một mục. Chọn xong thì thực hiện Chức năng 2.</p>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<ul>
<li><strong>Mục 1: Nhập phần tử.</strong> Yêu cầu nhập “độ dài mảng, giá trị”. Kiểm tra hợp lệ: độ dài
mảng phải lớn hơn 0. Lưu các phần tử rồi quay về màn hình chính.</li>
<li><strong>Mục 2: Sắp xếp tăng dần.</strong> Hiển thị các phần tử theo thứ tự tăng dần rồi quay về
màn hình chính.</li>
<li><strong>Mục 3: Sắp xếp giảm dần.</strong> Hiển thị các phần tử theo thứ tự giảm dần rồi quay về
màn hình chính.</li>
<li><strong>Mục 4:</strong> Thoát chương trình.</li>
</ul>''',

 'J1.S.P0008': '''<p><strong>Short Assignment · J1.S.P0008 · 50 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3>
<p>Biết được số từ hay số ký tự trong một văn bản có thể rất quan trọng. Ví dụ, nếu tác giả bị yêu cầu
viết tối thiểu hoặc tối đa bao nhiêu từ cho một bài báo, công cụ đếm từ sẽ giúp họ biết bài viết đã đạt
yêu cầu chưa.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình cho phép người dùng nhập vào một chuỗi. Đếm và hiển thị số chữ cái và số ký
tự.</p>
<h3>Hướng dẫn</h3>
<p>Để tách chuỗi thành các từ, bạn có thể dùng <code>StringTokenizer</code> trong gói
<code>java.util</code>.</p>''',

 'J1.S.P0009': '''<p><strong>Short Assignment · J1.S.P0009 · 50 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3>
<p>Dãy Fibonacci là dãy số: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, … Số tiếp theo được tìm bằng cách cộng hai
số liền trước nó. Số 2 có được là do cộng hai số trước nó (1+1).</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình hiển thị 45 số của dãy Fibonacci.</p>
<h3>Chi tiết chức năng</h3>
<p>Dùng <strong>phương pháp đệ quy</strong> để tìm 45 số Fibonacci và hiển thị lên màn hình.</p>
<h3>Hướng dẫn</h3>
<p>Dãy Fibonacci là dãy số nguyên 0, 1, 1, 2, 3, 5, 8, 13, 21, … trong đó mỗi phần tử được tạo thành
bằng cách cộng hai phần tử liền trước. Dãy này có thể định nghĩa bằng đệ quy.</p>
<p>Các chương trình Fibonacci cài đặt trực tiếp theo định nghĩa này thường được dùng làm ví dụ nhập môn
về đệ quy. Tuy nhiên còn nhiều thuật toán khác để tính (hoặc sử dụng) số Fibonacci.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI7:
        s['problemVi'] = VI7[s['lab']]
