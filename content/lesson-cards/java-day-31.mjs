/**
 * Thẻ bài học "100 Ngày Java" — Ngày 31: Stream API.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-31.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 31,
  total: 100,
  titleLead: 'Java Day 31:',
  titleAccent: 'Stream API',
  subtitle: 'Lọc · biến đổi · gom — bảy dòng vòng lặp thành một dây chuyền 🌊',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT DÂY CHUYỀN, ĐỌC NHƯ CÂU VĂN 🌊',
      code: `ds.stream()
  .filter(s -> s.getDiem() >= 8.0)     // loc
  .map(s -> s.getTen().toUpperCase())  // bien doi
  .sorted()                            // sap xep
  .collect(Collectors.toList());       // gom
// [AN, CHI, EM]`,
      notes: [
        { mark: 'ok', text: 'Nói **LÀM GÌ**, không nói làm thế nào — vòng `for` thì ngược lại' },
        { mark: 'dot', text: 'Mỗi mắt xích nhận một lambda của **Ngày 30**' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. THỐNG KÊ & GOM NHÓM 📊',
      code: `.mapToDouble(SinhVien::getDiem).average()   // 7.90
.max(Comparator.comparingDouble(...))       // An
.collect(groupingBy(SinhVien::getLop, counting()))
// {SE01=3, SE02=2}`,
      notes: [{ mark: 'ok', text: '`groupingBy` + `counting` thay cả một vòng lặp đếm bằng `Map`' }],
    },
    {
      tone: 'pink',
      title: '3. LƯỜI: KHÔNG CÓ TOÁN TỬ KẾT THÚC THÌ KHÔNG CHẠY 😴',
      code: `ds.stream().filter(s -> { log.add(s.getTen()); return true; });
// log VAN RONG — chua co collect/forEach/count`,
      notes: [
        { mark: 'dot', text: 'Trung gian (`filter`,`map`,`sorted`) chỉ **ghi nhận ý định**' },
        { mark: 'ok', text: 'Nhờ lười nên duyệt MỘT lần cho cả dây chuyền, không tạo danh sách trung gian' },
      ],
    },
    {
      tone: 'green',
      title: '4. DÙNG MỘT LẦN RỒI BỎ 🚮',
      code: `Stream<SinhVien> st = ds.stream();
st.count();
st.count();   // ✗ IllegalStateException`,
      notes: [
        { mark: 'no', text: 'Đừng lưu stream vào biến để dùng lại — tạo mới từ nguồn' },
        { mark: 'ok', text: 'Stream **không sửa** danh sách gốc, chỉ đọc' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'nguồn → trung gian → **kết thúc** (thiếu vế cuối là không có gì xảy ra)' },
        { mark: 'next', text: '**Ngày 32**: `Optional` — dẹp `null` và NullPointerException' },
      ],
    },
  ],

  /* Output THẬT của `java StreamDemo` trên JDK 21 — không phải viết tay.
     `groupingBy` dùng `TreeMap::new` chứ không để mặc định: HashMap không
     hứa thứ tự nên output sẽ đổi giữa các lần chạy và phép so hỏng. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) loc+bien doi+sap -> [AN, CHI, EM]',
      '2) diem trung binh -> 7.90',
      '4) so em moi lop -> {SE01=3, SE02=2}',
      '6) co ai duoi 5? false | tat ca tren 6? true',
      '7) dung lai stream -> IllegalStateException',
      '8) chua co toan tu ket thuc -> log rong? true',
    ],
  },

  verify: {
    className: 'StreamDemo',
    source: `import java.util.*;
import java.util.stream.*;

class SinhVien {
    private final String ten; private final double diem; private final String lop;
    SinhVien(String ten, double diem, String lop) { this.ten = ten; this.diem = diem; this.lop = lop; }
    String getTen() { return ten; }
    double getDiem() { return diem; }
    String getLop() { return lop; }
}

public class StreamDemo {
    public static void main(String[] args) {
        List<SinhVien> ds = List.of(
                new SinhVien("An", 9.5, "SE01"),
                new SinhVien("Binh", 7.0, "SE01"),
                new SinhVien("Chi", 8.5, "SE02"),
                new SinhVien("Dung", 6.5, "SE02"),
                new SinhVien("Em", 8.0, "SE01"));

        List<String> gioi = ds.stream()
                .filter(s -> s.getDiem() >= 8.0)
                .map(s -> s.getTen().toUpperCase())
                .sorted()
                .collect(Collectors.toList());
        System.out.println("1) loc+bien doi+sap -> " + gioi);

        double tb = ds.stream().mapToDouble(SinhVien::getDiem).average().orElse(0);
        System.out.printf("2) diem trung binh -> %.2f%n", tb);

        Map<String, Long> theoLop = ds.stream()
                .collect(Collectors.groupingBy(SinhVien::getLop, TreeMap::new, Collectors.counting()));
        System.out.println("4) so em moi lop -> " + theoLop);

        System.out.println("6) co ai duoi 5? " + ds.stream().anyMatch(s -> s.getDiem() < 5)
                + " | tat ca tren 6? " + ds.stream().allMatch(s -> s.getDiem() > 6));

        Stream<SinhVien> st = ds.stream();
        st.count();
        try { st.count(); }
        catch (IllegalStateException e) { System.out.println("7) dung lai stream -> IllegalStateException"); }

        List<String> log = new ArrayList<>();
        ds.stream().filter(s -> { log.add(s.getTen()); return true; });
        System.out.println("8) chua co toan tu ket thuc -> log rong? " + log.isEmpty());
    }
}`,
  },
};
