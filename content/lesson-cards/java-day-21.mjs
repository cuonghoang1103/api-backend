/**
 * Thẻ bài học "100 Ngày Java" — Ngày 21: Ngoại lệ (try/catch/finally).
 * Mở Giai đoạn 3.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-21.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 21,
  total: 100,
  titleLead: 'Java Day 21:',
  titleAccent: 'Ngoại lệ',
  subtitle: 'try · catch · finally — khi đời không chạy đúng đường 💥',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BỐN CÁI TÊN GẶP HÀNG NGÀY 💥',
      code: `10 / 0                 → ArithmeticException: / by zero
Integer.parseInt("abc") → NumberFormatException
a[5] voi a.length = 3   → ArrayIndexOutOfBoundsException
null.length()           → NullPointerException`,
      notes: [{ mark: 'dot', text: 'Nhớ mặt bốn cái này là đọc được 80% stack trace đầu đời' }],
    },
    {
      tone: 'yellow',
      title: '2. try · catch — BẮT ĐÚNG LOẠI 🎣',
      code: `try {
    int x = Integer.parseInt(nhap);
} catch (NumberFormatException e) {
    System.out.println("Vui long nhap so");
}`,
      notes: [
        { mark: 'ok', text: '`e.getMessage()` cho biết CHUYỆN GÌ · `e.printStackTrace()` cho biết Ở ĐÂU' },
        { mark: 'no', text: 'Bắt `Exception` TRƯỚC loại hẹp: *exception … has already been caught*' },
      ],
    },
    {
      tone: 'pink',
      title: '3. finally LUÔN CHẠY 🔚',
      code: `static String thu() {
    try { return "tu try"; }
    finally { System.out.println("finally van chay"); }
}
// finally chay TRUOC khi ham thoat`,
      notes: [{ mark: 'ok', text: 'Đóng file, đóng kết nối, mở khoá — việc dọn dẹp đặt ở đây mới chắc' }],
    },
    {
      tone: 'green',
      title: '4. TỘI ÁC: catch RỖNG ☠️',
      code: `try { … }
catch (Exception e) { }   // ☠️ nuot loi, khong ai biet

catch (Exception e) {     // it nhat phai the nay
    log.error("khong doc duoc file", e);
}`,
      notes: [
        { mark: 'no', text: 'Nuốt lỗi = biến một lỗi to tiếng thành một bug im lặng, tìm cả tuần' },
        { mark: 'ok', text: 'Không xử lý được thì **để nó nổ**, đừng giả vờ không thấy' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`try` bọc phần có thể hỏng · `catch` xử lý · `finally` dọn dẹp' },
        { mark: 'next', text: '**Ngày 22**: checked vs unchecked · `throw` · ngoại lệ tự viết' },
      ],
    },
  ],

  /* Output THẬT của `java NgoaiLe` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) ArithmeticException: / by zero',
      '2) NumberFormatException: For input string: "mot tram"',
      '3) ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3',
      '4) NullPointerException da bi bat',
      '   finally van chay truoc khi ham thoat',
      '5) ket qua = tu try',
    ],
  },

  verify: {
    className: 'NgoaiLe',
    source: `public class NgoaiLe {

    static int chia(int a, int b) { return a / b; }

    public static void main(String[] args) {
        try {
            chia(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("1) " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }

        try {
            Integer.parseInt("mot tram");
        } catch (NumberFormatException e) {
            System.out.println("2) " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }

        int[] a = {1, 2, 3};
        try {
            System.out.println(a[5]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("3) " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }

        String s = null;
        try {
            s.length();
        } catch (NullPointerException e) {
            System.out.println("4) NullPointerException da bi bat");
        }

        System.out.println("5) ket qua = " + thu());
    }

    static String thu() {
        try {
            return "tu try";
        } finally {
            System.out.println("   finally van chay truoc khi ham thoat");
        }
    }
}`,
  },
};
