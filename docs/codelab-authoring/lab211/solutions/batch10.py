# Batch 10 — J1.S.P0051 (calculator with a running memory + BMI),
# J1.S.P0066 (car showroom: three enums, one exception, one rule method).
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0051 — Develop a computer program (61 LOC)
# ════════════════════════════════════════════════════════════════

P0051_OPERATOR = '''package entity;

/**
 * The six things the user may type where an operator is expected.
 *
 * The Guidelines require checkOperator to return an ENUM, not a char, and this
 * is why: once the operator is an enum, calculate() can switch over it and the
 * compiler checks the list of cases for you. A char would let "&" travel all
 * the way into the arithmetic before anything noticed.
 *
 * "=" is a member like the others even though it computes nothing. It is the
 * only way the calculator loop can ever end, so it has to be a value the
 * validator is allowed to return - not a special case bolted on beside it.
 */
public enum Operator {

    ADD("+"), SUBTRACT("-"), MULTIPLY("*"), DIVIDE("/"), POWER("^"), EQUAL("=");

    private final String symbol;

    Operator(String symbol) {
        this.symbol = symbol;
    }

    public String getSymbol() {
        return symbol;
    }
}
'''

P0051_BMI = '''package entity;

/**
 * The five body-status bands the brief lists, as a type rather than as text.
 *
 * The Guidelines say calculateBMI returns an "Enum contained in BMI status",
 * so the classification is a value the caller can compare and switch on. Each
 * constant carries the exact words that go on the screen, which keeps the
 * display text next to the value it belongs to instead of in some far-away
 * if-else chain that has to be kept in step by hand.
 */
public enum BMI {

    UNDER_STANDARD("UNDER-STANDARD"),
    STANDARD("STANDARD"),
    OVERWEIGHT("OVERWEIGHT"),
    FAT("FAT - SHOULD LOSE WEIGHT"),
    VERY_FAT("VERY FAT - SHOULD LOSE WEIGHT IMMEDIATELY");

    private final String label;

    BMI(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
'''

P0051_BO = '''package bo;

import entity.BMI;
import entity.Operator;

/**
 * The arithmetic and the BMI rules. Nothing here reads the keyboard or prints.
 *
 * That separation is what makes this class testable: calculate(4, ADD, 4) is a
 * question with one right answer and no screen involved, so it can be checked
 * without pretending to be a user.
 */
public class Calculator {

    /** Centimetres per metre - the unit conversion the brief hides in plain sight. */
    private static final double CM_PER_METRE = 100.0;

    /**
     * The signature is dictated by the brief: calculate(double, Operator, double).
     *
     * Division by zero is rejected with an explicit "if" rather than left to the
     * hardware, exactly as the Guidelines ask. This matters because Java does
     * NOT throw for doubles: 4.0 / 0.0 is the value Infinity, and the program
     * would happily go on to print "Memory:Infinity". Only integer division
     * throws ArithmeticException by itself. The check has to be written.
     */
    public double calculate(double a, Operator operator, double b) {
        switch (operator) {
            case ADD:
                return a + b;
            case SUBTRACT:
                return a - b;
            case MULTIPLY:
                return a * b;
            case DIVIDE:
                if (b == 0) {
                    throw new ArithmeticException("Can not divide by zero");
                }
                return a / b;
            case POWER:
                return Math.pow(a, b);
            default:
                // EQUAL. It ends the calculation, so it never asks for a second
                // number and must never reach here; saying so out loud beats a
                // silent "return b" that would hide the caller's mistake.
                throw new IllegalArgumentException("'=' is not a calculation.");
        }
    }

    /**
     * The BMI number itself: weight in kg, height in CENTIMETRES.
     *
     * The brief's formula says "height x height: m" while the prompt on the
     * screen asks for Height(cm), so the conversion happens here and only here.
     * Forget it and 70 kg at 170 cm comes out as 0.0024 instead of 24.22 - a
     * number so far off that it lands in UNDER_STANDARD for every human alive.
     */
    public double bmiIndex(double weight, double height) {
        double metres = height / CM_PER_METRE;
        return weight / (metres * metres);
    }

    /**
     * The band, with the signature the brief names: calculateBMI(weight, height).
     *
     * The bands are written as an ascending ladder of "less than" tests. The
     * brief describes them as overlapping ranges ("between 19-25", "between
     * 25-30"), which cannot both own the value 25; the ladder resolves every
     * boundary the same way - a value on the line belongs to the HIGHER band.
     */
    public BMI calculateBMI(double weight, double height) {
        double bmi = bmiIndex(weight, height);
        if (bmi < 19) {
            return BMI.UNDER_STANDARD;
        }
        if (bmi < 25) {
            return BMI.STANDARD;
        }
        if (bmi < 30) {
            return BMI.OVERWEIGHT;
        }
        if (bmi < 40) {
            return BMI.FAT;
        }
        return BMI.VERY_FAT;
    }
}
'''

P0051_VALIDATOR = '''package utils;

import entity.Operator;
import java.util.Scanner;

/** Every keyboard read and every check in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /**
     * The brief's own function: Double checkin(String), null when not a number.
     *
     * The return type is the WRAPPER Double, not the primitive double, because
     * a primitive has no way to say "there was no number here" - every one of
     * its values is a legitimate answer, 0 included. Returning null is what
     * makes "not a number" representable at all.
     *
     * NumberFormatException covers "a" and the empty line; NullPointerException
     * covers a null argument. Both are caught here, which is why no caller
     * anywhere else in the program has to write a try block.
     */
    public static Double checkin(String inputVal) {
        try {
            return Double.valueOf(inputVal.trim());
        } catch (NumberFormatException | NullPointerException e) {
            return null;
        }
    }

    /**
     * The brief's own function: Operator checkOperator(String), null when invalid.
     *
     * It compares against the symbol each constant carries rather than against
     * its name, so adding an operator means adding one enum constant and
     * nothing else. "x" is accepted as a synonym for "*" because the Guidelines
     * spell the multiplication operator as x while the screen and the error
     * message both spell it *; accepting both costs one line and refuses
     * nothing the brief allows.
     */
    public static Operator checkOperator(String operator) {
        if (operator == null) {
            return null;
        }
        String text = operator.trim();
        if ("x".equalsIgnoreCase(text)) {
            text = "*";
        }
        for (Operator candidate : Operator.values()) {
            if (candidate.getSymbol().equals(text)) {
                return candidate;
            }
        }
        return null;
    }

    /**
     * Keeps asking until checkin() gives a number back.
     *
     * "positive" exists for the BMI screen: a weight of 0 is not a measurement,
     * and a height of 0 would make the division produce Infinity rather than
     * fail. Both refusals share the brief's one message, because the brief
     * prints exactly one.
     */
    public static double getNumber(String message, String error, boolean positive) {
        while (true) {
            System.out.print(message);
            Double value = checkin(SCANNER.nextLine());
            if (value != null && (!positive || value > 0)) {
                return value;
            }
            System.out.println(error);
        }
    }

    /** Keeps asking until checkOperator() gives an Operator back. */
    public static Operator getOperator(String message) {
        while (true) {
            System.out.print(message);
            Operator operator = checkOperator(SCANNER.nextLine());
            if (operator != null) {
                return operator;
            }
            System.out.println("Please input (+, -, *, /, ^)");
        }
    }

    /** A menu choice: a whole number inside the range the menu offers. */
    public static int getOption(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            Double value = checkin(SCANNER.nextLine());
            if (value != null && value == Math.floor(value)
                    && value >= min && value <= max) {
                return value.intValue();
            }
            System.out.println("Please input a number from " + min + " to " + max + ".");
        }
    }
}
'''

