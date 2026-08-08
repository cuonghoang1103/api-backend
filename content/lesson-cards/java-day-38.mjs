/**
 * Thẻ bài học "100 Ngày Java" — Ngày 38: record.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-38.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 38,
  total: 100,
  titleLead: 'Java Day 38:',
  titleAccent: 'record',
  subtitle: 'Ba mươi dòng chở dữ liệu rút còn một 📇',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT DÒNG, JAVA LO PHẦN CÒN LẠI 📇',
      code: `record SinhVien(String ten, double diem) { }

// tu sinh: constructor, ten(), diem(),
//          equals(), hashCode(), toString()
new SinhVien("An", 9.5)   // SinhVien[ten=An, diem=9.5]`,
      notes: [
        { mark: 'ok', text: 'Getter KHÔNG có chữ `get`: `a.ten()` chứ không `a.getTen()`' },
        { mark: 'dot', text: 'Java 16+ · field tự động `private final` — bất biến hoàn toàn' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. equals & hashCode ĐÚNG NGAY 🤝',
      code: `a.equals(b)                    // true — so NOI DUNG
new HashSet<>(List.of(a, b))   // 1 phan tu
Map.of(a, "SE01").get(b)       // "SE01"`,
      notes: [
        { mark: 'ok', text: 'Hợp đồng của **Ngày 20** được thoả sẵn — hết cảnh quên viết `hashCode`' },
        { mark: 'ok', text: 'Bất biến nên làm khoá `Map` rất an toàn' },
      ],
    },
    {
      tone: 'pink',
      title: '3. VẪN KIỂM ĐƯỢC DỮ LIỆU ✅',
      code: `record SinhVien(String ten, double diem) {
    SinhVien {                       // constructor GON — khong ngoac tham so
        if (diem < 0 || diem > 10)
            throw new IllegalArgumentException("Diem ngoai 0-10");
    }
    boolean gioi() { return diem >= 8.0; }   // them method binh thuong
}`,
      notes: [{ mark: 'ok', text: 'Đóng gói của **Ngày 13** vẫn giữ: chặn dữ liệu bẩn ngay tại cửa' }],
    },
    {
      tone: 'green',
      title: '4. KHI NÀO ĐỪNG DÙNG record 🚧',
      code: `// ✓ hop: DTO, ket qua tra ve, khoa Map, cau hinh
// ✗ khong hop: doi tuong CO TRANG THAI DOI (tai khoan, gio hang)
//              can ke thua (record la final)`,
      notes: [{ mark: 'no', text: '`record` **không** kế thừa được — nó luôn `final`' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Class chỉ để CHỞ dữ liệu, không đổi sau khi tạo → `record`' },
        { mark: 'next', text: '**Ngày 39**: `switch` biểu thức & pattern matching' },
      ],
    },
  ],

  /* Output THẬT của `java HoSo` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) toString tu sinh -> SinhVien[ten=An, diem=9.5]',
      '2) getter khong co chu get -> An / 9.5',
      '3) equals tu sinh -> true | hashCode bang nhau -> true',
      '4) HashSet coi la trung -> 1 phan tu',
      '5) constructor phu -> SinhVien[ten=Binh, diem=0.0]',
      '7) kiem tra -> Diem ngoai 0-10',
      '8) record co the lam khoa Map: lop SE01',
    ],
  },

  verify: {
    className: 'HoSo',
    source: `import java.util.*;

record SinhVien(String ten, double diem) {

    SinhVien {
        if (ten == null || ten.isBlank()) throw new IllegalArgumentException("Ten trong");
        if (diem < 0 || diem > 10) throw new IllegalArgumentException("Diem ngoai 0-10");
    }

    boolean gioi() { return diem >= 8.0; }

    SinhVien(String ten) { this(ten, 0.0); }
}

public class HoSo {
    public static void main(String[] args) {
        SinhVien a = new SinhVien("An", 9.5);

        System.out.println("1) toString tu sinh -> " + a);
        System.out.println("2) getter khong co chu get -> " + a.ten() + " / " + a.diem());

        SinhVien b = new SinhVien("An", 9.5);
        System.out.println("3) equals tu sinh -> " + a.equals(b) + " | hashCode bang nhau -> " + (a.hashCode() == b.hashCode()));

        Set<SinhVien> tap = new HashSet<>(List.of(a, b));
        System.out.println("4) HashSet coi la trung -> " + tap.size() + " phan tu");

        System.out.println("5) constructor phu -> " + new SinhVien("Binh"));

        try { new SinhVien("Chi", 99); }
        catch (IllegalArgumentException e) { System.out.println("7) kiem tra -> " + e.getMessage()); }

        System.out.println("8) record co the lam khoa Map: " + Map.of(a, "lop SE01").get(b));
    }
}`,
  },
};
