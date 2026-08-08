/**
 * Thẻ bài học "100 Ngày Java" — Ngày 32: Optional.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-32.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 32,
  total: 100,
  titleLead: 'Java Day 32:',
  titleAccent: 'Optional',
  subtitle: 'Nói "có thể không có" ngay trong kiểu trả về 🎁',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CHỮ KÝ TỰ NÓI SỰ THẬT 🎁',
      code: `Integer tim(String ma)            // co the null — ai biet?
Optional<Integer> tim(String ma)  // NOI RO: co the khong co

kho.tim("but").orElse(0)   // 10
kho.tim("tay").orElse(0)   // 0`,
      notes: [
        { mark: 'no', text: 'Trả `null` thì người gọi phải ĐOÁN và rất dễ quên kiểm' },
        { mark: 'ok', text: '`Optional` bắt họ đối mặt ngay lúc dịch' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. LẤY GIÁ TRỊ RA CHO TỬ TẾ 🧰',
      code: `.orElse(0)                       // giá trị thay thế
.orElseGet(() -> tinhLai())      // chỉ tính khi rỗng
.orElseThrow(() -> new ...)      // ném ngoại lệ nghiệp vụ
.ifPresent(n -> ...)             // chỉ chạy khi CÓ`,
      notes: [{ mark: 'ok', text: '`ifPresent` thay hẳn cặp `if (x != null) { … }`' }],
    },
    {
      tone: 'pink',
      title: '3. XÍCH ĐƯỢC NHƯ STREAM ⛓️',
      code: `kho.tim("vo")
   .filter(n -> n > 5)
   .map(n -> "du hang")
   .orElse("sap het");     // "sap het"`,
      notes: [{ mark: 'ok', text: 'Cùng bộ từ vựng `map`/`filter` của **Ngày 31** — rỗng thì cả dây chuyền bỏ qua' }],
    },
    {
      tone: 'green',
      title: '4. ĐỪNG GỌI .get() ☠️',
      code: `kho.tim("tay").get();
// ✗ NoSuchElementException — no HET null

// dung: orElse / orElseThrow / ifPresent`,
      notes: [
        { mark: 'no', text: '`get()` mù quáng chỉ đổi `NullPointerException` lấy một tên khác' },
        { mark: 'no', text: 'Đừng dùng `Optional` cho field, tham số, hay phần tử trong Collection' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Dùng `Optional` cho KIỂU TRẢ VỀ của method có thể không tìm thấy gì' },
        { mark: 'next', text: '**Ngày 33**: Date/Time API — LocalDate, LocalDateTime, Duration' },
      ],
    },
  ],

  /* Output THẬT của `java OptionalDemo` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) co hang -> 10 | khong co -> 0',
      '3) ifPresent -> con 10',
      '4) map+filter -> sap het',
      '5) get() khi rong -> NoSuchElementException',
      '6) orElseThrow -> Khong co ma hang',
      '7) cach cu tra null -> NullPointerException',
    ],
  },

  verify: {
    className: 'OptionalDemo',
    source: `import java.util.*;

class Kho {
    private final Map<String, Integer> ton = new HashMap<>(Map.of("but", 10, "vo", 3));

    Integer timCu(String ma) { return ton.get(ma); }

    Optional<Integer> tim(String ma) { return Optional.ofNullable(ton.get(ma)); }
}

public class OptionalDemo {
    public static void main(String[] args) {
        Kho kho = new Kho();

        System.out.println("1) co hang -> " + kho.tim("but").orElse(0)
                + " | khong co -> " + kho.tim("tay").orElse(0));

        StringBuilder sb = new StringBuilder();
        kho.tim("but").ifPresent(n -> sb.append("con ").append(n));
        kho.tim("tay").ifPresent(n -> sb.append("KHONG BAO GIO CHAY"));
        System.out.println("3) ifPresent -> " + sb);

        System.out.println("4) map+filter -> " + kho.tim("vo")
                .filter(n -> n > 5).map(n -> "du hang").orElse("sap het"));

        try { kho.tim("tay").get(); }
        catch (NoSuchElementException e) { System.out.println("5) get() khi rong -> NoSuchElementException"); }

        try { kho.tim("tay").orElseThrow(() -> new IllegalStateException("Khong co ma hang")); }
        catch (IllegalStateException e) { System.out.println("6) orElseThrow -> " + e.getMessage()); }

        Integer cu = kho.timCu("tay");
        try { int x = cu + 1; }
        catch (NullPointerException e) { System.out.println("7) cach cu tra null -> NullPointerException"); }
    }
}`,
  },
};
