/**
 * Thẻ bài học "100 Ngày Java" — Ngày 16: Đa hình.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-16.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 16,
  total: 100,
  titleLead: 'Java Day 16:',
  titleAccent: 'Đa hình',
  subtitle: 'Một lời gọi, mỗi lớp con trả lời một kiểu — và cái chết của chuỗi if 🎭',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT VÒNG FOR, KHÔNG MỘT CÂU IF 🎭',
      code: `Hinh[] ds = { new HinhTron(2), new HinhChuNhat(3,4), new HinhVuong(5) };
for (Hinh h : ds)
    System.out.println(h.dienTich());   // mỗi hình một công thức`,
      notes: [
        { mark: 'ok', text: 'Thêm hình mới: viết thêm **một class**, vòng lặp này không sửa một chữ' },
        { mark: 'no', text: 'Cách cũ: `if (loai == TRON) … else if (loai == VUONG) …` — sửa mãi mãi' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. KIỂU KHAI BÁO ≠ KIỂU THẬT 🎯',
      code: `Hinh h = new HinhTron(1);
h.getClass().getSimpleName()   // "HinhTron"

// Java chọn method theo KIỂU THẬT, lúc CHẠY
// (dynamic dispatch / late binding)`,
      notes: [{ mark: 'dot', text: 'Trình dịch nhìn bên trái dấu `=`, JVM nhìn bên phải' }],
    },
    {
      tone: 'pink',
      title: '3. CÁI GIÁ: MẤT PHẦN RIÊNG CỦA CON 🚧',
      code: `A a = new B();
a.rieng();      // ✗ cannot find symbol: method rieng()

if (a instanceof B b)   // ép kiểu an toàn (pattern matching)
    b.rieng();`,
      notes: [
        { mark: 'dot', text: 'Kiểu khai báo quyết định bạn ĐƯỢC GỌI gì; kiểu thật quyết định CHẠY bản nào' },
        { mark: 'no', text: 'Phải `instanceof` liên tục = thiết kế sai, không phải Java thiếu tính năng' },
      ],
    },
    {
      tone: 'green',
      title: '4. NGUYÊN TẮC MỞ/ĐÓNG 🔓',
      code: `void inTatCa(Hinh[] ds) { … }   // viết MỘT lần

class HinhTamGiac extends Hinh { … }   // thêm sau
// inTatCa() vẫn chạy đúng, không cần đọc lại`,
      notes: [{ mark: 'ok', text: '**Mở** để mở rộng · **đóng** với sửa đổi — mã cũ càng ít bị đụng, bug càng ít' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Đa hình = lập trình theo **kiểu cha**, để lớp con tự trả lời' },
        { mark: 'next', text: '**Ngày 17**: `abstract` — cha chỉ nêu yêu cầu, không tự làm' },
      ],
    },
  ],

  /* Output THẬT của `java HinhHoc` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'Hinh tron    dien tich 12.57',
      'Hinh chu nhat dien tich 12.00',
      'Hinh vuong   dien tich 25.00',
      'tong dien tich 49.57',
      'bien kieu Hinh, thuc te la HinhTron',
    ],
  },

  /* Chương trình dùng để sinh ra `proof`. Script sẽ biên dịch + chạy lại nó
     mỗi lần render và DỪNG nếu output khác `proof.lines` — nên thẻ không thể
     nói dối về hành vi của Java. */
  verify: {
    className: 'HinhHoc',
    source: `public class HinhHoc {
    public static void main(String[] args) {
        Hinh[] ds = { new HinhTron(2), new HinhChuNhat(3, 4), new HinhVuong(5) };

        double tong = 0;
        for (Hinh h : ds) {
            System.out.printf("%-12s dien tich %.2f%n", h.ten(), h.dienTich());
            tong += h.dienTich();
        }
        System.out.printf("tong dien tich %.2f%n", tong);

        Hinh h = new HinhTron(1);
        System.out.println("bien kieu Hinh, thuc te la " + h.getClass().getSimpleName());
    }
}

class Hinh {
    double dienTich() { return 0; }
    String ten() { return "Hinh"; }
}

class HinhTron extends Hinh {
    private double r;
    HinhTron(double r) { this.r = r; }
    @Override double dienTich() { return Math.PI * r * r; }
    @Override String ten() { return "Hinh tron"; }
}

class HinhChuNhat extends Hinh {
    protected double dai, rong;
    HinhChuNhat(double dai, double rong) { this.dai = dai; this.rong = rong; }
    @Override double dienTich() { return dai * rong; }
    @Override String ten() { return "Hinh chu nhat"; }
}

class HinhVuong extends HinhChuNhat {
    HinhVuong(double canh) { super(canh, canh); }
    @Override String ten() { return "Hinh vuong"; }
}`,
  },
};
