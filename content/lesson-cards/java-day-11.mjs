/**
 * Thẻ bài học "99 Ngày Java" — Ngày 11: Classes & Objects.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-11.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '99 NGÀY JAVA',
  day: 11,
  total: 99,
  titleLead: 'Java Day 11:',
  titleAccent: 'Classes & Objects',
  subtitle: 'Khuôn đúc, new, heap & this — OOP bắt đầu! 🏠',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CLASS = KHUÔN, OBJECT = BÁNH 🧁',
      code: `public class SinhVien {
    String ten;  double diemTB;   // field: ai nấy giữ 1 bản
    void gioiThieu() { ... }      // method: dùng dữ liệu CỦA MÌNH
}`,
      notes: [{ mark: 'ok', text: 'Gom **dữ liệu + hành vi** của một "thứ" vào chung một nhà' }],
    },
    {
      tone: 'yellow',
      title: '2. new — ĐÚC TRÊN HEAP 🏭',
      code: `SinhVien an = new SinhVien();  // đúc 1 chiếc — độc lập
an.ten = "An";   an.diemTB = 9.0;`,
      notes: [
        { mark: 'dot', text: 'Field **có mặc định**: `double` → **0.0** · `int` → 0 · `boolean` → false · tham chiếu → null' },
        { mark: 'ok', text: 'Không ai trỏ tới nữa? Garbage Collector dọn — khỏi free tay' },
      ],
    },
    {
      tone: 'pink',
      title: '3. BIẾN CHỈ GIỮ THAM CHIẾU 🔗',
      code: `SinhVien x = an;    // KHÔNG đúc mới — thêm tham chiếu
x.diemTB = 5.0;
an.diemTB           // 5.0 — hai biến, MỘT đối tượng!`,
      notes: [{ mark: 'no', text: 'Gán biến ≠ copy đối tượng — đúng bài mảng **Ngày 08** & pass-by-value **Ngày 10**' }],
    },
    {
      tone: 'green',
      title: '4. this — "CHÍNH TÔI ĐÂY" 👉',
      code: `void doiTen(String ten) {
    this.ten = ten;   // this.ten = field CỦA đối tượng này
}`,
      notes: [
        { mark: 'dot', text: 'Method chung một bản code — **this** cho biết đang phục vụ object nào' },
        { mark: 'ok', text: 'Bắt buộc xuất hiện khi tham số **trùng tên** field (shadowing)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Class là khuôn · new đúc từng object độc lập · biến giữ tham chiếu' },
        { mark: 'next', text: '**Ngày 12**: Constructor — nghi thức khai sinh bắt buộc' },
      ],
    },
  ],

  /* Output THẬT của `java SinhVien` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) so -> 0.0      bool -> false      ref -> null',
      '2) an.diemTB -> 5.0      (x == an ? true)',
      '3) an.ten -> An Nguyen',
      '4) an == binh ? false    (hai lan new = hai doi tuong)',
    ],
  },

  /* Chương trình dùng để sinh ra `proof`. Script sẽ biên dịch + chạy lại nó
     mỗi lần render và DỪNG nếu output khác `proof.lines` — nên thẻ không thể
     nói dối về hành vi của Java. */
  verify: {
    className: 'SinhVien',
    source: `public class SinhVien {
    String ten;
    double diemTB;
    boolean daTotNghiep;
    String lop;

    void doiTen(String ten) { this.ten = ten; }

    public static void main(String[] args) {
        SinhVien moi = new SinhVien();
        System.out.println("1) so -> " + moi.diemTB + "      bool -> " + moi.daTotNghiep + "      ref -> " + moi.lop);

        SinhVien an = new SinhVien();
        an.ten = "An";  an.diemTB = 9.0;
        SinhVien x = an;
        x.diemTB = 5.0;
        System.out.println("2) an.diemTB -> " + an.diemTB + "      (x == an ? " + (x == an) + ")");

        an.doiTen("An Nguyen");
        System.out.println("3) an.ten -> " + an.ten);

        SinhVien binh = new SinhVien();
        System.out.println("4) an == binh ? " + (an == binh) + "    (hai lan new = hai doi tuong)");
    }
}`,
  },
};
