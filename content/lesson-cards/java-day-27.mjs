/**
 * Thẻ bài học "100 Ngày Java" — Ngày 27: Iterator & Iterable.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-27.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 27,
  total: 100,
  titleLead: 'Java Day 27:',
  titleAccent: 'Iterator',
  subtitle: 'Thứ nằm dưới mọi vòng for-each mà bạn chưa từng thấy mặt 🔁',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. for-each CHỈ LÀ LỚP ÁO 🔁',
      code: `for (String s : ds) { … }
// trinh dich bien thanh:
Iterator<String> it = ds.iterator();
while (it.hasNext()) { String s = it.next(); … }`,
      notes: [
        { mark: 'ok', text: 'Hai method: `hasNext()` còn không · `next()` lấy phần tử kế' },
        { mark: 'dot', text: 'Vì thế `ArrayList`, `HashSet`, `TreeMap.keySet()` duyệt cùng một cú pháp' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. XOÁ ĐÚNG CÁCH KHI ĐANG DUYỆT ✂️',
      code: `Iterator<String> it = ds.iterator();
while (it.hasNext())
    if (it.next().length() > 1) it.remove();   // ✓ [a, c]`,
      notes: [
        { mark: 'no', text: 'Xoá qua `ds.remove(...)` giữa vòng for-each → `ConcurrentModificationException` (**Ngày 24**)' },
        { mark: 'ok', text: '`it.remove()` báo cho iterator biết, nên nó không hoảng' },
      ],
    },
    {
      tone: 'pink',
      title: '3. next() QUÁ TAY 💥',
      code: `it.next();   // het phan tu roi van goi
// ✗ NoSuchElementException`,
      notes: [{ mark: 'ok', text: 'Luôn hỏi `hasNext()` trước — đó là lý do nó tồn tại' }],
    },
    {
      tone: 'green',
      title: '4. CLASS CỦA BẠN CŨNG for-each ĐƯỢC ✍️',
      code: `class LopHoc implements Iterable<String> {
    @Override public Iterator<String> iterator() { … }
}
for (String s : lop) { … }   // chay ngay`,
      notes: [{ mark: 'ok', text: 'Chỉ cần trả về một `Iterator` — `Iterable` đúng một method' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`Iterable` = "duyệt được" · `Iterator` = "người đang duyệt"' },
        { mark: 'next', text: '**Ngày 28**: `Deque`, `Queue`, `Stack` — hàng đợi và ngăn xếp' },
      ],
    },
  ],

  /* Output THẬT của `java DuyetQua` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) duyet tay -> a bo c do',
      '2) sau it.remove() -> [a, c]',
      '3) NoSuchElementException khi het phan tu',
      '4) for-each tren class tu viet -> An Binh',
    ],
  },

  verify: {
    className: 'DuyetQua',
    source: `import java.util.*;

class LopHoc implements Iterable<String> {
    private final List<String> hs = new ArrayList<>();
    void them(String s) { hs.add(s); }

    @Override public Iterator<String> iterator() {
        return new Iterator<String>() {
            private int i = 0;
            @Override public boolean hasNext() { return i < hs.size(); }
            @Override public String next() { return hs.get(i++); }
        };
    }
}

public class DuyetQua {
    public static void main(String[] args) {
        List<String> ds = new ArrayList<>(List.of("a", "bo", "c", "do"));

        Iterator<String> it = ds.iterator();
        StringBuilder sb = new StringBuilder();
        while (it.hasNext()) sb.append(it.next()).append(" ");
        System.out.println("1) duyet tay -> " + sb.toString().trim());

        Iterator<String> it2 = ds.iterator();
        while (it2.hasNext()) if (it2.next().length() > 1) it2.remove();
        System.out.println("2) sau it.remove() -> " + ds);

        Iterator<String> it3 = List.of("x").iterator();
        it3.next();
        try { it3.next(); }
        catch (NoSuchElementException e) { System.out.println("3) NoSuchElementException khi het phan tu"); }

        LopHoc lop = new LopHoc();
        lop.them("An"); lop.them("Binh");
        StringBuilder sb2 = new StringBuilder();
        for (String s : lop) sb2.append(s).append(" ");
        System.out.println("4) for-each tren class tu viet -> " + sb2.toString().trim());
    }
}`,
  },
};
