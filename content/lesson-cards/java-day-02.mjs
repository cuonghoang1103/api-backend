/** "100 Ngày Java" — Ngày 2: Biến & kiểu dữ liệu. */
export default {
  series: '100 NGÀY JAVA',
  day: 2,
  total: 100,
  titleLead: 'Java Day 2:',
  titleAccent: 'Biến & Kiểu dữ liệu',
  subtitle: '8 kiểu nguyên thuỷ, final, và vì sao Java bắt khai kiểu 📦',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. KHAI BÁO = ĐẶT TÊN + CHỌN HỘP 📦',
      code: `int    tuoi  = 20;        // số nguyên
double diem  = 8.5;       // số thực
boolean dauKy = true;     // đúng/sai
char   hang  = 'A';       // MỘT ký tự, nháy ĐƠN`,
      notes: [
        { mark: 'ok', text: 'Java là ngôn ngữ **kiểu tĩnh**: khai sai kiểu là lỗi lúc dịch, không đợi tới lúc chạy' },
        { mark: 'no', text: '`char` dùng nháy **đơn** `\'A\'`; nháy kép `"A"` là `String` — hai thứ khác nhau' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. TÁM KIỂU NGUYÊN THUỶ 🔢',
      code: `byte   1 byte    -128 .. 127
short  2 byte    -32.768 .. 32.767
int    4 byte    ±2,1 tỉ        ← mặc định cho số nguyên
long   8 byte    ±9,2 tỉ tỉ     ← nhớ hậu tố L: 10000000000L
float  4 byte    ~7 chữ số      ← nhớ hậu tố f: 3.14f
double 8 byte    ~15 chữ số     ← mặc định cho số thực
char   2 byte    một ký tự Unicode
boolean          true / false`,
      notes: [
        { mark: 'dot', text: 'Không nhớ hết cũng được — **90% thời gian bạn chỉ dùng `int`, `double`, `boolean`, `String`**' },
      ],
    },
    {
      tone: 'pink',
      title: '3. char LÀ MỘT CON SỐ 🔤',
      code: `char hang = 'A';
System.out.println((int) hang);   // 65 — mã Unicode của 'A'
char sau = (char) (hang + 1);     // 'B'`,
      notes: [
        { mark: 'dot', text: '`char` **là số** ở bên dưới, nên cộng trừ được — đây là nền của mọi bài xử lý ký tự' },
      ],
    },
    {
      tone: 'green',
      title: '4. final — HẰNG SỐ 🔒',
      code: `final double PI = 3.14159;
// PI = 3.14;   ✗ lỗi ngay lúc DỊCH, không đợi chạy`,
      notes: [
        { mark: 'ok', text: 'Quy ước đặt tên hằng: **VIẾT HOA_CÓ_GẠCH_DƯỚI**' },
        { mark: 'dot', text: 'Còn `var` (Java 10+) thì ngược lại: **suy** kiểu từ giá trị, nhưng vẫn là kiểu tĩnh' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Khai kiểu rõ ràng · `int`/`double` là mặc định · `final` khoá giá trị' },
        { mark: 'next', text: '**Ngày 3**: toán tử & ép kiểu — nơi `7 / 2` cho ra `3`' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'int  -> 20   | 4 byte',
      'double -> 8.5 | 8 byte',
      'boolean -> true',
      "char 'A' -> so 65",
      'final PI -> 3.14159 (khong doi duoc)',
    ],
  },

  verify: {
    className: 'D02',
    source: `public class D02 {
    public static void main(String[] args) {
        int tuoi = 20;
        double diem = 8.5;
        boolean dauKy = true;
        char hang = 'A';
        final double PI = 3.14159;
        System.out.println("int  -> " + tuoi + "   | 4 byte");
        System.out.println("double -> " + diem + " | 8 byte");
        System.out.println("boolean -> " + dauKy);
        System.out.println("char 'A' -> so " + (int) hang);
        System.out.println("final PI -> " + PI + " (khong doi duoc)");
    }
}`,
  },
};
