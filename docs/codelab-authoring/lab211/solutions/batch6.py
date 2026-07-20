# Batch 6 — J1.S.P0061 (abstract Shape hierarchy) and J1.S.P0083 (a stack).
from solkit import solution


def _triangle_retry_check(out):
    """1, 2, 10 must be refused and re-asked; NaN must never reach the screen."""
    if 'NaN' in out:
        return False, 'Math.sqrt of a negative reached the screen as NaN'
    if 'cannot form a triangle' not in out:
        return False, 'the impossible triangle was accepted'
    if 'Area:6.0' not in out:
        return False, 'the retry 3-4-5 triangle should have area 6.0'
    return True, ''


def _lifo_check(out):
    """The whole point of the exercise: last in, first out."""
    for needed in ['Pushed 10', 'Pushed 20', 'Pushed 30',
                   'Top is 30',                       # peek does not remove
                   'Stack (bottom -> top): [10, 20, 30]',
                   'Popped 30', 'Popped 20',          # LIFO order
                   'Stack (bottom -> top): [10]']:
        if needed not in out:
            return False, f'missing from the console: {needed!r}'
    if out.index('Top is 30') > out.index('Popped 30'):
        return False, 'peek must happen before the pop'
    return True, ''


def _empty_stack_check(out):
    """Popping and peeking an empty stack must report, not crash."""
    if out.count('Stack is empty.') < 2:
        return False, 'pop and peek on an empty stack should both report it'
    if 'You must input a number.' not in out:
        return False, 'a letter at the menu should be refused'
    if 'Value must be between 0 and 4.' not in out:
        return False, 'an out-of-range menu choice should be refused'
    return True, ''

# ════════════════════════════════════════════════════════════════
# J1.S.P0061 — Perimeter and area of three shapes (42 LOC)
# ════════════════════════════════════════════════════════════════

P0061_SHAPE = '''package entity;

/**
 * The base of the hierarchy the brief asks for.
 *
 * It is abstract because a "Shape" with no kind has no area — there is no
 * formula to write at this level, and you must never be able to say
 * new Shape(). Declaring the three methods here is the contract: every shape
 * CAN report its perimeter, its area, and print itself.
 */
public abstract class Shape {

    /** Required by the brief. Each subclass supplies its own formula. */
    public abstract double getPerimeter();

    /** Required by the brief. */
    public abstract double getArea();

    /**
     * Required by the brief. Left abstract on purpose: each shape prints a
     * different set of properties, and the brief's expected screen shows that.
     */
    public abstract void printResult();
}
'''

P0061_RECT = '''package entity;

/** A rectangle: width and length. */
public class Rectangle extends Shape {

    private double width;
    private double length;

    public Rectangle(double width, double length) {
        this.width = width;
        this.length = length;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }

    @Override
    public double getPerimeter() {
        return 2 * (width + length);
    }

    @Override
    public double getArea() {
        return width * length;
    }

    @Override
    public void printResult() {
        System.out.println("-----Rectangle-----");
        System.out.println("Width: " + width);
        System.out.println("Length: " + length);
        System.out.println("Area: " + getArea());
        System.out.println("Perimeter: " + getPerimeter());
    }
}
'''

P0061_CIRCLE = '''package entity;

/** A circle: one radius. */
public class Circle extends Shape {

    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }

    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }

    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }

    @Override
    public void printResult() {
        System.out.println("-----Circle-----");
        System.out.println("Radius: " + radius);
        // The brief prints the circle's two results with NO space after the
        // colon, unlike the rectangle above. Matched deliberately.
        System.out.println("Area:" + getArea());
        System.out.println("Perimeter:" + getPerimeter());
    }
}
'''

