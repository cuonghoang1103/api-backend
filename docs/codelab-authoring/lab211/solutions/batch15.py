# Batch 15 — J1.S.P0050 (equations + odd/even/perfect-square report),
# J1.S.P0055 (doctor management, the canonical CRUD assignment of the course).
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0050 — Solving the equation, find the square numbers,
#              even numbers, and odd numbers (72 LOC)
# ════════════════════════════════════════════════════════════════

P0050_NUMBER = '''package utils;

/**
 * The three questions this program keeps asking about a number: is it a number
 * at all, is it odd, is it a perfect square.
 *
 * The Guidelines name this class and its methods, down to the spelling of
 * "checkin", so the names are copied exactly rather than improved. They are
 * instance methods for the same reason - the brief writes them as
 * "public Float checkin(...)", not "public static Float checkin(...)".
 *
 * Naming a class Number shadows java.lang.Number for anyone who imports it.
 * That is safe here only because nothing in this program uses java.lang.Number,
 * and an explicit single-type import always wins over the implicit java.lang
 * one. Worth knowing before you name a class String or List by accident.
 */
public class Number {

    /**
     * The typed text as a Float, or null when it is not a number.
     *
     * null is the answer rather than an exception because "the user typed
     * rubbish" is the expected case in this program, not an exceptional one -
     * the whole point of the prompt loop is that it happens. An exception per
     * keystroke would be control flow dressed up as a failure.
     *
     * NaN and Infinity parse happily out of Float.valueOf ("NaN", "Infinity"),
     * and neither is a coefficient anybody meant to type, so both are rejected
     * here instead of poisoning every calculation downstream.
     */
    public Float checkin(String floatString) {
        if (floatString == null) {
            return null;
        }
        String text = floatString.trim();
        if (text.isEmpty()) {
            return null;
        }
        try {
            Float value = Float.valueOf(text);
            if (value.isNaN() || value.isInfinite()) {
                return null;
            }
            return value;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * The Guidelines' own rule: odd is "a % 2 != 0".
     *
     * Applied to a float that also makes -1.25 "odd", which is not what odd
     * means in arithmetic. It IS what the brief asks for and what the brief's
     * own expected screen prints, so it is implemented as written - see the
     * walkthrough, where the disagreement is spelled out.
     */
    public boolean isOdd(float number) {
        return number % 2 != 0;
    }

    public boolean isEven(float number) {
        return number % 2 == 0;
    }

    /**
     * A perfect square: a whole number that is some whole number squared.
     *
     * Two guards before the square root, and both matter. A negative number has
     * no real square root at all. A number with a fractional part is not a
     * perfect square either - 0.25 is 0.5 squared, but 0.5 is not a whole
     * number, and "perfect square" has always meant 0, 1, 4, 9, 16, ...
     *
     * Math.round rather than a bare cast: (long) Math.sqrt(x) truncates, and on
     * a value that the floating point unit returns as 4.999999999 instead of 5
     * the cast would answer 4 and call 25 "not a square". Rounding first, then
     * multiplying back and comparing, is the check that cannot be fooled by the
     * last bit of a double.
     */
    public boolean isPerfectSquare(float number) {
        if (number < 0) {
            return false;
        }
        if (number != Math.floor(number)) {
            return false;
        }
        long root = Math.round(Math.sqrt(number));
        return (double) root * root == (double) number;
    }
}
'''

P0050_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * Number.checkin takes a String, so somebody else has to own the Scanner and
 * the "ask again" loop. That is this class: Number decides whether text is a
 * number, Validator decides what to do about it. Splitting the judgement from
 * the input makes Number testable without a keyboard.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);
    private static final Number NUMBER = new Number();

    private Validator() {
    }

    /** Keeps asking until the line really is a number. */
    public static float getFloat(String message) {
        while (true) {
            System.out.print(message);
            Float value = NUMBER.checkin(SCANNER.nextLine());
            if (value != null) {
                return value;
            }
            System.out.println("Please input number");
        }
    }

    /**
     * A menu choice between min and max.
     *
     * It is read as a float and then checked for a fractional part, so that
     * "2.5" is rejected as a menu option instead of quietly becoming 2.
     */
    public static int getOption(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            Float value = NUMBER.checkin(SCANNER.nextLine());
            if (value == null) {
                System.out.println("Please input number");
                continue;
            }
            int option = value.intValue();
            if (option != value || option < min || option > max) {
                System.out.println("Please choose from " + min + " to " + max + ".");
                continue;
            }
            return option;
        }
    }
}
'''

P0050_SOLVER = '''package bo;

import java.util.ArrayList;
import java.util.List;

/**
 * The two equations, and nothing else. No Scanner, no println.
 *
 * The Guidelines fix both signatures and, more importantly, fix the meaning of
 * the return value: null means NO solution, an empty list means INFINITELY MANY
 * solutions, and a non-empty list holds the roots. That is a three-state answer
 * from one reference, which is worth stating out loud because "null" and
 * "empty" are exactly the pair a careless caller collapses into one case.
 */
public class EquationSolver {

    /**
     * ax + b = 0.
     *
     * a == 0 is not an error, it is the whole reason the three-state return
     * exists: 0x + 0 = 0 is true for every x, and 0x + 5 = 0 is true for none.
     */
    public List<Float> calculateEquation(float a, float b) {
        if (a == 0) {
            return b == 0 ? new ArrayList<Float>() : null;
        }
        List<Float> roots = new ArrayList<>();
        roots.add(-b / a);
        return roots;
    }

    /**
     * ax^2 + bx + c = 0.
     *
     * When a == 0 there is no square term, so this is not a quadratic at all -
     * it is bx + c = 0, and the honest thing is to hand it to the linear solver
     * rather than divide by 2a and produce Infinity or NaN. A marker types
     * a = 0 here precisely to see whether you noticed.
     *
     * delta == 0 gives ONE root, of multiplicity two. It is added twice on
     * purpose: the brief's own screen prints "x1 = -0.500 and x2 = -0.500" for
     * a = 4, b = 4, c = 1, and then lists -0.5 TWICE among the odd numbers.
     * That second detail is the evidence - it only fits a list holding the root
     * twice, so that is what this returns.
     */
    public List<Float> calculateQuadraticEquation(float a, float b, float c) {
        if (a == 0) {
            return calculateEquation(b, c);
        }
        float delta = b * b - 4 * a * c;
        if (delta < 0) {
            return null;
        }
        List<Float> roots = new ArrayList<>();
        if (delta == 0) {
            float root = -b / (2 * a);
            roots.add(root);
            roots.add(root);
            return roots;
        }
        float sqrtDelta = (float) Math.sqrt(delta);
        roots.add((-b + sqrtDelta) / (2 * a));
        roots.add((-b - sqrtDelta) / (2 * a));
        return roots;
    }
}
'''

P0050_MAIN = '''package ui;

import bo.EquationSolver;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import utils.Number;
import utils.Validator;

/**
 * The menu and the screen.
 *
 * The import of utils.Number is deliberate and legal: an explicit single-type
 * import beats the implicit java.lang.* one, so Number here means ours.
 */
public class Main {

    private static final EquationSolver SOLVER = new EquationSolver();
    private static final Number NUMBER = new Number();

