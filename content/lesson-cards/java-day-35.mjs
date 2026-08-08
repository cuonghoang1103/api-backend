/**
 * Thẻ bài học "100 Ngày Java" — Ngày 35: Biểu thức chính quy.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-35.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ ESCAPE HAI TẦNG: `verify.source` là template literal của JS. Muốn file
 * .java nhận được `\\d` (điều Java cần để regex thấy `\d`) thì ở đây phải gõ
 * BỐN dấu chéo `\\\\d`. Gõ hai dấu là Java nhận `\d` → không dịch được.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 35,
  total: 100,
  titleLead: 'Java Day 35:',
  titleAccent: 'Regex',
  subtitle: 'Mô tả HÌNH DẠNG của chuỗi — bóc dữ liệu bằng vài ký tự 🔍',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. KIỂM NHANH BẰNG matches 🔍',
      code: `"0912345678".matches("0\\\\d{9}")   // true
"091234".matches("0\\\\d{9}")       // false

// \\\\d so   \\\\w chu+so   \\\\s trang
// {9} dung 9 lan   + mot tro len   * khong tro len`,
      notes: [{ mark: 'ok', text: '`matches` đòi khớp TOÀN BỘ chuỗi, không phải khớp một phần' }],
    },
    {
      tone: 'yellow',
      title: '2. BÓC DỮ LIỆU BẰNG NHÓM ( ) 🎣',
      code: `Pattern p = Pattern.compile("^(\\\\S+) (\\\\S+) (\\\\w+) \\\\[(\\\\w+)\\\\] (.+)$");
Matcher m = p.matcher(log);
if (m.matches()) m.group(3);   // ERROR`,
      notes: [
        { mark: 'ok', text: 'Nhóm đặt tên `(?<mien>…)` rồi `m.group("mien")` — đỡ đếm số' },
        { mark: 'dot', text: '`find()` trong `while` để lấy MỌI chỗ khớp' },
      ],
    },
    {
      tone: 'pink',
      title: '3. THAY THẾ & TÁCH ✂️',
      code: `"1234-5678-9012-3456".replaceAll("\\\\d{4}-\\\\d{4}-\\\\d{4}", "****-****-****")
// ****-****-****-3456

"a, b;c |d".split("[,;|]\\\\s*")   // [a, b, c , d]`,
      notes: [{ mark: 'ok', text: '`split` của **Ngày 09** vốn đã nhận regex — nay dùng được hết sức' }],
    },
    {
      tone: 'green',
      title: '4. HAI CÁI BẪY ⚠️',
      code: `"1x3".matches("1.3")     // true  — dau cham khop MOI ky tu
"1x3".matches("1\\\\.3")   // false — phai escape

Pattern.compile("([a-z")  // ✗ PatternSyntaxException luc CHAY`,
      notes: [
        { mark: 'no', text: 'Regex sai cú pháp KHÔNG bị bắt lúc dịch — nó là chuỗi, không phải mã' },
        { mark: 'ok', text: 'Dùng nhiều lần thì `Pattern.compile` MỘT lần rồi tái sử dụng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Regex mạnh cho chuỗi có KHUÔN — đừng dùng để phân tích HTML hay JSON' },
        { mark: 'next', text: '**Ngày 36**: `StringBuilder` và xử lý chuỗi hiệu năng cao' },
      ],
    },
  ],

  /* Output THẬT của `java Regex` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) '0912345678' la sdt? true | '091234' ? false",
      '2) ngay=2026-08-09 muc=ERROR module=db',
      '4) cac ten mien -> [fpt.edu.vn, gmail.com]',
      '5) The: ****-****-****-3456',
      '7) \'1x3\'.matches("1.3") -> true | escape \\. -> false',
      '8) regex sai -> PatternSyntaxException',
    ],
  },

  verify: {
    className: 'Regex',
    source: `import java.util.*;
import java.util.regex.*;

public class Regex {
    public static void main(String[] args) {
        System.out.println("1) '0912345678' la sdt? " + "0912345678".matches("0\\\\d{9}")
                + " | '091234' ? " + "091234".matches("0\\\\d{9}"));

        String log = "2026-08-09 09:15:03 ERROR [db] Connection timeout after 30s";
        Pattern p = Pattern.compile("^(\\\\S+) (\\\\S+) (\\\\w+) \\\\[(\\\\w+)\\\\] (.+)$");
        Matcher m = p.matcher(log);
        if (m.matches()) {
            System.out.println("2) ngay=" + m.group(1) + " muc=" + m.group(3) + " module=" + m.group(4));
        }

        Pattern email = Pattern.compile("(?<ten>[\\\\w.]+)@(?<mien>[\\\\w.]+\\\\.\\\\w+)");
        Matcher me = email.matcher("lien he: an.nguyen@fpt.edu.vn hoac binh@gmail.com");
        List<String> mien = new ArrayList<>();
        while (me.find()) mien.add(me.group("mien"));
        System.out.println("4) cac ten mien -> " + mien);

        String che = "The: 1234-5678-9012-3456".replaceAll("\\\\d{4}-\\\\d{4}-\\\\d{4}", "****-****-****");
        System.out.println("5) " + che);

        System.out.println("7) '1x3'.matches(\\"1.3\\") -> " + "1x3".matches("1.3")
                + " | escape \\\\. -> " + "1x3".matches("1\\\\.3"));

        try { Pattern.compile("([a-z"); }
        catch (PatternSyntaxException e) { System.out.println("8) regex sai -> PatternSyntaxException"); }
    }
}`,
  },
};
