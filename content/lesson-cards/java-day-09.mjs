/** "100 Ngày Java" — Ngày 9: String & equals. Bài Ngày 11 trỏ ngược về đây. */
export default {
  series: '100 NGÀY JAVA',
  day: 9,
  total: 100,
  titleLead: 'Java Day 9:',
  titleAccent: 'String & equals',
  subtitle: 'Vì sao "Java" == "Java" đúng mà vẫn không được tin nó 🎭',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'pink',
      title: '1. == SO ĐỊA CHỈ · equals SO NỘI DUNG 🎭',
      code: `String x = "Java";
String y = "Java";
String z = new String("Java");

x == y        // true   ← cùng nằm trong String pool
x == z        // FALSE  ← z là đối tượng MỚI, khác ô nhớ
x.equals(z)   // true   ← so nội dung ✓`,
      notes: [
        { mark: 'no', text: 'Cái bẫy độc ở chỗ `==` **đôi khi đúng** — nên bug lọt qua mọi lần thử tay' },
        { mark: 'ok', text: 'Luôn dùng `.equals()`. So không phân biệt hoa thường thì `.equalsIgnoreCase()`' },
      ],
    },
    {
      tone: 'blue',
      title: '2. String BẤT BIẾN 🔒',
      code: `String s = "  Xin chao  ";
s.trim().toUpperCase();      // ✗ tính rồi VỨT — s không đổi
s = s.trim().toUpperCase();  // ✓ phải GÁN LẠI

System.out.println(s);       // "  Xin chao  " nếu không gán lại`,
      notes: [
        { mark: 'dot', text: 'Mọi method của `String` **trả về chuỗi mới**, không sửa chuỗi cũ' },
        { mark: 'ok', text: 'Nối chuỗi trong vòng lặp thì dùng `StringBuilder` — `+` tạo rác mỗi vòng' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. BỘ ĐỒ NGHỀ HAY DÙNG 🧰',
      code: `s.length()            // độ dài — CÓ ngoặc (mảng thì không)
s.charAt(0)           // ký tự tại vị trí
s.substring(0, 3)     // cắt [0, 3) — không lấy vị trí 3
s.indexOf("a")        // vị trí đầu tiên, -1 nếu không có
s.split(",")          // tách thành mảng
s.isBlank()           // rỗng hoặc toàn khoảng trắng`,
      notes: [
        { mark: 'dot', text: '`substring(0, 3)` là **nửa mở**: lấy 0,1,2 — cùng quy ước với mọi khoảng trong lập trình' },
      ],
    },
    {
      tone: 'green',
      title: '4. null KHÔNG PHẢI CHUỖI RỖNG ⚠️',
      code: `String s = null;
s.length();              // 💥 NullPointerException
"Java".equals(s)         // ✓ false — an toàn, không nổ
s.equals("Java")         // 💥 nổ
Objects.equals(a, b)     // ✓ chịu được null cả hai vế`,
      notes: [
        { mark: 'ok', text: 'Mẹo: đặt **hằng chuỗi ở bên trái** `.equals()` là không bao giờ nổ null' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`equals` chứ không `==` · String bất biến, phải gán lại · `null ≠ ""`' },
        { mark: 'next', text: '**Ngày 10**: method — đóng gói hành vi, và pass-by-value' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'x == y      -> true   <- cung o pool',
      'x == z      -> false  <- KHAC o nho!',
      'x.equals(z) -> true   <- so NOI DUNG, luon dung cai nay',
      'trim+upper  -> [XIN CHAO]',
      's van la    -> [  Xin chao  ]  <- String BAT BIEN',
    ],
  },

  verify: {
    className: 'D09',
    source: `public class D09 {
    public static void main(String[] args) {
        String x = "Java";
        String y = "Java";
        String z = new String("Java");
        System.out.println("x == y      -> " + (x == y) + "   <- cung o pool");
        System.out.println("x == z      -> " + (x == z) + "  <- KHAC o nho!");
        System.out.println("x.equals(z) -> " + x.equals(z) + "   <- so NOI DUNG, luon dung cai nay");
        String s = "  Xin chao  ";
        System.out.println("trim+upper  -> [" + s.trim().toUpperCase() + "]");
        System.out.println("s van la    -> [" + s + "]  <- String BAT BIEN");
    }
}`,
  },
};
