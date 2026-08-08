/**
 * Thẻ bài học "100 Ngày Java" — Ngày 24: ArrayList. Mở Giai đoạn 4.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-24.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 24,
  total: 100,
  titleLead: 'Java Day 24:',
  titleAccent: 'ArrayList',
  subtitle: 'Danh sách co giãn — và ba cái bẫy ai cũng dính một lần 📚',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. THOÁT KHỎI MẢNG CỐ ĐỊNH 📚',
      code: `List<String> ds = new ArrayList<>();   // khai LIST, dung ARRAYLIST
ds.add("An");  ds.add(1, "Bao");       // them cuoi / chen giua
ds.remove("Bao");  ds.size();  ds.get(0);`,
      notes: [
        { mark: 'ok', text: 'Tự lớn, tự dồn khi xoá — hết chép mảng tay như **Ngày 08**' },
        { mark: 'dot', text: 'Khai kiểu `List` để đổi sang `LinkedList` không phải sửa gì (**Ngày 18**)' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. BẪY 1: remove(1) HAY remove(30)? ⚠️',
      code: `List<Integer> so = new ArrayList<>(List.of(10, 20, 30));
so.remove(1);                  // CHI SO -> [10, 30]
so.remove(Integer.valueOf(30)); // GIA TRI -> [10]`,
      notes: [{ mark: 'no', text: 'Với `List<Integer>`, `remove(int)` xoá theo VỊ TRÍ — không phải theo giá trị' }],
    },
    {
      tone: 'pink',
      title: '3. BẪY 2: VỪA DUYỆT VỪA XOÁ 💥',
      code: `for (String s : t)
    if (s.length() > 1) t.remove(s);
// ✗ ConcurrentModificationException

t.removeIf(s -> s.length() > 1);   // ✓ cach dung`,
      notes: [{ mark: 'ok', text: 'Hoặc `Iterator.remove()` — đừng sửa danh sách khi đang duyệt nó' }],
    },
    {
      tone: 'green',
      title: '4. BẪY 3: Arrays.asList CỨNG ĐƠ 🧊',
      code: `List<String> l = Arrays.asList("x", "y");
l.add("z");   // ✗ UnsupportedOperationException
// muon sua: new ArrayList<>(Arrays.asList(...))`,
      notes: [{ mark: 'dot', text: '`List.of(...)` còn cứng hơn: không sửa được phần tử nào cả' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Cần danh sách co giãn, truy cập theo chỉ số nhanh → `ArrayList`' },
        { mark: 'next', text: '**Ngày 25**: `Set` & `Map` — chống trùng và tra cứu theo khoá' },
      ],
    },
  ],

  /* Output THẬT của `java DanhSach` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) [An, Bao, Binh, Chi] | size 4',
      '4) remove(1)          -> [10, 30]',
      '5) remove(valueOf(30))-> [10]',
      '6) ConcurrentModificationException khi vua duyet vua xoa',
      '7) removeIf -> [a, c]',
      '8) Arrays.asList khong them duoc',
    ],
  },

  verify: {
    className: 'DanhSach',
    source: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DanhSach {
    public static void main(String[] args) {
        List<String> ds = new ArrayList<>();
        ds.add("An"); ds.add("Binh"); ds.add("Chi");
        ds.add(1, "Bao");

        System.out.println("1) " + ds + " | size " + ds.size());

        List<Integer> so = new ArrayList<>(List.of(10, 20, 30));
        so.remove(1);
        System.out.println("4) remove(1)          -> " + so);
        so.remove(Integer.valueOf(30));
        System.out.println("5) remove(valueOf(30))-> " + so);

        List<String> t = new ArrayList<>(List.of("a", "bo", "c", "do"));
        try {
            for (String s : t) if (s.length() > 1) t.remove(s);
        } catch (Exception e) {
            System.out.println("6) " + e.getClass().getSimpleName() + " khi vua duyet vua xoa");
        }
        t.removeIf(s -> s.length() > 1);
        System.out.println("7) removeIf -> " + t);

        List<String> coDinh = Arrays.asList("x", "y");
        try { coDinh.add("z"); }
        catch (UnsupportedOperationException e) { System.out.println("8) Arrays.asList khong them duoc"); }
    }
}`,
  },
};
