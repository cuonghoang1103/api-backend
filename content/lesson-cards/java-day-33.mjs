/**
 * Thẻ bài học "100 Ngày Java" — Ngày 33: Date/Time API.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-33.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 33,
  total: 100,
  titleLead: 'Java Day 33:',
  titleAccent: 'Ngày & Giờ',
  subtitle: 'LocalDate · Duration · Period — bất biến và gọi đúng tên 📅',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BA CLASS CHO BA NHU CẦU 📅',
      code: `LocalDate     2026-08-09        // chi NGAY
LocalTime     09:00             // chi GIO
LocalDateTime 2026-08-09T09:00  // ca hai

LocalDate.of(2026, 8, 9)   // thang 8 LA thang 8`,
      notes: [
        { mark: 'no', text: 'Class `Date` cũ: năm đếm từ 1900, tháng đếm từ 0, lại còn sửa được' },
        { mark: 'ok', text: 'Có múi giờ thì dùng `ZonedDateTime`' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. BẤT BIẾN — MỌI PHÉP ĐỔI TRẢ VẬT MỚI 🧊',
      code: `LocalDate sau = ngay.plusDays(30).plusMonths(1);
// goc van la 2026-08-09 | moi la 2026-10-08`,
      notes: [
        { mark: 'ok', text: 'Chuyền đi khắp nơi vẫn an toàn — không ai sửa trộm được' },
        { mark: 'no', text: 'Quên gán lại kết quả là phép tính coi như không xảy ra' },
      ],
    },
    {
      tone: 'pink',
      title: '3. KHOẢNG CÁCH: Period vs Duration ⏳',
      code: `ChronoUnit.DAYS.between(ngay, han)   // 144 ngay
Period.between(ngay, han)            // 4 thang 22 ngay
Duration.between(batDau, ketThuc)    // 2h30p`,
      notes: [
        { mark: 'dot', text: '`Period` cho NGÀY–THÁNG–NĂM · `Duration` cho GIỜ–PHÚT–GIÂY' },
        { mark: 'ok', text: 'Cần một con số duy nhất thì `ChronoUnit` gọn nhất' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐỌC & VIẾT CHUỖI 🔤',
      code: `DateTimeFormatter vn = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
batDau.format(vn)              // 09/08/2026 09:00
LocalDate.parse("2026-01-15")  // JANUARY 2026

LocalDate.of(2026, 2, 30)      // ✗ DateTimeException`,
      notes: [{ mark: 'ok', text: 'Ngày không tồn tại thì NỔ ngay, không âm thầm trôi sang 02/03' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Quên `Date`/`Calendar` cũ đi — chỉ dùng `java.time` (Java 8+)' },
        { mark: 'next', text: '**Ngày 34**: Đọc/ghi file với `Files` và `Path`' },
      ],
    },
  ],

  /* Output THẬT của `java NgayGio` trên JDK 21 — không phải viết tay.
     Chương trình cố ý KHÔNG dùng `LocalDate.now()`: kết quả sẽ đổi theo
     ngày chạy và phép so output của thẻ hỏng sau đúng một hôm. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) 2026-08-09 | thu SUNDAY | ngay thu 221',
      '2) goc van la 2026-08-09 | moi la 2026-10-08',
      '3) con 144 ngay den han',
      '4) tuc la 4 thang 22 ngay',
      '5) hop keo dai 2h30p',
      '6) format -> 09/08/2026 09:00',
      '9) 30/02 -> DateTimeException',
    ],
  },

  verify: {
    className: 'NgayGio',
    source: `import java.time.*;
import java.time.format.*;
import java.time.temporal.ChronoUnit;

public class NgayGio {
    public static void main(String[] args) {
        LocalDate ngay = LocalDate.of(2026, 8, 9);
        System.out.println("1) " + ngay + " | thu " + ngay.getDayOfWeek() + " | ngay thu " + ngay.getDayOfYear());

        LocalDate sau = ngay.plusDays(30).plusMonths(1);
        System.out.println("2) goc van la " + ngay + " | moi la " + sau);

        LocalDate hanNop = LocalDate.of(2026, 12, 31);
        System.out.println("3) con " + ChronoUnit.DAYS.between(ngay, hanNop) + " ngay den han");
        Period p = Period.between(ngay, hanNop);
        System.out.println("4) tuc la " + p.getMonths() + " thang " + p.getDays() + " ngay");

        LocalDateTime batDau = LocalDateTime.of(2026, 8, 9, 9, 0);
        LocalDateTime ketThuc = batDau.plusHours(2).plusMinutes(30);
        Duration d = Duration.between(batDau, ketThuc);
        System.out.println("5) hop keo dai " + d.toHours() + "h" + d.toMinutesPart() + "p");

        DateTimeFormatter vn = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        System.out.println("6) format -> " + batDau.format(vn));

        try { LocalDate.of(2026, 2, 30); }
        catch (DateTimeException e) { System.out.println("9) 30/02 -> DateTimeException"); }
    }
}`,
  },
};
