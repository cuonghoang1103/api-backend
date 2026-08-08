/** "100 Ngày Java" — Ngày 5: Rẽ nhánh if / switch. */
export default {
  series: '100 NGÀY JAVA',
  day: 5,
  total: 100,
  titleLead: 'Java Day 5:',
  titleAccent: 'if · else · switch',
  subtitle: 'Cho chương trình biết chọn đường 🔀',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. if — else if — else 🔀',
      code: `if (diem >= 8.5)      return "Gioi";
else if (diem >= 7.0) return "Kha";
else if (diem >= 5.0) return "Trung binh";
else                  return "Yeu";`,
      notes: [
        { mark: 'ok', text: 'Chuỗi `else if` dừng ở nhánh **đúng đầu tiên** — nên thứ tự điều kiện quyết định kết quả' },
        { mark: 'no', text: 'Viết `if (diem >= 5)` trước `if (diem >= 8.5)` là mọi học sinh giỏi đều thành trung bình' },
      ],
    },
    {
      tone: 'pink',
      title: '2. BA CÁI BẪY ĐIỀU KIỆN 🪤',
      code: `if (a = 5)   ✗ lỗi dịch — Java cứu bạn (C thì không)
if (s == "Java")   ✗ so ĐỊA CHỈ, không so nội dung → Ngày 9
if (x > 0);        ✗ dấu ; nuốt mất thân if — luôn chạy khối dưới`,
      notes: [
        { mark: 'ok', text: 'So chuỗi bằng `.equals()`, không bao giờ bằng `==`' },
        { mark: 'dot', text: 'Luôn viết `{ }` kể cả một dòng — dấu `;` lạc chỗ là bug im lặng' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. switch KIỂU MŨI TÊN (Java 14+) ➡️',
      code: `String ten = switch (thu) {
    case 2 -> "Thu hai";
    case 3 -> "Thu ba";
    default -> "Khong ro";
};`,
      notes: [
        { mark: 'ok', text: 'Kiểu `->` **không rơi tầng**, trả thẳng giá trị — quên `break` không còn là lỗi được nữa' },
        { mark: 'dot', text: 'Kiểu `case 3:` cũ vẫn chạy, nhưng **thiếu `break` là rơi xuống nhánh dưới**' },
      ],
    },
    {
      tone: 'green',
      title: '4. TOÁN TỬ BA NGÔI & NGẮN MẠCH ⚡',
      code: `String kq = (diem >= 5) ? "Dau" : "Rot";   // if rút gọn

if (s != null && s.length() > 0)   // ✓ && NGẮN MẠCH: null thì dừng luôn
if (s.length() > 0 && s != null)   // ✗ nổ NullPointerException`,
      notes: [
        { mark: 'ok', text: '`&&` và `||` **ngắn mạch**: vế trái quyết định xong thì vế phải không chạy — đặt phép kiểm null lên trước' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Thứ tự `else if` quan trọng · luôn có `{}` · `switch ->` an toàn hơn' },
        { mark: 'next', text: '**Ngày 6**: vòng lặp — `for`, `while`, `do-while`' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '9.0 -> Gioi',
      '7.5 -> Kha',
      '4.0 -> Yeu',
      'switch 3 -> Thu ba',
    ],
  },

  verify: {
    className: 'D05',
    source: `public class D05 {
    static String xepLoai(double d) {
        if (d >= 8.5) return "Gioi";
        else if (d >= 7.0) return "Kha";
        else if (d >= 5.0) return "Trung binh";
        else return "Yeu";
    }
    public static void main(String[] args) {
        System.out.println("9.0 -> " + xepLoai(9.0));
        System.out.println("7.5 -> " + xepLoai(7.5));
        System.out.println("4.0 -> " + xepLoai(4.0));
        int thu = 3;
        String ten = switch (thu) {
            case 2 -> "Thu hai";
            case 3 -> "Thu ba";
            default -> "Khong ro";
        };
        System.out.println("switch 3 -> " + ten);
    }
}`,
  },
};
