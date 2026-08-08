/** "100 Ngày Java" — Ngày 4: Nhập & xuất. */
export default {
  series: '100 NGÀY JAVA',
  day: 4,
  total: 100,
  titleLead: 'Java Day 4:',
  titleAccent: 'Nhập & Xuất',
  subtitle: 'Scanner, printf, và cái bẫy "1 + 2 = 12" ⌨️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. Scanner — ĐỌC TỪ BÀN PHÍM ⌨️',
      code: `import java.util.Scanner;      // BẮT BUỘC, để ở đầu file

Scanner sc = new Scanner(System.in);
System.out.print("Ten: ");
String ten = sc.nextLine();
System.out.print("Tuoi: ");
int tuoi = sc.nextInt();`,
      notes: [
        { mark: 'dot', text: '`nextLine()` đọc **cả dòng**; `nextInt()` chỉ đọc **con số**, bỏ lại dấu xuống dòng' },
      ],
    },
    {
      tone: 'pink',
      title: '2. BẪY KINH ĐIỂN: nextInt RỒI nextLine 🪤',
      code: `int tuoi = sc.nextInt();
String ten = sc.nextLine();   // ✗ nhận CHUỖI RỖNG, không kịp gõ!

// Cách sửa: ăn nốt dấu xuống dòng còn sót
int tuoi = sc.nextInt();
sc.nextLine();                // ← dòng cứu mạng
String ten = sc.nextLine();   // ✓`,
      notes: [
        { mark: 'no', text: '`nextInt()` **không** nuốt ký tự xuống dòng, nên `nextLine()` ngay sau đó vớ luôn phần thừa' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. printf — IN CÓ ĐỊNH DẠNG 🖨️',
      code: `System.out.printf("%s, %d tuoi, diem %.2f%n", ten, tuoi, diem);
//                 ^chuỗi ^số nguyên  ^2 chữ số thập phân  ^xuống dòng
System.out.printf("|%-8s|%8s|%n", "trai", "phai");
//                  ^căn trái  ^căn phải (8 ký tự)`,
      notes: [
        { mark: 'ok', text: 'Dùng `%n` thay `\\n` — nó tự chọn đúng kiểu xuống dòng cho từng hệ điều hành' },
      ],
    },
    {
      tone: 'green',
      title: '4. DẤU + LÚC NỐI, LÚC CỘNG 🤔',
      code: `System.out.println("1 + 2 = " + 1 + 2);     // 1 + 2 = 12  ✗
System.out.println("1 + 2 = " + (1 + 2));   // 1 + 2 = 3   ✓`,
      notes: [
        { mark: 'no', text: 'Gặp `String` là `+` chuyển sang **nối chuỗi**, và nó chạy từ trái sang phải' },
        { mark: 'ok', text: 'Cứ **đóng ngoặc** phép tính khi nối vào chuỗi — miễn phải đoán' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`nextInt()` rồi phải `nextLine()` · `%n` thay `\\n` · đóng ngoặc phép tính' },
        { mark: 'next', text: '**Ngày 5**: `if` / `switch` — cho chương trình biết rẽ nhánh' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'noi chuoi: An 20',
      'printf   : An, 20 tuoi, diem 8.46',
      'can le   : |trai    |    phai|',
      '1 + 2 = 12   <- BAY: noi chuoi, khong cong',
      '1 + 2 = 3   <- dung ngoac moi cong',
    ],
  },

  verify: {
    className: 'D04',
    source: `public class D04 {
    public static void main(String[] args) {
        String ten = "An";
        int tuoi = 20;
        double diem = 8.456;
        System.out.println("noi chuoi: " + ten + " " + tuoi);
        System.out.printf("printf   : %s, %d tuoi, diem %.2f%n", ten, tuoi, diem);
        System.out.printf("can le   : |%-8s|%8s|%n", "trai", "phai");
        System.out.println("1 + 2 = " + 1 + 2 + "   <- BAY: noi chuoi, khong cong");
        System.out.println("1 + 2 = " + (1 + 2) + "   <- dung ngoac moi cong");
    }
}`,
  },
};
