/**
 * Thẻ bài học "100 Ngày Java" — Ngày 14: static.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-14.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 14,
  total: 100,
  titleLead: 'Java Day 14:',
  titleAccent: 'static',
  subtitle: 'Thuộc về CLASS, không thuộc đối tượng nào — và vì sao main là static ⚡',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT BẢN DÙNG CHUNG ⚡',
      code: `class NhanVien {
    private static int soNhanVien = 0;   // MỘT bản cho cả class
    private final int id;                // mỗi đối tượng một bản
    NhanVien(String ten) { soNhanVien++; }
}`,
      notes: [
        { mark: 'ok', text: 'Field thường: 1000 đối tượng = 1000 bản · `static`: vẫn **một** bản' },
        { mark: 'dot', text: 'Sinh ra khi class được nạp, sống tới lúc chương trình tắt' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. CẤP ID TỰ ĐỘNG 🎫',
      code: `private static int idTiepTheo = 1;
private final int id;

NhanVien(String ten) { this.id = idTiepTheo++; }
// an.id=1  binh.id=2  chi.id=3`,
      notes: [{ mark: 'ok', text: 'Bộ đếm phải là `static` — để riêng mỗi đối tượng thì ai cũng nhận số 1' }],
    },
    {
      tone: 'pink',
      title: '3. static KHÔNG CÓ this 🚫',
      code: `private String ten;
static void in() { System.out.println(ten); }
// ✗ non-static variable ten cannot be
//   referenced from a static context`,
      notes: [
        { mark: 'dot', text: 'Method `static` chạy khi **chưa có đối tượng nào** — biết `ten` của ai mà in?' },
        { mark: 'ok', text: 'Đây chính là lý do `public static void main` — JVM gọi nó trước khi có gì cả' },
      ],
    },
    {
      tone: 'green',
      title: '4. static final = HẰNG SỐ 📐',
      code: `static final String CONG_TY = "CuongThai Corp";
static final double VAT = 0.1;

Math.PI · Integer.MAX_VALUE   // cùng một kiểu`,
      notes: [
        { mark: 'ok', text: 'Tên **IN_HOA_GACH_DUOI** · gán một lần, không đổi được' },
        { mark: 'no', text: 'Field `static` **không** phải hằng số bừa bãi — biến toàn cục trá hình là bẫy' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Hỏi trước khi viết: thứ này của **một đối tượng** hay của **cả class**?' },
        { mark: 'next', text: '**Ngày 15**: Kế thừa — `extends`, `super`, và việc dùng lại code cho tử tế' },
      ],
    },
  ],

  /* Output THẬT của `java NhanVien` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '#1 An @ CuongThai Corp',
      '#3 Chi @ CuongThai Corp',
      '1) tong nhan vien -> 3',
      '2) an.id=1 binh.id=2 chi.id=3',
      '3) hang so -> CuongThai Corp',
    ],
  },

  /* Chương trình dùng để sinh ra `proof`. Script sẽ biên dịch + chạy lại nó
     mỗi lần render và DỪNG nếu output khác `proof.lines` — nên thẻ không thể
     nói dối về hành vi của Java. */
  verify: {
    className: 'NhanVien',
    source: `public class NhanVien {
    static final String CONG_TY = "CuongThai Corp";
    private static int soNhanVien = 0;
    private static int idTiepTheo = 1;

    private final int id;
    private String ten;

    NhanVien(String ten) {
        this.ten = ten;
        this.id = idTiepTheo++;
        soNhanVien++;
    }

    public int getId() { return id; }

    static int demNhanVien() { return soNhanVien; }

    void inThe() {
        System.out.println("#" + id + " " + ten + " @ " + CONG_TY);
    }

    public static void main(String[] args) {
        NhanVien an = new NhanVien("An");
        NhanVien binh = new NhanVien("Binh");
        NhanVien chi = new NhanVien("Chi");

        an.inThe();
        chi.inThe();

        System.out.println("1) tong nhan vien -> " + NhanVien.demNhanVien());
        System.out.println("2) an.id=" + an.getId() + " binh.id=" + binh.getId() + " chi.id=" + chi.getId());
        System.out.println("3) hang so -> " + NhanVien.CONG_TY);
    }
}`,
  },
};
