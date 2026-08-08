/**
 * Thẻ bài học "100 Ngày Java" — Ngày 40: bài tổng hợp, khép Giai đoạn 5.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-40.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Chương trình ở đây ghép MƯỜI công cụ
 * của Giai đoạn 4-5 vào một luồng việc thật, và ghi vào file tạm rồi tự xoá
 * nên chạy lại bao nhiêu lần cũng cho đúng một kết quả.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 40,
  total: 100,
  titleLead: 'Java Day 40:',
  titleAccent: 'Ghép tất cả lại',
  subtitle: 'Một chương trình dùng gần hết Giai đoạn 4-5 🧩',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MÔ HÌNH DỮ LIỆU: record + enum 🧩',
      code: `record SinhVien(String ten, String lop, double diem) {
    SinhVien { if (diem < 0 || diem > 10) throw new ...; }   // Ngay 13+38
    XepLoai xepLoai() { return XepLoai.tu(diem); }
}
enum XepLoai { XUAT_SAC, GIOI, KHA, TRUNG_BINH }             // Ngay 37`,
      notes: [{ mark: 'ok', text: 'Dữ liệu bất biến + tập giá trị đóng — sai là không dịch được' }],
    },
    {
      tone: 'yellow',
      title: '2. ĐỌC & BÓC: Files + regex + Optional 📥',
      code: `try (Stream<String> st = Files.lines(f)) {        // Ngay 23+34
    ds = st.map(TongHop::doc)                     // tra Optional (Ngay 32)
           .flatMap(Optional::stream)             // bo dong hong
           .collect(Collectors.toList());
}
// doc duoc 5 sinh vien, bo qua dong hong`,
      notes: [{ mark: 'ok', text: '`flatMap(Optional::stream)` — lọc bỏ dòng lỗi mà không cần một câu `if` nào' }],
    },
    {
      tone: 'pink',
      title: '3. THỐNG KÊ: stream + Collectors 📊',
      code: `groupingBy(SinhVien::lop, TreeMap::new, averagingDouble(...))
// TB lop SE01 8.17 | SE02 7.50

groupingBy(SinhVien::xepLoai, () -> new EnumMap<>(...), counting())
// {XUAT_SAC=1, GIOI=2, KHA=1, TRUNG_BINH=1}`,
      notes: [{ mark: 'ok', text: 'Chỉ định `TreeMap`/`EnumMap` để thứ tự ổn định, đừng để mặc định `HashMap`' }],
    },
    {
      tone: 'green',
      title: '4. MƯỜI CÔNG CỤ, MỘT LUỒNG VIỆC 🔗',
      code: `Files · try-with-resources · Stream · Optional · Collectors
regex · record · enum · switch bieu thuc · Comparator · ngoai le`,
      notes: [
        { mark: 'ok', text: 'Không phải mười thứ rời rạc — chúng sinh ra để ghép với nhau' },
        { mark: 'dot', text: 'Dữ liệu bẩn bị chặn ngay tại cửa, đúng tinh thần Giai đoạn 2' },
      ],
    },
    {
      tone: 'blue',
      title: '5. HẾT GIAI ĐOẠN 5 🏁',
      notes: [
        { mark: 'ok', text: 'Bạn viết được Java hiện đại — đọc hiểu code trong dự án thật' },
        { mark: 'next', text: '**Ngày 41**: Đa luồng — `Thread`, và vì sao hai luồng cộng cùng một biến lại mất số' },
      ],
    },
  ],

  /* Output THẬT của `java TongHop` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) doc duoc 5 sinh vien, bo qua dong hong',
      '2) gioi tro len -> An, Chi, Em',
      '3) TB lop SE01 8.17 | SE02 7.50',
      '4) theo xep loai -> {XUAT_SAC=1, GIOI=2, KHA=1, TRUNG_BINH=1}',
      '5) cao nhat -> An (Xuat sac)',
      '6) chan du lieu ban -> Diem ngoai 0-10: 99.0',
    ],
  },

  verify: {
    className: 'TongHop',
    source: `import java.nio.file.*;
import java.util.*;
import java.util.regex.*;
import java.util.stream.*;

enum XepLoai {
    XUAT_SAC("Xuat sac"), GIOI("Gioi"), KHA("Kha"), TRUNG_BINH("Trung binh");
    private final String nhan;
    XepLoai(String nhan) { this.nhan = nhan; }
    String nhan() { return nhan; }

    static XepLoai tu(double d) {
        return switch ((int) d) {
            case 9, 10 -> XUAT_SAC;
            case 8 -> GIOI;
            case 7 -> KHA;
            default -> TRUNG_BINH;
        };
    }
}

record SinhVien(String ten, String lop, double diem) {
    SinhVien {
        if (diem < 0 || diem > 10) throw new IllegalArgumentException("Diem ngoai 0-10: " + diem);
    }
    XepLoai xepLoai() { return XepLoai.tu(diem); }
}

public class TongHop {
    static final Pattern DONG = Pattern.compile("^(?<ten>[\\\\w ]+)\\\\|(?<lop>\\\\w+)\\\\|(?<diem>\\\\d+(\\\\.\\\\d+)?)$");

    static Optional<SinhVien> doc(String dong) {
        Matcher m = DONG.matcher(dong.trim());
        if (!m.matches()) return Optional.empty();
        return Optional.of(new SinhVien(m.group("ten"), m.group("lop"), Double.parseDouble(m.group("diem"))));
    }

    public static void main(String[] args) throws Exception {
        Path f = Files.createTempFile("java40", ".txt");
        Files.writeString(f, String.join("\\n",
                "An|SE01|9.5", "Binh|SE01|7.0", "Chi|SE02|8.5",
                "DONG HONG", "Dung|SE02|6.5", "Em|SE01|8.0") + "\\n");

        List<SinhVien> ds;
        try (Stream<String> st = Files.lines(f)) {
            ds = st.map(TongHop::doc).flatMap(Optional::stream).collect(Collectors.toList());
        }
        System.out.println("1) doc duoc " + ds.size() + " sinh vien, bo qua dong hong");

        System.out.println("2) gioi tro len -> " + ds.stream()
                .filter(s -> s.diem() >= 8.0).map(SinhVien::ten).sorted().collect(Collectors.joining(", ")));

        Map<String, Double> tbLop = ds.stream().collect(Collectors.groupingBy(
                SinhVien::lop, TreeMap::new, Collectors.averagingDouble(SinhVien::diem)));
        System.out.printf("3) TB lop SE01 %.2f | SE02 %.2f%n", tbLop.get("SE01"), tbLop.get("SE02"));

        Map<XepLoai, Long> theoLoai = ds.stream().collect(Collectors.groupingBy(
                SinhVien::xepLoai, () -> new EnumMap<>(XepLoai.class), Collectors.counting()));
        System.out.println("4) theo xep loai -> " + theoLoai);

        System.out.println("5) cao nhat -> " + ds.stream()
                .max(Comparator.comparingDouble(SinhVien::diem))
                .map(s -> s.ten() + " (" + s.xepLoai().nhan() + ")").orElse("khong co"));

        try { new SinhVien("Loi", "SE03", 99); }
        catch (IllegalArgumentException e) { System.out.println("6) chan du lieu ban -> " + e.getMessage()); }

        Files.deleteIfExists(f);
    }
}`,
  },
};
