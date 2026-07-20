# Batch 1 — the two smallest assignments, solved in the layout the user's own
# passing submissions used (entity / bo / utils / ui).
from solkit import solution

# ════════════════════════════════════════════════════════════════
# J1.S.P0060 — Calculate the total amount spent (21 LOC)
# ════════════════════════════════════════════════════════════════

P0060_WALLET = '''package entity;

/**
 * The user's wallet. It knows one thing — how much money is in it — and answers
 * one question: can this total be paid?
 *
 * The brief asks for the wallet to live INSIDE Person, which is composition:
 * a Person HAS-A Wallet. That is why there is no inheritance anywhere here.
 */
public class Wallet {

    private int amount;

    public Wallet(int amount) {
        this.amount = amount;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    /**
     * Required by the brief: public boolean payMoney(int total).
     *
     * Returns true when the wallet holds at least `total`. Note >= and not >:
     * paying exactly what you have is still paying.
     */
    public boolean payMoney(int total) {
        return amount >= total;
    }
}
'''

P0060_PERSON = '''package entity;

/**
 * The user. Owns a Wallet (composition) and can add up a set of bills.
 */
public class Person {

    private Wallet wallet;

    public Person(Wallet wallet) {
        this.wallet = wallet;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    /**
     * Required by the brief: public int calcTotal(int[] bills).
     *
     * A plain accumulator loop. It is deliberately NOT printing anything — the
     * screen belongs to the ui layer, so this method stays testable.
     */
    public int calcTotal(int[] bills) {
        int total = 0;
        for (int bill : bills) {
            total += bill;
        }
        return total;
    }
}
'''

P0060_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program goes through here, so no other class ever
 * has to think about what happens when the user types letters.
 *
 * One shared Scanner: opening a second one on System.in loses buffered input,
 * and closing one closes System.in for the rest of the program.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
        // utility class - never instantiated
    }

    /**
     * Reads an int inside [min, max]. Loops until the value is acceptable, so
     * the caller can assume the returned value is already valid.
     */
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

P0060_MAIN = '''package ui;

import entity.Person;
import entity.Wallet;
import utils.Validator;

/**
 * Screen and flow only. It reads the data, hands it to the entities, and prints
 * the answer — it contains no arithmetic and no rules of its own.
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("======= Shopping program ==========");

        int numberOfBill = Validator.getInt("input number of bill:", 1, 100);

        int[] bills = new int[numberOfBill];
        for (int i = 0; i < numberOfBill; i++) {
            bills[i] = Validator.getInt("input value of bill " + (i + 1) + ":", 0, 1000000000);
        }

        int walletAmount = Validator.getInt("input value of wallet:", 0, 1000000000);

        Person person = new Person(new Wallet(walletAmount));
        int total = person.calcTotal(bills);

        System.out.println("this is total of bill:" + total);
        if (person.getWallet().payMoney(total)) {
            System.out.println("You can buy it.");
        } else {
            System.out.println("You can't buy it.");
        }
    }
}
'''

