# Part 7b — the class mechanics the first pass assumed you knew.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(8, 'Classes: constructors, this, static, access',
         'Lớp: constructor, this, static, phạm vi truy cập',
         'The plumbing under the four pillars — and the questions about it',
         'Phần khung sườn nằm dưới bốn tính chất — và những câu hỏi về nó')

    p('<p>Before the four pillars there is the plumbing. These three words come up in almost every '
      'oral, usually as "why did you write it this way".</p>',
      '<p>Trước bốn tính chất là phần khung sườn. Ba từ này xuất hiện ở gần như mọi buổi vấn đáp, thường '
      'dưới dạng câu hỏi "sao em viết thế này".</p>')

    code('One class showing all three', 'Một lớp minh hoạ cả ba',
         """public class Student {

    private static int count = 0;      // ONE copy shared by every Student
    public static final String SCHOOL = "FPT";   // a constant

    private final String id;           // one copy PER object
    private String name;
    private double gpa;

    /** Full constructor. `this.name` is the field, `name` is the parameter. */
    public Student(String id, String name, double gpa) {
        this.id = id;
        this.name = name;
        this.gpa = gpa;
        count++;                       // static field, shared
    }

    /** Overloaded constructor: delegates, so the rules live in one place. */
    public Student(String id, String name) {
        this(id, name, 0.0);
    }

    public String getId()   { return id; }
    public String getName() { return name; }
    public double getGpa()  { return gpa; }

    public void setGpa(double gpa) {
        if (gpa < 0 || gpa > 4) {
            throw new IllegalArgumentException("GPA must be between 0 and 4");
        }
        this.gpa = gpa;                // the guard cannot be bypassed
    }

    /** static: belongs to the class, needs no object. */
    public static int getCount() {
        return count;
    }

    @Override
    public String toString() {
        return String.format("%s %s %.2f", id, name, gpa);
    }

    public static void main(String[] args) {
        Student a = new Student("SE001", "Tran Binh", 3.4);
        Student b = new Student("SE002", "Le Hoa");     // uses the overload

        System.out.println(a);
        System.out.println(b);
        System.out.println(Student.getCount());   // called on the CLASS
        System.out.println(Student.SCHOOL);

        try {
            b.setGpa(9);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        'SE001 Tran Binh 3.40\nSE002 Le Hoa 0.00\n2\nFPT\nGPA must be between 0 and 4')

    table(['Question they ask', 'The answer'],
          ['Câu họ hỏi', 'Trả lời'],
          [['Why <code>this.name = name</code>?',
            'the parameter hides the field; <code>this</code> says "the field of this object"'],
           ['Why is <code>count</code> <code>static</code>?',
            'there is one count for the whole class, not one per student'],
           ['Why does the short constructor call <code>this(...)</code>?',
            'so the initialisation rules exist in exactly one place'],
           ['Why is <code>id</code> <code>final</code>?',
            'an id must never change after creation — the compiler enforces it'],
           ['Why a setter for gpa but not for id?',
            'gpa changes and needs a guard; id does not change at all']],
          [['Sao phải viết <code>this.name = name</code>?',
            'tham số che mất trường; <code>this</code> nói rõ "trường của đối tượng này"'],
           ['Sao <code>count</code> để <code>static</code>?',
            'cả lớp chỉ có một biến đếm, không phải mỗi sinh viên một cái'],
           ['Sao constructor ngắn lại gọi <code>this(...)</code>?',
            'để luật khởi tạo chỉ nằm ở đúng một chỗ'],
           ['Sao <code>id</code> để <code>final</code>?',
            'mã định danh không được đổi sau khi tạo — trình biên dịch ép buộc điều đó'],
           ['Sao có setter cho gpa mà không có cho id?',
            'gpa thay đổi được và cần chốt chặn; id thì không đổi']])

    h('Access modifiers', 'Phạm vi truy cập')

    table(['Modifier', 'Visible to', 'Use it for'],
          ['Từ khoá', 'Ai thấy được', 'Dùng cho'],
          [['<code>private</code>', 'this class only', 'every field, always'],
           ['<em>(nothing)</em>', 'the same package', 'helper classes in small projects'],
           ['<code>protected</code>', 'the package and subclasses', 'something only subclasses should touch'],
           ['<code>public</code>', 'everyone', 'the methods that form the class\'s contract']],
          [['<code>private</code>', 'chỉ trong lớp này', 'mọi trường dữ liệu, luôn luôn'],
           ['<em>(để trống)</em>', 'cùng package', 'lớp tiện ích trong project nhỏ'],
           ['<code>protected</code>', 'cùng package và các lớp con', 'thứ chỉ lớp con được chạm vào'],
           ['<code>public</code>', 'mọi nơi', 'các phương thức tạo nên hợp đồng của lớp']])

    p('<p>The default habit: <strong>fields <code>private</code>, methods <code>public</code>, and '
      '<code>protected</code> only when a subclass genuinely needs it</strong> — as with '
      '<code>deathThreshold()</code> in the Bee hierarchy, which subclasses must supply but nothing '
      'outside should call.</p>',
      '<p>Thói quen mặc định: <strong>trường để <code>private</code>, phương thức để <code>public</code>, '
      'và chỉ dùng <code>protected</code> khi lớp con thật sự cần</strong> — như hàm '
      '<code>deathThreshold()</code> trong cây lớp Bee: lớp con bắt buộc phải cung cấp, còn bên ngoài thì '
      'không nên gọi.</p>')

    h('Overloading versus overriding — say it in one breath',
      'Overload và override — nói gọn trong một hơi')

    code('The two, side by side', 'Hai cái, đặt cạnh nhau',
         """class Calculator {
    // OVERLOADING: same name, different parameter lists, chosen at COMPILE time
    public int add(int a, int b)          { return a + b; }
    public double add(double a, double b) { return a + b; }
    public int add(int a, int b, int c)   { return a + b + c; }
}

class ScientificCalculator extends Calculator {
    // OVERRIDING: same signature as the parent, chosen at RUN time
    @Override
    public int add(int a, int b) {
        return super.add(a, b) * 1;      // super calls the parent version
    }
}

public class OverDemo {
    public static void main(String[] args) {
        Calculator c = new ScientificCalculator();   // declared parent, actual child
        System.out.println(c.add(2, 3));             // child's version runs
        System.out.println(c.add(2.5, 3.5));         // inherited overload
        System.out.println(c.add(1, 2, 3));
    }
}""")

    out('Real output', 'Kết quả chạy thật', '5\n6.0\n6')

    practice([
        (249, 'OOP fundamentals', 'Nền tảng hướng đối tượng',
         'Classes, constructors, encapsulation — 10 exercises + a deep lesson',
         'Lớp, constructor, đóng gói — 10 bài + bài giảng sâu'),
        (250, 'Inheritance, polymorphism, interfaces', 'Kế thừa, đa hình, interface',
         'The hierarchy skills the Shapes and Bees briefs test',
         'Đúng kỹ năng cây phân cấp mà đề Shapes và Bees kiểm tra'),
        ('overload-constructors-for-a-book-catalog-entry',
         'Exercise: overload constructors', 'Bài tập: nạp chồng constructor',
         'Exactly the this(...) delegation shown above',
         'Đúng kiểu uỷ quyền this(...) vừa trình bày ở trên'),
        ('model-a-2d-point-class', 'Exercise: model a class from scratch',
         'Bài tập: tự dựng một lớp từ đầu',
         'Fields, constructor, getters, toString — the whole shape',
         'Trường, constructor, getter, toString — đủ bộ khung'),
    ])