    public static void main(String[] args) {
        boolean running = true;
        while (running) {
            System.out.println("========= Equation Program =========");
            System.out.println("1. Calculate Superlative Equation");
            System.out.println("2. Calculate Quadratic Equation");
            System.out.println("3. Exit");
            switch (Validator.getOption("Please choice one option: ", 1, 3)) {
                case 1:
                    superlative();
                    break;
                case 2:
                    quadratic();
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }

    /** The brief titles this screen "Calculate Equation", not "Superlative". */
    private static void superlative() {
        System.out.println("----- Calculate Equation -----");
        float a = Validator.getFloat("Enter A: ");
        float b = Validator.getFloat("Enter B: ");

        List<Float> roots = SOLVER.calculateEquation(a, b);
        if (roots == null) {
            System.out.println("The equation has no solution.");
        } else if (roots.isEmpty()) {
            System.out.println("The equation has infinitely many solutions.");
        } else {
            System.out.println(String.format(Locale.US, "Solution: x = %.3f", roots.get(0)));
        }
        report("Number is Odd:", collect(roots, a, b));
    }

    private static void quadratic() {
        System.out.println("----- Calculate Quadratic Equation -----");
        float a = Validator.getFloat("Enter A: ");
        float b = Validator.getFloat("Enter B: ");
        float c = Validator.getFloat("Enter C: ");

        List<Float> roots = SOLVER.calculateQuadraticEquation(a, b, c);
        if (roots == null) {
            System.out.println("The equation has no solution.");
        } else if (roots.isEmpty()) {
            System.out.println("The equation has infinitely many solutions.");
        } else if (roots.size() == 1) {
            // a == 0 was typed, so the quadratic solver handed the work to the
            // linear one and there is a single root to show.
            System.out.println(String.format(Locale.US, "Solution: x = %.3f", roots.get(0)));
        } else {
            System.out.println(String.format(Locale.US, "Solution: x1 = %.3f and x2 = %.3f",
                    roots.get(0), roots.get(1)));
        }
        // The second screen in the brief labels the same line "Odd Number(s):"
        // where the first one says "Number is Odd:". Both are copied exactly:
        // a marker diffs the screen, so an inconsistency in the brief is not
        // ours to tidy up.
        report("Odd Number(s):", collect(roots, a, b, c));
    }

    /**
     * The coefficients first, then the roots.
     *
     * That order is not a guess - in the brief's quadratic screen the odd
     * numbers come out as "1.0, -0.5, -0.5", which is c followed by the two
     * roots, and the even numbers as "4.0, 4.0", which is a followed by b.
     */
    private static List<Float> collect(List<Float> roots, float... coefficients) {
        List<Float> all = new ArrayList<>();
        for (float coefficient : coefficients) {
            all.add(coefficient);
        }
        if (roots != null) {
            all.addAll(roots);
        }
        return all;
    }

    private static void report(String oddLabel, List<Float> values) {
        StringBuilder odd = new StringBuilder();
        StringBuilder even = new StringBuilder();
        StringBuilder square = new StringBuilder();
        for (Float value : values) {
            append(NUMBER.isOdd(value) ? odd : even, value);
            if (NUMBER.isPerfectSquare(value)) {
                append(square, value);
            }
        }
        System.out.println(oddLabel + odd);
        System.out.println("Number is Even:" + even);
        System.out.println("Number is Perfect Square:" + square);
    }

    /** Comma-separated, and the separator goes BEFORE every item but the first. */
    private static void append(StringBuilder line, Float value) {
        if (line.length() > 0) {
            line.append(", ");
        }
        line.append(value);
    }
}
'''

MENU_0050 = '''========= Equation Program =========
1. Calculate Superlative Equation
2. Calculate Quadratic Equation
3. Exit
'''


solution(
    'J1.S.P0050',
    title_vi='Giải phương trình, tìm số chính phương, số chẵn và số lẻ',
    files=[('src/bo/EquationSolver.java', P0050_SOLVER),
           ('src/utils/Number.java', P0050_NUMBER),
           ('src/utils/Validator.java', P0050_VALIDATOR),
           ('src/ui/Main.java', P0050_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — the brief's own two screens, keystroke for keystroke,
        # including the rejected "a" on both.
        ('1\na\n4\n5\n2\na\n4\n4\n1\n3\n',
         MENU_0050 +
         'Please choice one option: ----- Calculate Equation -----\n'
         'Enter A: Please input number\n'
         'Enter A: Enter B: Solution: x = -1.250\n'
         'Number is Odd:5.0, -1.25\n'
         'Number is Even:4.0\n'
         'Number is Perfect Square:4.0\n' + MENU_0050 +
         'Please choice one option: ----- Calculate Quadratic Equation -----\n'
         'Enter A: Please input number\n'
         'Enter A: Enter B: Enter C: Solution: x1 = -0.500 and x2 = -0.500\n'
         'Odd Number(s):1.0, -0.5, -0.5\n'
         'Number is Even:4.0, 4.0\n'
         'Number is Perfect Square:4.0, 4.0, 1.0\n' + MENU_0050 +
         'Please choice one option: Goodbye.'),
        # Run 1 — the three degenerate cases of the LINEAR equation:
        # a = 0 with b = 0 (every x works), a = 0 with b != 0 (no x works),
        # and a normal one with two real perfect squares among the input.
        ('1\n0\n0\n1\n0\n5\n1\n9\n-3\n3\n',
         MENU_0050 +
         'Please choice one option: ----- Calculate Equation -----\n'
         'Enter A: Enter B: The equation has infinitely many solutions.\n'
         'Number is Odd:\n'
         'Number is Even:0.0, 0.0\n'
         'Number is Perfect Square:0.0, 0.0\n' + MENU_0050 +
         'Please choice one option: ----- Calculate Equation -----\n'
         'Enter A: Enter B: The equation has no solution.\n'
         'Number is Odd:5.0\n'
         'Number is Even:0.0\n'
         'Number is Perfect Square:0.0\n' + MENU_0050 +
         'Please choice one option: ----- Calculate Equation -----\n'
         'Enter A: Enter B: Solution: x = 0.333\n'
         'Number is Odd:9.0, -3.0, 0.33333334\n'
         'Number is Even:\n'
         'Number is Perfect Square:9.0\n' + MENU_0050 +
         'Please choice one option: Goodbye.'),
        # Run 2 — the three cases of the QUADRATIC that a marker types:
        # delta > 0 (two roots), delta < 0 (none), and a = 0 (not a quadratic
        # at all, so it must fall back to the linear solver).
        ('2\n1\n-3\n2\n2\n1\n1\n1\n2\n0\n4\n-16\n3\n',
         MENU_0050 +
         'Please choice one option: ----- Calculate Quadratic Equation -----\n'
         'Enter A: Enter B: Enter C: Solution: x1 = 2.000 and x2 = 1.000\n'
         'Odd Number(s):1.0, -3.0, 1.0\n'
         'Number is Even:2.0, 2.0\n'
         'Number is Perfect Square:1.0, 1.0\n' + MENU_0050 +
         'Please choice one option: ----- Calculate Quadratic Equation -----\n'
         'Enter A: Enter B: Enter C: The equation has no solution.\n'
         'Odd Number(s):1.0, 1.0, 1.0\n'
         'Number is Even:\n'
         'Number is Perfect Square:1.0, 1.0, 1.0\n' + MENU_0050 +
         'Please choice one option: ----- Calculate Quadratic Equation -----\n'
         'Enter A: Enter B: Enter C: Solution: x = 4.000\n'
         'Odd Number(s):\n'
         'Number is Even:0.0, 4.0, -16.0, 4.0\n'
         'Number is Perfect Square:0.0, 4.0, 4.0\n' + MENU_0050 +
         'Please choice one option: Goodbye.'),
    ],
    explain_en='''<p><strong>The brief's own perfect-square rule is the one worth arguing about.</strong>
The Guidelines say "find the square number by using <code>Math.sqrt</code>", and that is exactly what
<code>isPerfectSquare</code> does — but with the two guards the phrase leaves out. A negative number has
no real square root, and a number with a fractional part is not a perfect square either: 0.25 is 0.5
squared, and 0.5 is not a whole number. "Perfect square" has always meant 0, 1, 4, 9, 16, … Another
sheet in this course (P0067) printed a sample screen calling 321 and 22 perfect squares; they are not,
and if you meet that screen, implement the definition and say so. On <em>this</em> sheet the sample is
right — 4.0 and 1.0 really are perfect squares — so the code and the picture agree.</p>
<p><strong>The odd rule, on the other hand, is one the brief gets wrong and we follow anyway.</strong>
The Guidelines define odd as <code>a % 2 != 0</code>. On a float that makes −1.25 "odd", which is
meaningless in arithmetic: odd and even are properties of integers. But the brief's own expected screen
prints <code>Number is Odd:5.0, -1.25</code>, so the rule and the picture agree with each other and
disagree with mathematics. The screen is the thing the marker diffs, so it is implemented as written —
and flagged here, which is the part that earns the mark.</p>
<p><strong>Three states from one return value.</strong> The Guidelines fix the meaning of the result:
<code>null</code> = no solution, an <em>empty</em> list = infinitely many solutions, a non-empty list =
the roots. Null and empty are exactly the pair a careless caller collapses into one branch, so the UI
tests them in that order, and <code>0x + 0 = 0</code> (true for every x) is reported differently from
<code>0x + 5 = 0</code> (true for none).</p>
<p><strong>a = 0 in the quadratic is not a quadratic.</strong> With no square term,
<code>ax² + bx + c = 0</code> is just <code>bx + c = 0</code>, so
<code>calculateQuadraticEquation</code> hands the work to <code>calculateEquation</code> instead of
dividing by <code>2a</code> and printing <code>Infinity</code> or <code>NaN</code>. A marker types
<code>a = 0</code> here on purpose. The same goes for <code>delta &lt; 0</code>: no real root, so
<code>null</code>, not a <code>NaN</code> that propagates through the whole report.</p>
<p><strong>Why <code>delta == 0</code> returns the root twice.</strong> Algebraically there is one root
of multiplicity two. The brief's screen prints <code>x1 = -0.500 and x2 = -0.500</code>, which alone
could be one value printed twice — but the same screen then lists <code>-0.5</code> <em>twice</em> among
the odd numbers, and that only fits a list that really holds two entries. The evidence decided the
design, not a preference.</p>
<p><strong>Two utility classes, not one.</strong> The Guidelines require
<code>public Float checkin(String)</code> — it takes text, so it cannot be the thing that reads the
keyboard. <code>Number</code> therefore judges (is it a number, is it odd, is it a perfect square) and
<code>Validator</code> owns the single <code>Scanner</code> and the "ask again" loop. The split is what
makes <code>Number</code> testable without a keyboard. There is no <code>entity</code> package because
there is nothing to model: this program has coefficients and answers, not records.</p>
<p><strong>Two formatting traps.</strong> The solution line uses
<code>String.format(Locale.US, "%.3f", …)</code> — without the explicit locale, the same program prints
<code>-1,250</code> on a machine set to a comma-decimal locale, and the marker's screen no longer
matches. The number lists, by contrast, are printed straight through <code>Float.toString</code>,
because that is what produces the brief's <code>5.0</code> and <code>-1.25</code>. Two different jobs,
two different tools.</p>
<p><strong>How this was verified.</strong> Three scripted runs. The first replays the brief's two
screens keystroke for keystroke, including the rejected <code>a</code>. The second exercises the linear
degenerate cases — <code>0x + 0 = 0</code>, <code>0x + 5 = 0</code> — and a root that is not a round
number. The third types the three quadratic cases a marker types: two real roots, a negative
discriminant, and <code>a = 0</code>. Every console line in this walkthrough was captured from a real
run, not written from memory.</p>''',
    explain_vi='''<p><strong>Luật số chính phương của đề mới là chỗ đáng tranh luận.</strong> Phần Hướng
dẫn nói "tìm số chính phương bằng <code>Math.sqrt</code>", và <code>isPerfectSquare</code> làm đúng như
vậy — nhưng kèm hai chốt chặn mà câu chữ ấy bỏ quên. Số âm không có căn bậc hai thực, còn số có phần lẻ
cũng không phải số chính phương: 0.25 là 0.5 bình phương, mà 0.5 không phải số nguyên. "Số chính phương"
xưa nay là 0, 1, 4, 9, 16, … Một đề khác trong môn này (P0067) in màn hình mẫu gọi 321 và 22 là số chính
phương; chúng không phải, và nếu gặp màn hình đó thì hãy cài đặt theo định nghĩa rồi nói rõ ra. Riêng đề
<em>này</em> thì mẫu đúng — 4.0 và 1.0 đúng là số chính phương — nên mã nguồn và hình vẽ khớp nhau.</p>
<p><strong>Ngược lại, luật số lẻ là chỗ đề sai mà ta vẫn phải theo.</strong> Phần Hướng dẫn định nghĩa số
lẻ là <code>a % 2 != 0</code>. Áp lên kiểu float thì −1.25 thành "số lẻ", điều vô nghĩa về mặt số học:
chẵn lẻ là tính chất của số nguyên. Nhưng chính màn hình mong đợi của đề in
<code>Number is Odd:5.0, -1.25</code>, tức là luật và hình vẽ khớp nhau và cùng lệch với toán học. Người
chấm so từng dòng màn hình, nên ta cài đặt đúng như đề viết — và nêu ra ở đây, chính chỗ nêu ra ấy mới là
điểm.</p>
<p><strong>Một giá trị trả về mang ba trạng thái.</strong> Hướng dẫn quy định rõ nghĩa của kết quả:
<code>null</code> = vô nghiệm, danh sách <em>rỗng</em> = vô số nghiệm, danh sách khác rỗng = các nghiệm.
Null và rỗng đúng là cặp mà người viết ẩu gộp thành một nhánh, nên phần giao diện kiểm theo đúng thứ tự
đó, và <code>0x + 0 = 0</code> (đúng với mọi x) được báo khác hẳn <code>0x + 5 = 0</code> (không x nào
đúng).</p>
<p><strong>a = 0 thì không còn là phương trình bậc hai.</strong> Không có số hạng bình phương thì
<code>ax² + bx + c = 0</code> chỉ là <code>bx + c = 0</code>, nên
<code>calculateQuadraticEquation</code> chuyển việc cho <code>calculateEquation</code> thay vì chia cho
<code>2a</code> rồi in ra <code>Infinity</code> hay <code>NaN</code>. Người chấm gõ <code>a = 0</code> ở
đây là có chủ ý. Tương tự với <code>delta &lt; 0</code>: không có nghiệm thực nên trả <code>null</code>,
chứ không để một <code>NaN</code> lan ra khắp bảng kết quả.</p>
<p><strong>Vì sao <code>delta == 0</code> lại trả nghiệm hai lần.</strong> Về đại số đó là một nghiệm bội
hai. Màn hình của đề in <code>x1 = -0.500 and x2 = -0.500</code>, riêng dòng đó thì có thể chỉ là in một
giá trị hai lần — nhưng ngay sau đó cũng màn hình ấy liệt kê <code>-0.5</code> <em>hai lần</em> trong dãy
số lẻ, và điều này chỉ khớp với một danh sách thật sự có hai phần tử. Bằng chứng quyết định thiết kế, chứ
không phải sở thích.</p>
<p><strong>Hai lớp tiện ích, không phải một.</strong> Hướng dẫn bắt buộc
<code>public Float checkin(String)</code> — nó nhận chuỗi, nên nó không thể là chỗ đọc bàn phím. Vì vậy
<code>Number</code> lo phần phán xét (có phải số không, lẻ không, chính phương không) còn
<code>Validator</code> giữ <code>Scanner</code> duy nhất và vòng lặp "hỏi lại". Chính cách tách này khiến
<code>Number</code> kiểm thử được mà không cần bàn phím. Không có gói <code>entity</code> vì chẳng có gì
để mô hình hoá: chương trình này có hệ số và đáp số, không có bản ghi.</p>
<p><strong>Hai cái bẫy về định dạng.</strong> Dòng nghiệm dùng
<code>String.format(Locale.US, "%.3f", …)</code> — không chỉ định locale thì cùng chương trình ấy in
<code>-1,250</code> trên máy đặt dấu phẩy thập phân, và màn hình không còn khớp với đề. Ngược lại, dãy số
được in thẳng qua <code>Float.toString</code>, vì đó mới là thứ tạo ra <code>5.0</code> và
<code>-1.25</code> như trong đề. Hai việc khác nhau, hai công cụ khác nhau.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Ba lần chạy có kịch bản. Lần đầu diễn lại hai màn hình của đề
đúng từng phím, kể cả chữ <code>a</code> bị từ chối. Lần hai chạy các trường hợp suy biến của phương
trình bậc nhất — <code>0x + 0 = 0</code>, <code>0x + 5 = 0</code> — và một nghiệm không tròn. Lần ba gõ ba
tình huống bậc hai mà người chấm hay gõ: hai nghiệm phân biệt, biệt thức âm, và <code>a = 0</code>. Mọi
dòng màn hình trong bài giải thích này đều lấy từ lần chạy thật, không viết theo trí nhớ.</p>''',
    hints_en=[
        'The Guidelines fix the return contract: null = no solution, EMPTY list = infinitely many.',
        'a == 0 in the quadratic means it is a linear equation — reuse calculateEquation, never divide by 2a.',
        'A perfect square must be a whole, non-negative number whose square root is whole; guard before Math.sqrt.',
        'Print the roots with String.format(Locale.US, "%.3f", x), but the number lists with plain Float.toString.',
        'Read the two screens closely: one says "Number is Odd:", the other "Odd Number(s):". Copy both exactly.',
    ],
    hints_vi=[
        'Hướng dẫn quy định rõ giá trị trả về: null = vô nghiệm, danh sách RỖNG = vô số nghiệm.',
        'a == 0 ở phương trình bậc hai nghĩa là nó bậc nhất — gọi lại calculateEquation, đừng chia cho 2a.',
        'Số chính phương phải là số nguyên không âm có căn bậc hai nguyên; chặn trước khi gọi Math.sqrt.',
        'In nghiệm bằng String.format(Locale.US, "%.3f", x), còn dãy số thì in thẳng bằng Float.toString.',
        'Đọc kỹ hai màn hình: một bên ghi "Number is Odd:", bên kia ghi "Odd Number(s):". Chép đúng cả hai.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0055 — Doctor management program (73 LOC)
# ════════════════════════════════════════════════════════════════

P0055_DOCTOR = '''package entity;

import java.io.Serializable;

/**
 * One doctor. Four fields, no rules, no printing.
 *
 * Serializable is here because a record class that can be written to a file
 * costs nothing today and is the difference between a five-minute change and a
 * redesign the day the assignment grows a "save to doctors.dat" option.
 *
 * Availability is an int, not a String: it is counted and compared against 0.
 * The type is the first place a rule can be enforced, and "an int cannot hold
 * the word 'many'" is a rule enforced by the compiler for free.
 */
public class Doctor implements Serializable {

    private static final long serialVersionUID = 1L;

    private String code;
    private String name;
    private String specialization;
    private int availability;

    public Doctor() {
    }

    /**
     * Code only.
     *
     * The Guidelines make deleteDoctor and updateDoctor take a whole Doctor
     * even though the screen only asks for a code, so this constructor exists
     * to build the one field those calls actually look at, without inventing
     * blank values for the other three.
     */
    public Doctor(String code) {
        this.code = code;
    }

    public Doctor(String code, String name, String specialization, int availability) {
        this.code = code;
        this.name = name;
        this.specialization = specialization;
        this.availability = availability;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getAvailability() {
        return availability;
    }

    public void setAvailability(int availability) {
        this.availability = availability;
    }

    /**
     * One row of the result table.
     *
     * The brief draws that table with tab characters, which line up only when
     * every value happens to be the right length - "Nghia" and "Phuong" already
     * break it. Fixed-width columns via printf-style formatting produce the
     * table the brief was clearly trying to draw.
     */
    @Override
    public String toString() {
        return String.format("%-10s%-15s%-20s%d", code, name, specialization, availability);
    }
}
'''

P0055_MANAGER = '''package bo;

import entity.Doctor;
import java.util.HashMap;
import java.util.LinkedHashMap;

/**
 * The doctors, and every rule about them. This class never prints.
 *
 * Each method reports failure by throwing an Exception carrying the brief's own
 * message, exactly as the Guidelines specify, and the screen layer decides how
 * to show it. That is what keeps the wording in ONE place: if the message is
 * only ever built here, no menu branch can drift into a slightly different
 * spelling of it, and the marker diffs one string rather than four.
 */
public class DoctorManager {

    // The Guidelines' own wording, copied character for character - including
    // the fact that add says "Data does not exist" while update and delete say
    // "Data doesn't exist", and that the code message uses a typographic
    // apostrophe. It is written as a Unicode escape rather than pasted in as a
    // character, so this file compiles to the same bytes whatever encoding
    // javac happens to be started with.
    private static final String NO_DATABASE = "Database does not exist";
    private static final String NO_DATA_ADD = "Data does not exist";
    private static final String NO_DATA = "Data doesn't exist";
    private static final String NO_CODE = "Doctor code doesn\\u2019t exist";
    private static final String BAD_AVAILABILITY = "Availability must be greater than or equal to 0";

    /**
     * A LinkedHashMap behind a HashMap reference.
     *
     * The Guidelines demand a HashMap, and LinkedHashMap IS one - it extends
     * HashMap - so the required type is honoured exactly. What it adds is a
     * stable iteration order: the search results and the listing come out in
     * the order the doctors were added, every run, on every JVM. A plain
     * HashMap orders by hash bucket, so the same three doctors can print in a
     * different order on a different machine, and a report that reshuffles
     * itself is impossible to check by eye.
     */
    private final HashMap<String, Doctor> doctors;

    public DoctorManager() {
        this(new LinkedHashMap<String, Doctor>());
    }

    /**
     * The null-database guard the Guidelines ask for is only meaningful if the
     * map can actually arrive from outside - hence this constructor. It is also
     * the seam a test uses to hand in a pre-filled map.
     */
    public DoctorManager(HashMap<String, Doctor> doctors) {
        this.doctors = doctors;
    }

    /** The brief's rule, in the brief's own words: Availability >= 0. */
    public boolean checkAvailability(int availability) {
        return availability >= 0;
    }

    public boolean addDoctor(Doctor doctor) throws Exception {
        if (doctors == null) {
            throw new Exception(NO_DATABASE);
        }
        if (doctor == null || doctor.getCode() == null || doctor.getCode().trim().isEmpty()) {
            throw new Exception(NO_DATA_ADD);
        }
        if (doctors.containsKey(doctor.getCode())) {
            throw new Exception("Doctor code [" + doctor.getCode() + "] is duplicate");
        }
        if (!checkAvailability(doctor.getAvailability())) {
            throw new Exception(BAD_AVAILABILITY);
        }
        doctors.put(doctor.getCode(), doctor);
        return true;
    }

    /**
     * Replaces the record stored under this code.
     *
     * put() on an existing key overwrites, which is exactly what an update is -
     * remove-then-put would leave the map briefly inconsistent and, with a
     * LinkedHashMap, would also move the doctor to the end of the listing.
     */
    public boolean updateDoctor(Doctor doctor) throws Exception {
        if (doctors == null) {
            throw new Exception(NO_DATABASE);
        }
        if (doctor == null || doctor.getCode() == null) {
            throw new Exception(NO_DATA);
        }
        if (!doctors.containsKey(doctor.getCode())) {
            throw new Exception(NO_CODE);
        }
        if (!checkAvailability(doctor.getAvailability())) {
            throw new Exception(BAD_AVAILABILITY);
        }
        doctors.put(doctor.getCode(), doctor);
        return true;
    }

    public boolean deleteDoctor(Doctor doctor) throws Exception {
        if (doctors == null) {
            throw new Exception(NO_DATABASE);
        }
        if (doctor == null || doctor.getCode() == null) {
            throw new Exception(NO_DATA);
        }
        if (!doctors.containsKey(doctor.getCode())) {
            throw new Exception(NO_CODE);
        }
        doctors.remove(doctor.getCode());
        return true;
    }

    /**
     * Every doctor whose code, name or specialization contains the text.
     *
     * The comparison is case-insensitive on purpose. The brief's own sample
     * data holds "Orthopedics" and "orthodontic" - one capitalised, one not -
     * so a case-sensitive contains() would answer "no doctor found" for a
     * search a user would swear should match. Fold both sides once, in one
     * helper, rather than remembering to do it at three call sites.
     *
     * An empty search string matches everything, which makes option 4 double as
     * "show me the whole list" - the brief never asks for a list-all option and
     * a marker always wants one.
     */
    public HashMap<String, Doctor> searchDoctor(String input) throws Exception {
        if (doctors == null) {
            throw new Exception(NO_DATABASE);
        }
        String needle = input == null ? "" : input.trim().toLowerCase();
        HashMap<String, Doctor> found = new LinkedHashMap<>();
        for (Doctor doctor : doctors.values()) {
            if (contains(doctor.getCode(), needle)
                    || contains(doctor.getName(), needle)
                    || contains(doctor.getSpecialization(), needle)) {
                found.put(doctor.getCode(), doctor);
            }
        }
        return found;
    }

    /** The record stored under this code, or null. Lookup, not a rule. */
    public Doctor getDoctor(String code) {
        return doctors == null || code == null ? null : doctors.get(code);
    }

    private boolean contains(String field, String needle) {
        return field != null && field.toLowerCase().contains(needle);
    }
}
'''

P0055_VALIDATION = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * One static Scanner for the whole run: a second Scanner over System.in would
 * buffer input the first one already swallowed, and the symptom - a prompt that
 * silently skips itself - is one of the hardest bugs to explain to yourself at
 * midnight. The private constructor says out loud that this class is never
 * instantiated.
 */
public class Validation {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validation() {
    }

    /** A line that may be empty; update uses "empty" to mean "keep the old value". */
    public static String getString(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }

    /** A line that may NOT be empty - the code of a new doctor, for instance. */
    public static String getNonBlank(String message, String error) {
        while (true) {
            String line = getString(message);
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println(error);
        }
    }

    public static int getInt(String message, int min, int max, String rangeError) {
        while (true) {
            String line = getString(message);
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println(rangeError);
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Please input number");
            }
        }
    }

    /**
     * An int, or null when the line is left empty.
     *
     * Only the update screen needs this, and it is the reason the method
     * returns Integer rather than int: "the user typed nothing" has to be
     * expressible, and no int value can mean that without stealing a legal
     * availability from the user.
     */
    public static Integer getOptionalInt(String message, int min, String rangeError) {
        while (true) {
            String line = getString(message);
            if (line.isEmpty()) {
                return null;
            }
            try {
                int value = Integer.parseInt(line);
                if (value < min) {
                    System.out.println(rangeError);
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Please input number");
            }
        }
    }
}
'''

P0055_MAIN = '''package ui;

import bo.DoctorManager;
import entity.Doctor;
import java.util.HashMap;
import utils.Validation;

/**
 * The menu and the screen, nothing else.
 *
 * No rule is decided here and no error message is written here: every failure
 * is an Exception thrown by DoctorManager, and this class only prints
 * e.getMessage(). That is why the brief's wording can never drift.
 */
public class Main {

    private static final String AVAILABILITY_ERROR =
            "Availability must be greater than or equal to 0";

    public static void main(String[] args) {
        DoctorManager manager = new DoctorManager();
        boolean running = true;
        while (running) {
            System.out.println("========= Doctor Management ==========");
            System.out.println("1. Add Doctor");
            System.out.println("2. Update Doctor");
            System.out.println("3. Delete Doctor");
            System.out.println("4. Search Doctor");
            System.out.println("5. Exit");
            int choice = Validation.getInt("Please choose an option: ", 1, 5,
                    "Please choose from 1 to 5.");
            switch (choice) {
                case 1:
                    add(manager);
                    break;
                case 2:
                    update(manager);
                    break;
                case 3:
                    delete(manager);
                    break;
                case 4:
                    search(manager);
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }

    private static void add(DoctorManager manager) {
        System.out.println("--------- Add Doctor ----------");
        String code = Validation.getNonBlank("Enter Code: ", "Code cannot be blank.");
        String name = Validation.getString("Enter Name: ");
        String specialization = Validation.getString("Enter Specialization: ");
        int availability = Validation.getInt("Enter Availability: ", 0, Integer.MAX_VALUE,
                AVAILABILITY_ERROR);
        try {
            manager.addDoctor(new Doctor(code, name, specialization, availability));
            System.out.println("Add doctor successfully.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * The brief's rule: "If Information is blank then not change old
     * information."
     *
     * So the old record is fetched first and each blank line simply keeps the
     * value it already had. The merge happens here rather than in the manager
     * because updateDoctor's signature takes a complete Doctor - a manager that
     * had to guess which of a half-filled object's nulls meant "unchanged" and
     * which meant "clear this" would be guessing about a screen it cannot see.
     *
     * When the code is unknown the program still calls updateDoctor, purely so
     * that the "doesn't exist" message comes from the one place that owns it.
     */
    private static void update(DoctorManager manager) {
        System.out.println("--------- Update Doctor -------");
        String code = Validation.getString("Enter Code: ");
        Doctor old = manager.getDoctor(code);
        try {
            if (old == null) {
                manager.updateDoctor(new Doctor(code));
                return;
            }
            String name = Validation.getString("Enter Name: ");
            String specialization = Validation.getString("Enter Specialization: ");
            Integer availability = Validation.getOptionalInt("Enter Availability: ", 0,
                    AVAILABILITY_ERROR);

            manager.updateDoctor(new Doctor(code,
                    name.isEmpty() ? old.getName() : name,
                    specialization.isEmpty() ? old.getSpecialization() : specialization,
                    availability == null ? old.getAvailability() : availability));
            System.out.println("Update doctor successfully.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void delete(DoctorManager manager) {
        System.out.println("--------- Delete Doctor -------");
        String code = Validation.getString("Enter Code: ");
        try {
            manager.deleteDoctor(new Doctor(code));
            System.out.println("Delete doctor successfully.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void search(DoctorManager manager) {
        System.out.println("---------- Search Doctor --------");
        String text = Validation.getString("Enter text: ");
        try {
            HashMap<String, Doctor> found = manager.searchDoctor(text);
            System.out.println("--------- Result ------------");
            if (found.isEmpty()) {
                System.out.println("No doctor found.");
                return;
            }
            System.out.println(String.format("%-10s%-15s%-20s%s",
                    "Code", "Name", "Specialization", "Availability"));
            for (Doctor doctor : found.values()) {
                System.out.println(doctor);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
'''

MENU_0055 = '''========= Doctor Management ==========
1. Add Doctor
2. Update Doctor
3. Delete Doctor
4. Search Doctor
5. Exit
'''

# The four prompts of the add/update screen print with print(), so when stdin is
# piped they all land on one line together with whatever is printed next.
ASK = 'Enter Code: Enter Name: Enter Specialization: Enter Availability: '
ADDED = (MENU_0055 + 'Please choose an option: --------- Add Doctor ----------\n'
         + ASK + 'Add doctor successfully.\n')
HEADER = 'Code      Name           Specialization      Availability'


solution(
    'J1.S.P0055',
    title_vi='Chương trình quản lý bác sĩ',
    files=[('src/entity/Doctor.java', P0055_DOCTOR),
           ('src/bo/DoctorManager.java', P0055_MANAGER),
           ('src/utils/Validation.java', P0055_VALIDATION),
           ('src/ui/Main.java', P0055_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — the brief's three doctors, then every failure path:
        # duplicate code, update an unknown code, delete an unknown code.
        ('1\nDOC 1\nNghia\nOrthopedics\n3\n'
         '1\nDOC 2\nPhuong\nObstetrics\n2\n'
         '1\nDOC 3\nLien\northodontic\n1\n'
         '1\nDOC 1\nSomeone\nCardiology\n4\n'
         '2\nDOC 9\n'
         '3\nDOC 9\n'
         '4\n\n'
         '5\n',
         ADDED * 3 +
         MENU_0055 + 'Please choose an option: --------- Add Doctor ----------\n'
         + ASK + 'Doctor code [DOC 1] is duplicate\n' +
         MENU_0055 + 'Please choose an option: --------- Update Doctor -------\n'
         'Enter Code: Doctor code doesn’t exist\n' +
         MENU_0055 + 'Please choose an option: --------- Delete Doctor -------\n'
         'Enter Code: Doctor code doesn’t exist\n' +
         MENU_0055 + 'Please choose an option: ---------- Search Doctor --------\n'
         'Enter text: --------- Result ------------\n' + HEADER + '\n'
         'DOC 1     Nghia          Orthopedics         3\n'
         'DOC 2     Phuong         Obstetrics          2\n'
         'DOC 3     Lien           orthodontic         1\n' +
         MENU_0055 + 'Please choose an option: Goodbye.'),
        # Run 1 — the update rules (blank keeps the old value), delete, and the
        # searches: a hit across capitalisation, and a miss.
        ('1\nDOC 1\nNghia\nOrthopedics\n3\n'
         '1\nDOC 2\nPhuong\nObstetrics\n2\n'
         '1\nDOC 3\nLien\northodontic\n1\n'
         '2\nDOC 2\n\n\n7\n'
         '2\nDOC 3\nLien Nguyen\n\n\n'
         '3\nDOC 1\n'
         '4\northo\n'
         '4\nzzz\n'
         '4\n\n'
         '5\n',
         ADDED * 3 +
         MENU_0055 + 'Please choose an option: --------- Update Doctor -------\n'
         + ASK + 'Update doctor successfully.\n' +
         MENU_0055 + 'Please choose an option: --------- Update Doctor -------\n'
         + ASK + 'Update doctor successfully.\n' +
         MENU_0055 + 'Please choose an option: --------- Delete Doctor -------\n'
         'Enter Code: Delete doctor successfully.\n' +
         MENU_0055 + 'Please choose an option: ---------- Search Doctor --------\n'
         'Enter text: --------- Result ------------\n' + HEADER + '\n'
         'DOC 3     Lien Nguyen    orthodontic         1\n' +
         MENU_0055 + 'Please choose an option: ---------- Search Doctor --------\n'
         'Enter text: --------- Result ------------\n'
         'No doctor found.\n' +
         MENU_0055 + 'Please choose an option: ---------- Search Doctor --------\n'
         'Enter text: --------- Result ------------\n' + HEADER + '\n'
         'DOC 2     Phuong         Obstetrics          7\n'
         'DOC 3     Lien Nguyen    orthodontic         1\n' +
         MENU_0055 + 'Please choose an option: Goodbye.'),
        # Run 2 — the input guards: a blank code, a non-numeric availability,
        # a negative one, and a menu choice out of range.
        ('9\nx\n1\n\nDOC 7\nHoa\nPaediatrics\nmany\n-2\n0\n'
         '4\nhoa\n'
         '5\n',
         MENU_0055 +
         'Please choose an option: Please choose from 1 to 5.\n'
         'Please choose an option: Please input number\n'
         'Please choose an option: --------- Add Doctor ----------\n'
         'Enter Code: Code cannot be blank.\n'
         'Enter Code: Enter Name: Enter Specialization: Enter Availability: Please input number\n'
         'Enter Availability: Availability must be greater than or equal to 0\n'
         'Enter Availability: Add doctor successfully.\n' +
         MENU_0055 + 'Please choose an option: ---------- Search Doctor --------\n'
         'Enter text: --------- Result ------------\n' + HEADER + '\n'
         'DOC 7     Hoa            Paediatrics         0\n' +
         MENU_0055 + 'Please choose an option: Goodbye.'),
    ],
    explain_en='''<p><strong>Four files, four layers, and each one has a job you can name.</strong>
<code>entity.Doctor</code> holds the data and nothing else. <code>bo.DoctorManager</code> holds the
collection and every rule, and never prints. <code>utils.Validation</code> owns the single
<code>Scanner</code>. <code>ui.Main</code> is the menu. There is no <code>controller</code> package
because with one entity and one manager it would do nothing but forward calls — the sample projects that
passed added a controller at seven files and up, not at four.</p>
<p><strong>The messages live in exactly one place.</strong> Every failure is an
<code>Exception</code> thrown by the manager with the brief's own wording, and <code>Main</code> only
ever prints <code>e.getMessage()</code>. That is not ceremony: the marker diffs these strings, and a
message built at four different call sites is a message that will be spelled four slightly different
ways by the end of the assignment.</p>
<p><strong>The brief contradicts itself about one of those messages, and the Guidelines win.</strong>
The Program Specifications section says option 2 shows <code>"Doctor code does not exist"</code> and
option 3 shows <code>"code does not exist Doctor"</code> — two different sentences for the same
condition, the second one barely English. The Guidelines section specifies
<code>Exception("Doctor code doesn’t exist")</code> for both. The Guidelines are the contract, so that
is what the program throws. Two more inconsistencies are copied rather than tidied: <code>add</code>
throws <code>"Data does not exist"</code> while <code>update</code> and <code>delete</code> throw
<code>"Data doesn't exist"</code>, and the code message uses a <em>typographic</em> apostrophe (’) where
the others use a plain one. Both are the brief's, character for character.</p>
<p><strong>That apostrophe is a real portability trap.</strong> <code>"doesn\\u2019t"</code> is written
as a Unicode escape rather than pasted as a character, so the file compiles to the same bytes whatever
encoding <code>javac</code> happens to start with. A source file that means one thing on your laptop and
another on the marker's is a way to fail an assignment that ran perfectly for you.</p>
<p><strong>A LinkedHashMap behind a HashMap reference.</strong> The Guidelines require
<code>HashMap&lt;String, Doctor&gt;</code>, and <code>LinkedHashMap</code> <em>is</em> a
<code>HashMap</code> — it extends it — so the required type is honoured exactly while the iteration order
becomes the insertion order. With a plain <code>HashMap</code> the three doctors come back in hash-bucket
order, which can differ between machines; a result table that reshuffles itself between runs is one
nobody can check by eye. Lookup is O(1) either way, so the stability is free.</p>
<p><strong>Update merges in the UI, not in the manager.</strong> The brief says "if Information is blank
then not change old information", so the old record is fetched, and each blank line keeps the value it
already had. The merge belongs to the screen because <code>updateDoctor</code>'s signature takes a
<em>complete</em> Doctor — a manager handed a half-filled object would have to guess which nulls mean
"unchanged" and which mean "clear this", and it cannot see the screen that would tell it. Note also that
<code>put</code> on an existing key is the update: remove-then-put would move the doctor to the end of
the listing.</p>
<p><strong>Search is case-insensitive, deliberately.</strong> The brief's own sample data contains
<code>Orthopedics</code> and <code>orthodontic</code> — one capitalised, one not. A literal
<code>contains</code> would answer "no doctor found" for a search the user would swear should match, so
both sides are folded to lower case in one helper rather than at three call sites. An empty search string
matches everything, which quietly gives the program the "show me everyone" option the brief forgot to
ask for.</p>
<p><strong>Why the doctors are not saved to a file.</strong> This brief never mentions one — no file
name, no load, no save, unlike its sister exercises. Persisting anyway would be inventing a requirement,
so the manager is in-memory and the <code>"Database does not exist"</code> guard the Guidelines ask for
is reachable through the constructor that accepts a map from outside. That constructor is what makes the
guard honest rather than dead code.</p>
<p><strong>How this was verified.</strong> Three scripted runs. The first adds the brief's three doctors
and then walks every failure path: a duplicate code, an update against an unknown code, a delete against
an unknown code. The second exercises the update rules — a blank name and specialization that must keep
the old values, then a changed name — followed by a delete, a search that matches across capitalisation,
and one that matches nothing. The third types the things a marker types to break input: a blank code, the
word "many" for availability, a negative availability, and a menu choice out of range. Every line of
console in this walkthrough came from a real run.</p>''',
    explain_vi='''<p><strong>Bốn tệp, bốn tầng, và mỗi tầng có một việc gọi tên được.</strong>
<code>entity.Doctor</code> chỉ giữ dữ liệu. <code>bo.DoctorManager</code> giữ tập dữ liệu và toàn bộ luật,
và không bao giờ in ra màn hình. <code>utils.Validation</code> sở hữu <code>Scanner</code> duy nhất.
<code>ui.Main</code> là thực đơn. Không có gói <code>controller</code>, vì với một entity và một manager
thì nó chỉ gọi chuyển tiếp — các project mẫu đã đỗ chỉ thêm controller từ bảy tệp trở lên, không phải ở
bốn tệp.</p>
<p><strong>Thông báo lỗi nằm ở đúng một chỗ.</strong> Mọi thất bại đều là một <code>Exception</code> do
manager ném ra với đúng câu chữ của đề, còn <code>Main</code> chỉ in <code>e.getMessage()</code>. Đây
không phải hình thức: người chấm so từng chuỗi, và một thông báo được ghép ở bốn nơi khác nhau thì đến
cuối bài sẽ có bốn cách viết hơi khác nhau.</p>
<p><strong>Đề tự mâu thuẫn ở một thông báo, và phần Hướng dẫn thắng.</strong> Phần Đặc tả nói mục 2 hiện
<code>"Doctor code does not exist"</code> còn mục 3 hiện <code>"code does not exist Doctor"</code> — hai
câu khác nhau cho cùng một tình huống, câu sau gần như không thành tiếng Anh. Phần Hướng dẫn quy định
<code>Exception("Doctor code doesn’t exist")</code> cho cả hai. Hướng dẫn mới là hợp đồng, nên chương
trình ném đúng câu đó. Hai điểm không nhất quán khác cũng được chép nguyên chứ không "sửa cho đẹp":
<code>add</code> ném <code>"Data does not exist"</code> trong khi <code>update</code> và
<code>delete</code> ném <code>"Data doesn't exist"</code>, và riêng thông báo về mã dùng dấu nháy
<em>cong</em> (’) trong khi các câu khác dùng dấu nháy thẳng. Cả hai đều là của đề, đúng từng ký tự.</p>
<p><strong>Dấu nháy cong đó là một cái bẫy về tính khả chuyển.</strong> <code>"doesn\\u2019t"</code> được
viết bằng escape Unicode chứ không dán ký tự vào, nên tệp nguồn biên dịch ra cùng một chuỗi byte dù
<code>javac</code> khởi động với bảng mã nào. Một tệp nguồn mang nghĩa này trên máy bạn và nghĩa khác trên
máy người chấm là cách trượt một bài đã chạy hoàn hảo ở nhà.</p>
<p><strong>LinkedHashMap đứng sau một tham chiếu HashMap.</strong> Hướng dẫn đòi
<code>HashMap&lt;String, Doctor&gt;</code>, mà <code>LinkedHashMap</code> <em>chính là</em> một
<code>HashMap</code> — nó kế thừa — nên kiểu bắt buộc được tôn trọng nguyên vẹn, đổi lại thứ tự duyệt trở
thành thứ tự thêm vào. Với <code>HashMap</code> thuần, ba bác sĩ trả về theo thứ tự ô băm, và thứ tự đó có
thể khác nhau giữa các máy; một bảng kết quả tự xáo trộn giữa các lần chạy thì không ai kiểm bằng mắt
được. Tra cứu vẫn O(1) ở cả hai, nên sự ổn định này là miễn phí.</p>
<p><strong>Việc trộn dữ liệu khi sửa nằm ở tầng giao diện, không nằm ở manager.</strong> Đề nói "nếu bỏ
trống thì giữ nguyên thông tin cũ", nên bản ghi cũ được lấy ra trước, và mỗi dòng bỏ trống giữ lại giá trị
sẵn có. Việc trộn thuộc về màn hình vì chữ ký <code>updateDoctor</code> nhận một Doctor <em>đầy đủ</em> —
một manager nhận vào đối tượng điền dở sẽ phải đoán null nào nghĩa là "giữ nguyên" và null nào nghĩa là
"xoá trắng", trong khi nó không nhìn thấy màn hình để biết. Cũng lưu ý: <code>put</code> lên khoá đã có
chính là phép sửa — xoá rồi thêm lại sẽ đẩy bác sĩ đó xuống cuối danh sách.</p>
<p><strong>Tìm kiếm không phân biệt hoa thường, một cách có chủ ý.</strong> Chính dữ liệu mẫu của đề có
<code>Orthopedics</code> và <code>orthodontic</code> — một chữ hoa, một chữ thường. Dùng
<code>contains</code> nguyên bản sẽ trả lời "không tìm thấy" cho một truy vấn mà người dùng chắc chắn là
phải khớp, nên hai vế được đưa về chữ thường trong một hàm phụ duy nhất thay vì nhớ làm điều đó ở ba chỗ
gọi. Chuỗi tìm kiếm rỗng khớp tất cả, nhờ đó chương trình lặng lẽ có thêm chức năng "xem toàn bộ danh
sách" mà đề quên yêu cầu.</p>
<p><strong>Vì sao không lưu bác sĩ ra tệp.</strong> Đề này không hề nhắc tới tệp — không tên tệp, không
nạp, không lưu, khác hẳn các bài anh em của nó. Tự thêm phần lưu trữ là tự bịa ra yêu cầu, nên manager
chạy hoàn toàn trong bộ nhớ, còn chốt chặn <code>"Database does not exist"</code> mà Hướng dẫn đòi vẫn với
tới được qua constructor nhận map từ bên ngoài. Chính constructor ấy khiến chốt chặn là thật chứ không
phải mã chết.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Ba lần chạy có kịch bản. Lần đầu thêm ba bác sĩ của đề rồi đi
hết các nhánh lỗi: mã trùng, sửa một mã không tồn tại, xoá một mã không tồn tại. Lần hai chạy các luật
sửa — bỏ trống tên và chuyên khoa để giữ giá trị cũ, rồi đổi tên — sau đó xoá, tìm kiếm khớp bất kể hoa
thường, và một lần tìm không ra gì. Lần ba gõ đúng những thứ người chấm hay gõ để phá phần nhập: mã trống,
chữ "many" cho số ca trực, số ca trực âm, và lựa chọn thực đơn ngoài khoảng. Mọi dòng màn hình trong bài
giải thích này đều lấy từ lần chạy thật.</p>''',
    hints_en=[
        'Store the doctors in a LinkedHashMap — it IS a HashMap, so the required signature still holds, '
        'and the listing stops reshuffling itself between runs.',
        'Throw the brief’s exact message from the manager and let Main print e.getMessage(); '
        'never build the same sentence in two places.',
        'The Guidelines and the Specifications disagree about the "code does not exist" wording. '
        'The Guidelines are the contract.',
        'Update: fetch the old record first, then let every blank line keep the value it already had.',
        'put() on a key that already exists IS the update — do not remove and re-add.',
    ],
    hints_vi=[
        'Lưu bác sĩ trong LinkedHashMap — nó VẪN LÀ một HashMap nên chữ ký bắt buộc vẫn đúng, '
        'mà danh sách thôi tự xáo trộn giữa các lần chạy.',
        'Ném đúng câu thông báo của đề từ manager rồi để Main in e.getMessage(); '
        'đừng viết cùng một câu ở hai nơi.',
        'Phần Hướng dẫn và phần Đặc tả nói khác nhau về câu "code does not exist". '
        'Phần Hướng dẫn mới là hợp đồng.',
        'Khi sửa: lấy bản ghi cũ ra trước, rồi để mỗi dòng bỏ trống giữ nguyên giá trị sẵn có.',
        'put() lên một khoá đã tồn tại CHÍNH LÀ phép sửa — đừng xoá rồi thêm lại.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
# The English brief is the contract and stays untouched; this is the reading
# aid beside it, so every message string the program prints stays in English
# exactly as the brief prints it.
VI = {
    'J1.S.P0050': '''<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế chương trình cho phép người dùng nhập hệ số của phương trình bậc nhất và phương trình bậc
hai. Hiển thị các số lẻ, số chẵn và số chính phương lấy từ các hệ số đã nhập.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện thực đơn và mời người dùng chọn một mục</h4>
<ul>
<li>Người dùng chạy chương trình, chương trình mời chọn một mục.</li>
<li>Người dùng chọn xong thì thực hiện Chức năng 2.</li>
</ul>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<p><strong>Mục 1: Giải phương trình bậc nhất</strong></p>
<ul>
<li>Yêu cầu người dùng nhập hệ số A, B.</li>
<li>Kiểm tra dữ liệu nhập (A, B phải là số hợp lệ).</li>
<li>Tính nghiệm x và hiển thị ra màn hình.</li>
<li>Tìm và hiển thị số chẵn, số lẻ, số chính phương từ các hệ số đã nhập.</li>
<li>Quay lại màn hình chính.</li>
</ul>
<p><strong>Mục 2: Giải phương trình bậc hai</strong></p>
<ul>
<li>Yêu cầu người dùng nhập hệ số A, B, C.</li>
<li>Kiểm tra dữ liệu nhập (A, B, C phải là số hợp lệ).</li>
<li>Tính nghiệm x1, x2 và hiển thị ra màn hình.</li>
<li>Tìm và hiển thị số chẵn, số lẻ, số chính phương từ các hệ số đã nhập.</li>
<li>Quay lại màn hình chính.</li>
</ul>
<p><strong>Mục 3: Thoát chương trình</strong></p>
<h3>Màn hình mong đợi</h3>
<pre>========= Equation Program =========
1. Calculate Superlative Equation
2. Calculate Quadratic Equation
3. Exit
Please choice one option:

----- Calculate Equation -----
Enter A: a
Please input number
Enter A: 4
Enter B: 5
Solution: x = -1.250
Number is Odd:5.0, -1.25
Number is Even:4.0
Number is Perfect Square:4.0

----- Calculate Quadratic Equation -----
Enter A: a
Please input number
Enter A: 4
Enter B: 4
Enter C: 1
Solution: x1 = -0.500 and x2 = -0.500
Odd Number(s):1.0, -0.5, -0.5
Number is Even:4.0, 4.0
Number is Perfect Square:4.0, 4.0, 1.0</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt hai phương thức <code>calculateEquation</code> và
<code>calculateQuadraticEquation</code> trong mã nguồn khởi tạo.</p>
<p>Khuyến nghị:</p>
<ul>
<li>Tìm số chính phương bằng <code>Math.sqrt</code> (căn bậc 2), tìm số lẻ bằng
<code>a % 2 != 0</code>.</li>
<li>Dùng <code>public Float checkin(String floatString)</code> trong lớp <code>Number</code> để kiểm
tra a, b, c nhập vào có phải giá trị số hay không.</li>
<li>Dùng <code>public boolean isOdd(float number)</code> để kiểm tra số lẻ.</li>
<li>Dùng <code>public boolean isPerfectSquare(float number)</code> để kiểm tra số chính phương.</li>
</ul>
<h4>Chức năng 1: Giải phương trình bậc nhất</h4>
<p>Bắt buộc viết hàm: <code>public List&lt;Float&gt; calculateEquation(float a, float b)</code></p>
<ul>
<li>Đầu vào: <code>a</code> — giá trị a; <code>b</code> — giá trị b.</li>
<li>Trả về: danh sách nghiệm (<strong>vô nghiệm = null</strong>, <strong>vô số nghiệm = danh sách
rỗng</strong>).</li>
</ul>
<h4>Chức năng 2: Giải phương trình bậc hai</h4>
<p>Bắt buộc viết hàm:
<code>public List&lt;Float&gt; calculateQuadraticEquation(float a, float b, float c)</code></p>
<ul>
<li>Đầu vào: <code>a</code>, <code>b</code>, <code>c</code> — giá trị của a, b, c.</li>
<li>Trả về: danh sách nghiệm (<strong>vô nghiệm = null</strong>, <strong>vô số nghiệm = danh sách
rỗng</strong>).</li>
</ul>''',

    'J1.S.P0055': '''<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình quản lý thông tin bác sĩ. Hiện thực đơn gồm:</p>
<ol>
<li>Add Doctor (Thêm bác sĩ)</li>
<li>Update Doctor (Sửa bác sĩ)</li>
<li>Delete Doctor (Xoá bác sĩ)</li>
<li>Search Doctor (Tìm bác sĩ)</li>
<li>Exit (Thoát)</li>
</ol>
<ul>
<li>Chọn 1: thêm một bản ghi gồm Code (String), Name (String), Specialization (String),
Availability (int).</li>
<li>Chọn 2: yêu cầu nhập Code. Nếu Code không tồn tại thì báo
<code>"Doctor code does not exist"</code>. Ngược lại người dùng được sửa các thông tin còn lại.
<strong>Thông tin nào bỏ trống thì giữ nguyên giá trị cũ.</strong></li>
<li>Chọn 3: yêu cầu nhập Code và xoá thông tin nếu Code tồn tại; nếu không tồn tại thì báo
<code>"code does not exist Doctor"</code>.</li>
<li>Chọn 4: yêu cầu nhập chuỗi cần tìm, tìm và trả danh sách kết quả cho người dùng.</li>
<li>Chọn 5: thoát chương trình.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình, chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<p><strong>Mục 1 — Add Doctor.</strong> Nhập "code, name, specialization, availability". Kiểm tra:
Code không rỗng và không trùng trong dữ liệu. Thêm xong quay lại màn hình chính.</p>
<p><strong>Mục 2 — Update Doctor.</strong> Nhập Code và dữ liệu cần sửa. Kiểm tra: Code phải tồn tại
trong dữ liệu. Sửa xong quay lại màn hình chính.</p>
<p><strong>Mục 3 — Delete Doctor.</strong> Nhập Code. Kiểm tra: Code phải tồn tại trong dữ liệu. Xoá
xong quay lại màn hình chính.</p>
<p><strong>Mục 4 — Search Doctor.</strong> Nhập chuỗi cần tìm, tìm và hiển thị kết quả ra màn hình.</p>
<p><strong>Mục 5 — Thoát chương trình.</strong></p>
<h3>Màn hình mong đợi</h3>
<pre>========= Doctor Management ==========
Add Doctor
Update Doctor
Delete Doctor
Search Doctor
Exit

--------- Update Doctor -------
Enter Code:
Enter Name:
Enter Specialization:
Enter Availability:

--------- Add Doctor ----------
Enter Code:
Enter Name:
Enter Specialization:
Enter Availability:

--------- Delete Doctor -------
Enter Code:

---------- Search Doctor --------
Enter text:
--------- Result ------------
Code      Name           Specialization      Availability
DOC 1     Nghia          Orthopedics         3
DOC 2     Phuong         Obstetrics          2
DOC 3     Lien           orthodontic         1</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức <code>addDoctor</code>,
<code>updateDoctor</code>, <code>deleteDoctor</code>, <code>searchDoctor</code>.</p>
<p>Gợi ý:</p>
<ul>
<li>Lớp <code>DoctorHash</code> chứa các chức năng thêm, sửa, xoá, tìm kiếm thông tin bác sĩ. Viết thêm
hàm <code>checkAvailability</code> để kiểm tra Availability, biết rằng <code>Availability &gt;= 0</code>.</li>
<li>Dùng <code>throw</code> để ném các ngoại lệ theo yêu cầu.</li>
<li>Dùng <code>put</code> để thêm một phần tử vào HashMap.</li>
<li>Sửa cũng dùng <code>put</code> để thay thế phần tử trong HashMap.</li>
<li>Dùng <code>remove</code> để xoá một phần tử khỏi HashMap.</li>
<li>Dùng <code>values()</code> của HashMap để lấy danh sách giá trị, rồi duyệt qua Code, Name… và dùng
<code>contains</code> để tìm.</li>
</ul>
<h4>Chức năng 1: Thêm bác sĩ</h4>
<p><code>public boolean addDoctor(Doctor doctor) throws Exception</code></p>
<ul>
<li>Đầu vào: <code>doctor</code> — thông tin bác sĩ.</li>
<li>Trả về: trạng thái thêm bác sĩ.</li>
<li><code>Exception("Database does not exist")</code> khi HashMap dữ liệu là null.</li>
<li><code>Exception("Doctor code [Code] is duplicate")</code> nếu trùng mã.</li>
<li><code>Exception("Data does not exist")</code> nếu tham số doctor là null.</li>
</ul>
<h4>Chức năng 2: Sửa thông tin bác sĩ</h4>
<p><code>public boolean updateDoctor(Doctor doctor) throws Exception</code></p>
<ul>
<li>Đầu vào: <code>doctor</code> — thông tin bác sĩ.</li>
<li>Trả về: trạng thái sửa bác sĩ.</li>
<li><code>Exception("Database does not exist")</code> khi HashMap dữ liệu là null.</li>
<li><code>Exception("Data doesn't exist")</code> nếu tham số doctor là null.</li>
<li><code>Exception("Doctor code doesn’t exist")</code> nếu mã không tồn tại.</li>
</ul>
<h4>Chức năng 3: Xoá thông tin bác sĩ</h4>
<p><code>public boolean deleteDoctor(Doctor doctor) throws Exception</code></p>
<ul>
<li>Đầu vào: <code>doctor</code> — thông tin bác sĩ.</li>
<li>Trả về: trạng thái xoá bác sĩ.</li>
<li><code>Exception("Database does not exist")</code> khi HashMap dữ liệu là null.</li>
<li><code>Exception("Data doesn't exist")</code> nếu tham số doctor là null.</li>
<li><code>Exception("Doctor code doesn’t exist")</code> nếu mã không tồn tại.</li>
</ul>
<h4>Chức năng 4: Tìm thông tin bác sĩ</h4>
<p><code>public HashMap&lt;String, Doctor&gt; searchDoctor(String input) throws Exception</code></p>
<ul>
<li>Đầu vào: <code>input</code> — chuỗi cần tìm.</li>
<li>Trả về: <code>HashMap&lt;String, Doctor&gt;</code> danh sách bác sĩ tìm được.</li>
<li><code>Exception("Database does not exist")</code> khi HashMap dữ liệu là null.</li>
</ul>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