P0061_TRIANGLE = '''package entity;

/** A triangle given by its three sides. */
public class Triangle extends Shape {

    private double sideA;
    private double sideB;
    private double sideC;

    public Triangle(double sideA, double sideB, double sideC) {
        this.sideA = sideA;
        this.sideB = sideB;
        this.sideC = sideC;
    }

    public double getSideA() {
        return sideA;
    }

    public void setSideA(double sideA) {
        this.sideA = sideA;
    }

    public double getSideB() {
        return sideB;
    }

    public void setSideB(double sideB) {
        this.sideB = sideB;
    }

    public double getSideC() {
        return sideC;
    }

    public void setSideC(double sideC) {
        this.sideC = sideC;
    }

    /**
     * Three sides only form a triangle when each pair is longer than the third.
     * Without this test, sides 1, 2, 10 would produce a NaN area, which prints
     * as "NaN" and looks like a crash to a marker.
     */
    public static boolean isValid(double a, double b, double c) {
        return a + b > c && a + c > b && b + c > a;
    }

    @Override
    public double getPerimeter() {
        return sideA + sideB + sideC;
    }

    /** Heron's formula: the only one that works from three sides alone. */
    @Override
    public double getArea() {
        double s = getPerimeter() / 2;
        return Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
    }

    @Override
    public void printResult() {
        System.out.println("-----Triangle-----");
        System.out.println("Side A: " + sideA);
        System.out.println("Side B: " + sideB);
        System.out.println("Side C: " + sideC);
        System.out.println("Area:" + getArea());
        System.out.println("Perimeter:" + getPerimeter());
    }
}
'''

