/**
 * Thẻ bài học "100 Ngày Java" — Ngày 29: Generics. Mở Giai đoạn 5.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-29.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 29,
  total: 100,
  titleLead: 'Java Day 29:',
  titleAccent: 'Generics',
  subtitle: 'Cặp ngoặc <> dùng suốt tuần rốt cuộc là gì 📦',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT CLASS, MỌI KIỂU 📦',
      code: `class Hop<T> {
    private T noiDung;
    void dat(T x) { noiDung = x; }
    T lay() { return noiDung; }
}
Hop<String> h = new Hop<>();
String s = h.lay();      // KHONG can ep kieu`,
      notes: [
        { mark: 'ok', text: '`T` là chỗ trống, người dùng điền kiểu thật lúc khai báo' },
        { mark: 'dot', text: 'Quy ước tên: **T**ype · **E**lement · **K**ey · **V**alue' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. RÀNG BUỘC extends 🔒',
      code: `class ThongKe<T extends Comparable<T>> {
    T lonNhat() { return Collections.max(ds); }
}
// chi nhan kieu SO SANH DUOC (Ngay 26)`,
      notes: [{ mark: 'ok', text: 'Không ràng buộc thì bên trong chỉ gọi được method của `Object`' }],
    },
    {
      tone: 'pink',
      title: '3. WILDCARD ? — NHẬN RỘNG HƠN 🃏',
      code: `static double tong(List<? extends Number> ds) { … }
tong(List.of(1, 2, 3));      // 6.0
tong(List.of(1.5, 2.5));     // 4.0`,
      notes: [
        { mark: 'no', text: '`List<Integer>` **KHÔNG** phải `List<Number>` — nên mới cần `?`' },
        { mark: 'dot', text: 'Đọc chỉ dùng `? extends` · ghi vào dùng `? super`' },
      ],
    },
    {
      tone: 'green',
      title: '4. TYPE ERASURE — LÚC CHẠY KIỂU BIẾN MẤT 👻',
      code: `Hop<String> h1;  Hop<Integer> h2;
h1.getClass() == h2.getClass()   // true !

List raw = new ArrayList();      // raw type
(String) raw.get(1)              // ClassCastException luc CHAY`,
      notes: [
        { mark: 'dot', text: 'Generics là phép kiểm **lúc DỊCH**; bytecode không giữ lại `<T>`' },
        { mark: 'no', text: 'Vì thế không có `new T[]`, không `instanceof List<String>`' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Generics = dùng lại code cho mọi kiểu mà **không mất an toàn kiểu**' },
        { mark: 'next', text: '**Ngày 30**: Lambda — viết hành vi gọn còn một dòng' },
      ],
    },
  ],

  /* Output THẬT của `java GenericDemo` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) Hop<String> -> xin chao',
      '2) Hop<Integer> -> 50',
      '3) lon nhat -> 19',
      '5) wildcard tong  -> 6.0 / 4.0',
      '6) erasure: cung mot class? true',
      '7) raw type -> ClassCastException luc CHAY',
    ],
  },

  verify: {
    className: 'GenericDemo',
    source: `import java.util.*;

class Hop<T> {
    private T noiDung;
    void dat(T x) { noiDung = x; }
    T lay() { return noiDung; }
}

class ThongKe<T extends Comparable<T>> {
    private final List<T> ds = new ArrayList<>();
    void them(T x) { ds.add(x); }
    T lonNhat() { return Collections.max(ds); }
}

public class GenericDemo {
    static double tong(List<? extends Number> ds) {
        double s = 0;
        for (Number n : ds) s += n.doubleValue();
        return s;
    }

    public static void main(String[] args) {
        Hop<String> h1 = new Hop<>();
        h1.dat("xin chao");
        String s = h1.lay();
        System.out.println("1) Hop<String> -> " + s);

        Hop<Integer> h2 = new Hop<>();
        h2.dat(42);
        System.out.println("2) Hop<Integer> -> " + (h2.lay() + 8));

        ThongKe<Integer> tk = new ThongKe<>();
        tk.them(5); tk.them(19); tk.them(7);
        System.out.println("3) lon nhat -> " + tk.lonNhat());

        System.out.println("5) wildcard tong  -> " + tong(List.of(1, 2, 3)) + " / " + tong(List.of(1.5, 2.5)));

        System.out.println("6) erasure: cung mot class? " + (h1.getClass() == h2.getClass()));

        List raw = new ArrayList();
        raw.add("chuoi"); raw.add(123);
        try {
            for (Object o : raw) { String x = (String) o; }
        } catch (ClassCastException e) {
            System.out.println("7) raw type -> ClassCastException luc CHAY");
        }
    }
}`,
  },
};
