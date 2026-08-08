/**
 * Thẻ bài học "100 Ngày Java" — Ngày 56: Maven.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-56.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ Maven là CÔNG CỤ NGOÀI, không chạy được trong thẻ (JDK thuần). Nên
 * chương trình dựng lại NGUYÊN LÝ khó nhất của nó: cây phụ thuộc bắc cầu và
 * luật "gần nhất thắng" khi xung đột phiên bản. Cú pháp pom.xml dạy trong
 * thân bài. Cùng cách đã dùng cho JUnit (53) và Mockito (54).
 */
export default {
  series: '100 NGÀY JAVA',
  day: 56,
  total: 100,
  titleLead: 'Java Day 56:',
  titleAccent: 'Maven',
  subtitle: 'Khai báo thư viện một chỗ, máy lo phần còn lại 📦',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. PHỤ THUỘC BẮC CẦU 🕸️',
      code: `// pom.xml khai DUNG 2 thu vien: junit + web
// thuc te tai ve 5:
[json, junit, log, opentest, web]`,
      notes: [
        { mark: 'ok', text: 'Thư viện bạn cần lại cần thư viện khác — Maven tự kéo hết về' },
        { mark: 'dot', text: 'Tải tay file `.jar` là tự đi giải bài toán này bằng cơm' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. XUNG ĐỘT: GẦN NHẤT THẮNG ⚖️',
      code: `web  (tang 1) can log 2.0.9
json (tang 2) can log 2.0.7
// -> Maven chon log:2.0.9  (tang NONG hon thang)`,
      notes: [
        { mark: 'ok', text: 'Chỉ MỘT phiên bản mỗi thư viện được nạp — không thể có hai' },
        { mark: 'no', text: 'Muốn ép bản khác thì khai thẳng nó ở `pom.xml` của bạn (tầng 0)' },
      ],
    },
    {
      tone: 'pink',
      title: '3. VÒNG ĐỜI BUILD 🔄',
      code: `validate → compile → test → package → install → deploy

mvn package   # chay 4 pha: validate, compile, test, package
// -> pha sau LUON keo theo cac pha truoc`,
      notes: [{ mark: 'ok', text: '`mvn package` mà test đỏ là dừng, không đóng gói — đúng ý đồ' }],
    },
    {
      tone: 'green',
      title: '4. CẤU TRÚC THƯ MỤC CHUẨN 📁',
      code: `src/main/java       ma nguon
src/main/resources  cau hinh
src/test/java       test (Ngay 53-55)
target/             ket qua build (dung commit)
pom.xml             khai bao tat ca`,
      notes: [{ mark: 'ok', text: 'Ai mở dự án Java cũng biết ngay file nằm đâu — đó là giá trị của quy ước' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`pom.xml` + `mvn test` là bộ đôi mọi dự án Java đi làm đều có' },
        { mark: 'next', text: '**Ngày 57**: Git & CI — máy tự chạy test mỗi lần đẩy code' },
      ],
    },
  ],

  /* Output THẬT của `java QuanLyThuVien` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) khai bao 2 thu vien -> thuc te tai ve 5',
      '2) danh sach -> [json, junit, log, opentest, web]',
      '3) thu vien BAC CAU (khong khai bao) co opentest? true',
      '4) log bi khai 2 phien ban -> chon log:2.0.9',
      "5) luat 'gan nhat thang' -> dung 2.0.9? true",
      '6) chay \'mvn package\' -> chay 4 pha: [validate, compile, test, package]',
    ],
  },

  verify: {
    className: 'QuanLyThuVien',
    source: `import java.util.*;

public class QuanLyThuVien {

    record ThuVien(String ten, String phienBan) {
        @Override public String toString() { return ten + ":" + phienBan; }
    }

    static final Map<ThuVien, List<ThuVien>> CAN = new LinkedHashMap<>();
    static {
        CAN.put(new ThuVien("du-an", "1.0"), List.of(
                new ThuVien("junit", "5.10.0"),
                new ThuVien("web", "3.2.0")));
        CAN.put(new ThuVien("junit", "5.10.0"), List.of(new ThuVien("opentest", "1.3.0")));
        CAN.put(new ThuVien("web", "3.2.0"), List.of(
                new ThuVien("json", "2.15.0"),
                new ThuVien("log", "2.0.9")));
        CAN.put(new ThuVien("json", "2.15.0"), List.of(new ThuVien("log", "2.0.7")));
    }

    static Map<String, ThuVien> giaiQuyet(ThuVien goc) {
        Map<String, ThuVien> chon = new LinkedHashMap<>();
        Map<String, Integer> tangCua = new HashMap<>();
        Deque<Map.Entry<ThuVien, Integer>> hang = new ArrayDeque<>();
        hang.add(Map.entry(goc, 0));

        while (!hang.isEmpty()) {
            var muc = hang.poll();
            ThuVien tv = muc.getKey(); int tang = muc.getValue();
            Integer daCo = tangCua.get(tv.ten());
            if (daCo != null && daCo <= tang) continue;
            chon.put(tv.ten(), tv);
            tangCua.put(tv.ten(), tang);
            for (ThuVien con : CAN.getOrDefault(tv, List.of())) hang.add(Map.entry(con, tang + 1));
        }
        chon.remove(goc.ten());
        return chon;
    }

    public static void main(String[] args) {
        ThuVien duAn = new ThuVien("du-an", "1.0");
        Map<String, ThuVien> ket = giaiQuyet(duAn);

        System.out.println("1) khai bao 2 thu vien -> thuc te tai ve " + ket.size());
        System.out.println("2) danh sach -> " + new TreeSet<>(ket.keySet()));
        System.out.println("3) thu vien BAC CAU (khong khai bao) co opentest? " + ket.containsKey("opentest"));

        System.out.println("4) log bi khai 2 phien ban -> chon " + ket.get("log"));
        System.out.println("5) luat 'gan nhat thang' -> dung 2.0.9? " + ket.get("log").phienBan().equals("2.0.9"));

        List<String> voiDoi = List.of("validate", "compile", "test", "package", "install");
        int denPha = voiDoi.indexOf("package");
        System.out.println("6) chay 'mvn package' -> chay " + (denPha + 1) + " pha: "
                + voiDoi.subList(0, denPha + 1));
    }
}`,
  },
};