P0051_MAIN = '''package ui;

import bo.Calculator;
import entity.BMI;
import entity.Operator;
import java.util.Locale;
import utils.Validator;

/** The menu and the screen, nothing else. */
public class Main {

    private static final String NUMBER_ERROR = "Number is digit";
    private static final String BMI_ERROR = "BMI is digit";

    private static final Calculator CALCULATOR = new Calculator();

    public static void main(String[] args) {
        boolean running = true;
        while (running) {
            System.out.println("========= Calculator Program =========");
            System.out.println("1. Normal Calculator");
            System.out.println("2. BMI Calculator");
            System.out.println("3. Exit");
            switch (Validator.getOption("Please choice one option: ", 1, 3)) {
                case 1:
                    normalCalculator();
                    break;
                case 2:
                    bmiCalculator();
                    break;
                default:
                    running = false;
            }
        }
    }

    /**
     * The running-memory calculator described by the brief.
     *
     * One number is read to start the memory off, and after that the program
     * asks for an operator FIRST and only then for the next number. That order
     * is what lets "=" stop the loop before a pointless number is demanded -
     * and it is exactly the order the brief's screen shows.
     */
    private static void normalCalculator() {
        System.out.println("----- Normal Calculator -----");
        double memory = Validator.getNumber("Enter number: ", NUMBER_ERROR, false);
        while (true) {
            Operator operator = Validator.getOperator("Enter Operator: ");
            if (operator == Operator.EQUAL) {
                System.out.println("Result:" + memory);
                return;
            }
            double next = Validator.getNumber("Enter number: ", NUMBER_ERROR, false);
            try {
                memory = CALCULATOR.calculate(memory, operator, next);
                System.out.println("Memory:" + memory);
            } catch (ArithmeticException e) {
                // Division by zero. The memory keeps the value it had, so the
                // user can carry on with another operator instead of losing a
                // calculation they have been building up for six steps.
                System.out.println(e.getMessage());
            }
        }
    }

    private static void bmiCalculator() {
        System.out.println("----- BMI Calculator -----");
        double weight = Validator.getNumber("Enter Weight(kg): ", BMI_ERROR, true);
        double height = Validator.getNumber("Enter Height(cm): ", BMI_ERROR, true);
        BMI status = CALCULATOR.calculateBMI(weight, height);
        // Locale.US, not the machine's locale: on a Vietnamese or German
        // desktop "%.2f" prints 24,22 with a comma and the screen no longer
        // matches the brief. The format of a number on screen is part of the
        // output, so it is pinned down like any other part of the output.
        System.out.println("BMI Number: "
                + String.format(Locale.US, "%.2f", CALCULATOR.bmiIndex(weight, height)));
        System.out.println("BMI Status: " + status.getLabel());
    }
}
'''

P0051_MENU = '''========= Calculator Program =========
1. Normal Calculator
2. BMI Calculator
3. Exit
'''


