/**
 * Thẻ bài học "100 Ngày Java" — Ngày 12: Constructor.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-12.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 12,
  total: 100,
  titleLead: 'Java Day 12:',
  titleAccent: 'Constructor',
  subtitle: 'Nghi thức khai sinh — nạp chồng, this(…) & bẫy mất constructor mặc định 🔨',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CÙNG TÊN CLASS · KHÔNG KIỂU TRẢ VỀ 🔨',
      code: `class Sach {
    String ten;  double gia;
    Sach(String ten, double gia) {     // ← không void, không int
        this.ten = ten;  this.gia = gia;
    }
}`,
      notes: [
        { mark: 'ok', text: 'Chạy **một lần duy nhất** lúc `new` — không gọi lại được' },
        { mark: 'no', text: 'Thêm `void` là nó thành **method thường**, `new Sach(…)` lỗi ngay' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. BẪY: VIẾT MỘT CÁI LÀ MẤT CÁI MẶC ĐỊNH ⚠️',
      code: `Sach(String ten) { this.ten = ten; }
new Sach();   // ✗ constructor Sach cannot be applied
              //   required: String`,
      notes: [
        { mark: 'dot', text: 'Java **chỉ** cấp constructor rỗng khi bạn KHÔNG viết cái nào' },
        { mark: 'ok', text: 'Cần cả hai? Viết tay cả hai — đó là nạp chồng của **Ngày 10**' },
      ],
    },
    {
      tone: 'pink',
      title: '3. this(…) — GỌI LẠI ANH EM 🔁',
      code: `Sach(String ten, double gia) { … }              // bản đầy đủ
Sach(String ten) { this(ten, 0.0); }            // ủy quyền
Sach()           { this("Chua dat ten", 0.0); }`,
      notes: [
        { mark: 'no', text: '`this(…)` phải là **câu lệnh đầu tiên** — sai thì: *call to this must be first statement*' },
        { mark: 'ok', text: 'Luật khởi tạo viết **một chỗ** — sửa một nơi, mọi lối vào cùng đúng' },
      ],
    },
    {
      tone: 'green',
      title: '4. THỨ TỰ KHỞI TẠO 📋',
      code: `class ThuTu {
    int x = 5;            // ② giá trị lúc khai báo
    ThuTu() {             // ③ thân constructor
        System.out.println(x);   // 5 — KHÔNG phải 0
    }
}                         // ① trước đó: mặc định 0`,
      notes: [{ mark: 'dot', text: 'mặc định **0/false/null** → giá trị khai báo → thân constructor' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Constructor bảo đảm **không đối tượng nào ra đời dở dang**' },
        { mark: 'next', text: '**Ngày 13**: Đóng gói — `private` + getter/setter, chặn dữ liệu bẩn ngay cửa' },
      ],
    },
  ],

  /* Output THẬT của `java Sach` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'Clean Code | Robert Martin | 350000.0 | SL 3',
      'Effective Java | Joshua Bloch | 420000.0 | SL 1',
      'Chua dat ten | Khuyet danh | 0.0 | SL 0',
      'trong constructor, x = 5',
    ],
  },

  /* Chương trình dùng để sinh ra `proof`. Script sẽ biên dịch + chạy lại nó
     mỗi lần render và DỪNG nếu output khác `proof.lines` — nên thẻ không thể
     nói dối về hành vi của Java. */
  verify: {
    className: 'Sach',
    source: `public class Sach {
    String ten;
    String tacGia;
    double gia;
    int soLuong;

    Sach(String ten, String tacGia, double gia, int soLuong) {
        this.ten = ten;
        this.tacGia = tacGia;
        this.gia = gia;
        this.soLuong = soLuong;
    }

    Sach(String ten, String tacGia, double gia) {
        this(ten, tacGia, gia, 1);
    }

    Sach() {
        this("Chua dat ten", "Khuyet danh", 0.0, 0);
    }

    void in() {
        System.out.println(ten + " | " + tacGia + " | " + gia + " | SL " + soLuong);
    }

    public static void main(String[] args) {
        new Sach("Clean Code", "Robert Martin", 350000, 3).in();
        new Sach("Effective Java", "Joshua Bloch", 420000).in();
        new Sach().in();
        new ThuTu();
    }
}

class ThuTu {
    int x = 5;
    ThuTu() {
        System.out.println("trong constructor, x = " + x);
    }
}`,
  },
};
