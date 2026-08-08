/**
 * Thẻ bài học "100 Ngày Java" — Ngày 26: Comparable & Comparator.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-26.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 26,
  total: 100,
  titleLead: 'Java Day 26:',
  titleAccent: 'Comparable & Comparator',
  subtitle: 'Dạy Java biết thứ tự của class do bạn viết 🔤',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. Comparable — THỨ TỰ TỰ NHIÊN 🔤',
      code: `class SinhVien implements Comparable<SinhVien> {
    @Override public int compareTo(SinhVien o) {
        return ten.compareTo(o.ten);      // < 0 · 0 · > 0
    }
}
Collections.sort(ds);   // dung compareTo`,
      notes: [
        { mark: 'ok', text: 'MỘT thứ tự mặc định, gắn liền với class — `TreeSet`/`TreeMap` cũng dùng nó' },
        { mark: 'dot', text: 'Trả số ÂM · 0 · DƯƠNG, không phải `true/false`' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. Comparator — THỨ TỰ NHẤT THỜI 🔀',
      code: `ds.sort(Comparator.comparingDouble(s -> s.diem));
ds.sort(Comparator.comparingDouble((SinhVien s) -> s.diem).reversed());
ds.sort(cmp.reversed().thenComparing(s -> s.ten));   // tie-break`,
      notes: [
        { mark: 'ok', text: 'Bao nhiêu kiểu sắp cũng được, **không đụng vào class**' },
        { mark: 'ok', text: 'Sắp theo class của thư viện (không sửa được) thì chỉ có cách này' },
      ],
    },
    {
      tone: 'pink',
      title: '3. BẪY: TRỪ HAI SỐ CÓ THỂ TRÀN ⚠️',
      code: `return a - b;               // ✗ 2000000000 - (-2000000000)
                            //   = -294967296  (tran int!)
return Integer.compare(a, b);   // ✓ an toan`,
      notes: [{ mark: 'no', text: 'Mẹo `a - b` chạy đúng suốt… tới ngày gặp số lớn — nối tràn số **Ngày 03**' }],
    },
    {
      tone: 'green',
      title: '4. NHẤT QUÁN VỚI equals 🤝',
      code: `compareTo(...) == 0   ⇔   equals(...) == true

// khong nhat quan -> TreeSet/TreeMap xu su la lung`,
      notes: [{ mark: 'dot', text: '`TreeSet` coi trùng theo `compareTo`, `HashSet` theo `equals` (**Ngày 20**)' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Một thứ tự "đương nhiên" → `Comparable` · nhiều kiểu sắp → `Comparator`' },
        { mark: 'next', text: '**Ngày 27**: `Iterator`, `Iterable` và vòng for-each thật ra là gì' },
      ],
    },
  ],

  /* Output THẬT của `java SapXep` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) tu nhien (ten)   -> [An(9.5,22), Binh(8.0,19), Chi(8.0,20)]',
      '2) theo diem tang   -> [Binh(8.0,19), Chi(8.0,20), An(9.5,22)]',
      '3) theo diem giam   -> [An(9.5,22), Binh(8.0,19), Chi(8.0,20)]',
      '6) (int)(a-b) voi a=2000000000,b=-2000000000 -> -294967296',
      '7) Integer.compare an toan               -> 1',
    ],
  },

  verify: {
    className: 'SapXep',
    source: `import java.util.*;

class SinhVien implements Comparable<SinhVien> {
    final String ten; final double diem; final int tuoi;
    SinhVien(String ten, double diem, int tuoi) { this.ten = ten; this.diem = diem; this.tuoi = tuoi; }

    @Override public int compareTo(SinhVien o) { return ten.compareTo(o.ten); }
    @Override public String toString() { return ten + "(" + diem + "," + tuoi + ")"; }
}

public class SapXep {
    public static void main(String[] args) {
        List<SinhVien> ds = new ArrayList<>(List.of(
                new SinhVien("Chi", 8.0, 20),
                new SinhVien("An", 9.5, 22),
                new SinhVien("Binh", 8.0, 19)));

        Collections.sort(ds);
        System.out.println("1) tu nhien (ten)   -> " + ds);

        ds.sort(Comparator.comparingDouble(s -> s.diem));
        System.out.println("2) theo diem tang   -> " + ds);

        ds.sort(Comparator.comparingDouble((SinhVien s) -> s.diem).reversed());
        System.out.println("3) theo diem giam   -> " + ds);

        System.out.println("6) (int)(a-b) voi a=2000000000,b=-2000000000 -> " + (2000000000 - (-2000000000)));
        System.out.println("7) Integer.compare an toan               -> " + Integer.compare(2000000000, -2000000000));
    }
}`,
  },
};