solution(
    'J1.S.P0051',
    title_vi='Máy tính thường và chỉ số BMI',
    files=[('src/entity/Operator.java', P0051_OPERATOR),
           ('src/entity/BMI.java', P0051_BMI),
           ('src/bo/Calculator.java', P0051_BO),
           ('src/utils/Validator.java', P0051_VALIDATOR),
           ('src/ui/Main.java', P0051_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — the brief's own two screens, in one session: the calculator
        # example (4 + 4, a bad operator, + 16, then =) and the BMI example
        # (a bad weight, 70, a bad height, 170 -> 24.22 STANDARD).
        ('1\n4\n+\n4\na\n+\n16\n=\n2\na\n70\nb\n170\n3\n',
         P0051_MENU +
         'Please choice one option: ----- Normal Calculator -----\n'
         'Enter number: Enter Operator: Enter number: Memory:8.0\n'
         'Enter Operator: Please input (+, -, *, /, ^)\n'
         'Enter Operator: Enter number: Memory:24.0\n'
         'Enter Operator: Result:24.0\n' + P0051_MENU +
         'Please choice one option: ----- BMI Calculator -----\n'
         'Enter Weight(kg): BMI is digit\n'
         'Enter Weight(kg): Enter Height(cm): BMI is digit\n'
         'Enter Height(cm): BMI Number: 24.22\n'
         'BMI Status: STANDARD\n' + P0051_MENU +
         'Please choice one option:'),
        # Run 1 — the arithmetic the brief's screen never shows: the exponent,
        # division, and division by zero (which must NOT print Infinity).
        ('1\n2\n^\n10\n/\n0\n/\n4\n=\n3\n',
         P0051_MENU +
         'Please choice one option: ----- Normal Calculator -----\n'
         'Enter number: Enter Operator: Enter number: Memory:1024.0\n'
         'Enter Operator: Enter number: Can not divide by zero\n'
         'Enter Operator: Enter number: Memory:256.0\n'
         'Enter Operator: Result:256.0\n' + P0051_MENU +
         'Please choice one option:'),
        # Run 2 — the other four BMI bands, and a menu choice out of range.
        ('9\n2\n45\n170\n2\n80\n170\n2\n100\n170\n2\n130\n170\n3\n',
         P0051_MENU +
         'Please choice one option: Please input a number from 1 to 3.\n'
         'Please choice one option: ----- BMI Calculator -----\n'
         'Enter Weight(kg): Enter Height(cm): BMI Number: 15.57\n'
         'BMI Status: UNDER-STANDARD\n' + P0051_MENU +
         'Please choice one option: ----- BMI Calculator -----\n'
         'Enter Weight(kg): Enter Height(cm): BMI Number: 27.68\n'
         'BMI Status: OVERWEIGHT\n' + P0051_MENU +
         'Please choice one option: ----- BMI Calculator -----\n'
         'Enter Weight(kg): Enter Height(cm): BMI Number: 34.60\n'
         'BMI Status: FAT - SHOULD LOSE WEIGHT\n' + P0051_MENU +
         'Please choice one option: ----- BMI Calculator -----\n'
         'Enter Weight(kg): Enter Height(cm): BMI Number: 44.98\n'
         'BMI Status: VERY FAT - SHOULD LOSE WEIGHT IMMEDIATELY\n' + P0051_MENU +
         'Please choice one option:'),
    ],
    explain_en='''<p><strong>The Guidelines are a set of signatures, and a marker looks for them by
name.</strong> This brief is unusually prescriptive: <code>public double calculate(double a, Operator
operator, double b)</code>, <code>public BMI calculateBMI(double weight, double height)</code>, a
<code>checkOperator</code> that returns an <em>enum</em> or <code>null</code>, and a <code>Double
checkin(String)</code> that returns <code>null</code> when the text is not a number. Every one of those
is present here with exactly that name and shape. Rename them to something you like better and you lose
marks for a program that behaves identically.</p>
<p><strong>Why <code>checkin</code> returns <code>Double</code> and not <code>double</code>.</strong> A
primitive <code>double</code> has no spare value that could mean "there was no number here" — 0 is a
perfectly good answer, and so is <code>-1</code>. The wrapper type can also be <code>null</code>, and
that is the whole reason the brief asks for it. The same argument makes <code>checkOperator</code>
return an <code>Operator</code> rather than a <code>char</code>.</p>
<p><strong>The unit trap, and how to know you fell into it.</strong> The formula says height in
<em>metres</em>; the prompt asks for <code>Height(cm)</code>. The conversion lives in one place,
<code>bmiIndex</code>, and the brief hands you the test that catches its absence: 70 kg at 170 cm must
print <code>24.22</code>. Skip the divide by 100 and you get 0.0024 — a number so small that every human
being on earth classifies as under-standard, which is exactly the kind of bug that looks like it is
working until someone reads the output.</p>
<p><strong><code>4.0 / 0.0</code> does not throw in Java.</strong> This is the single most common wrong
answer to this exercise. Integer division by zero throws <code>ArithmeticException</code>; floating
point division does not — it produces <code>Infinity</code>, and the program cheerfully prints
<code>Memory:Infinity</code>. That is why the Guidelines say "use <em>if</em> to catch ArithmeticException
divided case 0": the check has to be written by hand, and <code>calculate</code> throws the exception
itself.</p>
<p><strong>Ask for the operator before the next number.</strong> The loop reads one number to prime the
memory, then repeats "operator, then number". Doing it the other way round — number, then operator —
would force the user to type a pointless extra number before they could type <code>=</code>. The order
is not a detail of taste; it is what the brief's screen shows, and it is what makes the memory model
work.</p>
<p><strong>The bands overlap in the brief, and you should say so.</strong> "Standard: between 19-25" and
"Overweight: between 25-30" both claim 25, and "over 40" leaves 40 itself unowned. The code is an
ascending ladder of <code>&lt;</code> tests, so every boundary resolves the same way: a value exactly on
the line belongs to the higher band. Any consistent rule is defensible; having no rule is not.</p>
<p><strong><code>Locale.US</code> in the format string.</strong> <code>String.format("%.2f", x)</code>
uses the machine's locale, and on a Vietnamese or German desktop that prints <code>24,22</code> with a
comma. The screen would then differ from the brief on a machine you never tested on. Pin the locale: how
a number looks on screen is part of the output.</p>
<p><strong>Where the brief goes quiet.</strong> Two messages are never shown. The calculator's
"that is not a number" message — the BMI screen has <code>BMI is digit</code>, the calculator screen
never types a bad number — is written here as <code>Number is digit</code>, in the same voice. The
error for an out-of-range menu choice is invented too. Both are flagged rather than smuggled in; if your
class has been given a marking script with different wording, those two strings are the ones to change.
A third gap: the message <code>Please input (+, -, *, /, ^)</code> lists five operators, but
<code>=</code> is a sixth valid one — without it the calculator could never stop. The message is copied
from the brief exactly as it is, inconsistency included, because that is what gets diffed.</p>
<p><strong>How this was verified.</strong> Three scripted runs. The first replays both of the brief's
own screens in one session and the console matches them line for line, including
<code>Memory:8.0</code>, <code>Memory:24.0</code>, <code>Result:24.0</code> and
<code>BMI Number: 24.22 / BMI Status: STANDARD</code>. The second exercises what the brief's screen
never does — <code>2 ^ 10</code>, then a division by zero that must not print <code>Infinity</code>,
then a real division. The third walks the four remaining BMI bands and types a menu option that does not
exist.</p>''',
    explain_vi='''<p><strong>Phần Hướng dẫn chính là một danh sách chữ ký hàm, và người chấm dò đúng
theo tên.</strong> Đề này quy định rất chặt: <code>public double calculate(double a, Operator operator,
double b)</code>, <code>public BMI calculateBMI(double weight, double height)</code>, một
<code>checkOperator</code> trả về <em>enum</em> hoặc <code>null</code>, và một <code>Double
checkin(String)</code> trả về <code>null</code> khi chuỗi không phải số. Bài giải này có đủ từng cái, đúng
tên và đúng dạng. Đổi tên cho "thuận tay" là mất điểm dù chương trình chạy y hệt.</p>
<p><strong>Vì sao <code>checkin</code> trả <code>Double</code> chứ không phải <code>double</code>.</strong>
Kiểu nguyên thuỷ <code>double</code> không còn giá trị nào rảnh để mang nghĩa "chỗ này không có số" — 0 là
một đáp án hợp lệ, <code>-1</code> cũng vậy. Kiểu bọc thì nhận thêm được <code>null</code>, và đó chính là
lý do đề yêu cầu nó. Cùng một lập luận khiến <code>checkOperator</code> trả về <code>Operator</code> thay
vì <code>char</code>.</p>
<p><strong>Cái bẫy đơn vị, và cách biết mình đã sập.</strong> Công thức ghi chiều cao tính bằng
<em>mét</em>; còn dòng nhắc lại hỏi <code>Height(cm)</code>. Phép đổi đơn vị nằm đúng một chỗ, trong
<code>bmiIndex</code>, và chính đề đã đưa sẵn phép thử phát hiện nếu thiếu nó: 70 kg với 170 cm phải ra
<code>24.22</code>. Quên chia 100 thì được 0,0024 — nhỏ tới mức mọi con người trên trái đất đều bị xếp
"dưới chuẩn", đúng kiểu lỗi trông như vẫn chạy được cho tới khi có người đọc kết quả.</p>
<p><strong><code>4.0 / 0.0</code> KHÔNG ném ngoại lệ trong Java.</strong> Đây là câu trả lời sai phổ biến
nhất của bài này. Chia số nguyên cho 0 mới ném <code>ArithmeticException</code>; chia số thực thì không —
nó cho ra <code>Infinity</code>, và chương trình hồn nhiên in <code>Memory:Infinity</code>. Vì thế phần
Hướng dẫn mới ghi "dùng <em>if</em> để bắt trường hợp chia 0": phép kiểm tra phải tự tay viết, và
<code>calculate</code> tự ném ngoại lệ đó ra.</p>
<p><strong>Hỏi toán tử trước, hỏi số sau.</strong> Vòng lặp đọc một số để mồi cho bộ nhớ, rồi lặp lại
"toán tử, rồi số". Làm ngược lại — số trước, toán tử sau — sẽ bắt người dùng gõ thêm một con số vô nghĩa
trước khi được gõ <code>=</code>. Thứ tự này không phải chuyện sở thích; đó là thứ tự trên màn hình của đề,
và là thứ khiến mô hình bộ nhớ chạy đúng.</p>
<p><strong>Các khoảng BMI trong đề chồng lên nhau, và bạn nên nói ra điều đó.</strong> "Standard: 19-25"
và "Overweight: 25-30" cùng giành lấy số 25, còn "over 40" thì bỏ rơi chính số 40. Mã nguồn là một thang
các phép <code>&lt;</code> tăng dần, nên mọi ranh giới đều xử lý như nhau: giá trị nằm đúng trên vạch
thuộc về nhóm cao hơn. Quy ước nào nhất quán cũng bảo vệ được; không có quy ước nào mới là mất điểm.</p>
<p><strong><code>Locale.US</code> trong chuỗi định dạng.</strong> <code>String.format("%.2f", x)</code>
dùng locale của máy, và trên một máy Việt Nam hay Đức nó in <code>24,22</code> với dấu phẩy. Màn hình sẽ
lệch khỏi đề trên đúng cái máy bạn chưa từng thử. Hãy ghim locale: hình dạng con số hiện ra cũng là một
phần của kết quả.</p>
<p><strong>Chỗ đề im lặng.</strong> Có hai thông báo đề không hề in ra. Thông báo "đây không phải số" của
máy tính thường — màn hình BMI có <code>BMI is digit</code>, còn màn hình máy tính chưa bao giờ gõ sai số
— ở đây được viết là <code>Number is digit</code>, cùng giọng văn. Thông báo cho lựa chọn menu ngoài
khoảng cũng là tự đặt. Cả hai đều được nói rõ ra chứ không giấu đi; nếu lớp bạn có kịch bản chấm với chữ
khác, đó đúng là hai chuỗi cần sửa. Còn một chỗ vênh nữa: câu <code>Please input (+, -, *, /, ^)</code>
liệt kê năm toán tử, nhưng <code>=</code> là toán tử hợp lệ thứ sáu — không có nó thì máy tính không bao
giờ dừng được. Câu này vẫn được chép y nguyên theo đề, vênh cũng chép, vì đó là thứ bị so từng ký tự.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Ba kịch bản chạy. Kịch bản đầu diễn lại cả hai màn hình của
chính đề trong một phiên và console khớp từng dòng, gồm <code>Memory:8.0</code>, <code>Memory:24.0</code>,
<code>Result:24.0</code> và <code>BMI Number: 24.22 / BMI Status: STANDARD</code>. Kịch bản thứ hai chạy
những thứ màn hình của đề không đụng tới — <code>2 ^ 10</code>, rồi một phép chia cho 0 mà tuyệt đối không
được in <code>Infinity</code>, rồi một phép chia thật. Kịch bản thứ ba đi qua bốn nhóm BMI còn lại và gõ
một lựa chọn menu không tồn tại.</p>''',
    hints_en=[
        'Read the operator as text, then turn it into an enum — a char lets nonsense through.',
        'checkin must return Double, not double: only a wrapper can also be null.',
        'The prompt asks for cm but the formula wants metres. Divide by 100 in exactly one place.',
        '4.0 / 0.0 gives Infinity, it does not throw. Write the if yourself before dividing.',
        'Ask for the operator BEFORE the next number, so "=" can end the loop without one.',
    ],
    hints_vi=[
        'Đọc toán tử dưới dạng chuỗi rồi đổi sang enum — dùng char là để lọt ký tự vô nghĩa.',
        'checkin phải trả về Double chứ không phải double: chỉ kiểu bọc mới nhận thêm được null.',
        'Dòng nhắc hỏi cm nhưng công thức cần mét. Hãy chia 100 ở đúng một chỗ duy nhất.',
        '4.0 / 0.0 cho ra Infinity chứ không ném lỗi. Phải tự viết câu if trước khi chia.',
        'Hỏi toán tử TRƯỚC rồi mới hỏi số, để "=" kết thúc được vòng lặp mà không cần thêm số.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0066 — Car showroom (63 LOC)
# ════════════════════════════════════════════════════════════════

P0066_COLOR = '''package entity;

/**
 * Every colour the showroom paints a car, plus the unpainted option.
 *
 * "no color" is a real member, not the absence of one. The brief treats it as a
 * choice a customer makes - it has a price consequence, a $100 discount - so
 * modelling it as null would push that rule out into if-statements scattered
 * across the program. A value that means something deserves to be a value.
 *
 * The label exists because an enum constant cannot be called NO COLOR, and the
 * customer types "no color" with a space. The constant keeps the Java name; the
 * label keeps the human one.
 */
public enum Color {

    NO_COLOR("no color"),
    WHITE("WHITE"), YELLOW("YELLOW"), ORANGE("ORANGE"),
    GREEN("GREEN"), BLUE("BLUE"), PURPLE("PURPLE"),
    PINK("PINK"), RED("RED"), BROWN("BROWN");

    private final String label;

    Color(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    /**
     * The brief's own lookup: the Color, or null when the text is not one.
     *
     * Enum.valueOf would be shorter and wrong twice over - it throws instead of
     * returning null, and it would never match "no color" because that is not
     * the constant's name. A loop over values() does both jobs in three lines.
     */
    public static Color getColor(String color) {
        if (color == null) {
            return null;
        }
        String text = color.trim();
        for (Color candidate : values()) {
            if (candidate.label.equalsIgnoreCase(text) || candidate.name().equalsIgnoreCase(text)) {
                return candidate;
            }
        }
        return null;
    }
}
'''

P0066_DAY = '''package entity;

/**
 * The seven days, and a lookup that answers null instead of throwing.
 *
 * The brief asks for all seven even though only five ever appear in a sale
 * list. A Day is a fact about the calendar, not about the showroom - which days
 * a car sells on belongs to Car, and keeping the two apart is what lets the
 * showroom change its opening days without touching this file.
 */
public enum Day {

    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;

    public static Day getDay(String day) {
        if (day == null) {
            return null;
        }
        String text = day.trim();
        for (Day candidate : values()) {
            if (candidate.name().equalsIgnoreCase(text)) {
                return candidate;
            }
        }
        return null;
    }
}
'''

P0066_CAR = '''package entity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * The showroom's stock list, as data carried by the enum itself.
 *
 * The three lists are INDEX-ALIGNED: getColors().get(i) is painted at
 * getPrices().get(i). That is the whole reason a BMW in PINK costs 2500 and the
 * same BMW in BROWN costs 3500, and it is why the price lookup is
 * prices.get(colors.indexOf(colour)) rather than a nine-branch if.
 *
 * The lists are wrapped in unmodifiableList. An enum constant is a singleton
 * shared by the entire program, so a mutable list inside one is a global
 * variable in disguise: any caller could add a colour to the BMW and every
 * later check would see it.
 */
public enum Car {

    AUDI(Arrays.asList(Color.WHITE, Color.YELLOW, Color.ORANGE),
         Arrays.asList(5500.0, 3000.0, 4500.0),
         Arrays.asList(Day.FRIDAY, Day.SUNDAY, Day.MONDAY)),

    MERCEDES(Arrays.asList(Color.GREEN, Color.BLUE, Color.PURPLE),
             Arrays.asList(5000.0, 6000.0, 8500.0),
             Arrays.asList(Day.TUESDAY, Day.SATURDAY, Day.WEDNESDAY)),

    BMW(Arrays.asList(Color.PINK, Color.RED, Color.BROWN),
        Arrays.asList(2500.0, 3000.0, 3500.0),
        Arrays.asList(Day.MONDAY, Day.SUNDAY, Day.THURSDAY));

    private final List<Color> colors;
    private final List<Double> prices;
    private final List<Day> daySells;

    Car(List<Color> colors, List<Double> prices, List<Day> daySells) {
        this.colors = Collections.unmodifiableList(colors);
        this.prices = Collections.unmodifiableList(prices);
        this.daySells = Collections.unmodifiableList(daySells);
    }

    public List<Color> getColors() {
        return colors;
    }

    public List<Double> getPrices() {
        return prices;
    }

    public List<Day> getDaySells() {
        return daySells;
    }

    /** The brief's own lookup: the Car, or null when the showroom has no such model. */
    public static Car getCar(String car) {
        if (car == null) {
            return null;
        }
        String text = car.trim();
        for (Car candidate : values()) {
            if (candidate.name().equalsIgnoreCase(text)) {
                return candidate;
            }
        }
        return null;
    }
}
'''

P0066_EXCEPTION = '''package bo;

/**
 * A refusal to sell, carrying the reason as its message.
 *
 * It extends Exception rather than RuntimeException on purpose: refusing a sale
 * is an expected outcome of the check, not a programming mistake, and a checked
 * exception forces every caller to decide what to say about it. The compiler
 * will not let the screen layer forget to handle one.
 */
public class ExceptionCar extends Exception {

    private static final long serialVersionUID = 1L;

    public ExceptionCar(String message) {
        super(message);
    }
}
'''

P0066_BO = '''package bo;

import entity.Car;
import entity.Color;
import entity.Day;
import java.util.Collections;

/**
 * The one rule in the program: may this customer buy this car today?
 *
 * Nothing here prints. Every refusal leaves through an ExceptionCar carrying
 * the brief's exact wording, and the screen layer decides how to show it. That
 * is what lets the six different refusals be written as six one-line throws
 * instead of six nested if-else blocks with a message threaded through them.
 */
public class Showroom {

    /** An unpainted car is $100 cheaper - the brief's only stated discount. */
    public static final double NO_COLOR_DISCOUNT = 100.0;

    /**
     * The signature is dictated by the brief: checkCar(Car, String, Day, String).
     *
     * Note the asymmetry, which is the brief's and not a slip here: the car and
     * the day arrive already converted to enums (null when the text was not one)
     * while the colour and the price arrive as raw text. So this method does the
     * colour lookup itself, and parses the price itself.
     *
     * The order of the checks is the order the brief's screen shows them: model,
     * colour, price, day. It matters, because a request can be wrong in more
     * than one way at once and only the first message is ever printed.
     */
    public Car checkCar(Car car, String color, Day day, String price) throws ExceptionCar {
        if (car == null) {
            throw new ExceptionCar("Car break");
        }
        Color wanted = Color.getColor(color);
        // Two different mistakes, one message: a colour that does not exist at
        // all ("color"), and a real colour this model is never painted in (a
        // GREEN BMW). From the customer's side both are the same answer.
        if (wanted == null || (wanted != Color.NO_COLOR && !car.getColors().contains(wanted))) {
            throw new ExceptionCar("Color Car does not exist");
        }
        Double offered = toPrice(price);
        if (offered == null) {
            throw new ExceptionCar("Price is digit");
        }
        if (offered <= 0) {
            throw new ExceptionCar("Price greater than zero");
        }
        if (offered < askingPrice(car, wanted)) {
            throw new ExceptionCar("Price is not enough");
        }
        if (day == null || !car.getDaySells().contains(day)) {
            throw new ExceptionCar("Car can't sell today");
        }
        return car;
    }

    /**
     * The least the showroom will take for this car in this colour.
     *
     * For a painted car it is the price sitting at the colour's own index. For
     * an unpainted one the brief says only "$100 discount" without saying off
     * WHAT, so the cheapest paint job is used as the base - and the brief's own
     * accepted example proves that reading: a BMW starts at 2500, and 2400 is
     * accepted. 2500 - 100 = 2400 is not a coincidence.
     *
     * The comparison is ">= asking", not "== asking", because the brief also
     * says extra options are ADDED to the final price. A customer offering more
     * than the sticker price is not a customer you turn away.
     */
    public double askingPrice(Car car, Color color) {
        if (color == Color.NO_COLOR) {
            return Collections.min(car.getPrices()) - NO_COLOR_DISCOUNT;
        }
        return car.getPrices().get(car.getColors().indexOf(color));
    }

    /** The price as a number, or null when the customer typed something else. */
    private Double toPrice(String price) {
        try {
            return Double.valueOf(price.trim());
        } catch (NumberFormatException | NullPointerException e) {
            return null;
        }
    }
}
'''

P0066_MAIN = r'''package ui;

import bo.ExceptionCar;
import bo.Showroom;
import entity.Car;
import entity.Day;
import java.util.Scanner;

/**
 * The screen, nothing else.
 *
 * There is no utils/Validator in this project, and that is deliberate. Nothing
 * on this screen is re-asked: a colour that does not exist is a REFUSAL, not a
 * retry, so a validating reader would have nothing to validate. The brief says
 * it outright - "In Main, use scanner to enter the car information" - and the
 * checking lives where the brief puts it, in checkCar.
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Showroom showroom = new Showroom();

        System.out.println("===== Showroom car program =====");
        System.out.println("Input Information of Car");

        boolean more = true;
        while (more) {
            System.out.print("Name: ");
            String name = scanner.nextLine();
            System.out.print("Color: ");
            String color = scanner.nextLine();
            System.out.print("Price: ");
            String price = scanner.nextLine();
            System.out.print("Today: ");
            String today = scanner.nextLine();
            System.out.println();

            try {
                // getCar / getDay answer null for text that is not a member, and
                // that null is the input checkCar expects - it is the signal for
                // "no such model", not an accident to be guarded against here.
                showroom.checkCar(Car.getCar(name), color, Day.getDay(today), price);
                System.out.println("Sell Car");
            } catch (ExceptionCar e) {
                // The brief writes this line with a typographic apostrophe and
                // the "Car can't sell today" message with a plain one. Both are
                // copied exactly. The curly one is spelled with a unicode
                // escape so this file stays pure ASCII and cannot be mangled by
                // whatever default encoding the next machine compiles it with.
                System.out.println("Can\u2019t sell Car");
                System.out.println(e.getMessage());
            }

            System.out.print("Do you want find more?(Y/N):");
            more = "Y".equalsIgnoreCase(scanner.nextLine().trim());
        }
    }
}
'''


# The four prompts are printed with print(), so with piped input they all land
# on one line, ended by the blank println() that separates request from verdict.
P0066_ASKED = 'Name: Color: Price: Today: \n'
P0066_REFUSE = 'Can’t sell Car\n'
P0066_MORE = 'Do you want find more?(Y/N):'
P0066_HEAD = '===== Showroom car program =====\nInput Information of Car\n'


solution(
    'J1.S.P0066',
    title_vi='Showroom ô tô',
    files=[('src/entity/Car.java', P0066_CAR),
           ('src/entity/Color.java', P0066_COLOR),
           ('src/entity/Day.java', P0066_DAY),
           ('src/bo/ExceptionCar.java', P0066_EXCEPTION),
           ('src/bo/Showroom.java', P0066_BO),
           ('src/ui/Main.java', P0066_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — all six of the brief's own cases in one session, in the order
        # the brief prints them: unknown model, the accepted sale, a colour that
        # does not exist, a negative price, a price that is not a number, and a
        # day this model is not sold on.
        ('BMV\nno color\n2400\nTHURSDAY\nY\n'
         'BMW\nno color\n2400\nTHURSDAY\nY\n'
         'BMW\ncolor\n2400\nTHURSDAY\nY\n'
         'BMW\nno color\n-200\nTHURSDAY\nY\n'
         'BMW\nno color\na\nTHURSDAY\nY\n'
         'BMW\nno color\n2400\nFRIDAY\nN\n',
         P0066_HEAD +
         P0066_ASKED + P0066_REFUSE + 'Car break\n' + P0066_MORE +
         P0066_ASKED + 'Sell Car\n' + P0066_MORE +
         P0066_ASKED + P0066_REFUSE + 'Color Car does not exist\n' + P0066_MORE +
         P0066_ASKED + P0066_REFUSE + 'Price greater than zero\n' + P0066_MORE +
         P0066_ASKED + P0066_REFUSE + 'Price is digit\n' + P0066_MORE +
         P0066_ASKED + P0066_REFUSE + "Car can't sell today\n" + P0066_MORE),
        # Run 1 — the rules the brief states but never shows on screen: a real
        # colour this model is not painted in, the index-aligned price of a
        # named colour, a price above the sticker (options are added), a price
        # below it, and a day that is not a day at all.
        ('BMW\nGREEN\n3000\nMONDAY\nY\n'
         'BMW\nBROWN\n3500\nSUNDAY\nY\n'
         'MERCEDES\nPURPLE\n9000\nSATURDAY\nY\n'
         'AUDI\nYELLOW\n2900\nFRIDAY\nY\n'
         'AUDI\nWHITE\n5500\nTomorrow\nN\n',
         P0066_HEAD +
         P0066_ASKED + P0066_REFUSE + 'Color Car does not exist\n' + P0066_MORE +
         P0066_ASKED + 'Sell Car\n' + P0066_MORE +
         P0066_ASKED + 'Sell Car\n' + P0066_MORE +
         P0066_ASKED + P0066_REFUSE + 'Price is not enough\n' + P0066_MORE +
         P0066_ASKED + P0066_REFUSE + "Car can't sell today\n" + P0066_MORE),
    ],
    explain_en='''<p><strong>Three enums, one exception, one rule method — the brief designs this
program for you.</strong> The Hint section is not advice, it is a specification: an
<code>ExceptionCar extends Exception</code>, a <code>Car</code> enum with
<code>getPrices</code>/<code>getColors</code>/<code>getDaySells</code>, a <code>Day</code> and a
<code>Color</code> enum each with a static lookup that returns <code>null</code> for text that is not a
member, and <code>public Car checkCar(Car car, String color, Day day, String price) throws
ExceptionCar</code>. Every name here is the brief's name.</p>
<p><strong>The three lists inside <code>Car</code> are index-aligned, and that is the design.</strong>
<code>getColors().get(i)</code> is the colour whose price is <code>getPrices().get(i)</code>. A BMW in
PINK is 2500 and the same BMW in BROWN is 3500 purely because of that pairing, which turns the price
lookup into <code>prices.get(colors.indexOf(colour))</code> instead of a nine-branch if. The lists are
wrapped with <code>Collections.unmodifiableList</code> because an enum constant is a singleton shared by
the whole program — a mutable list inside one is a global variable wearing a disguise.</p>
<p><strong>"no color" is a value, not a null.</strong> The brief makes it a choice with a consequence: a
$100 discount. Model it as <code>null</code> and that rule leaks out into if-statements all over the
program; model it as a <code>Color</code> constant and the discount lives in one method. It needs a
label because a Java constant cannot be named <code>NO COLOR</code>, and the customer types it with a
space.</p>
<p><strong>The decision you were asked to make: yes, the price is compared against the DISCOUNTED
price.</strong> The brief never says what the $100 comes off, but it hands over the proof. A BMW's
cheapest paint job is 2500; the brief's accepted sale is a BMW with <em>no color</em> at <em>2400</em>.
2500 − 100 = 2400 exactly. Any other reading — comparing against 2500, or not comparing at all —
either refuses the brief's own accepted example or makes <code>getPrices</code> a method nothing ever
calls. So the asking price is the colour's own listed price, or the cheapest listed price minus 100 when
the car is unpainted.</p>
<p><strong>And the comparison is <code>&gt;=</code>, not <code>==</code>.</strong> The brief says extra
options are <em>added</em> to the final price, so a customer offering more than the sticker is still a
sale. Requiring an exact match would refuse every customer who wanted a radio.</p>
<p><strong>Where the brief is silent, and where it contradicts itself.</strong> Three things.
(1) There is no message for "your price is below the asking price" — the five refusals the brief prints
do not cover it. <code>Price is not enough</code> is written here in the brief's own voice and flagged
as invented; it is the one string to change if your marking script has its own. (2) The Hint says "if
color of car is not in Color Enum, enter null value using getColor method" in Main, but the signature it
gives takes the colour as a <code>String</code> — so the lookup cannot happen in Main. The signature is
the contract, so <code>checkCar</code> does it. (3) The screen writes <code>Can’t sell Car</code> with a
typographic apostrophe and <code>Car can't sell today</code> with a plain one. Both are copied exactly,
because a marker diffs the screen character by character; the curly one is written as <code>\\u2019</code>
so the file does not depend on the compiler's default encoding.</p>
<p><strong>Why there is no <code>utils/Validator</code> here.</strong> Every other project in this track
has one, and this one should not. Nothing on this screen is ever re-asked: a colour that does not exist
is a <em>refusal</em>, not a prompt to try again, so a validating reader would have nothing to validate
and would just forward the line it read. The brief agrees — "In Main, use scanner to enter the car
information". Six files, three layers, and a reason for each.</p>
<p><strong>Why <code>ExceptionCar</code> is checked and lives in <code>bo</code>.</strong> Refusing a
sale is an expected outcome of the rule, not a bug, so it extends <code>Exception</code> and the
compiler makes the screen layer handle it. It sits beside <code>Showroom</code> because it is part of
that contract: the rule layer defines both the check and the way a failure is reported.</p>
<p><strong>How this was verified.</strong> Two scripted runs. The first replays all six of the brief's
own cases in one session — unknown model, the accepted sale, a colour that does not exist, a negative
price, a price that is not a number, and a Friday BMW — and the console matches the brief's wording
line for line. The second exercises the rules the brief states but never shows: a GREEN BMW (a real
colour, wrong model), a named colour paid at its own index price, an offer above the sticker, an offer
below it, and a "day" that is not a day.</p>''',
    explain_vi='''<p><strong>Ba enum, một lớp ngoại lệ, một hàm luật — đề đã thiết kế sẵn chương trình
cho bạn.</strong> Phần Hint không phải lời khuyên, nó là bản đặc tả: một
<code>ExceptionCar extends Exception</code>, enum <code>Car</code> có
<code>getPrices</code>/<code>getColors</code>/<code>getDaySells</code>, enum <code>Day</code> và enum
<code>Color</code> mỗi cái có một hàm tra tĩnh trả về <code>null</code> khi chuỗi không thuộc enum, và
<code>public Car checkCar(Car car, String color, Day day, String price) throws ExceptionCar</code>. Mọi
cái tên ở đây đều là tên của đề.</p>
<p><strong>Ba danh sách trong <code>Car</code> khớp nhau theo chỉ số, và đó chính là thiết kế.</strong>
<code>getColors().get(i)</code> là màu có giá <code>getPrices().get(i)</code>. BMW màu PINK giá 2500 còn
cũng chiếc BMW đó màu BROWN giá 3500 hoàn toàn nhờ cặp chỉ số ấy, và nhờ vậy việc tra giá gọn lại thành
<code>prices.get(colors.indexOf(colour))</code> thay vì một chuỗi chín nhánh if. Các danh sách được bọc
bằng <code>Collections.unmodifiableList</code> vì hằng số enum là một thể hiện duy nhất dùng chung cho cả
chương trình — một danh sách sửa được nằm bên trong nó chính là biến toàn cục trá hình.</p>
<p><strong>"no color" là một giá trị, không phải null.</strong> Đề coi nó là một lựa chọn có hệ quả:
giảm 100 $. Mô hình hoá bằng <code>null</code> thì luật ấy rò rỉ ra khắp nơi dưới dạng các câu if; mô hình
hoá bằng một hằng <code>Color</code> thì phần giảm giá nằm gọn trong một hàm. Nó cần nhãn riêng vì hằng số
Java không thể đặt tên là <code>NO COLOR</code>, còn khách thì gõ có dấu cách.</p>
<p><strong>Quyết định được hỏi: đúng, giá được so với giá ĐÃ giảm.</strong> Đề không nói 100 $ trừ vào
đâu, nhưng lại đưa sẵn bằng chứng. Bản sơn rẻ nhất của BMW là 2500; ca bán thành công trong đề là BMW
<em>no color</em> giá <em>2400</em>. 2500 − 100 = 2400, đúng khít. Mọi cách đọc khác — so với 2500, hoặc
không so gì cả — hoặc là từ chối chính ví dụ đề đã chấp nhận, hoặc biến <code>getPrices</code> thành một
hàm không ai gọi. Vậy giá chào là giá đứng đúng chỉ số của màu đó, hoặc giá thấp nhất trừ 100 khi xe không
sơn.</p>
<p><strong>Và phép so là <code>&gt;=</code> chứ không phải <code>==</code>.</strong> Đề nói các tuỳ chọn
thêm được <em>cộng</em> vào giá cuối, nên khách trả cao hơn giá niêm yết vẫn là một vụ bán được. Bắt bằng
đúng sẽ từ chối mọi khách muốn lắp thêm cái radio.</p>
<p><strong>Chỗ đề im lặng, và chỗ đề tự mâu thuẫn.</strong> Ba điểm. (1) Không có thông báo cho "giá bạn
trả thấp hơn giá bán" — năm lời từ chối đề in ra không phủ được ca này. <code>Price is not enough</code>
ở đây được viết theo đúng giọng của đề và được nói rõ là tự đặt; nếu kịch bản chấm của lớp có chữ riêng
thì đó là chuỗi duy nhất cần sửa. (2) Phần Hint bảo "nếu màu không có trong Color Enum thì dùng getColor
để đưa vào giá trị null" ở Main, nhưng chữ ký hàm mà đề đưa lại nhận màu là <code>String</code> — nên việc
tra màu không thể xảy ra ở Main. Chữ ký là bản hợp đồng, nên <code>checkCar</code> tự làm việc đó.
(3) Màn hình viết <code>Can’t sell Car</code> bằng dấu nháy cong còn <code>Car can't sell today</code>
bằng dấu nháy thẳng. Cả hai đều được chép y nguyên, vì người chấm so màn hình tới từng ký tự; dấu cong
được viết là <code>\\u2019</code> để tệp không phụ thuộc vào bảng mã mặc định của trình biên dịch.</p>
<p><strong>Vì sao ở đây không có <code>utils/Validator</code>.</strong> Mọi project khác trong lộ trình
này đều có, còn bài này thì không nên có. Trên màn hình này không có gì bị hỏi lại: một màu không tồn tại
là một lời <em>từ chối</em>, không phải lời mời gõ lại, nên một lớp đọc-có-kiểm-tra sẽ chẳng có gì để
kiểm, chỉ chuyển tiếp lại dòng vừa đọc. Đề cũng nói vậy — "In Main, use scanner to enter the car
information". Sáu tệp, ba tầng, và mỗi thứ đều có lý do.</p>
<p><strong>Vì sao <code>ExceptionCar</code> là ngoại lệ kiểm tra và nằm trong <code>bo</code>.</strong>
Từ chối bán là một kết cục được dự liệu của luật, không phải lỗi lập trình, nên nó kế thừa
<code>Exception</code> và trình biên dịch bắt tầng màn hình phải xử lý. Nó nằm cạnh <code>Showroom</code>
vì nó là một phần của bản hợp đồng đó: tầng luật định nghĩa cả phép kiểm lẫn cách báo thất bại.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Hai kịch bản chạy. Kịch bản đầu diễn lại cả sáu ca của chính
đề trong một phiên — sai tên xe, ca bán thành công, màu không tồn tại, giá âm, giá không phải số, và chiếc
BMW vào thứ Sáu — console khớp từng dòng với chữ của đề. Kịch bản thứ hai chạy những luật đề có nêu nhưng
không hề in ra: BMW màu GREEN (màu có thật, sai dòng xe), một màu có tên được trả đúng giá theo chỉ số,
một mức trả cao hơn niêm yết, một mức thấp hơn, và một "ngày" không phải là ngày.</p>''',
    hints_en=[
        'Keep the colours, prices and sale days as three index-aligned lists inside the Car enum.',
        'getCar / getColor / getDay must RETURN null for unknown text — valueOf throws instead.',
        '"no color" is a Color constant with a label, not a null: it carries the $100 discount.',
        'Check in the order the screen shows: model, colour, price, day. Only the first message prints.',
        'The brief accepts a BMW at 2400 and the cheapest BMW is 2500 — that tells you what the discount applies to.',
    ],
    hints_vi=[
        'Giữ màu, giá và ngày bán thành ba danh sách khớp chỉ số ngay trong enum Car.',
        'getCar / getColor / getDay phải TRẢ VỀ null với chuỗi lạ — valueOf thì ném lỗi.',
        '"no color" là một hằng Color có nhãn riêng, không phải null: nó mang theo khoản giảm 100 $.',
        'Kiểm theo đúng thứ tự màn hình: tên xe, màu, giá, ngày. Chỉ thông báo đầu tiên được in ra.',
        'Đề chấp nhận BMW giá 2400 mà BMW rẻ nhất là 2500 — chính chỗ đó cho biết khoản giảm trừ vào đâu.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
# The English brief is the contract and stays untouched; this is the reading
# aid beside it, so every message string the program prints stays in English
# exactly as the brief prints it.
VI = {
    'J1.S.P0051': '''<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<ul>
<li>Viết một chương trình máy tính gồm các chức năng cộng, trừ, nhân, chia, tính luỹ thừa và tính chỉ
số BMI.</li>
<li>Chức năng tính toán sẽ tính rồi <strong>lưu kết quả vào bộ nhớ tạm</strong> mỗi khi người dùng nhập
một toán tử, và chỉ dừng lại khi người dùng nhập toán tử <code>=</code>.</li>
<li>BMI được tính như sau:
<pre>BMI = (cân nặng) / (chiều cao x chiều cao)</pre>
Cân nặng tính bằng kg; chiều cao x chiều cao tính bằng <strong>m</strong>.</li>
<li>Hiển thị thông báo về tình trạng cơ thể người dùng:
<ul>
<li>Dưới chuẩn: BMI nhỏ hơn 19</li>
<li>Chuẩn: BMI trong khoảng 19–25</li>
<li>Thừa cân: BMI trong khoảng 25–30</li>
<li>Béo — nên giảm cân: BMI trong khoảng 30–40</li>
<li>Rất béo — cần giảm cân ngay: BMI trên 40</li>
</ul>
</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện thực đơn và mời người dùng chọn</h4>
<ul><li>Người dùng chạy chương trình, chương trình mời chọn một mục.</li>
<li>Người dùng chọn một mục, chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<ul>
<li><strong>Mục 1: Máy tính thường</strong>
<ul>
<li>Yêu cầu nhập thông tin phép tính gồm "số, toán tử".</li>
<li>Kiểm tra dữ liệu hợp lệ với các điều kiện: trường số phải là dữ liệu số; toán tử là một trong các
ký tự (+, -, *, /, ^).</li>
<li>Tính toán rồi quay lại màn hình chính.</li>
</ul>
</li>
<li><strong>Mục 2: Tính chỉ số BMI</strong>
<ul>
<li>Yêu cầu nhập cân nặng và chiều cao; cả hai phải là số.</li>
<li>Tính BMI, hiển thị tình trạng, rồi quay lại màn hình chính.</li>
</ul>
</li>
<li><strong>Mục 3: Thoát chương trình.</strong></li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>========= Calculator Program =========
1. Normal Calculator
2. BMI Calculator
3. Exit
Please choice one option: 1
----- Normal Calculator -----
Enter number: 4
Enter Operator: +
Enter number: 4
Memory:8.0
Enter Operator: a
Please input (+, -, *, /, ^)
Enter Operator: +
Enter number: 16
Memory:24.0
Enter Operator: =
Result:24.0</pre>
<pre>----- BMI Calculator -----
Enter Weight(kg): a
BMI is digit
Enter Weight(kg): 70
Enter Height(cm): b
BMI is digit
Enter Height(cm): 170
BMI Number: 24.22
BMI Status: STANDARD</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức <code>calculate</code> và
<code>calculateBMI</code> trong mã nguồn.</p>
<ul>
<li>Dùng <code>Math.pow(a, b)</code> để tính luỹ thừa.</li>
<li>Dùng <code>switch case</code> trên enum.</li>
<li>Dùng <code>try catch</code> để bắt <code>NumberFormatException</code>,
<code>NullPointerException</code>.</li>
<li>Dùng <code>if</code> để bắt <code>ArithmeticException</code> ở trường hợp chia cho 0.</li>
<li>Dùng hàm public <code>Operator checkOperator(String operator)</code> để kiểm tra hợp lệ. Nếu toán tử
hợp lệ thì hàm trả về hằng enum tương ứng với +, -, x, /, ^, = ; ngược lại trả về
<code>null</code>.</li>
<li>Dùng hàm public <code>Double checkin(String inputVal)</code> để kiểm tra đầu vào có phải số không;
nếu không phải số thì trả về <code>null</code>.</li>
</ul>
<h4>Chức năng 1: Máy tính thường</h4>
<p><code>public double calculate(double a, Operator operator, double b)</code></p>
<ul><li>Đầu vào: <code>a</code> — số thứ nhất; <code>operator</code> — toán tử; <code>b</code> — số thứ
hai.</li>
<li>Trả về: kết quả đã tính.</li></ul>
<h4>Chức năng 2: Máy tính BMI</h4>
<p><code>public BMI calculateBMI(double weight, double height)</code></p>
<ul><li>Đầu vào: <code>weight</code> — cân nặng (kg); <code>height</code> — chiều cao
(<strong>cm</strong>).</li>
<li>Trả về: hằng enum chứa tình trạng BMI.</li></ul>''',

    'J1.S.P0066': '''<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Showroom có ba dòng xe:</p>
<ul>
<li><strong>AUDI</strong> — màu có sẵn: WHITE, YELLOW, ORANGE; giá: 5500, 3000, 4500 $; bán vào:
FRIDAY, SUNDAY, MONDAY.</li>
<li><strong>MERCEDES</strong> — màu có sẵn: GREEN, BLUE, PURPLE; giá: 5000, 6000, 8500 $; bán vào:
TUESDAY, SATURDAY, WEDNESDAY.</li>
<li><strong>BMW</strong> — màu có sẵn: PINK, RED, BROWN; giá: 2500, 3000, 3500 $; bán vào:
MONDAY, SUNDAY, THURSDAY.</li>
</ul>
<p>Viết chương trình giúp nhân viên bán hàng kiểm tra xem yêu cầu của khách có khớp với những xe
showroom đang bán hay không.</p>
<ul>
<li>Khách có thể chọn xe <strong>không sơn màu</strong> để được giảm 100 $.</li>
<li>Khách có thể chọn thêm các tuỳ chọn khác, và giá của chúng được <strong>cộng thêm</strong> vào giá
cuối cùng của xe.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình, chương trình mời nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul><li>Chương trình hiển thị thông tin yêu cầu của khách và kiểm tra xem có khớp với xe trong showroom
không.</li>
<li>Hiển thị thông báo rồi thoát chương trình.</li></ul>
<h3>Màn hình mong đợi</h3>
<pre>===== Showroom car program =====
Input Information of Car
Name: BMV
Color: no color
Price: 2400
Today: THURSDAY

Can’t sell Car
Car break

Name: BMW
Color: no color
Price: 2400
Today: THURSDAY

Sell Car
Do you want find more?(Y/N):Y

Name: BMW
Color: color
Price: 2400
Today: THURSDAY

Can’t sell Car
Color Car does not exist

Name: BMW
Color: no color
Price: -200
Today: THURSDAY

Can’t sell Car
Price greater than zero

Name: BMW
Color: no color
Price: a
Today: THURSDAY

Can’t sell Car
Price is digit

Name: BMW
Color: no color
Price: 2400
Today: FRIDAY

Can’t sell Car
Car can't sell today</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức <code>checkCar</code>,
<code>getPrices</code>, <code>getColors</code>, <code>getDaySells</code> trong mã nguồn.</p>
<h4>Gợi ý</h4>
<ul>
<li>Tạo lớp <code>ExceptionCar</code> kế thừa <code>Exception</code>; truyền nội dung thông báo vào
constructor.</li>
<li>Tạo enum <code>Car</code>:
<ul><li>Tạo các phương thức <code>getPrices</code>, <code>getColors</code>, <code>getDaySells</code>
trả về danh sách thông tin bán hàng.</li>
<li>Tạo phương thức <code>Car getCar(String car)</code>.</li></ul>
</li>
<li>Tạo enum <code>Day</code>:
<ul><li>Liệt kê đủ các ngày trong tuần.</li>
<li>Tạo phương thức <code>Day getDay(String day)</code>; nếu chuỗi không thuộc enum Day thì trả về
<code>null</code>.</li></ul>
</li>
<li>Tạo enum <code>Color</code>:
<ul><li>Liệt kê mọi màu xe trong showroom, và cả tuỳ chọn "no color".</li>
<li>Tạo phương thức <code>Color getColor(String color)</code>; nếu chuỗi không thuộc enum Color thì trả
về <code>null</code>.</li></ul>
</li>
<li>Tạo phương thức <code>checkCar</code> nhận vào thông tin yêu cầu của khách. Nó kiểm tra thông tin và
trả về hằng enum <code>Car</code> nếu khớp, nếu không thì ném <code>ExceptionCar</code>.</li>
<li>Trong <code>Main</code>, dùng <code>Scanner</code> để nhập thông tin xe:
<ul><li>Nếu tên xe không thuộc enum Car thì đưa vào giá trị null (dùng <code>getCar</code>).</li>
<li>Nếu màu xe không thuộc enum Color thì đưa vào giá trị null (dùng <code>getColor</code>).</li>
<li>Nếu ngày không thuộc enum Day thì đưa vào giá trị null (dùng <code>getDay</code>).</li></ul>
</li>
</ul>
<h4>Chức năng 1: Kiểm tra thông tin bán xe</h4>
<p><code>public Car checkCar(Car car, String color, Day day, String price) throws ExceptionCar</code></p>
<ul>
<li>Đầu vào: <code>car</code> — enum Car; <code>color</code> — màu; <code>day</code> — enum Day;
<code>price</code> — giá xe.</li>
<li>Trả về: hằng enum <code>Car</code>, hoặc ném <code>ExceptionCar</code>.</li>
</ul>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
