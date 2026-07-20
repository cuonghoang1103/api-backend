# Part 4 — the menu loop, methods, and naming.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(5, 'The menu loop, methods, and naming',
         'Vòng lặp menu, chia hàm, và quy tắc đặt tên',
         'The shape 26 briefs are built around, plus the free marks in naming',
         'Khuôn hình mà 26 đề dùng chung, cộng phần điểm cho không ở cách đặt tên')

    p('<p>26 briefs are built around a menu. Write it once, correctly, and reuse the shape forever. '
      'The version below survives every input a marker will throw at it: a letter, an empty Enter, a '
      'number out of range.</p>',
      '<p>26 đề được xây quanh một cái menu. Hãy viết nó một lần cho đúng rồi dùng lại mãi mãi. Bản dưới '
      'đây sống sót trước mọi thứ người chấm gõ vào: một chữ cái, một phím Enter trống, một số ngoài '
      'khoảng.</p>')

    code('A menu loop that cannot crash', 'Vòng lặp menu không thể chết',
         """import java.util.Scanner;

public class MenuDemo {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        boolean running = true;

        while (running) {
            printMenu();
            String choice = sc.nextLine().trim();

            switch (choice) {
                case "1": System.out.println("Add");    break;
                case "2": System.out.println("Update"); break;
                case "3": System.out.println("Delete"); break;
                case "4": System.out.println("Search"); break;
                case "5": System.out.println("Display");break;
                case "6":
                    running = false;
                    System.out.println("Bye");
                    break;
                default:
                    System.out.println("Invalid choice, please enter 1-6.");
            }
        }
    }

    private static void printMenu() {
        System.out.println("===== MANAGEMENT PROGRAM =====");
        System.out.println("1. Add");
        System.out.println("2. Update");
        System.out.println("3. Delete");
        System.out.println("4. Search");
        System.out.println("5. Display");
        System.out.println("6. Exit");
        System.out.print("Choose: ");
    }
}""",
         src_vi="""import java.util.Scanner;

public class MenuDemo {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        boolean dangChay = true;

        while (dangChay) {
            inMenu();
            // Đọc bằng nextLine nên gõ chữ cái cũng không văng lỗi
            String chon = sc.nextLine().trim();

            switch (chon) {
                case "1": System.out.println("Them");    break;
                case "2": System.out.println("Sua");     break;
                case "3": System.out.println("Xoa");     break;
                case "4": System.out.println("Tim kiem");break;
                case "5": System.out.println("Hien thi");break;
                case "6":
                    dangChay = false;          // thoat vong lap, KHONG dung System.exit
                    System.out.println("Tam biet");
                    break;
                default:
                    // Nhanh nay bat MOI thu con lai: chu cai, Enter trong, so ngoai khoang
                    System.out.println("Lua chon khong hop le, moi nhap 1-6.");
            }
        }
    }

    private static void inMenu() {
        System.out.println("===== CHUONG TRINH QUAN LY =====");
        System.out.println("1. Them");
        System.out.println("2. Sua");
        System.out.println("3. Xoa");
        System.out.println("4. Tim kiem");
        System.out.println("5. Hien thi");
        System.out.println("6. Thoat");
        System.out.print("Chon: ");
    }
}""")

    p('<p>Three deliberate decisions in that code, and each one is a likely defence question:</p>',
      '<p>Ba quyết định có chủ ý trong đoạn code trên, và mỗi cái đều có thể thành câu hỏi vấn đáp:</p>')

    ul(['<strong>The choice is read as a <code>String</code>, not an <code>int</code>.</strong> '
        'Typing a letter into <code>nextInt()</code> throws <code>InputMismatchException</code> and, '
        'worse, leaves the bad text in the buffer so the next loop spins forever.',
        '<strong>Exit is a <code>boolean</code> flag, not <code>System.exit(0)</code>.</strong> '
        '<code>System.exit</code> kills the JVM immediately — any "save to file before quitting" step '
        'never runs.',
        '<strong><code>default</code> catches everything else.</strong> There is no input that falls '
        'through without a message.'],
       ['<strong>Lựa chọn được đọc dưới dạng <code>String</code>, không phải <code>int</code>.</strong> '
        'Gõ chữ cái vào <code>nextInt()</code> sẽ ném <code>InputMismatchException</code>, và tệ hơn, nó '
        'để lại đoạn text hỏng trong bộ đệm khiến vòng lặp sau quay vô tận.',
        '<strong>Thoát bằng cờ <code>boolean</code>, không dùng <code>System.exit(0)</code>.</strong> '
        '<code>System.exit</code> giết JVM ngay lập tức — mọi bước "lưu ra tệp trước khi thoát" sẽ không '
        'bao giờ chạy.',
        '<strong><code>default</code> hứng mọi trường hợp còn lại.</strong> Không có đầu vào nào lọt qua '
        'mà không có thông báo.'])

    h('Why a 300-line main fails even when it works',
      'Vì sao hàm main dài 300 dòng vẫn trượt dù chạy đúng')

    p('<p>The briefs from 100 LOC upward say things like <em>"Student must implement methods: '
      'inputPersonInfo, displayPersonInfo, sortBySalary"</em>. That is not a style suggestion — the '
      'marker looks for those methods by name. Beyond that, methods are what make the oral defence '
      'survivable: you can explain a 12-line method; nobody can explain line 217 of a 300-line '
      '<code>main</code>.</p>',
      '<p>Các đề từ 100 LOC trở lên viết những câu như <em>"Student must implement methods: '
      'inputPersonInfo, displayPersonInfo, sortBySalary"</em>. Đó không phải gợi ý về phong cách — người '
      'chấm sẽ tìm đúng các hàm đó theo tên. Ngoài ra, chia hàm là thứ giúp bạn sống sót ở phần vấn đáp: '
      'bạn giải thích được một hàm 12 dòng; không ai giải thích nổi dòng thứ 217 của một hàm '
      '<code>main</code> dài 300 dòng.</p>')

    table(['A method should…', 'Concretely'],
          ['Một hàm nên…', 'Cụ thể là'],
          [['do one thing', 'its name is a verb phrase with no "and" in it'],
           ['be short', 'if it does not fit on one screen, split it'],
           ['take what it needs', 'pass parameters instead of reading global state'],
           ['return a result', 'rather than printing from deep inside the logic']],
          [['làm đúng một việc', 'tên của nó là một cụm động từ, không chứa chữ "và"'],
           ['ngắn gọn', 'nếu không vừa một màn hình thì tách ra'],
           ['nhận đúng thứ nó cần', 'truyền tham số thay vì đọc biến toàn cục'],
           ['trả về kết quả', 'thay vì in ra ngay từ trong lõi xử lý']])

    h('Naming: the free marks', 'Quy tắc đặt tên: điểm cho không')

    p('<p>Java has one universal convention. Following it costs nothing and its absence is the first '
      'thing a marker notices.</p>',
      '<p>Java có một bộ quy ước chung. Tuân theo nó không tốn gì cả, còn việc không tuân theo là thứ đầu '
      'tiên người chấm nhìn thấy.</p>')

    table(['Thing', 'Style', 'Good', 'Bad'],
          ['Đối tượng', 'Kiểu viết', 'Nên', 'Không nên'],
          [['class', '<code>PascalCase</code>, a noun', '<code>Doctor</code>, <code>DoctorManager</code>',
            '<code>doctor</code>, <code>quanly</code>'],
           ['method', '<code>camelCase</code>, a verb', '<code>addDoctor()</code>, <code>isValidId()</code>',
            '<code>Add()</code>, <code>x1()</code>'],
           ['variable', '<code>camelCase</code>, a noun', '<code>doctorList</code>, <code>totalSalary</code>',
            '<code>a</code>, <code>list1</code>, <code>tam</code>'],
           ['constant', '<code>UPPER_SNAKE</code>', '<code>MAX_SIZE</code>, <code>DATE_PATTERN</code>',
            '<code>maxSize</code>'],
           ['package', 'all lowercase', '<code>doctormanagement</code>', '<code>DoctorManagement</code>'],
           ['boolean', 'reads as a question', '<code>isDead</code>, <code>hasLicense</code>',
            '<code>flag</code>, <code>check</code>']],
          [['lớp', '<code>PascalCase</code>, là danh từ', '<code>Doctor</code>, <code>DoctorManager</code>',
            '<code>doctor</code>, <code>quanly</code>'],
           ['phương thức', '<code>camelCase</code>, là động từ', '<code>addDoctor()</code>, <code>isValidId()</code>',
            '<code>Add()</code>, <code>x1()</code>'],
           ['biến', '<code>camelCase</code>, là danh từ', '<code>doctorList</code>, <code>totalSalary</code>',
            '<code>a</code>, <code>list1</code>, <code>tam</code>'],
           ['hằng số', '<code>UPPER_SNAKE</code>', '<code>MAX_SIZE</code>, <code>DATE_PATTERN</code>',
            '<code>maxSize</code>'],
           ['package', 'viết thường hết', '<code>doctormanagement</code>', '<code>DoctorManagement</code>'],
           ['biến boolean', 'đọc lên như một câu hỏi', '<code>isDead</code>, <code>hasLicense</code>',
            '<code>flag</code>, <code>check</code>']])

    p('<p>Write identifiers in English even if you think in Vietnamese. Mixed <code>danhSachDoctor</code> '
      'reads badly to everyone, and the briefs themselves name the methods in English.</p>',
      '<p>Hãy đặt tên định danh bằng tiếng Anh dù bạn nghĩ bằng tiếng Việt. Kiểu lai '
      '<code>danhSachDoctor</code> đọc lên khó chịu với tất cả mọi người, và bản thân đề bài cũng đặt tên '
      'hàm bằng tiếng Anh.</p>')

    practice([
        (248, 'Control flow and methods', 'Điều khiển luồng và phương thức',
         'Loops, switch, and writing methods that do one thing — 10 exercises',
         'Vòng lặp, switch, và viết hàm chỉ làm một việc — 10 bài'),
    ])