solution(
    'J1.S.P0060',
    title_vi='Tính tổng tiền hoá đơn và kiểm tra ví có đủ trả không',
    files=[('src/entity/Wallet.java', P0060_WALLET),
           ('src/entity/Person.java', P0060_PERSON),
           ('src/utils/Validator.java', P0060_VALIDATOR),
           ('src/ui/Main.java', P0060_MAIN)],
    main_class='ui.Main',
    runs=[
        # enough money — the brief's own first screen
        ('2\n100\n200\n500\n',
         '======= Shopping program ==========\n'
         'input number of bill:input value of bill 1:input value of bill 2:'
         'input value of wallet:this is total of bill:300\nYou can buy it.'),
        # not enough — the brief's second screen
        ('2\n200\n200\n200\n',
         '======= Shopping program ==========\n'
         'input number of bill:input value of bill 1:input value of bill 2:'
         'input value of wallet:this is total of bill:400\nYou can\'t buy it.'),
        # the marker types letters where a number belongs
        ('2\nabc\n100\n200\n500\n',
         '======= Shopping program ==========\n'
         'input number of bill:input value of bill 1:You must input a number.\n'
         'input value of bill 1:input value of bill 2:input value of wallet:'
         'this is total of bill:300\nYou can buy it.'),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Two numbers decide everything:
the sum of the bills, and what is in the wallet. The interesting part is not the arithmetic — it is
that the brief dictates the class design: <em>"Designing class Wallet represented the user's wallet
within class Person"</em>. That sentence is asking for composition, a Person HAS-A Wallet, and it is
the first thing an examiner will point at.</p>
<p><strong>Why four files for 21 lines of logic.</strong> <code>Wallet</code> owns the money and the
one rule about it (<code>payMoney</code>). <code>Person</code> owns the wallet and the totalling
(<code>calcTotal</code>). <code>Validator</code> owns every keyboard read. <code>Main</code> owns the
screen. Each file has one reason to change, and you can explain any of them in a sentence — which is
exactly what the oral defence tests. There is deliberately no <code>bo</code> or
<code>controller</code> layer here: this program has no collection to manage, and adding empty layers
to look professional is the opposite of professional.</p>
<p><strong>The two required methods.</strong> The brief names them, so they must exist with those
exact signatures: <code>public int calcTotal(int[] bills)</code> and
<code>public boolean payMoney(int total)</code>. Neither prints anything. That is not decoration —
a method that prints cannot be reused or tested, and the marker can see at a glance that the logic is
separated from the screen.</p>
<p><strong>The decision worth defending.</strong> <code>payMoney</code> uses <code>&gt;=</code>, not
<code>&gt;</code>. Paying exactly what you have is still paying, so a wallet of 200 against a bill of
200 must succeed. Off-by-one thinking like this is where marks quietly disappear.</p>
<p><strong>What happens on bad input.</strong> Typing <code>abc</code> at any prompt prints
<em>You must input a number.</em> and asks again — the program never crashes, because
<code>Validator.getInt</code> does not return until it holds a real number.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Chỉ hai con số quyết định tất cả: tổng các hoá
đơn, và số tiền trong ví. Phần đáng chú ý không phải phép tính — mà là việc đề <em>áp đặt cách thiết
kế lớp</em>: <em>"Designing class Wallet represented the user's wallet within class Person"</em>. Câu
đó đang yêu cầu quan hệ thành phần (composition): một Person CÓ một Wallet, và đây là chỗ đầu tiên
giám khảo sẽ chỉ vào.</p>
<p><strong>Vì sao 21 dòng logic lại cần bốn file.</strong> <code>Wallet</code> giữ tiền và giữ luật
duy nhất về nó (<code>payMoney</code>). <code>Person</code> giữ ví và việc cộng tổng
(<code>calcTotal</code>). <code>Validator</code> giữ mọi thao tác đọc bàn phím. <code>Main</code> giữ
màn hình. Mỗi file chỉ có một lý do để phải sửa, và bạn giải thích được từng file trong một câu —
đúng thứ mà buổi vấn đáp kiểm tra. Ở đây <strong>cố ý không có</strong> tầng <code>bo</code> hay
<code>controller</code>: chương trình này không quản lý danh sách nào cả, mà thêm tầng rỗng cho ra vẻ
chuyên nghiệp thì lại là điều ngược với chuyên nghiệp.</p>
<p><strong>Hai phương thức bắt buộc.</strong> Đề gọi đích danh, nên chúng phải tồn tại đúng chữ ký:
<code>public int calcTotal(int[] bills)</code> và <code>public boolean payMoney(int total)</code>. Cả
hai đều không in ra gì. Đó không phải để làm đẹp — một phương thức có in ra thì không dùng lại và
không kiểm thử được, còn người chấm thì nhìn một cái là thấy logic đã tách khỏi màn hình.</p>
<p><strong>Quyết định đáng bảo vệ.</strong> <code>payMoney</code> dùng <code>&gt;=</code> chứ không
phải <code>&gt;</code>. Trả đúng bằng số tiền đang có thì vẫn là trả được, nên ví 200 với hoá đơn 200
phải cho kết quả mua được. Kiểu suy nghĩ lệch một đơn vị như thế chính là nơi điểm lặng lẽ bay
mất.</p>
<p><strong>Nhập sai thì sao.</strong> Gõ <code>abc</code> ở bất kỳ câu hỏi nào sẽ hiện
<em>You must input a number.</em> rồi hỏi lại — chương trình không bao giờ chết, vì
<code>Validator.getInt</code> không trả về cho tới khi cầm được một con số thật.</p>''',
    hints_en=[
        'Read the expected screen in the brief line by line first. Your output has to match it, including the colon with no space after it.',
        'The brief names two methods. Create them with exactly those signatures before you write anything else.',
        'Put the wallet inside Person as a field — that is what "within class Person" means.',
        'calcTotal is a plain accumulator over the array; payMoney is one comparison. Neither of them prints.',
    ],
    hints_vi=[
        'Đọc kỹ màn hình mẫu trong đề theo từng dòng trước đã. Kết quả của bạn phải khớp với nó, kể cả dấu hai chấm không có dấu cách phía sau.',
        'Đề gọi tên hai phương thức. Hãy tạo chúng đúng chữ ký đó trước khi viết bất cứ thứ gì khác.',
        'Đặt wallet thành một trường bên trong Person — đó chính là ý của cụm "within class Person".',
        'calcTotal chỉ là vòng lặp cộng dồn trên mảng; payMoney chỉ là một phép so sánh. Cả hai đều không in ra gì.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0063 — Input and display Person Info (25 LOC)
# ════════════════════════════════════════════════════════════════

P0063_PERSON = '''package entity;

/**
 * One person: name, address, salary.
 *
 * The brief asks for private fields plus get/set, which is encapsulation — the
 * outside world reaches the data only through methods, so a rule can be added
 * later without every caller having to change.
 */
public class Person {

    private String name;
    private String address;
    private double salary;

    public Person() {
    }

    public Person(String name, String address, double salary) {
        this.name = name;
        this.address = address;
        this.salary = salary;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    @Override
    public String toString() {
        return "Name:" + name + "\\nAddress:" + address + "\\nSalary:" + salary;
    }
}
'''

P0063_MANAGER = '''package bo;

import entity.Person;

/**
 * The three methods the brief names, and nothing else.
 *
 * None of them reads the keyboard. inputPersonInfo receives the three values as
 * TEXT and either returns a Person or throws — deciding what to say to the user
 * and when to ask again is the ui layer's job. That split is the whole reason
 * the brief specifies "throws Exception" instead of "print an error".
 */
public class PersonManager {

    /**
     * Required: Person inputPersonInfo(String name, String address, String sSalary) throws Exception
     *
     * The three exception messages are dictated by the brief, word for word.
     */
    public Person inputPersonInfo(String name, String address, String sSalary) throws Exception {
        if (sSalary == null || sSalary.trim().isEmpty()) {
            throw new Exception("You must input Salary.");
        }

        double salary;
        try {
            salary = Double.parseDouble(sSalary.trim());
        } catch (NumberFormatException e) {
            // Not a number at all - the brief's third message.
            throw new Exception("You must input digit.");
        }

        if (salary <= 0) {
            throw new Exception("Salary is greater than zero");
        }
        return new Person(name, address, salary);
    }

    /** Required: void displayPersonInfo(Person person) */
    public void displayPersonInfo(Person person) {
        System.out.println("Information of Person you have entered:");
        System.out.println(person);
    }

    /**
     * Required: Person[] sortBySalary(Person[] person), using bubble sort.
     *
     * The brief forbids the library sort by naming the algorithm. The `swapped`
     * flag lets an already-sorted array finish in one pass instead of n-1.
     */
    public Person[] sortBySalary(Person[] persons) {
        for (int i = 0; i < persons.length - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < persons.length - 1 - i; j++) {
                if (persons[j].getSalary() > persons[j + 1].getSalary()) {
                    Person temp = persons[j];
                    persons[j] = persons[j + 1];
                    persons[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
        return persons;
    }
}
'''

P0063_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /** Prints the prompt and returns the whole line, trimmed. */
    public static String getString(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }

    /** Non-empty text — used for name and address. */
    public static String getNonEmpty(String message, String error) {
        while (true) {
            String line = getString(message);
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println(error);
        }
    }
}
'''

P0063_MAIN = '''package ui;

import bo.PersonManager;
import entity.Person;
import utils.Validator;

/**
 * Screen and flow. It asks, it catches the exception the manager throws, it
 * prints the message, and it asks again — the retry loop lives here because
 * "ask again" is a user-interface decision, not a data rule.
 */
public class Main {

    private static final int SIZE = 3;

    public static void main(String[] args) {
        PersonManager manager = new PersonManager();
        Person[] persons = new Person[SIZE];

        System.out.println("=====Management Person programer=====");

        for (int i = 0; i < SIZE; i++) {
            System.out.println("Input Information of Person");
            String name = Validator.getNonEmpty("Please input name:", "You must input name.");
            String address = Validator.getNonEmpty("Please input address:", "You must input address.");

            // Only the salary is re-asked, because only the salary can be invalid.
            while (persons[i] == null) {
                String sSalary = Validator.getString("Please input salary:");
                try {
                    persons[i] = manager.inputPersonInfo(name, address, sSalary);
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
        }

        Person[] sorted = manager.sortBySalary(persons);
        for (Person person : sorted) {
            manager.displayPersonInfo(person);
        }
    }
}
'''

solution(
    'J1.S.P0063',
    title_vi='Nhập, hiển thị và sắp xếp thông tin Person theo lương',
    files=[('src/entity/Person.java', P0063_PERSON),
           ('src/bo/PersonManager.java', P0063_MANAGER),
           ('src/utils/Validator.java', P0063_VALIDATOR),
           ('src/ui/Main.java', P0063_MAIN)],
    main_class='ui.Main',
    runs=[
        # exactly the brief's screen: bad salary, negative salary, then valid
        ('NghiaNV\nHa Noi\nabc\n-2000\n2000\n'
         'LienVT\nHa Noi\n500\n'
         'TuanNT\nHa Noi\n1000\n',
         '=====Management Person programer=====\n'
         'Input Information of Person\n'
         'Please input name:Please input address:Please input salary:You must input digit.\n'
         'Please input salary:Salary is greater than zero\n'
         'Please input salary:Input Information of Person\n'
         'Please input name:Please input address:Please input salary:Input Information of Person\n'
         'Please input name:Please input address:Please input salary:'
         'Information of Person you have entered:\n'
         'Name:LienVT\nAddress:Ha Noi\nSalary:500.0\n'
         'Information of Person you have entered:\n'
         'Name:TuanNT\nAddress:Ha Noi\nSalary:1000.0\n'
         'Information of Person you have entered:\n'
         'Name:NghiaNV\nAddress:Ha Noi\nSalary:2000.0'),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Three people, three named
methods, and a sort you must write yourself. The subtle part is the signature the brief dictates:
<code>Person inputPersonInfo(String name, String address, String sSalary) throws Exception</code>.
The salary arrives as <em>text</em>, and the method <em>throws</em> instead of printing. That single
decision is the architecture of this program.</p>
<p><strong>Why throwing beats printing.</strong> <code>PersonManager</code> decides whether data is
valid; <code>Main</code> decides what to say and whether to ask again. Because the manager throws, it
never touches the screen, and you could reuse it unchanged in a program with a different interface.
If an examiner asks "why not just print the error inside the method", that is the answer — and it is
the reason the brief wrote <code>throws Exception</code> into the signature.</p>
<p><strong>The three messages are a contract.</strong> Empty gives <em>You must input Salary.</em>,
non-numeric gives <em>You must input digit.</em>, zero or negative gives <em>Salary is greater than
zero</em>. Those exact strings come from the Guidelines section, so they are copied literally,
including the full stops. Note the expected-screen picture in the same brief prints
<em>You must input digidt.</em> with a typo — the Guidelines text is the authoritative one, and it is
worth mentioning to your examiner that you noticed.</p>
<p><strong>Order of checks matters.</strong> Empty is tested first, then parsing, then the sign. Test
the sign first and <code>"abc"</code> would blow up inside <code>parseDouble</code> before your rule
ever ran.</p>
<p><strong>The sort.</strong> The brief names bubble sort, so <code>Collections.sort</code> would
score nothing. The inner loop stops at <code>length - 1 - i</code> because each pass parks one more
element at the end, and the <code>swapped</code> flag exits early when the array is already ordered.</p>
<p><strong>Only the salary is re-asked.</strong> The retry loop wraps the salary prompt alone, because
name and address cannot fail validation. Re-asking all three would not match the screen in the
brief.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Ba người, ba phương thức có tên sẵn, và một
thuật toán sắp xếp bạn phải tự viết. Phần tinh tế nằm ở chữ ký mà đề áp đặt:
<code>Person inputPersonInfo(String name, String address, String sSalary) throws Exception</code>.
Lương được truyền vào dưới dạng <em>chuỗi</em>, và phương thức <em>ném ngoại lệ</em> chứ không in ra.
Chỉ một quyết định đó đã định hình toàn bộ kiến trúc chương trình.</p>
<p><strong>Vì sao ném lỗi tốt hơn in lỗi.</strong> <code>PersonManager</code> quyết định dữ liệu có
hợp lệ hay không; <code>Main</code> quyết định nói gì với người dùng và có hỏi lại hay không. Vì lớp
manager ném ngoại lệ nên nó không hề chạm vào màn hình, và bạn có thể mang nguyên nó sang một chương
trình có giao diện khác. Nếu giám khảo hỏi "sao không in lỗi luôn trong hàm", đó chính là câu trả lời
— và cũng là lý do đề viết sẵn <code>throws Exception</code> vào chữ ký.</p>
<p><strong>Ba thông điệp là một hợp đồng.</strong> Bỏ trống thì <em>You must input Salary.</em>, không
phải số thì <em>You must input digit.</em>, bằng 0 hoặc âm thì <em>Salary is greater than zero</em>.
Ba chuỗi này lấy từ mục Guidelines nên phải chép đúng từng chữ, kể cả dấu chấm cuối câu. Để ý là ảnh
màn hình mong đợi trong chính đề đó lại in <em>You must input digidt.</em> — sai chính tả. Phần
Guidelines mới là bản có hiệu lực, và việc bạn phát hiện ra điểm vênh này đáng để nói với giám
khảo.</p>
<p><strong>Thứ tự kiểm tra rất quan trọng.</strong> Kiểm rỗng trước, rồi mới ép kiểu, rồi mới xét dấu.
Nếu xét dấu trước thì <code>"abc"</code> đã nổ ngay trong <code>parseDouble</code> trước khi luật của
bạn kịp chạy.</p>
<p><strong>Phần sắp xếp.</strong> Đề chỉ đích danh bubble sort, nên dùng <code>Collections.sort</code>
là không có điểm. Vòng lặp trong dừng ở <code>length - 1 - i</code> vì mỗi lượt lại đưa thêm một phần
tử về đúng chỗ ở cuối, còn cờ <code>swapped</code> giúp thoát sớm khi mảng đã có thứ tự.</p>
<p><strong>Chỉ hỏi lại phần lương.</strong> Vòng lặp thử lại chỉ bọc quanh câu hỏi lương, vì tên và
địa chỉ không có luật nào để sai. Hỏi lại cả ba sẽ không khớp với màn hình trong đề.</p>''',
    hints_en=[
        'Copy the three exception messages out of the Guidelines section character by character before writing any logic.',
        'Check empty first, then parse, then check the sign — that order matters.',
        'inputPersonInfo must not print anything: it returns a Person or throws.',
        'The retry loop belongs in Main, around the salary prompt only.',
    ],
    hints_vi=[
        'Chép ba thông điệp ngoại lệ từ mục Guidelines ra, đúng từng ký tự, trước khi viết bất kỳ logic nào.',
        'Kiểm rỗng trước, rồi ép kiểu, rồi mới xét dấu — thứ tự này quan trọng.',
        'inputPersonInfo tuyệt đối không in ra gì: nó trả về Person hoặc ném ngoại lệ.',
        'Vòng lặp hỏi lại nằm ở Main, và chỉ bọc quanh câu hỏi nhập lương.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────
# The English statement stays the source of truth (it is the sheet the marker
# reads). These are faithful translations, not summaries: every rule, message
# and screen line survives.
from solkit import SOLUTIONS

VI = {
 'J1.S.P0060': '''<p><strong>Short Assignment · J1.S.P0060 · 21 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Dữ liệu vào của chương trình là các hoá đơn của người dùng và số tiền trong ví của người đó.</p>
<ul>
<li>Tính số tiền người dùng đã tiêu.</li>
<li>So sánh số tiền phải trả cho các hoá đơn với số tiền trong ví để xem giao dịch có thực hiện được không.</li>
</ul>
<p>Chương trình được thiết kế như sau:</p>
<ul>
<li>Thiết kế lớp <code>Person</code> đại diện cho người dùng.</li>
<li>Thiết kế lớp <code>Wallet</code> đại diện cho ví tiền, nằm <strong>bên trong</strong> lớp <code>Person</code>.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình. Chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul><li>Chương trình tính tổng tiền các hoá đơn rồi so với số tiền trong ví để xem có đủ trả không.</li>
<li>Hiện thông báo rồi kết thúc chương trình.</li></ul>
<h3>Màn hình mong đợi</h3>
<pre>======= Shopping program ==========
input number of bill:2
input value of bill 1:100
input value of bill 2:200
input value of wallet:500
this is total of bill:300
You can buy it.</pre>
<pre>======= Shopping program ==========
input number of bill:2
input value of bill 1:200
input value of bill 2:200
input value of wallet:200
this is total of bill:400
You can't buy it.</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức <code>calcTotal</code> và
<code>payMoney</code>.</p>
<h4>Chức năng 1: Tính tổng tiền các hoá đơn</h4>
<p>Phải tạo hàm: <code>public int calcTotal(int[] bills)</code></p>
<ul><li>Vào: <code>bills</code> — các hoá đơn.</li>
<li>Trả về: tổng số tiền của các hoá đơn.</li></ul>
<h4>Chức năng 2: Kiểm tra ví có đủ tiền trả không</h4>
<p>Phải tạo hàm: <code>public boolean payMoney(int total)</code></p>
<ul><li>Vào: <code>total</code> — tổng tiền phải trả.</li>
<li>Trả về: <code>true</code> nếu ví đủ tiền, ngược lại <code>false</code>.</li></ul>''',

 'J1.S.P0063': '''<p><strong>Short Assignment · J1.S.P0063 · 25 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình cho phép người dùng nhập và sắp xếp thông tin người (tên, địa chỉ, lương).</p>
<ul>
<li>Kiểm tra lương có phải là số hay không.</li>
<li>Sắp xếp danh sách người theo lương tăng dần.</li>
<li>Hiển thị thông tin 3 người theo lương tăng dần.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình. Chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul><li>Chương trình hiển thị thông tin vừa nhập.</li>
<li>Sắp xếp danh sách theo lương tăng dần rồi kết thúc chương trình.</li></ul>
<h3>Màn hình mong đợi</h3>
<pre>=====Management Person programer=====
Input Information of Person
Please input name:NghiaNV
Please input address:Ha Noi
Please input salary:abc
You must input digit.
Please input salary:-2000
Salary is greater than zero
Please input salary:2000
Input Information of Person
Please input name:LienVT
Please input address:Ha Noi
Please input salary:500
Input Information of Person
Please input name:TuanNT
Please input address:Ha Noi
Please input salary:1000
Information of Person you have entered:
Name:LienVT
Address:Ha Noi
Salary:500.0
Information of Person you have entered:
Name:TuanNT
Address:Ha Noi
Salary:1000.0
Information of Person you have entered:
Name:NghiaNV
Address:Ha Noi
Salary:2000.0</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt <code>inputPersonInfo</code>,
<code>displayPersonInfo</code>, <code>sortBySalary</code>.</p>
<p>Tạo lớp <code>Person</code> với các thuộc tính <code>private String name;</code>,
<code>private String address;</code>, <code>private double salary;</code>; có constructor và
get/set.</p>
<h4>Chức năng 1: Nhập thông tin</h4>
<p><code>Person inputPersonInfo(String name, String address, String sSalary) throws Exception</code></p>
<ul>
<li>Trả về: đối tượng <code>Person</code>.</li>
<li><code>Exception("Salary is greater than zero")</code> — nếu lương &le; 0.</li>
<li><code>Exception("You must input Salary.")</code> — nếu bỏ trống.</li>
<li><code>Exception("You must input digit.")</code> — nếu không phải số.</li>
</ul>
<h4>Chức năng 2: Hiển thị thông tin</h4>
<p><code>void displayPersonInfo(Person person)</code> — in ra mọi thuộc tính của person.</p>
<h4>Chức năng 3: Sắp xếp</h4>
<p><code>Person[] sortBySalary(Person[] person)</code> — sắp theo lương tăng dần bằng
<strong>thuật toán BubbleSort</strong>. Tạo mảng 3 phần tử.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
