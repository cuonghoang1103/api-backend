/**
 * Thẻ bài học "100 Ngày Java" — Ngày 57: Git & CI.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-57.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ Git và GitHub Actions là CÔNG CỤ NGOÀI, không chạy được trong thẻ (JDK
 * thuần, không classpath). Nên chương trình dựng lại NGUYÊN LÝ của chúng bằng
 * Java: kho lưu theo nội dung (mã băm SHA-1 y hệt `git hash-object`), nhánh là
 * con trỏ, tổ tiên chung gần nhất, gộp ba đường, và cổng CI chặn nhánh đỏ.
 * Cú pháp lệnh git + file YAML dạy trong thân bài. Cùng cách đã dùng cho
 * JUnit (53), Mockito (54) và Maven (56).
 *
 * ✅ Hai mã băm ở mục 1 khớp CHÍNH XÁC với git thật — kiểm lại bằng:
 *      printf 'xin chao' | git hash-object --stdin   -> 1156bc3f6612...
 *      printf 'xin chdo' | git hash-object --stdin   -> c29752d5e643...
 */
export default {
  series: '100 NGÀY JAVA',
  day: 57,
  total: 100,
  titleLead: 'Java Day 57:',
  titleAccent: 'Git & CI',
  subtitle: 'Máy tự chạy test mỗi lần đẩy code, nhánh đỏ đừng hòng vào 🚦',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. COMMIT = ẢNH CHỤP CÓ MÃ BĂM 📸',
      code: `// ma bam tinh TU CHINH NOI DUNG, khong phai so thu tu
"xin chao" -> 1156bc3
"xin chdo" -> c29752d   // doi DUNG 1 ky tu`,
      notes: [
        { mark: 'ok', text: 'Cùng nội dung → cùng mã trên mọi máy, nên không sửa lén được lịch sử' },
        { mark: 'dot', text: 'Gõ thử: `printf "xin chao" | git hash-object --stdin`' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. NHÁNH CHỈ LÀ MỘT CON TRỎ 🔀',
      code: `main       -> C3
tinh-nang  -> C5
sua-loi    -> C3
// tao nhanh = ghi them 1 dong; 0 ban sao noi dung`,
      notes: [
        { mark: 'ok', text: 'Nên rẽ nhánh gần như tức thì, không tốn đĩa — cứ nhánh riêng mà làm' },
        { mark: 'dot', text: '`git switch -c sua-loi-gio-hang` rồi commit thoải mái, `main` không hề hấn' },
      ],
    },
    {
      tone: 'pink',
      title: '3. GỘP: TÌM TỔ TIÊN CHUNG 🌿',
      code: `C1 - C2 - C3         (main)
       \\- C4 - C5    (tinh-nang)

// to tien chung gan nhat = C2 -> Git so 3 ban: C2, C3, C5`,
      notes: [
        { mark: 'ok', text: 'Hai người sửa hai dòng khác nhau → Git tự gộp, bạn không phải làm gì' },
        { mark: 'no', text: 'Cùng sửa MỘT dòng → xung đột. Máy không đoán bừa, người phải quyết' },
      ],
    },
    {
      tone: 'green',
      title: '4. CI = CỔNG TỰ ĐỘNG 🚦',
      code: `# .github/workflows/ci.yml
on: [push, pull_request]
steps:
  - uses: actions/setup-java@v4
  - run: mvn --batch-mode test
// 1 phep thu DO -> chan gop, khong ai phai bam nut nao`,
      notes: [
        { mark: 'ok', text: '"Máy tôi chạy được" hết là lý do — máy chủ dựng lại từ đầu, sạch sẽ' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Nhánh riêng → PR → CI xanh → gộp. Vòng lặp của mọi đội đi làm' },
        { mark: 'next', text: '**Ngày 58**: log & gỡ lỗi — khi bug chỉ chịu xuất hiện trên production' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongGit` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) commit 'xin chao' -> ma bam 1156bc3",
      '2) sua 1 ky tu -> ma bam doi han: c29752d',
      '3) tao 3 nhanh -> 3 con tro, so ban sao noi dung: 0',
      '4) to tien chung gan nhat cua main & tinh-nang -> C2',
      '5) cung sua dong 3 -> XUNG DOT [3] | khac dong -> tu gop du 3 dong: true',
      '6) CI 3 phep thu -> 1 DO -> chan gop vao main? true',
    ],
  },

  verify: {
    className: 'MoPhongGit',
    source: `import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

/* Dung lai NGUYEN LY cua Git bang JDK thuan:
   kho theo noi dung, nhanh = con tro, to tien chung, gop ba duong, cong CI. */
public class MoPhongGit {

    /* 1. Danh tinh cua noi dung = ma bam cua chinh noi dung do.
       Cong thuc y het Git: "blob <so byte>\\0<noi dung>" roi SHA-1. */
    static String bam(String noiDung) {
        try {
            byte[] than = noiDung.getBytes(StandardCharsets.UTF_8);
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            sha1.update(("blob " + than.length + "\\0").getBytes(StandardCharsets.UTF_8));
            sha1.update(than);
            StringBuilder hex = new StringBuilder();
            for (byte b : sha1.digest()) hex.append(String.format("%02x", b));
            return hex.substring(0, 7);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /* 2. Do thi commit: moi commit chi nho CHA cua no. */
    record Commit(String ma, String cha) {}

    static final Map<String, Commit> LICH_SU = new LinkedHashMap<>();

    static void them(String ma, String cha) {
        LICH_SU.put(ma, new Commit(ma, cha));
    }

    static List<String> duongVeGoc(String ma) {
        List<String> duong = new ArrayList<>();
        for (String hienTai = ma; hienTai != null; hienTai = LICH_SU.get(hienTai).cha()) {
            duong.add(hienTai);
        }
        return duong;
    }

    static String toTienChung(String a, String b) {
        List<String> cuaA = duongVeGoc(a);
        for (String ma : duongVeGoc(b)) {
            if (cuaA.contains(ma)) return ma;
        }
        return null;
    }

    /* 3. Gop BA DUONG: so tung dong cua A va B voi ban GOC chung. */
    static List<String> gopBaDuong(List<String> goc, List<String> a, List<String> b,
                                   List<Integer> xungDot) {
        List<String> ket = new ArrayList<>();
        for (int i = 0; i < goc.size(); i++) {
            boolean aSua = !a.get(i).equals(goc.get(i));
            boolean bSua = !b.get(i).equals(goc.get(i));
            if (aSua && bSua && !a.get(i).equals(b.get(i))) {
                xungDot.add(i + 1);
                ket.add("<<<can nguoi quyet>>>");
            } else if (aSua) {
                ket.add(a.get(i));
            } else if (bSua) {
                ket.add(b.get(i));
            } else {
                ket.add(goc.get(i));
            }
        }
        return ket;
    }

    /* 4. Cong CI: mot phep thu do la chan gop, khong ai bam nut nao ca. */
    record PhepThu(String ten, boolean dat) {}

    public static void main(String[] args) {
        // (1)(2) kho theo noi dung
        String maGoc = bam("xin chao");
        String maSua = bam("xin chdo");           // doi DUNG mot ky tu
        System.out.println("1) commit 'xin chao' -> ma bam " + maGoc);
        System.out.println("2) sua 1 ky tu -> ma bam doi han: " + maSua);

        // (3) nhanh chi la mot dong ten -> ma commit
        Map<String, String> nhanh = new LinkedHashMap<>();
        int banSao = 0;                            // dem so lan chep noi dung file
        nhanh.put("main", "C3");
        nhanh.put("tinh-nang", "C5");
        nhanh.put("sua-loi", "C3");
        System.out.println("3) tao " + nhanh.size() + " nhanh -> " + nhanh.size()
                + " con tro, so ban sao noi dung: " + banSao);

        // (4) to tien chung gan nhat
        them("C1", null);
        them("C2", "C1");
        them("C3", "C2");       // main  di tiep tu C2
        them("C4", "C2");       // tinh-nang re nhanh tai C2
        them("C5", "C4");
        System.out.println("4) to tien chung gan nhat cua main & tinh-nang -> "
                + toTienChung(nhanh.get("main"), nhanh.get("tinh-nang")));

        // (5a) PHEP THU RIENG: hai nhanh cung sua dong 3
        List<String> goc1 = List.of("dong 1", "dong 2", "dong 3");
        List<String> a1 = List.of("dong 1", "dong 2", "dong 3 theo A");
        List<String> b1 = List.of("dong 1", "dong 2", "dong 3 theo B");
        List<Integer> xungDot1 = new ArrayList<>();
        gopBaDuong(goc1, a1, b1, xungDot1);

        // (5b) PHEP THU RIENG khac: moi nhanh sua mot dong khac nhau
        List<String> goc2 = List.of("dong 1", "dong 2", "dong 3");
        List<String> a2 = List.of("dong 1 theo A", "dong 2", "dong 3");
        List<String> b2 = List.of("dong 1", "dong 2", "dong 3 theo B");
        List<Integer> xungDot2 = new ArrayList<>();
        List<String> ketGop = gopBaDuong(goc2, a2, b2, xungDot2);
        System.out.println("5) cung sua dong 3 -> XUNG DOT " + xungDot1
                + " | khac dong -> tu gop du " + ketGop.size() + " dong: "
                + xungDot2.isEmpty());

        // (6) cong CI
        List<PhepThu> phepThu = List.of(
                new PhepThu("themVaoGio", true),
                new PhepThu("tinhTongTien", false),
                new PhepThu("xoaKhoiGio", true));
        long soDo = phepThu.stream().filter(p -> !p.dat()).count();
        System.out.println("6) CI " + phepThu.size() + " phep thu -> " + soDo
                + " DO -> chan gop vao main? " + (soDo > 0));
    }
}`,
  },
};
