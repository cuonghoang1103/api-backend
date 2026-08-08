/**
 * Thẻ bài học "100 Ngày Java" — Ngày 23: try-with-resources.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-23.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 23,
  total: 100,
  titleLead: 'Java Day 23:',
  titleAccent: 'try-with-resources',
  subtitle: 'Java tự đóng hộ — tám dòng dọn dẹp rút còn một 🚰',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. TÁM DÒNG THÀNH MỘT 🚰',
      code: `try (BufferedReader br = new BufferedReader(new FileReader(f))) {
    while (br.readLine() != null) dem++;
}   // ← tu dong dong, khong can finally`,
      notes: [
        { mark: 'no', text: 'Cách cũ: `finally` + kiểm `null` + `try/catch` lồng quanh `close()`' },
        { mark: 'ok', text: 'Java 7+ · điều kiện duy nhất: class đó `implements AutoCloseable`' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ĐÓNG NGƯỢC THỨ TỰ MỞ 🔄',
      code: `try (KetNoi a = new KetNoi("A"); KetNoi b = new KetNoi("B")) { }
// mo   A → mo   B → dong B → dong A`,
      notes: [{ mark: 'ok', text: 'Đúng chiều phụ thuộc: B mở sau, có thể đang dùng A, nên phải đóng trước' }],
    },
    {
      tone: 'pink',
      title: '3. CÓ LỖI VẪN ĐÓNG 🛡️',
      code: `try (KetNoi c = new KetNoi("C")) {
    throw new IllegalStateException("hong giua chung");
}
// dong C  ← chay TRUOC khi catch nhan duoc loi`,
      notes: [{ mark: 'ok', text: 'Rò rỉ tài nguyên là bug âm thầm: chạy vài ngày mới hết handle rồi sập' }],
    },
    {
      tone: 'green',
      title: '4. TỰ VIẾT TÀI NGUYÊN ✍️',
      code: `class KetNoi implements AutoCloseable {
    @Override public void close() { … }   // Java goi giup
}`,
      notes: [
        { mark: 'dot', text: 'Đúng một method — mọi thứ trong `java.io`, JDBC, socket đều theo chuẩn này' },
        { mark: 'ok', text: 'Lỗi trong `close()` thành *suppressed* — lấy bằng `e.getSuppressed()`' },
      ],
    },
    {
      tone: 'blue',
      title: '5. HẾT PHẦN NGOẠI LỆ 📌',
      notes: [
        { mark: 'ok', text: 'Mở tài nguyên gì cũng đặt trong `try(...)` — thành phản xạ' },
        { mark: 'next', text: '**Ngày 24**: `ArrayList` — thoát khỏi mảng cố định của Ngày 08' },
      ],
    },
  ],

  /* Output THẬT của `java TaiNguyen` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'mo   A',
      'mo   B',
      'dong B',
      'dong A',
      'mo   C',
      'dong C',
      'bat duoc: hong giua chung',
      'doc duoc 3 dong',
    ],
  },

  verify: {
    className: 'TaiNguyen',
    source: `import java.io.*;
import java.nio.file.*;

class KetNoi implements AutoCloseable {
    private final String ten;
    KetNoi(String ten) { this.ten = ten; System.out.println("mo   " + ten); }
    @Override public void close() { System.out.println("dong " + ten); }
}

public class TaiNguyen {
    public static void main(String[] args) throws IOException {
        try (KetNoi a = new KetNoi("A"); KetNoi b = new KetNoi("B")) {
        }

        try (KetNoi c = new KetNoi("C")) {
            throw new IllegalStateException("hong giua chung");
        } catch (IllegalStateException e) {
            System.out.println("bat duoc: " + e.getMessage());
        }

        Path p = Files.createTempFile("java23", ".txt");
        Files.writeString(p, "dong 1\\ndong 2\\ndong 3\\n");
        int dem = 0;
        try (BufferedReader br = new BufferedReader(new FileReader(p.toFile()))) {
            while (br.readLine() != null) dem++;
        }
        System.out.println("doc duoc " + dem + " dong");
        Files.deleteIfExists(p);
    }
}`,
  },
};
