/**
 * Thẻ bài học "100 Ngày Java" — Ngày 34: Đọc/ghi file với Files & Path.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-34.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 34,
  total: 100,
  titleLead: 'Java Day 34:',
  titleAccent: 'Đọc & ghi file',
  subtitle: 'Files · Path — và cách đọc file 2GB mà không tràn bộ nhớ 💾',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT DÒNG LÀ XONG 💾',
      code: `Path f = Path.of("diem.csv");
Files.writeString(f, "An,9.5\\nBinh,7.0\\n");
String all = Files.readString(f);
List<String> dong = Files.readAllLines(f);`,
      notes: [
        { mark: 'ok', text: 'Java 11+ — không còn `FileWriter` + `BufferedWriter` + `finally`' },
        { mark: 'dot', text: '`Path` thay `File` cũ: ghép đường dẫn bằng `resolve(...)`, không nối chuỗi' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. FILE LỚN: ĐỪNG NẠP HẾT VÀO RAM ⚠️',
      code: `try (Stream<String> st = Files.lines(f)) {     // doc TUNG dong
    double tb = st.map(l -> l.split(","))
                  .mapToDouble(p -> Double.parseDouble(p[1]))
                  .average().orElse(0);              // 8.33
}`,
      notes: [
        { mark: 'no', text: '`readString` một file 2GB = 2GB RAM = `OutOfMemoryError`' },
        { mark: 'ok', text: '`Files.lines` là Stream (**Ngày 31**) → PHẢI đặt trong `try(...)` (**Ngày 23**)' },
      ],
    },
    {
      tone: 'pink',
      title: '3. GHI THÊM, KHÔNG ĐÈ ✍️',
      code: `Files.writeString(f, "Dung,6.0\\n");                        // DE mat het
Files.writeString(f, "Dung,6.0\\n", StandardOpenOption.APPEND);  // ghi them`,
      notes: [{ mark: 'no', text: 'Mặc định là GHI ĐÈ — quên `APPEND` là mất sạch dữ liệu cũ' }],
    },
    {
      tone: 'green',
      title: '4. VIỆC VẶT & LỖI RÕ RÀNG 🧰',
      code: `Files.exists(f)   Files.size(f)   Files.copy(a, b)
Files.isDirectory(p)   Files.list(p)   Files.deleteIfExists(f)

Files.readString(khongCo)  // ✗ NoSuchFileException`,
      notes: [{ mark: 'ok', text: 'Ngoại lệ gọi đúng tên, không phải `false` im lặng như `File` cũ' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'File nhỏ → `readString`/`readAllLines` · file lớn → `Files.lines` trong `try(...)`' },
        { mark: 'next', text: '**Ngày 35**: Regex — bóc dữ liệu ra khỏi chuỗi bằng vài ký tự' },
      ],
    },
  ],

  /* Output THẬT của `java DocGhiFile` trên JDK 21 — không phải viết tay.
     Chương trình ghi vào thư mục tạm rồi tự xoá, nên chạy lại bao nhiêu
     lần cũng cho đúng một kết quả. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) da ghi, kich thuoc 24 byte',
      '2) doc ca file -> 3 dong',
      '4) diem trung binh -> 8.33',
      '5) sau khi APPEND -> 4 dong',
      '6) ton tai ban sao? true | thu muc? true',
      '7) file khong ton tai -> NoSuchFileException',
    ],
  },

  verify: {
    className: 'DocGhiFile',
    source: `import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class DocGhiFile {
    public static void main(String[] args) throws IOException {
        Path thuMuc = Files.createTempDirectory("java34");
        Path f = thuMuc.resolve("diem.csv");

        Files.writeString(f, "An,9.5\\nBinh,7.0\\nChi,8.5\\n");
        System.out.println("1) da ghi, kich thuoc " + Files.size(f) + " byte");

        String all = Files.readString(f);
        System.out.println("2) doc ca file -> " + all.lines().count() + " dong");

        try (Stream<String> st = Files.lines(f)) {
            double tb = st.map(l -> l.split(","))
                          .mapToDouble(p -> Double.parseDouble(p[1]))
                          .average().orElse(0);
            System.out.printf("4) diem trung binh -> %.2f%n", tb);
        }

        Files.writeString(f, "Dung,6.0\\n", StandardOpenOption.APPEND);
        System.out.println("5) sau khi APPEND -> " + Files.readAllLines(f).size() + " dong");

        Path ban = thuMuc.resolve("ban-sao.csv");
        Files.copy(f, ban, StandardCopyOption.REPLACE_EXISTING);
        System.out.println("6) ton tai ban sao? " + Files.exists(ban) + " | thu muc? " + Files.isDirectory(thuMuc));

        try { Files.readString(thuMuc.resolve("khong-co.txt")); }
        catch (NoSuchFileException e) { System.out.println("7) file khong ton tai -> NoSuchFileException"); }

        Files.deleteIfExists(ban);
        Files.deleteIfExists(f);
        Files.deleteIfExists(thuMuc);
    }
}`,
  },
};
