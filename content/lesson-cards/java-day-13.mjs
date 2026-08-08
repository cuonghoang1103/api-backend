/**
 * Thẻ bài học "100 Ngày Java" — Ngày 13: Đóng gói (Encapsulation).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-13.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 13,
  total: 100,
  titleLead: 'Java Day 13:',
  titleAccent: 'Đóng gói',
  subtitle: 'private · getter/setter · chặn dữ liệu bẩn ngay tại cửa 🔒',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. private — ĐÓNG CỬA TRƯỚC ĐÃ 🔒',
      code: `class TaiKhoan {
    private double soDu;              // ngoài class: KHÔNG thấy
    public double getSoDu() { return soDu; }
}
tk.soDu = -999;   // ✗ soDu has private access in TaiKhoan`,
      notes: [
        { mark: 'ok', text: 'Field `private` · hành vi `public` — mặc định nên là như vậy' },
        { mark: 'dot', text: 'Ngày 12 canh **lúc sinh ra**, đóng gói canh **suốt đời** đối tượng' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. SETTER LÀ CHỐT KIỂM, KHÔNG PHẢI ỐNG DẪN ⚠️',
      code: `public boolean napTien(double tien) {
    if (tien <= 0) return false;      // ← chặn tại cửa
    soDu += tien;  return true;
}`,
      notes: [
        { mark: 'no', text: 'Setter chỉ `this.x = x` = **public trá hình**, chẳng bảo vệ được gì' },
        { mark: 'ok', text: 'Đặt tên theo NGHIỆP VỤ (`napTien`, `rutTien`) thay vì `setSoDu`' },
      ],
    },
    {
      tone: 'pink',
      title: '3. BẪY: GETTER LÀM RÒ RỈ THAM CHIẾU 🕳️',
      code: `private String[] lichSu;
public String[] getLichSu() { return lichSu; }   // ✗ trả CHÌA KHOÁ

tk.getLichSu()[0] = "HACKED";   // sửa được dữ liệu bên trong!`,
      notes: [
        { mark: 'dot', text: '`private` giữ được **cái biến**, không giữ được **cái đối tượng** nó trỏ tới — Ngày 08 & 11' },
        { mark: 'ok', text: 'Trả **bản sao** (copy phòng thủ) thì bên ngoài sửa bao nhiêu cũng không tới được' },
      ],
    },
    {
      tone: 'green',
      title: '4. BỐN MỨC TRUY CẬP 🚪',
      code: `private     → chỉ trong class
(mặc định)  → cùng package
protected   → cùng package + lớp con
public      → mọi nơi`,
      notes: [{ mark: 'dot', text: 'Bắt đầu bằng `private`, chỉ mở rộng khi có lý do — mở thì dễ, đóng lại thì phá code người khác' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Đóng gói = chỉ một cửa vào, và cửa đó có người gác' },
        { mark: 'next', text: '**Ngày 14**: `static` — thứ thuộc về CLASS chứ không thuộc đối tượng nào' },
      ],
    },
  ],

  /* Output THẬT của `java TaiKhoan` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) nap -500 duoc chap nhan? false   so du -> 1000.0',
      '2) nap 500          -> so du 1500.0',
      '3) rut 9999 duoc?   false   so du -> 1500.0',
      '4) sua qua ban RO RI -> HACKED',
      '5) sua qua ban SAO   -> nap 100.0',
    ],
  },

  /* Chương trình dùng để sinh ra `proof`. Script sẽ biên dịch + chạy lại nó
     mỗi lần render và DỪNG nếu output khác `proof.lines` — nên thẻ không thể
     nói dối về hành vi của Java.

     Hai tài khoản a và b là CỐ Ý: nếu thử cả hai kiểu getter trên cùng một
     tài khoản thì phép thử thứ hai chạy trên dữ liệu đã bị phép thử thứ nhất
     phá, và nó sẽ "chứng minh" điều ngược hẳn với sự thật. */
  verify: {
    className: 'TaiKhoan',
    source: `public class TaiKhoan {
    private String chuTk;
    private double soDu;
    private String[] lichSu = new String[10];
    private int soGiaoDich = 0;

    TaiKhoan(String chuTk, double soDuBanDau) {
        this.chuTk = chuTk;
        this.soDu = Math.max(0, soDuBanDau);
    }

    public double getSoDu() { return soDu; }

    public boolean napTien(double tien) {
        if (tien <= 0) return false;
        soDu += tien;
        ghiSo("nap " + tien);
        return true;
    }

    public boolean rutTien(double tien) {
        if (tien <= 0 || tien > soDu) return false;
        soDu -= tien;
        ghiSo("rut " + tien);
        return true;
    }

    private void ghiSo(String s) {
        if (soGiaoDich < lichSu.length) lichSu[soGiaoDich++] = s;
    }

    public String[] getLichSuRoRi() { return lichSu; }

    public String[] getLichSu() {
        String[] copy = new String[soGiaoDich];
        for (int i = 0; i < soGiaoDich; i++) copy[i] = lichSu[i];
        return copy;
    }

    public static void main(String[] args) {
        TaiKhoan tk = new TaiKhoan("An", 1000);
        System.out.println("1) nap -500 duoc chap nhan? " + tk.napTien(-500) + "   so du -> " + tk.getSoDu());
        tk.napTien(500);
        System.out.println("2) nap 500          -> so du " + tk.getSoDu());
        System.out.println("3) rut 9999 duoc?   " + tk.rutTien(9999) + "   so du -> " + tk.getSoDu());

        TaiKhoan a = new TaiKhoan("A", 0);  a.napTien(100);
        TaiKhoan b = new TaiKhoan("B", 0);  b.napTien(100);

        a.getLichSuRoRi()[0] = "HACKED";
        b.getLichSu()[0]     = "HACKED";

        System.out.println("4) sua qua ban RO RI -> " + a.getLichSu()[0]);
        System.out.println("5) sua qua ban SAO   -> " + b.getLichSu()[0]);
    }
}`,
  },
};
