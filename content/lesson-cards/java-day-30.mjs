/**
 * Thẻ bài học "100 Ngày Java" — Ngày 30: Lambda.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-30.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 30,
  total: 100,
  titleLead: 'Java Day 30:',
  titleAccent: 'Lambda',
  subtitle: 'Năm dòng thủ tục rút còn một dòng việc thật λ',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NĂM DÒNG THÀNH MỘT λ',
      code: `ds.sort(new Comparator<String>() {          // cach cu
    @Override public int compare(String a, String b) {
        return a.compareTo(b);
    }
});
ds.sort((a, b) -> a.compareTo(b));           // lambda`,
      notes: [
        { mark: 'ok', text: 'Cùng một việc — bỏ hết phần thủ tục, giữ lại đúng hành vi' },
        { mark: 'dot', text: 'Rút gọn của lớp nặc danh ở **Ngày 27**' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. CHỈ HỢP LỆ VỚI INTERFACE MỘT METHOD 🎯',
      code: `@FunctionalInterface
interface PhepTinh { double tinh(double a, double b); }

PhepTinh cong = (a, b) -> a + b;    // 7.0
PhepTinh nhan = (a, b) -> a * b;    // 12.0`,
      notes: [
        { mark: 'ok', text: 'Một method trừu tượng ⇒ Java biết lambda là bản hiện thực của method đó' },
        { mark: 'dot', text: '`@FunctionalInterface` để trình dịch canh giúp — thêm method thứ hai là báo lỗi' },
      ],
    },
    {
      tone: 'pink',
      title: '3. BỐN CÁI TÊN PHẢI THUỘC 🧰',
      code: `Predicate<T>     t -> boolean     .test()
Function<T,R>    t -> R           .apply()
Consumer<T>      t -> void        .accept()
Supplier<T>      () -> T          .get()`,
      notes: [{ mark: 'ok', text: 'Cả Stream API (Ngày 31) đứng trên đúng bốn interface này' }],
    },
    {
      tone: 'green',
      title: '4. BIẾN NGOÀI PHẢI BẤT BIẾN 🔒',
      code: `int dem = 0;
Runnable r = () -> System.out.println(dem);
dem = 5;   // ✗ local variables referenced from a lambda
           //   must be final or effectively final`,
      notes: [
        { mark: 'dot', text: 'Không cần gõ `final`, chỉ cần **không gán lại** sau đó' },
        { mark: 'ok', text: 'Method reference: `s -> s.length()` viết gọn là `String::length`' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Lambda = truyền HÀNH VI làm tham số, không chỉ truyền dữ liệu' },
        { mark: 'next', text: '**Ngày 31**: Stream API — lọc, biến đổi, gom trong một dây chuyền' },
      ],
    },
  ],

  /* Output THẬT của `java LambdaDemo` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) cong=7.0 nhan=12.0',
      '2) sort lambda -> [An, Binh, Chi]',
      '3) reverseOrder -> [Chi, Binh, An]',
      '4) Predicate=false Function=4 Supplier=xin chao',
      '5) removeIf -> [5, 9]',
      '7) bien ngoai -> 50',
    ],
  },

  verify: {
    className: 'LambdaDemo',
    source: `import java.util.*;
import java.util.function.*;

@FunctionalInterface
interface PhepTinh { double tinh(double a, double b); }

public class LambdaDemo {
    public static void main(String[] args) {
        PhepTinh cong = (a, b) -> a + b;
        PhepTinh nhan = (a, b) -> a * b;
        System.out.println("1) cong=" + cong.tinh(3, 4) + " nhan=" + nhan.tinh(3, 4));

        List<String> ten = new ArrayList<>(List.of("Chi", "An", "Binh"));
        ten.sort((a, b) -> a.compareTo(b));
        System.out.println("2) sort lambda -> " + ten);
        ten.sort(Comparator.reverseOrder());
        System.out.println("3) reverseOrder -> " + ten);

        Predicate<String> dai = s -> s.length() > 2;
        Function<String, Integer> doDai = String::length;
        Supplier<String> chao = () -> "xin chao";
        System.out.println("4) Predicate=" + dai.test("An") + " Function=" + doDai.apply("Binh")
                + " Supplier=" + chao.get());

        List<Integer> so = new ArrayList<>(List.of(5, 2, 9, 1));
        so.removeIf(n -> n < 3);
        System.out.println("5) removeIf -> " + so);

        int he = 10;
        Function<Integer, Integer> nhanHeSo = n -> n * he;
        System.out.println("7) bien ngoai -> " + nhanHeSo.apply(5));
    }
}`,
  },
};
