/**
 * Thẻ bài học "100 Ngày Java" — Ngày 15: Kế thừa.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-15.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 15,
  total: 100,
  titleLead: 'Java Day 15:',
  titleAccent: 'Kế thừa',
  subtitle: 'extends · super · @Override — dùng lại code cho tử tế 🧬',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. extends — NHẬN LẠI TOÀN BỘ 🧬',
      code: `class PhuongTien {
    protected String hang;
    void khoiDong() { … }
}
class XeMay extends PhuongTien {   // có sẵn hang + khoiDong()
    private int phanKhoi;          // rồi thêm phần riêng
}`,
      notes: [
        { mark: 'ok', text: 'Thử câu **"XeMay LÀ MỘT PhuongTien"** — sai câu này thì đừng kế thừa' },
        { mark: 'dot', text: '`protected` (Ngày 13): con thấy được, người ngoài thì không' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. super(…) — CHA XONG MỚI TỚI CON 👨‍👦',
      code: `XeMay(String hang, int nam, int cc) {
    super(hang, nam);     // ← câu lệnh ĐẦU TIÊN
    this.phanKhoi = cc;
}
// [cha] khoi tao truoc → [con] khoi tao sau`,
      notes: [
        { mark: 'no', text: 'Cha không có constructor rỗng mà quên `super(…)`: *required: int · found: no arguments*' },
        { mark: 'dot', text: 'Cùng luật với `this(…)` của **Ngày 12** — nền phải xong trước' },
      ],
    },
    {
      tone: 'pink',
      title: '3. @Override — VIẾT ĐÈ, KHÔNG XOÁ 🖊️',
      code: `@Override
void moTa() {
    super.moTa();        // dùng lại phần của cha
    System.out.println("  -> xe may " + phanKhoi + "cc");
}`,
      notes: [
        { mark: 'ok', text: 'Ghi `@Override` để trình dịch **bắt lỗi gõ nhầm tên** — không có nó, `motA()` thành method mới toanh' },
        { mark: 'dot', text: 'Cùng tên KHÁC tham số = nạp chồng (**Ngày 10**), không phải ghi đè' },
      ],
    },
    {
      tone: 'green',
      title: '4. MỘT CHA DUY NHẤT 🚧',
      code: `class A extends B, C   // ✗ Java KHÔNG đa kế thừa class
class XeMay extends PhuongTien   // ✓ đúng một cha
// không viết extends? → ngầm kế thừa Object`,
      notes: [
        { mark: 'dot', text: 'Mọi class đều là con của `Object` — chỗ `toString()` và `equals()` (**Ngày 09**) sinh ra' },
        { mark: 'next', text: 'Muốn nhiều "vai"? Đó là `interface` — **Ngày 18**' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Kế thừa là quan hệ **LÀ MỘT**, không phải mẹo tiết kiệm dòng code' },
        { mark: 'next', text: '**Ngày 16**: Đa hình — một lời gọi, mỗi lớp con trả lời một kiểu' },
      ],
    },
  ],

  /* Output THẬT của `java PhuongTien` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '[cha] PhuongTien khoi tao truoc',
      '[con] XeMay khoi tao sau',
      'Phuong tien Honda (2024)',
      '  -> xe may 150cc',
      'Honda: vroom',
    ],
  },

  /* Chương trình dùng để sinh ra `proof`. Script sẽ biên dịch + chạy lại nó
     mỗi lần render và DỪNG nếu output khác `proof.lines` — nên thẻ không thể
     nói dối về hành vi của Java. */
  verify: {
    className: 'PhuongTien',
    source: `public class PhuongTien {
    protected String hang;
    protected int namSX;

    PhuongTien(String hang, int namSX) {
        this.hang = hang;
        this.namSX = namSX;
        System.out.println("[cha] PhuongTien khoi tao truoc");
    }

    void moTa() { System.out.println("Phuong tien " + hang + " (" + namSX + ")"); }
    void khoiDong() { System.out.println(hang + ": vroom"); }

    public static void main(String[] args) {
        XeMay w = new XeMay("Honda", 2024, 150);
        w.moTa();
        w.khoiDong();
    }
}

class XeMay extends PhuongTien {
    private int phanKhoi;

    XeMay(String hang, int namSX, int phanKhoi) {
        super(hang, namSX);
        this.phanKhoi = phanKhoi;
        System.out.println("[con] XeMay khoi tao sau");
    }

    @Override
    void moTa() {
        super.moTa();
        System.out.println("  -> xe may " + phanKhoi + "cc");
    }
}`,
  },
};
