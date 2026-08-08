/**
 * Thẻ bài học "100 Ngày Java" — Ngày 36: StringBuilder & xử lý chuỗi.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-36.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Script so khớp CHÍNH XÁC từng dòng —
 * nên chương trình đo hiệu năng ở đây KHÔNG in số mili-giây (số đó đổi mỗi
 * lần chạy), mà in một kết luận ổn định: "nhanh hơn ít nhất 10 lần?".
 */
export default {
  series: '100 NGÀY JAVA',
  day: 36,
  total: 100,
  titleLead: 'Java Day 36:',
  titleAccent: 'StringBuilder',
  subtitle: 'Vì sao nối chuỗi bằng dấu + trong vòng lặp là một cái bẫy ⚡',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. PHÉP ĐO THẬT ⚡',
      code: `String s = "";
for (int i = 0; i < 50000; i++) s += "x";      // moi vong TAO CHUOI MOI

StringBuilder sb = new StringBuilder();
for (int i = 0; i < 50000; i++) sb.append("x"); // sua tren cung bo dem
// ket qua giong het nhau, nhung nhanh hon >10 lan`,
      notes: [
        { mark: 'dot', text: '`String` bất biến (**Ngày 09**) → mỗi `+` chép lại TOÀN BỘ nội dung cũ' },
        { mark: 'ok', text: '50.000 vòng = 50.000 lần chép, độ dài tăng dần → chậm theo bình phương' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. KHI NÀO DÙNG CÁI NÀO 🧭',
      code: `"Xin chao " + ten + "!"     // ✓ + van tot: 1 lan, trinh dich tu toi uu
for (...) sb.append(x);      // ✓ trong VONG LAP thi phai StringBuilder`,
      notes: [{ mark: 'no', text: 'Đừng thay mọi dấu `+` bằng `StringBuilder` — code xấu mà chẳng nhanh hơn' }],
    },
    {
      tone: 'pink',
      title: '3. VIỆC MÀ String KHÔNG LÀM ĐƯỢC 🔧',
      code: `StringBuilder b = new StringBuilder("Java");
b.append(" 100").insert(0, ">> ").reverse();
// 001 avaJ >>`,
      notes: [{ mark: 'ok', text: '`append` · `insert` · `delete` · `reverse` · `setCharAt` — sửa tại chỗ, nối chuỗi được' }],
    },
    {
      tone: 'green',
      title: '4. BỘ BA TIỆN TAY 🧰',
      code: `String.format("%-6s|%5.2f|%03d", "An", 9.456, 7)   // An    | 9.46|007
String.join(" - ", "a", "b", "c")                  // a - b - c
""" text block """   // xuong dong that, khong can \\n hay escape \\"`,
      notes: [{ mark: 'ok', text: 'Text block (Java 15+) cứu bạn khi phải nhúng JSON hay SQL vào code' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Nối chuỗi trong vòng lặp → `StringBuilder`, không bàn cãi' },
        { mark: 'next', text: '**Ngày 37**: enum — tập giá trị cố định, an toàn hơn hằng số `int`' },
      ],
    },
  ],

  /* Output THẬT của `java ChuoiNhanh` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) hai cach cho ket qua giong nhau? true (do dai 50000)',
      '2) StringBuilder nhanh hon it nhat 10 lan? true',
      '3) reverse -> 001 avaJ >>',
      '4) chuoi goc bat bien: Java moi | van la Java',
      '5) An    | 9.46|007',
      '6) text block co 3 dong, khong can escape dau nhay',
      '7) join -> a - b - c',
    ],
  },

  verify: {
    className: 'ChuoiNhanh',
    source: `public class ChuoiNhanh {
    public static void main(String[] args) {
        int N = 50000;

        long t1 = System.nanoTime();
        String s = "";
        for (int i = 0; i < N; i++) s += "x";
        long msConcat = (System.nanoTime() - t1) / 1_000_000;

        long t2 = System.nanoTime();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < N; i++) sb.append("x");
        String s2 = sb.toString();
        long msBuilder = (System.nanoTime() - t2) / 1_000_000;

        System.out.println("1) hai cach cho ket qua giong nhau? " + s.equals(s2) + " (do dai " + s.length() + ")");
        System.out.println("2) StringBuilder nhanh hon it nhat 10 lan? " + (msConcat > msBuilder * 10));

        StringBuilder b = new StringBuilder("Java");
        b.append(" 100").insert(0, ">> ").reverse();
        System.out.println("3) reverse -> " + b);
        System.out.println("4) chuoi goc bat bien: " + "Java".concat(" moi") + " | van la Java");

        System.out.println("5) " + String.format("%-6s|%5.2f|%03d", "An", 9.456, 7));
        String tb = """
                {
                  "ten": "An"
                }""";
        System.out.println("6) text block co " + tb.lines().count() + " dong, khong can escape dau nhay");

        System.out.println("7) join -> " + String.join(" - ", "a", "b", "c"));
    }
}`,
  },
};