P0061_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /** A length: must be a number and must be greater than zero. */
    public static double getPositiveDouble(String message) {
        while (true) {
            System.out.println(message);
            String line = SCANNER.nextLine().trim();
            try {
                double value = Double.parseDouble(line);
                if (value <= 0) {
                    System.out.println("Value must be greater than zero.");
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

P0061_MAIN = '''package ui;

import entity.Circle;
import entity.Rectangle;
import entity.Shape;
import entity.Triangle;
import utils.Validator;

/**
 * Screen and flow.
 *
 * The three shapes are kept in one Shape[] and printed by one loop. Nothing in
 * this file knows that a circle uses PI or that a triangle uses Heron's
 * formula — that is polymorphism doing the work.
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("=====Calculator Shape Program=====");

        double width = Validator.getPositiveDouble("Please input side width of Rectangle:");
        double length = Validator.getPositiveDouble("Please input length of Rectangle:");
        double radius = Validator.getPositiveDouble("Please input radius of Circle:");

        double a;
        double b;
        double c;
        while (true) {
            a = Validator.getPositiveDouble("Please input side A of Triangle:");
            b = Validator.getPositiveDouble("Please input side B of Triangle:");
            c = Validator.getPositiveDouble("Please input side C of Triangle:");
            if (Triangle.isValid(a, b, c)) {
                break;
            }
            System.out.println("These three sides cannot form a triangle. Please input again.");
        }

        Shape[] shapes = {
            new Rectangle(width, length),
            new Circle(radius),
            new Triangle(a, b, c)
        };

        // ONE call, three different behaviours - this line is the whole point.
        for (Shape shape : shapes) {
            shape.printResult();
        }
    }
}
'''

solution(
    'J1.S.P0061',
    title_vi='Tính chu vi và diện tích hình chữ nhật, hình tròn, tam giác',
    files=[('src/entity/Shape.java', P0061_SHAPE),
           ('src/entity/Rectangle.java', P0061_RECT),
           ('src/entity/Circle.java', P0061_CIRCLE),
           ('src/entity/Triangle.java', P0061_TRIANGLE),
           ('src/utils/Validator.java', P0061_VALIDATOR),
           ('src/ui/Main.java', P0061_MAIN)],
    main_class='ui.Main',
    runs=[
        # the brief's own numbers — every digit below is copied from its screen
        ('11\n32\n12\n5\n5\n5\n',
         '=====Calculator Shape Program=====\n'
         'Please input side width of Rectangle:\nPlease input length of Rectangle:\n'
         'Please input radius of Circle:\nPlease input side A of Triangle:\n'
         'Please input side B of Triangle:\nPlease input side C of Triangle:\n'
         '-----Rectangle-----\nWidth: 11.0\nLength: 32.0\nArea: 352.0\nPerimeter: 86.0\n'
         '-----Circle-----\nRadius: 12.0\nArea:452.3893421169302\nPerimeter:75.39822368615503\n'
         '-----Triangle-----\nSide A: 5.0\nSide B: 5.0\nSide C: 5.0\n'
         'Area:10.825317547305483\nPerimeter:15.0'),
        # 1, 2, 10 cannot form a triangle: must re-ask, not print NaN
        ('11\n32\n12\n1\n2\n10\n3\n4\n5\n', _triangle_retry_check),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Not arithmetic — a hierarchy. The
Guidelines are explicit: <em>"Create an abstract class Shape contains three methods printResult,
getPerimeter and getArea. Create classes Triangle, Rectangle, Circle that extend from class
Shape."</em> The formulas are the easy part; the marks are in the structure.</p>
<p><strong>Why Shape is abstract.</strong> A shape with no kind has no area — there is no formula to
write at that level. Making the class abstract means <code>new Shape()</code> is a compile error, and
declaring the three methods there is a contract every subclass must honour. If an examiner asks
"why not just put an empty getArea in Shape and return 0", the answer is that 0 is a lie: a subclass
that forgets to override would compile and silently report nonsense. Abstract makes forgetting
impossible.</p>
<p><strong>The line that demonstrates polymorphism.</strong> <code>for (Shape shape : shapes)
shape.printResult();</code> — one call, three different behaviours chosen at run time by the object
itself. Nothing in <code>Main</code> knows that a circle uses π or that a triangle needs Heron's
formula. When you are asked to point at polymorphism in your own code, point at that loop.</p>
<p><strong>Heron's formula, and why it is the only choice.</strong> Area = ½ × base × height needs a
height nobody typed. From three sides alone the formula is
<code>√(s(s−a)(s−b)(s−c))</code> with <code>s</code> the half-perimeter. Sides 5, 5, 5 give
10.825317547305483, exactly what the brief prints.</p>
<p><strong>The check the brief does not mention but a marker will test.</strong> Three arbitrary
lengths do not always form a triangle. Sides 1, 2, 10 make <code>s(s−a)(s−b)(s−c)</code> negative,
<code>Math.sqrt</code> of a negative is <code>NaN</code>, and the screen prints <em>Area:NaN</em> —
which looks exactly like a crash. <code>isValid</code> tests that each pair of sides is longer than
the third, and the second test run enters 1, 2, 10 to prove the program asks again instead.</p>
<p><strong>One inconsistency copied on purpose.</strong> The brief prints <em>Area: 352.0</em> with a
space for the rectangle and <em>Area:452.38…</em> without one for the circle and triangle. That is the
brief's own inconsistency; this solution reproduces it exactly, because the marker compares your
screen with theirs. It is worth mentioning that you noticed.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Không phải phép tính — mà là một cây phân cấp
lớp. Mục Hướng dẫn nói rất rõ: <em>"Create an abstract class Shape contains three methods printResult,
getPerimeter and getArea. Create classes Triangle, Rectangle, Circle that extend from class
Shape."</em> Công thức là phần dễ; điểm nằm ở cấu trúc.</p>
<p><strong>Vì sao Shape phải abstract.</strong> Một hình không thuộc loại nào thì không có diện tích —
ở mức đó không có công thức nào để viết. Để lớp là abstract nghĩa là <code>new Shape()</code> sẽ báo
lỗi biên dịch, và việc khai báo ba phương thức ở đó là một hợp đồng mà mọi lớp con phải tuân thủ. Nếu
giám khảo hỏi "sao không để getArea rỗng trong Shape và trả về 0", câu trả lời là số 0 đó là một lời
nói dối: lớp con nào quên ghi đè vẫn biên dịch được và lặng lẽ báo kết quả vô nghĩa. Abstract khiến
việc quên trở thành bất khả thi.</p>
<p><strong>Dòng thể hiện tính đa hình.</strong> <code>for (Shape shape : shapes)
shape.printResult();</code> — một lời gọi, ba hành vi khác nhau do chính đối tượng chọn lúc chạy.
Trong <code>Main</code> không có chỗ nào biết hình tròn dùng π hay tam giác cần công thức Heron. Khi
bị bảo "chỉ chỗ nào là đa hình trong bài em", hãy chỉ vào vòng lặp đó.</p>
<p><strong>Công thức Heron, và vì sao không có lựa chọn khác.</strong> Diện tích = ½ × đáy × chiều cao
cần một chiều cao mà không ai nhập. Từ ba cạnh, công thức là <code>√(s(s−a)(s−b)(s−c))</code> với
<code>s</code> là nửa chu vi. Ba cạnh 5, 5, 5 cho ra 10.825317547305483, đúng bằng con số đề in.</p>
<p><strong>Phép kiểm mà đề không nhắc nhưng người chấm sẽ thử.</strong> Ba độ dài bất kỳ không phải lúc
nào cũng tạo thành tam giác. Ba cạnh 1, 2, 10 làm <code>s(s−a)(s−b)(s−c)</code> âm,
<code>Math.sqrt</code> của số âm là <code>NaN</code>, và màn hình in ra <em>Area:NaN</em> — trông y hệt
một lần chương trình chết. Hàm <code>isValid</code> kiểm tra tổng hai cạnh bất kỳ luôn lớn hơn cạnh
còn lại, và kịch bản chạy thứ hai nhập 1, 2, 10 để chứng minh chương trình hỏi lại thay vì hỏng.</p>
<p><strong>Một chỗ không nhất quán được chép lại có chủ ý.</strong> Đề in <em>Area: 352.0</em> có dấu
cách ở hình chữ nhật và <em>Area:452.38…</em> không có dấu cách ở hình tròn và tam giác. Đó là điểm
không nhất quán của chính đề; lời giải này chép lại y nguyên, vì người chấm so màn hình của bạn với
màn hình của họ. Việc bạn nhận ra điều này đáng để nói ra.</p>''',
    hints_en=[
        'Read the Guidelines before the formulas: the brief dictates an abstract Shape and three subclasses.',
        'Keep printResult abstract too — each shape prints a different set of properties.',
        'Put the three shapes in one Shape[] and print them with one loop. That loop is your polymorphism answer.',
        'Check the triangle inequality, or Math.sqrt of a negative gives NaN and looks like a crash.',
    ],
    hints_vi=[
        'Đọc mục Hướng dẫn trước khi nghĩ tới công thức: đề áp đặt một lớp Shape abstract và ba lớp con.',
        'Để printResult cũng abstract — mỗi hình in ra một bộ thuộc tính khác nhau.',
        'Đặt ba hình vào một mảng Shape[] rồi in bằng một vòng lặp. Chính vòng lặp đó là câu trả lời về đa hình.',
        'Nhớ kiểm bất đẳng thức tam giác, nếu không Math.sqrt của số âm ra NaN và trông như chương trình chết.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0083 — Stacks (40 LOC)
# ════════════════════════════════════════════════════════════════

P0083_ENTITY = '''package entity;

import java.util.ArrayList;
import java.util.List;

/**
 * A stack, built by hand.
 *
 * LIFO — last in, first out. Everything happens at ONE end, called the top.
 * An ArrayList is the right store because the top is its LAST element, and
 * adding to or removing from the end of an ArrayList costs nothing extra.
 * Using index 0 as the top instead would shift every other element on every
 * push and pop.
 */
public class MyStack {

    private final List<Integer> stackValues = new ArrayList<>();

    /** Required: push a value onto the top. */
    public void push(int value) {
        stackValues.add(value);
    }

    /**
     * Required: remove and return the top value.
     *
     * Throws rather than returning a magic number: -1 would be indistinguishable
     * from a -1 that someone really pushed. The caller decides what to say.
     */
    public int pop() {
        if (isEmpty()) {
            throw new IllegalStateException("Stack is empty.");
        }
        return stackValues.remove(stackValues.size() - 1);
    }

    /** Required: read the top value WITHOUT removing it. */
    public int get() {
        if (isEmpty()) {
            throw new IllegalStateException("Stack is empty.");
        }
        return stackValues.get(stackValues.size() - 1);
    }

    public boolean isEmpty() {
        return stackValues.isEmpty();
    }

    public int size() {
        return stackValues.size();
    }

    /** Bottom first, so the printed order matches the picture of a real stack. */
    public List<Integer> getStackValues() {
        return new ArrayList<>(stackValues);
    }
}
'''

P0083_VALIDATOR = '''package utils;

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
}
'''

P0083_MAIN = '''package ui;

import entity.MyStack;
import java.util.List;
import utils.Validator;

/**
 * Menu-driven demo so the LIFO behaviour is visible.
 *
 * The menu choice is read as an int inside a fixed range, so a letter or an
 * out-of-range number produces a message instead of an exception.
 */
public class Main {

    public static void main(String[] args) {
        MyStack stack = new MyStack();
        boolean running = true;

        while (running) {
            System.out.println("======= STACK DEMO (MyStack) =======");
            System.out.println("1.Push   2.Pop   3.Get(peek)   4.Display   0.Exit");
            System.out.println("====================================");
            int choice = Validator.getInt("Choose: ", 0, 4);

            switch (choice) {
                case 1:
                    int value = Validator.getInt("Value to push: ", -1000000, 1000000);
                    stack.push(value);
                    System.out.println("Pushed " + value);
                    break;
                case 2:
                    try {
                        System.out.println("Popped " + stack.pop());
                    } catch (IllegalStateException e) {
                        System.out.println(e.getMessage());
                    }
                    break;
                case 3:
                    try {
                        System.out.println("Top is " + stack.get());
                    } catch (IllegalStateException e) {
                        System.out.println(e.getMessage());
                    }
                    break;
                case 4:
                    display(stack);
                    break;
                default:
                    running = false;
                    System.out.println("Bye");
            }
        }
    }

    /** Prints bottom to top, with the top marked, so LIFO is visible. */
    private static void display(MyStack stack) {
        List<Integer> values = stack.getStackValues();
        if (values.isEmpty()) {
            System.out.println("Stack is empty.");
            return;
        }
        System.out.println("Stack (bottom -> top): " + values);
        System.out.println("Top: " + values.get(values.size() - 1) + ", size: " + values.size());
    }
}
'''

solution(
    'J1.S.P0083',
    title_vi='Cấu trúc dữ liệu ngăn xếp (Stack)',
    files=[('src/entity/MyStack.java', P0083_ENTITY),
           ('src/utils/Validator.java', P0083_VALIDATOR),
           ('src/ui/Main.java', P0083_MAIN)],
    main_class='ui.Main',
    runs=[
        # push 10, 20, 30; peek; display; pop twice; display; exit
        ('1\n10\n1\n20\n1\n30\n3\n4\n2\n2\n4\n0\n', _lifo_check),
        # pop and peek on an empty stack, then a letter and an out-of-range choice
        ('2\n3\nx\n9\n0\n', _empty_stack_check),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Build the data structure
yourself. <code>java.util.Stack</code> exists, but using it would answer none of the questions the
exercise is asking — the point is that you can implement push, pop and peek and explain LIFO.</p>
<p><strong>Why the top is the LAST element.</strong> An <code>ArrayList</code> adds and removes at the
end in constant time. Treat index 0 as the top instead and every push shifts every other element one
place right, and every pop shifts them back — O(n) work for something that should be free. That
single decision is the most likely design question on this exercise.</p>
<p><strong>Why pop throws instead of returning -1.</strong> A magic return value cannot be told apart
from real data: if someone pushed −1, a −1 coming back means two different things. Throwing separates
"there is nothing here" from "the value is −1", and it puts the decision about what to SAY in the ui
layer where it belongs. The second test run pops and peeks an empty stack to prove the program
reports it politely rather than crashing.</p>
<p><strong>get() versus pop() — the distinction being tested.</strong> Both look at the top;
<code>pop</code> removes it, <code>get</code> (peek) leaves it. Calling <code>get</code> twice must
return the same value twice. The first test run peeks 30, displays, and only then pops — you can see
30 still present between the peek and the pop.</p>
<p><strong>getStackValues returns a copy.</strong> Handing out the internal list would let any caller
insert into the middle of the stack and break the LIFO rule the class exists to enforce. A copy costs
one allocation and keeps the guarantee true.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Tự xây cấu trúc dữ liệu. Java có sẵn
<code>java.util.Stack</code>, nhưng dùng nó thì không trả lời được câu hỏi nào mà bài đang đặt ra —
mục đích là bạn cài đặt được push, pop, peek và giải thích được LIFO.</p>
<p><strong>Vì sao đỉnh là phần tử CUỐI.</strong> <code>ArrayList</code> thêm và xoá ở cuối với chi phí
hằng số. Nếu coi vị trí 0 là đỉnh thì mỗi lần push phải đẩy mọi phần tử khác sang phải một ô, mỗi lần
pop lại đẩy ngược về — mất O(n) cho một việc đáng ra miễn phí. Chỉ riêng quyết định đó đã là câu hỏi
thiết kế nhiều khả năng nhất ở bài này.</p>
<p><strong>Vì sao pop ném ngoại lệ thay vì trả về -1.</strong> Một giá trị "báo hiệu" không thể phân
biệt với dữ liệu thật: nếu ai đó đã push −1 vào thì một số −1 trả về mang hai nghĩa khác nhau. Ném
ngoại lệ tách bạch "ở đây không có gì" khỏi "giá trị là −1", và đẩy quyết định NÓI GÌ về tầng giao
diện, đúng chỗ của nó. Kịch bản chạy thứ hai thực hiện pop và peek trên ngăn xếp rỗng để chứng minh
chương trình báo lịch sự chứ không chết.</p>
<p><strong>get() khác pop() ở đâu — chính là điều đang bị kiểm tra.</strong> Cả hai đều nhìn vào đỉnh;
<code>pop</code> lấy nó đi, <code>get</code> (peek) để nguyên. Gọi <code>get</code> hai lần phải trả
về cùng một giá trị hai lần. Kịch bản chạy đầu peek ra 30, hiển thị, rồi mới pop — bạn thấy rõ 30 vẫn
còn nguyên giữa lần peek và lần pop.</p>
<p><strong>getStackValues trả về một bản sao.</strong> Đưa thẳng danh sách bên trong ra ngoài sẽ cho
phép bất kỳ ai chèn vào giữa ngăn xếp và phá vỡ luật LIFO mà chính lớp này sinh ra để bảo vệ. Một bản
sao chỉ tốn một lần cấp phát nhưng giữ được lời hứa đó.</p>''',
    hints_en=[
        'Keep the top at the END of the list — adding and removing there costs nothing.',
        'pop removes, get (peek) does not. Calling get twice must give the same value twice.',
        'Do not return -1 for an empty stack: -1 could be a real value someone pushed. Throw instead.',
        'Test popping an empty stack before you show anyone — that is the first thing a marker tries.',
    ],
    hints_vi=[
        'Giữ đỉnh ở CUỐI danh sách — thêm và xoá ở đó không tốn thêm gì.',
        'pop lấy đi, get (peek) thì không. Gọi get hai lần phải cho cùng một giá trị.',
        'Đừng trả về -1 khi ngăn xếp rỗng: -1 có thể là giá trị thật ai đó đã push. Hãy ném ngoại lệ.',
        'Hãy thử pop trên ngăn xếp rỗng trước khi cho ai xem — đó là thứ đầu tiên người chấm thử.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────
from solkit import SOLUTIONS

VI6 = {
 'J1.S.P0061': '''<p><strong>Short Assignment · J1.S.P0061 · 42 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình tính chu vi và diện tích của Hình tròn, Hình chữ nhật và Tam giác.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình. Chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul><li>Chương trình tính diện tích và chu vi của hình tròn, hình chữ nhật và tam giác vừa nhập.</li>
<li>Hiển thị thông tin lên màn hình rồi kết thúc chương trình.</li></ul>
<h3>Màn hình mong đợi</h3>
<pre>=====Calculator Shape Program=====
Please input side width of Rectangle:
11
Please input length of Rectangle:
32
Please input radius of Circle:
12
Please input side A of Triangle:
5
Please input side B of Triangle:
5
Please input side C of Triangle:
5
-----Rectangle-----
Width: 11.0
Length: 32.0
Area: 352.0
Perimeter: 86.0
-----Circle-----
Radius: 12.0
Area:452.3893421169302
Perimeter:75.39822368615503
-----Triangle-----
Side A: 5.0
Side B: 5.0
Side C: 5.0
Area:10.825317547305483
Perimeter:15.0</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt <code>getPerimeter</code>, <code>getArea</code>,
<code>printResult</code>.</p>
<ul>
<li>Tạo lớp <strong>abstract</strong> <code>Shape</code> chứa ba phương thức <code>printResult</code>,
<code>getPerimeter</code>, <code>getArea</code>.</li>
<li>Tạo các lớp <code>Triangle</code>, <code>Rectangle</code>, <code>Circle</code> <strong>kế thừa</strong>
từ lớp <code>Shape</code>.</li>
<li>Xây dựng các hình với thuộc tính riêng: hình tròn (bán kính), hình chữ nhật (rộng, dài), tam giác
(cạnh A, cạnh B, cạnh C); sinh getter/setter cho chúng.</li>
</ul>''',

 'J1.S.P0083': '''<p><strong>Short Assignment · J1.S.P0083 · 40 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3>
<p>Ngăn xếp (stack) là một cấu trúc dữ liệu rất quen thuộc trong đời sống — hãy nghĩ tới chồng ly hay
chồng đĩa. Ngăn xếp hoạt động theo kiểu LIFO, tức <em>vào sau ra trước</em>: phần tử được thêm vào gần
nhất luôn là phần tử được lấy ra đầu tiên. Mọi thao tác đều diễn ra ở một đầu duy nhất, gọi là
<strong>đỉnh</strong>.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết ứng dụng minh hoạ cách một ngăn xếp hoạt động. Tạo lớp <code>MyStack</code> gồm:</p>
<p><strong>Thuộc tính</strong></p>
<ul><li><code>stackValues</code> — chứa các giá trị hiện có trong ngăn xếp.</li></ul>
<p><strong>Phương thức</strong></p>
<ul>
<li><code>push()</code> — đẩy một giá trị vào ngăn xếp.</li>
<li><code>pop()</code> — lấy ra (và xoá) giá trị ở đỉnh.</li>
<li><code>get()</code> — đọc giá trị đang ở đỉnh mà không xoá.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<ol>
<li><strong>Xây lớp MyStack.</strong> Lưu các phần tử trong <code>stackValues</code> (mảng hoặc
ArrayList). <code>push(value)</code> thêm giá trị vào đỉnh. <code>pop()</code> xoá và trả về giá trị ở
đỉnh, xử lý êm trường hợp ngăn xếp rỗng. <code>get()</code> trả về giá trị ở đỉnh mà không xoá (peek),
cũng phải xử lý trường hợp rỗng. Các thành viên phụ như <code>isEmpty()</code> và <code>size()</code>
sẽ giúp lớp dễ dùng hơn.</li>
<li><strong>Viết ứng dụng minh hoạ.</strong> Cung cấp một menu đơn giản cho phép người dùng push, pop,
get (peek) và hiển thị ngăn xếp, sao cho hành vi LIFO nhìn thấy được.</li>
</ol>
<h3>Màn hình mong đợi</h3>
<p>Một chương trình có menu. Ví dụ dưới đây đẩy vào ba giá trị, xem giá trị ở đỉnh, rồi lấy ra.</p>
<pre>======= STACK DEMO (MyStack) =======
1.Push   2.Pop   3.Get(peek)   4.Display   0.Exit
====================================</pre>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI6:
        s['problemVi'] = VI6[s['lab']]
