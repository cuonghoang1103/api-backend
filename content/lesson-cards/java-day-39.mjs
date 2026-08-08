/**
 * Thẻ bài học "100 Ngày Java" — Ngày 39: switch biểu thức & pattern matching.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-39.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 39,
  total: 100,
  titleLead: 'Java Day 39:',
  titleAccent: 'switch mới',
  subtitle: 'Mũi tên -> , hết rơi nhánh, và pattern matching 🏹',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. LỖI RƠI NHÁNH — CHỨNG MINH BẰNG SỐ 🏹',
      code: `case 2: r = "Mua dong";    // QUEN break
case 3: r = "Mua xuan"; break;
// thang 2 -> "Mua xuan"  ← sai, va khong ai bao`,
      notes: [
        { mark: 'no', text: 'Trình dịch KHÔNG cảnh báo — đây là lỗi âm thầm kinh điển của `switch` cũ (**Ngày 05**)' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. switch BIỂU THỨC: TRẢ THẲNG GIÁ TRỊ ✅',
      code: `return switch (thang) {
    case 12, 1, 2 -> "Mua dong";     // gop nhieu gia tri
    case 3, 4, 5  -> "Mua xuan";
    default       -> "Mua thu";
};`,
      notes: [
        { mark: 'ok', text: 'Mũi tên `->` KHÔNG rơi nhánh · không cần `break`' },
        { mark: 'ok', text: 'Là BIỂU THỨC nên gán/return thẳng được; thiếu nhánh là lỗi lúc dịch' },
      ],
    },
    {
      tone: 'pink',
      title: '3. yield KHI NHÁNH CẦN NHIỀU CÂU 🧱',
      code: `default -> {
    String s = diem >= 6.5 ? "Kha" : "Trung binh";
    yield s + " (" + diem + ")";      // tra gia tri cho nhanh
}`,
      notes: [{ mark: 'dot', text: '`yield` trả giá trị cho NHÁNH; `return` thoát cả method' }],
    },
    {
      tone: 'green',
      title: '4. PATTERN MATCHING 🎯',
      code: `switch (o) {
    case Integer i when i > 100 -> "so nguyen lon: " + i;
    case Integer i -> "so nguyen: " + i;
    case String s  -> "chuoi dai " + s.length();
    case null      -> "khong co gi";
    default        -> "kieu khac";
}`,
      notes: [
        { mark: 'ok', text: 'Kiểm kiểu + ép kiểu + đặt tên biến trong MỘT nhịp — thay chuỗi `instanceof` của **Ngày 16**' },
        { mark: 'ok', text: '`when` thêm điều kiện · `case null` xử lý được `null` (switch cũ thì nổ NPE)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Từ nay mặc định viết `switch` mũi tên — bản cũ chỉ để đọc code người khác' },
        { mark: 'next', text: '**Ngày 40**: khép Giai đoạn 5 — ôn tập & bài tập tổng hợp' },
      ],
    },
  ],

  /* Output THẬT của `java SwitchMoi` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) switch cu, thang 2 -> Mua xuan   (bi ROI xuong nhanh duoi!)',
      '2) switch moi, thang 2 -> Mua dong',
      '3) thang 7 -> Mua he | thang 10 -> Mua thu',
      '4) xep loai 9.5 -> Xuat sac | 7.0 -> Kha (7.0)',
      '5) so nguyen lon: 500',
      '6) so nguyen: 42 | chuoi dai 8',
      '7) khong co gi | kieu khac: Double',
    ],
  },

  verify: {
    className: 'SwitchMoi',
    source: `public class SwitchMoi {

    static String cuLoi(int thang) {
        String r = "";
        switch (thang) {
            case 12:
            case 1:
            case 2: r = "Mua dong";
            case 3: r = "Mua xuan"; break;
            default: r = "Khac";
        }
        return r;
    }

    static String moi(int thang) {
        return switch (thang) {
            case 12, 1, 2 -> "Mua dong";
            case 3, 4, 5  -> "Mua xuan";
            case 6, 7, 8  -> "Mua he";
            default       -> "Mua thu";
        };
    }

    static String xepLoai(double diem) {
        return switch ((int) diem) {
            case 9, 10 -> "Xuat sac";
            case 8 -> "Gioi";
            default -> {
                String s = diem >= 6.5 ? "Kha" : "Trung binh";
                yield s + " (" + diem + ")";
            }
        };
    }

    static String mota(Object o) {
        return switch (o) {
            case Integer i when i > 100 -> "so nguyen lon: " + i;
            case Integer i -> "so nguyen: " + i;
            case String s -> "chuoi dai " + s.length();
            case null -> "khong co gi";
            default -> "kieu khac: " + o.getClass().getSimpleName();
        };
    }

    public static void main(String[] args) {
        System.out.println("1) switch cu, thang 2 -> " + cuLoi(2) + "   (bi ROI xuong nhanh duoi!)");
        System.out.println("2) switch moi, thang 2 -> " + moi(2));
        System.out.println("3) thang 7 -> " + moi(7) + " | thang 10 -> " + moi(10));
        System.out.println("4) xep loai 9.5 -> " + xepLoai(9.5) + " | 7.0 -> " + xepLoai(7.0));
        System.out.println("5) " + mota(500));
        System.out.println("6) " + mota(42) + " | " + mota("xin chao"));
        System.out.println("7) " + mota(null) + " | " + mota(3.14));
    }
}`,
  },
};
