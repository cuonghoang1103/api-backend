/**
 * Thẻ bài học "100 Ngày Java" — Ngày 25: Set & Map.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-25.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 25,
  total: 100,
  titleLead: 'Java Day 25:',
  titleAccent: 'Set & Map',
  subtitle: 'Chống trùng và tra theo khoá — nơi hashCode của Ngày 20 ra trận 🗺️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. SET — TỰ CHỐNG TRÙNG 🎯',
      code: `Set<String> email = new HashSet<>();
email.add("an@abc.com");   // true
email.add("an@abc.com");   // false — size van la 1`,
      notes: [
        { mark: 'ok', text: '`add` trả `boolean`: có thêm được không, khỏi `contains` trước' },
        { mark: 'dot', text: 'Chống trùng dựa trên `equals` + `hashCode` — **Ngày 20**' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. BA LOẠI SET, BA KIỂU THỨ TỰ 📑',
      code: `HashSet       -> khong hua thu tu nao (nhanh nhat)
LinkedHashSet -> [chuoi, cam, buoi]   giu thu tu THEM
TreeSet       -> [buoi, cam, chuoi]   tu SAP XEP`,
      notes: [{ mark: 'ok', text: 'Mặc định dùng `HashSet`; cần thứ tự ổn định mới đổi' }],
    },
    {
      tone: 'pink',
      title: '3. MAP — TRA THEO KHOÁ 🗺️',
      code: `Map<String,String> danhBa = new HashMap<>();
danhBa.put("An", "0912345678");
danhBa.put("An", "0911111111");   // cung khoa = GHI DE
danhBa.get("Chi")                 // null (khong phai loi!)`,
      notes: [
        { mark: 'no', text: 'Khoá không tồn tại trả `null` → dễ NPE. Dùng `getOrDefault(k, mặcĐịnh)`' },
        { mark: 'ok', text: 'Tra cứu gần như tức thì, không phải quét cả danh sách như `List`' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐẾM TẦN SUẤT — VIỆC MAP LÀM HAY NHẤT 🔢',
      code: `for (String tu : cau.split(" "))
    dem.merge(tu, 1, Integer::sum);
// {java=3, la=1, va=1}`,
      notes: [
        { mark: 'ok', text: '`merge` gọn hơn hẳn `containsKey` + `get` + `put`' },
        { mark: 'dot', text: 'Duyệt bằng `for (Map.Entry<K,V> e : map.entrySet())`' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Thứ tự & trùng lặp → `List` · duy nhất → `Set` · tra theo khoá → `Map`' },
        { mark: 'next', text: '**Ngày 26**: sắp xếp — `Comparable` & `Comparator`' },
      ],
    },
  ],

  /* Output THẬT của `java TapHopVaBanDo` trên JDK 21 — không phải viết tay.
     Bản in dùng `new TreeMap<>(...)` khi hiện Map: `HashMap` không hứa thứ
     tự nào, để nguyên thì output đổi giữa các lần chạy và phép so hỏng. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '2) them lan 2 -> false  size 1',
      '3) LinkedHashSet giu thu tu them -> [chuoi, cam, buoi]',
      '4) TreeSet tu sap xep            -> [buoi, cam, chuoi]',
      '5) 0911111111 | size 2',
      '6) khong co khoa -> null | getOrDefault -> chua co',
      '7) dem tu -> {java=3, la=1, va=1}',
    ],
  },

  verify: {
    className: 'TapHopVaBanDo',
    source: `import java.util.*;

public class TapHopVaBanDo {
    public static void main(String[] args) {
        Set<String> email = new HashSet<>();
        email.add("an@abc.com");
        System.out.println("2) them lan 2 -> " + email.add("an@abc.com") + "  size " + email.size());

        Set<String> linked = new LinkedHashSet<>(List.of("chuoi", "cam", "buoi"));
        Set<String> tree = new TreeSet<>(List.of("chuoi", "cam", "buoi"));
        System.out.println("3) LinkedHashSet giu thu tu them -> " + linked);
        System.out.println("4) TreeSet tu sap xep            -> " + tree);

        Map<String, String> danhBa = new HashMap<>();
        danhBa.put("An", "0912345678");
        danhBa.put("Binh", "0987654321");
        danhBa.put("An", "0911111111");
        System.out.println("5) " + danhBa.get("An") + " | size " + danhBa.size());
        System.out.println("6) khong co khoa -> " + danhBa.get("Chi")
                + " | getOrDefault -> " + danhBa.getOrDefault("Chi", "chua co"));

        String cau = "java la java va java";
        Map<String, Integer> dem = new HashMap<>();
        for (String tu : cau.split(" ")) dem.merge(tu, 1, Integer::sum);
        System.out.println("7) dem tu -> " + new TreeMap<>(dem));
    }
}`,
  },
};
