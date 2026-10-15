/**
 * PRO192 · Progress Test 1 viết lại — 20 câu (CLO1–7).
 * Quiz viết lại (20 câu, giữ slug pro192-progress-test-1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

/* ───────── Quiz (pro192-progress-test-1) — 20 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 1500,
  questions: [
    { id: 'q1',
      question: '(FE question type) Identifying and grouping only the attributes and actions of an entity that are relevant to the application at hand is called…|||(Dạng câu FE) Việc xác định và gom nhóm chỉ những thuộc tính và hành động của một thực thể mà ứng dụng đang xét cần đến được gọi là…',
      options: ['Encapsulation|||Đóng gói (encapsulation)', 'Inheritance|||Kế thừa (inheritance)', 'Polymorphism|||Đa hình (polymorphism)', 'Abstraction|||Trừu tượng hoá (abstraction)'],
      correctIndex: 3,
      points: 1,
      explanation: 'Abstraction is the modelling step: from everything a real student has (height, favourite food, student ID, GPA…) you keep only what FAP needs (ID, name, GPA) and the actions it needs (enroll, view marks). Encapsulation comes after: it hides the chosen fields (private) and exposes methods. A common FE trap is to swap the two — abstraction decides WHAT goes into the class, encapsulation decides WHO may touch it. Lesson 1.A.|||Trừu tượng hoá là bước mô hình hoá: từ mọi thứ một sinh viên thật có (chiều cao, món ăn yêu thích, mã sinh viên, GPA…) bạn chỉ giữ thứ FAP cần (mã, tên, GPA) và những hành động nó cần (đăng ký môn, xem điểm). Đóng gói đến sau: nó giấu các trường đã chọn (private) và mở ra các phương thức. Bẫy FE hay gặp là đảo hai khái niệm — trừu tượng hoá quyết định CÁI GÌ vào lớp, đóng gói quyết định AI được chạm vào. Bài 1.A.' },
    { id: 'q2',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `int[] a = {1, 2, 3, 4};
int b = 1;
a[b] = b = 3;
System.out.println(Arrays.toString(a));`,
      codeLang: 'java',
      options: ['[1, 2, 3, 3]|||[1, 2, 3, 3]', '[1, 3, 3, 4]|||[1, 3, 3, 4]', '[1, 2, 3, 4]|||[1, 2, 3, 4]', 'An ArrayIndexOutOfBoundsException|||Một ArrayIndexOutOfBoundsException'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: [1, 3, 3, 4]. Java evaluates the left operand of = first: a[b] is fixed as a[1] while b is still 1. Only then the right side runs: b = 3 stores 3 in b and its value (3) is stored in a[1]. Answer A would need the index to be read AFTER b changed (a[3] = 3), which Java never does (JLS 15.26.1). Lesson 1.D.|||Output của chương trình thật: [1, 3, 3, 4]. Java tính toán hạng bên trái của dấu = trước: a[b] được chốt là a[1] khi b còn bằng 1. Rồi mới chạy vế phải: b = 3 cất 3 vào b và giá trị của nó (3) được cất vào a[1]. Phương án A đòi chỉ số được đọc SAU khi b đã đổi (a[3] = 3), điều Java không bao giờ làm (JLS 15.26.1). Bài 1.D.' },
    { id: 'q3',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `int[] a = new int[5];
for (int i : a) {
    i = 1;
}
System.out.println(a[1]);`,
      codeLang: 'java',
      options: ['0|||0', '1|||1', 'null|||null', 'Something like [I@15db9742|||Một chuỗi kiểu [I@15db9742'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: 0. new int[5] fills the array with 0. In for (int i : a) the variable i receives a COPY of each element; i = 1 changes only that copy, never a[k]. To change the array you need an index: for (int k = 0; k < a.length; k++) a[k] = 1. null is the default of an OBJECT array, not of int[]; [I@… is what println(a) would print. Lesson 1.D.|||Output của chương trình thật: 0. new int[5] điền 0 vào cả mảng. Trong for (int i : a), biến i nhận một BẢN SAO của từng phần tử; i = 1 chỉ đổi bản sao đó, không bao giờ đổi a[k]. Muốn đổi mảng phải dùng chỉ số: for (int k = 0; k < a.length; k++) a[k] = 1. null là giá trị mặc định của mảng ĐỐI TƯỢNG, không phải của int[]; [I@… là thứ println(a) sẽ in ra. Bài 1.D.' },
    { id: 'q4',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `int marks = 10;
switch (marks) {
    default:
        System.out.print("A ");
    case 10:
        System.out.print("B ");
    case 100:
        System.out.print("C ");
}`,
      codeLang: 'java',
      options: ['A B C|||A B C', 'A|||A', 'B C|||B C', 'B|||B'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: "B C". switch jumps straight to the label that matches (case 10) — the position of default in the text does not matter, default runs only when NO case matches. There is no break, so execution falls through into case 100 and prints C too. With marks = 7 the output would be "A B C". In Java 8 a switch value may be byte, short, char, int, their wrappers, an enum or a String — never long, float, double or boolean. Lesson 1.D.|||Output của chương trình thật: "B C". switch nhảy thẳng tới nhãn khớp (case 10) — vị trí của default trong code không quan trọng, default chỉ chạy khi KHÔNG case nào khớp. Không có break, nên luồng chạy rơi xuống case 100 và in thêm C. Nếu marks = 7 thì output là "A B C". Trong Java 8, giá trị của switch được là byte, short, char, int, lớp bao của chúng, enum hoặc String — không bao giờ là long, float, double hay boolean. Bài 1.D.' },
    { id: 'q5',
      question: '(FE question type) What happens when this code runs?|||(Dạng câu FE) Điều gì xảy ra khi đoạn code chạy?',
      code: `Integer i = null;
if (i != null & i.intValue() == 5) System.out.println("Value is 5");`,
      codeLang: 'java',
      options: ['It prints nothing|||Không in gì', 'It prints Value is 5|||In ra Value is 5', 'Compile error: & cannot be applied to two booleans|||Lỗi biên dịch: & không dùng được cho hai boolean', 'A NullPointerException is thrown|||Ném ra NullPointerException'],
      correctIndex: 3,
      points: 1,
      explanation: 'The real program catches a NullPointerException. & on two booleans is legal, but it is the NON-short-circuit AND: it evaluates both sides even when the left one is already false. So i.intValue() runs on null — unboxing a null Integer throws. With && the right side would be skipped and the program would print nothing. Rule for PE code: always guard null checks with && (and || for "or"). Lesson 1.D.|||Chương trình thật bắt được một NullPointerException. & giữa hai boolean là hợp lệ, nhưng đó là phép AND KHÔNG đoản mạch: nó tính cả hai vế kể cả khi vế trái đã false. Vì vậy i.intValue() chạy trên null — mở hộp một Integer null là ném ngoại lệ. Với && vế phải sẽ bị bỏ qua và chương trình không in gì. Luật cho code PE: luôn canh kiểm tra null bằng && (và || cho phép "hoặc"). Bài 1.D.' },
    { id: 'q6',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `StringBuilder s = new StringBuilder("123456789");
s.delete(0, 3).replace(1, 3, "24");
System.out.println(s);`,
      codeLang: 'java',
      options: ['424789|||424789', '456789|||456789', '42489|||42489', '124456789|||124456789'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: 424789. Unlike String, a StringBuilder is mutable: delete(0, 3) removes indexes 0..2 from the SAME object ("456789") and returns that object, so replace(1, 3, "24") works on it and replaces indexes 1..2 ("56") with "24". The end index is exclusive in both calls — that is why C (which replaces 5, 6 and 7) is wrong. D is what you would get if delete returned a copy that was thrown away. Lesson 1.F.|||Output của chương trình thật: 424789. Khác String, StringBuilder là khả biến: delete(0, 3) xoá chỉ số 0..2 trên CHÍNH đối tượng đó ("456789") rồi trả lại đối tượng ấy, nên replace(1, 3, "24") làm việc trên nó và thay chỉ số 1..2 ("56") bằng "24". Chỉ số cuối KHÔNG tính ở cả hai lời gọi — vì thế C (thay cả 5, 6 và 7) sai. D là kết quả nếu delete trả về một bản sao rồi bị vứt đi. Bài 1.F.' },
    { id: 'q7',
      question: '(FE question type) What is the result of compiling and running this class?|||(Dạng câu FE) Biên dịch và chạy lớp này cho kết quả gì?',
      code: `public class Test {
    int x = 5;
    int y = 2;
    public static void main(String[] args) {
        Test obj;
        obj.x = 10;
        obj.y = 20;
        System.out.println(obj.x + obj.y);
    }
}`,
      codeLang: 'java',
      options: ['30|||30', '7|||7', 'Compile error: variable obj might not have been initialized|||Lỗi biên dịch: variable obj might not have been initialized', 'A NullPointerException at run time|||Một NullPointerException lúc chạy'],
      correctIndex: 2,
      points: 1,
      explanation: 'Measured with the real JDK 8 javac: "variable obj might not have been initialized". Test obj; only declares a LOCAL reference — no object exists, and unlike fields, local variables get no default value, so the compiler refuses to let you read obj. It is not a NullPointerException: that needs obj = null; first (then it compiles and crashes at run time). Fix: Test obj = new Test(); and the output becomes 30. Lesson 2.B.|||Đo bằng javac JDK 8 thật: "variable obj might not have been initialized". Test obj; chỉ khai báo một tham chiếu CỤC BỘ — chưa có đối tượng nào, và khác với trường, biến cục bộ không có giá trị mặc định, nên trình biên dịch không cho đọc obj. Đây không phải NullPointerException: muốn thế phải viết obj = null; trước (khi đó biên dịch được và sập lúc chạy). Sửa: Test obj = new Test(); và output thành 30. Bài 2.B.' },
    { id: 'q8',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `public class Q8 {
    private static int x = 100;

    public static void main(String[] args) {
        Q8 t = new Q8();
        t.x++;
        Q8 h = new Q8();
        h.x++;
        h = new Q8();
        h.x++;
        Q8.x++;
        System.out.println("x = " + x);
    }
}`,
      codeLang: 'java',
      options: ['x = 101|||x = 101', 'x = 104|||x = 104', 'x = 102|||x = 102', 'Compile error: a private static field cannot be used through an object|||Lỗi biên dịch: không dùng được trường private static qua đối tượng'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: "x = 104". A static field belongs to the CLASS: there is one x, whatever reference you write in front of it. t.x++, h.x++ (two different objects) and Q8.x++ all increment the same variable: 100 + 4. private is not a problem because main is inside the same class. Writing t.x compiles but hides the truth — good style is Q8.x. Lesson 2.B (static).|||Output của chương trình thật: "x = 104". Trường static thuộc về LỚP: chỉ có một x, bất kể bạn viết tham chiếu nào phía trước. t.x++, h.x++ (hai đối tượng khác nhau) và Q8.x++ đều tăng cùng một biến: 100 + 4. private không gây vấn đề vì main nằm trong chính lớp đó. Viết t.x vẫn biên dịch được nhưng che mất bản chất — viết đúng kiểu là Q8.x. Bài 2.B (static).' },
    { id: 'q9',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `class StaticTest {
    static void staticMethod() {
        System.out.println("Static Method");
    }
}
public class Q9 {
    public static void main(String[] args) {
        StaticTest first = null;
        first.staticMethod();
    }
}`,
      codeLang: 'java',
      options: ['Static Method|||Static Method', 'A NullPointerException is thrown|||Ném ra NullPointerException', 'null|||null', 'Compile error: cannot call a method on null|||Lỗi biên dịch: không gọi được phương thức trên null'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: "Static Method". For a static method the compiler only looks at the DECLARED type of first (StaticTest) and turns the call into StaticTest.staticMethod(); the value of the reference is never used, so null does no harm. Calling an INSTANCE method through first would throw a NullPointerException. This is the same rule that makes static methods "hidden, not overridden" (Chapter 4 quiz). Lesson 2.B.|||Output của chương trình thật: "Static Method". Với phương thức static, trình biên dịch chỉ nhìn KIỂU KHAI BÁO của first (StaticTest) và biến lời gọi thành StaticTest.staticMethod(); giá trị của tham chiếu không bao giờ được dùng, nên null vô hại. Gọi một phương thức THỂ HIỆN qua first thì mới ném NullPointerException. Đây cũng là luật khiến phương thức static "bị che giấu chứ không bị ghi đè" (quiz Chương 4). Bài 2.B.' },
    { id: 'q10',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `class Van {
    String driver;
    int rate;
    Van() { driver = "unknown"; rate = 5; }
    Van(String driver, int rate) { this.driver = driver; this.rate = rate; }
    public String toString() { return driver + "," + rate; }
}
class SpecVan extends Van {
    int type;
    SpecVan() { }
    SpecVan(String driver, int rate, int type) {
        super(driver, rate);
        this.type = type;
    }
    void display() { System.out.print("(" + super.toString() + "," + type + ") "); }
}
public class Q10 {
    public static void main(String[] args) {
        new SpecVan().display();
        new SpecVan("Hoa", 20, 10).display();
    }
}`,
      codeLang: 'java',
      options: ['(null,0,0) (Hoa,20,10)|||(null,0,0) (Hoa,20,10)', '(unknown,5,5) (Hoa,20,10)|||(unknown,5,5) (Hoa,20,10)', 'Compile error: SpecVan() must call super() explicitly|||Lỗi biên dịch: SpecVan() phải gọi super() tường minh', '(unknown,5,0) (Hoa,20,10)|||(unknown,5,0) (Hoa,20,10)'],
      correctIndex: 3,
      points: 1,
      explanation: "Output of the real program: \"(unknown,5,0) (Hoa,20,10)\". The empty constructor SpecVan() { } gets an invisible super(); as its first line, so Van() runs and sets \"unknown\" and 5; type keeps its default 0. The second object goes through super(driver, rate). super.toString() calls the parent's version, which prints driver and rate. The FE bank shows this question with main() and the options cut off — here the program is complete and was run for real. Lesson 2.B and 4.A.|||Output của chương trình thật: \"(unknown,5,0) (Hoa,20,10)\". Constructor rỗng SpecVan() { } được chèn ngầm super(); làm dòng đầu, nên Van() chạy và gán \"unknown\" và 5; type giữ giá trị mặc định 0. Đối tượng thứ hai đi qua super(driver, rate). super.toString() gọi bản của lớp cha, in driver và rate. Ngân hàng FE chụp câu này bị cắt mất main() và các phương án — ở đây chương trình được viết đủ và chạy thật. Bài 2.B và 4.A." },
    { id: 'q11',
      question: '(FE question type) Which statement about this class is true?|||(Dạng câu FE) Phát biểu nào về lớp này là đúng?',
      code: `public class CreditCard {
    private String cardID;
    private Integer limit;
    public String ownerName;

    public void setCardInformation(String cardID, String ownerName, Integer limit) {
        this.cardID = cardID;
        this.ownerName = ownerName;
        this.limit = limit;
    }
}`,
      codeLang: 'java',
      options: ['The class is fully encapsulated|||Lớp đã được đóng gói hoàn toàn', 'The code demonstrates polymorphism|||Đoạn code minh hoạ đa hình', 'ownerName breaks encapsulation: any code can change it without going through a method|||ownerName phá vỡ đóng gói: code nào cũng đổi được nó mà không qua phương thức', 'cardID and limit break encapsulation because they have no getters|||cardID và limit phá vỡ đóng gói vì không có getter'],
      correctIndex: 2,
      points: 1,
      explanation: "A field is encapsulated when it is private and can only be changed through the class's own methods, which can check the value. ownerName is public, so card.ownerName = \"\" compiles anywhere and skips every rule. cardID and limit are private — having no getter makes them write-only from outside, which is a design choice, not a leak. Nothing here is polymorphism (no subclass, no overriding). Lesson 3.A.|||Một trường được đóng gói khi nó private và chỉ đổi được qua phương thức của chính lớp đó — nơi có thể kiểm giá trị. ownerName là public, nên card.ownerName = \"\" biên dịch được ở bất kỳ đâu và bỏ qua mọi luật. cardID và limit là private — không có getter chỉ khiến bên ngoài ghi được mà không đọc được, đó là lựa chọn thiết kế, không phải rò rỉ. Ở đây không có gì là đa hình (không lớp con, không ghi đè). Bài 3.A." },
    { id: 'q12',
      question: 'What is printed?|||Đoạn code in ra gì?',
      code: `final StringBuilder sb = new StringBuilder("Java");
sb.append(" 8");
System.out.println(sb);`,
      codeLang: 'java',
      options: ['Java|||Java', 'Java 8|||Java 8', 'Compile error: cannot assign a value to final variable sb|||Lỗi biên dịch: cannot assign a value to final variable sb', 'An UnsupportedOperationException is thrown|||Ném ra UnsupportedOperationException'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: "Java 8". final makes the VARIABLE sb unchangeable — sb = new StringBuilder("C"); would not compile — but the object it refers to can still change through its methods. So "a final variable is a constant" (an FE answer) is only true for primitives and for immutable objects such as String. This is why an encapsulated class must not hand out its final List field: the caller can still add to it. Lesson 3.A.|||Output của chương trình thật: "Java 8". final làm BIẾN sb không đổi được — sb = new StringBuilder("C"); sẽ không biên dịch — nhưng đối tượng nó trỏ tới vẫn đổi được qua phương thức của nó. Vì vậy câu "biến final là hằng số" (một đáp án FE) chỉ đúng với kiểu nguyên thủy và đối tượng bất biến như String. Đó cũng là lý do một lớp đóng gói không được trao ra ngoài trường List final của mình: bên gọi vẫn add thêm vào được. Bài 3.A.' },
    { id: 'q13',
      question: '(FE question type) What is the result of compiling and running this code?|||(Dạng câu FE) Biên dịch và chạy đoạn code này cho kết quả gì?',
      code: `class Vase {
    String color;
    int price;
    Vase() { price = 5; }
    Vase(String color, int price) { this.color = color; this.price = price; }
}
class SpecVase extends Vase {
    int type;
    SpecVase(String color, int price, int type) {
        this.type = type;
        super(color, price);
    }
}
public class Main {
    public static void main(String[] args) {
        System.out.println(new SpecVase("Hoa", 20, 10).type);
    }
}`,
      codeLang: 'java',
      options: ['Compile error: call to super must be first statement in constructor|||Lỗi biên dịch: call to super must be first statement in constructor', '10|||10', '0|||0', 'A RuntimeException: the parent constructor runs twice|||Một RuntimeException: constructor cha chạy hai lần'],
      correctIndex: 0,
      points: 1,
      explanation: 'Measured with the real JDK 8 javac: "call to super must be first statement in constructor". The parent part of an object must be built before the child touches anything, so super(...) (or this(...)) may only be the very first statement. Because the explicit call is not first, javac does not silently insert super() either — it simply refuses. Fix: swap the two lines. Lesson 4.A.|||Đo bằng javac JDK 8 thật: "call to super must be first statement in constructor". Phần cha của đối tượng phải được dựng xong trước khi lớp con chạm vào bất cứ thứ gì, nên super(...) (hoặc this(...)) chỉ được là câu lệnh đầu tiên. Vì lời gọi tường minh không đứng đầu, javac cũng không lặng lẽ chèn super() — nó từ chối luôn. Sửa: đổi chỗ hai dòng. Bài 4.A.' },
    { id: 'q14',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `class Person {
    protected int age;
    protected void setAge(int val) { age = val; }
}
class Professor extends Person {
    String specialization;
    Professor(String val) { specialization = val; }
}
public class Q14 {
    public static void main(String[] args) {
        Professor p1 = new Professor("Binh");
        Professor p2 = new Professor("Huong");
        p1.setAge(40);
        System.out.println(p2.specialization + ":" + p1.age + " " + p1.specialization + ":" + p2.age);
    }
}`,
      codeLang: 'java',
      options: ['Huong:0 Binh:40|||Huong:0 Binh:40', 'Huong:40 Binh:40|||Huong:40 Binh:40', 'Binh:40 Huong:0|||Binh:40 Huong:0', 'Huong:40 Binh:0|||Huong:40 Binh:0'],
      correctIndex: 3,
      points: 1,
      explanation: "Output of the real program: \"Huong:40 Binh:0\". Inheritance copies the DECLARATION of age into Professor, not one shared value: p1 and p2 each have their own age. Only p1.setAge(40) ran, so p1.age is 40 and p2.age keeps the default 0. Read the print statement slowly — it prints p2's name with p1's age, then p1's name with p2's age; that is the whole trick of this FE question. B would be true only if age were static. Lesson 4.A.|||Output của chương trình thật: \"Huong:40 Binh:0\". Kế thừa chép KHAI BÁO của age sang Professor, không phải một giá trị dùng chung: p1 và p2 mỗi đối tượng có age riêng. Chỉ p1.setAge(40) được gọi, nên p1.age là 40 còn p2.age giữ mặc định 0. Đọc chậm câu in — nó in tên của p2 kèm tuổi của p1, rồi tên của p1 kèm tuổi của p2; đó là toàn bộ cái bẫy của câu FE này. B chỉ đúng nếu age là static. Bài 4.A." },
    { id: 'q15',
      question: '(FE question type) "______ is applied within one class. ______ is applied in a class hierarchy." Fill in the blanks.|||(Dạng câu FE) "______ được áp dụng trong phạm vi một lớp. ______ được áp dụng trong một cây phân cấp lớp." Điền vào chỗ trống.',
      options: ['Method overriding, method overloading|||Ghi đè (overriding), nạp chồng (overloading)', 'Method overloading, method overriding|||Nạp chồng (overloading), ghi đè (overriding)', 'Encapsulation, abstraction|||Đóng gói, trừu tượng hoá', 'Method hiding, method generalization|||Che giấu phương thức, tổng quát hoá phương thức'],
      correctIndex: 1,
      points: 1,
      explanation: 'Overloading = several methods with the SAME name but DIFFERENT parameter lists, usually in one class (println(int), println(String)…); the compiler picks one from the argument types — compile-time polymorphism. Overriding = a subclass re-defines a method with the SAME signature it inherited, so it needs a parent and a child; the JVM picks the version from the real object — run-time polymorphism. Lesson 4.B.|||Nạp chồng (overloading) = nhiều phương thức CÙNG tên nhưng KHÁC danh sách tham số, thường trong một lớp (println(int), println(String)…); trình biên dịch chọn một bản theo kiểu đối số — đa hình lúc biên dịch. Ghi đè (overriding) = lớp con định nghĩa lại một phương thức CÙNG chữ ký mà nó kế thừa, nên cần có cha và con; JVM chọn bản theo đối tượng thật — đa hình lúc chạy. Bài 4.B.' },
    { id: 'q16',
      question: 'Which overload does each call choose? What is printed?|||Mỗi lời gọi chọn bản nạp chồng nào? Đoạn code in ra gì?',
      code: `public class Q16 {
    static void f(long x)    { System.out.print("long "); }
    static void f(Integer x) { System.out.print("Integer "); }
    static void f(Object x)  { System.out.print("Object "); }

    public static void main(String[] args) {
        int i = 5;
        f(i);
        f('p');
        f(5.0);
    }
}`,
      codeLang: 'java',
      options: ['Integer Integer Object|||Integer Integer Object', 'long Object Object|||long Object Object', 'long long Object|||long long Object', 'Compile error: ambiguous method call|||Lỗi biên dịch: lời gọi mơ hồ (ambiguous)'],
      correctIndex: 2,
      points: 1,
      explanation: "Output of the real program: \"long long Object\". javac chooses in phases (JLS 15.12.2): first without boxing — int widens to long, and char 'p' widens to long too, so both pick f(long) even though f(Integer) \"looks\" closer. 5.0 is a double: it cannot widen to long, so phase 2 boxes it to Double, which only fits f(Object). Same rule as the FE question where foo(char) picks foo(int) over foo(String). Lesson 4.B.|||Output của chương trình thật: \"long long Object\". javac chọn theo từng pha (JLS 15.12.2): pha đầu không đóng hộp — int nới rộng thành long, và char 'p' cũng nới rộng thành long, nên cả hai chọn f(long) dù f(Integer) \"trông\" gần hơn. 5.0 là double: không nới được thành long, nên pha 2 đóng hộp nó thành Double, và chỉ vừa f(Object). Cùng luật với câu FE foo(char) chọn foo(int) thay vì foo(String). Bài 4.B." },
    { id: 'q17',
      question: 'What is printed?|||Đoạn code in ra gì?',
      code: `class Animal {
    int id;
    Animal(int id) { this.id = id; }
    public boolean equals(Animal o) { return o != null && id == o.id; }
}
public class Q17 {
    public static void main(String[] args) {
        Animal a1 = new Animal(1001);
        Animal a2 = new Animal(1001);
        Object o = a2;
        System.out.println(a1.equals(a2) + " " + a1.equals(o));
    }
}`,
      codeLang: 'java',
      options: ['true false|||true false', 'true true|||true true', 'false false|||false false', 'false true|||false true'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: "true false". equals(Animal o) has a different parameter type from Object.equals(Object o), so it is a new OVERLOAD, not an override. a1.equals(a2) has an Animal argument and picks the new method (true). a1.equals(o) has an Object argument and picks the inherited Object.equals, which compares references (false). List.contains, HashSet and HashMap all call equals(Object), so they would never see your method (measured: contains returns false). Always write public boolean equals(Object o) with @Override — then javac catches this mistake. Lesson 4.B.|||Output của chương trình thật: "true false". equals(Animal o) có kiểu tham số khác Object.equals(Object o), nên nó là một bản NẠP CHỒNG mới, không phải ghi đè. a1.equals(a2) có đối số kiểu Animal nên chọn phương thức mới (true). a1.equals(o) có đối số kiểu Object nên chọn Object.equals kế thừa, so sánh tham chiếu (false). List.contains, HashSet và HashMap đều gọi equals(Object), nên chúng không bao giờ thấy phương thức của bạn (đo thật: contains trả false). Luôn viết public boolean equals(Object o) kèm @Override — khi đó javac bắt được lỗi này. Bài 4.B.' },
    { id: 'q18',
      question: '(FE question type, variant) Class Two adds no method at all. What happens?|||(Dạng câu FE, biến thể) Lớp Two không thêm phương thức nào. Điều gì xảy ra?',
      code: `interface A {
    void method();
}
class One {
    public void method() { System.out.println("Class One method"); }
}
class Two extends One implements A {
}
public class Q18 {
    public static void main(String[] args) {
        A a = new Two();
        a.method();
    }
}`,
      codeLang: 'java',
      options: ['Compile error: Two must implement method()|||Lỗi biên dịch: Two phải hiện thực method()', 'It compiles but prints nothing|||Biên dịch được nhưng không in gì', 'An AbstractMethodError at run time|||Một AbstractMethodError lúc chạy', 'Class One method|||Class One method'],
      correctIndex: 3,
      points: 1,
      explanation: 'Output of the real program: "Class One method". To implement interface A, Two needs a public method() — and it already HAS one, inherited from One. The interface does not care where the method was written. If One.method() were not public, javac 8 would refuse: "method() in One cannot implement method() in A … attempting to assign weaker access privileges; was public" (measured). Lesson 5.A.|||Output của chương trình thật: "Class One method". Để hiện thực interface A, Two cần một method() public — và nó ĐÃ CÓ, kế thừa từ One. Interface không quan tâm phương thức được viết ở đâu. Nếu One.method() không public, javac 8 sẽ từ chối: "method() in One cannot implement method() in A … attempting to assign weaker access privileges; was public" (đo thật). Bài 5.A.' },
    { id: 'q19',
      question: '(FE question type) Which is true? (1) An abstract class cannot have any final methods. (2) A final class may not have any abstract methods.|||(Dạng câu FE) Câu nào đúng? (1) Lớp abstract không thể có phương thức final nào. (2) Lớp final không thể có phương thức abstract nào.',
      options: ['Only statement 1|||Chỉ phát biểu 1', 'Both statement 1 and 2|||Cả phát biểu 1 và 2', 'Only statement 2|||Chỉ phát biểu 2', 'None of them|||Không phát biểu nào'],
      correctIndex: 2,
      points: 1,
      explanation: 'Both statements were tested with the real JDK 8 javac. An abstract class with a final method compiles: final simply means "subclasses keep this concrete method as it is" (the template-method pattern uses exactly that). A final class with an abstract method is rejected — "B is not abstract and does not override abstract method g() in B" — because nobody could ever subclass it to supply the body. The only illegal pair is abstract + final on the SAME member. Lesson 5.A.|||Cả hai phát biểu đã được thử bằng javac JDK 8 thật. Lớp abstract có phương thức final biên dịch được: final chỉ có nghĩa "lớp con giữ nguyên phương thức cụ thể này" (mẫu template method dùng đúng cách đó). Lớp final có phương thức abstract bị từ chối — "B is not abstract and does not override abstract method g() in B" — vì không ai kế thừa nó được để viết thân hàm. Cặp duy nhất không hợp lệ là abstract + final trên CÙNG một thành phần. Bài 5.A.' },
    { id: 'q20',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `interface Wage {
    default void notice() { System.out.print("Executing..."); }
    void increase();
}
class Employee implements Wage {
    private int salary = 1000;
    public void increase() { salary += 200; }
    int getSalary() { return salary; }
}
public class Q20 {
    public static void main(String[] args) {
        Employee e = new Employee();
        try {
            e.increase();
            System.out.print("Salary: " + e.getSalary() + " ");
        } catch (Exception ex) {
            System.out.print("Cannot increase. ");
        } finally {
            e.notice();
        }
    }
}`,
      codeLang: 'java',
      options: ['Salary: 1200|||Salary: 1200', 'Salary: 1200 Executing...|||Salary: 1200 Executing...', 'Compile error: Employee must implement notice()|||Lỗi biên dịch: Employee phải hiện thực notice()', 'Salary: 1000 Executing...|||Salary: 1000 Executing...'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: "Salary: 1200 Executing...". A Java 8 default method has a body, so a class that does not override it simply inherits it — only increase() is abstract and must be implemented. increase() adds 200, no exception happens, then finally always runs and calls the inherited notice(). Default methods are the Java 8 way to add a method to an interface without breaking every class that implements it. Lesson 5.A.|||Output của chương trình thật: "Salary: 1200 Executing...". Phương thức default của Java 8 có thân, nên lớp không ghi đè nó thì đơn giản là kế thừa nó — chỉ increase() là abstract và bắt buộc hiện thực. increase() cộng 200, không có ngoại lệ, rồi finally luôn chạy và gọi notice() kế thừa. Default method là cách Java 8 thêm phương thức vào một interface mà không làm hỏng mọi lớp đang hiện thực nó. Bài 5.A.' },
  ],
};

export default {
  quiz: QUIZ,
  quizDescription: 'Progress Test 1 viết lại: 20 câu theo dạng câu FE PRO192 phủ Chương 1–5 (CLO1–7), mỗi câu có giải thích song ngữ; câu "in ra gì" chạy thật trên JDK 8 và câu lỗi biên dịch đo bằng javac của JDK 8: trừu tượng hoá, thứ tự tính a[b] = b = 3, biến lặp for-each, switch rơi xuống, & không đoản mạch, StringBuilder, biến cục bộ chưa gán, trường static, gọi static qua null, chuỗi constructor, đóng gói, final với tham chiếu, super phải đứng đầu, trường kế thừa của từng đối tượng, nạp chồng và ghi đè, chọn bản nạp chồng, equals nạp chồng nhầm, interface thoả bằng phương thức kế thừa, abstract với final, và default method của Java 8.',
};
