/**
 * Thẻ bài học "100 Ngày Java" — Ngày 74: Cấu hình & hồ sơ (profiles).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-74.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: thẻ chạy JDK thuần. Chương trình dựng lại nguyên lý: nhiều tầng
 * cấu hình xếp chồng (mặc định < file < profile < biến môi trường), bí mật đến
 * từ biến môi trường. Cú pháp application.yml/@Value/profiles dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 74,
  total: 100,
  titleLead: 'Java Day 74:',
  titleAccent: 'Cấu hình & Profiles',
  subtitle: 'Một mã nguồn, nhiều môi trường — bí mật ngoài code 🔧',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NHIỀU TẦNG, TẦNG SAU THẮNG 🎚️',
      code: `mac-dinh < file < profile < BIEN MOI TRUONG

server.port: file 8080 -> prod 80 -> env 9000`,
      notes: [
        { mark: 'ok', text: 'Cùng một khoá, tầng ưu tiên cao hơn ghi đè tầng thấp' },
        { mark: 'dot', text: 'Nhờ vậy đổi cấu hình prod không phải sửa code hay file trong Git' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. application.yml: KHAI CẤU HÌNH 📄',
      code: `# application.yml
server:
  port: 8080
app:
  ten: CuongThai

@Value("\${app.ten}") String ten;`,
      notes: [
        { mark: 'ok', text: '`@Value` tiêm giá trị vào bean; hoặc gom vào `@ConfigurationProperties`' },
        { mark: 'dot', text: 'YAML hay .properties đều được — cùng cây khoá' },
      ],
    },
    {
      tone: 'pink',
      title: '3. PROFILE: DEV KHÁC PROD 🌓',
      code: `application-dev.yml   -> CSDL local
application-prod.yml  -> CSDL that

SPRING_PROFILES_ACTIVE=prod`,
      notes: [
        { mark: 'ok', text: 'Một mã nguồn chạy mọi môi trường, chỉ đổi profile đang bật' },
        { mark: 'dot', text: 'Profile `prod` chồng lên cấu hình chung, ghi đè phần khác biệt' },
      ],
    },
    {
      tone: 'green',
      title: '4. BÍ MẬT: TỪ ENV, KHÔNG VÀO GIT 🔐',
      code: `db.password: KHONG co trong file
-> lay tu BIEN MOI TRUONG (nguon: env)

thieu jwt.secret o moi noi -> DUNG, khong chay`,
      notes: [
        { mark: 'no', text: 'Mật khẩu/khoá API tuyệt đối không nằm trong code hay Git (Ngày 57)' },
        { mark: 'ok', text: 'Thiếu cấu hình bắt buộc thì dừng ngay, đừng chạy với giá trị rỗng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Cấu hình theo tầng + profile; bí mật qua biến môi trường' },
        { mark: 'next', text: '**Ngày 75**: kiểm thử Spring — @SpringBootTest, MockMvc, @DataJpaTest' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongCauHinh` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) tang uu tien: mac-dinh < file < profile < BIEN MOI TRUONG',
      "2) doc 'server.port' (moi co file) -> 8080",
      "3) profile 'prod' ghi de -> server.port=80",
      '4) BIEN MOI TRUONG ghi de tat ca -> server.port=9000',
      '5) db.password co gia tri? true, nguon: bien-moi-truong',
      "6) doc 'jwt.secret' (khong o dau) -> thieu cau hinh bat buoc: jwt.secret",
    ],
  },

  verify: {
    className: 'MoPhongCauHinh',
    source: `import java.util.*;

/* Dung lai NGUYEN LY cau hinh Spring Boot bang JDK THUAN: nhieu TANG cau hinh
   xep chong, tang sau GHI DE tang truoc (mac dinh < file < profile < bien moi
   truong). Bi mat (mat khau) den tu bien moi truong, KHONG nam trong file/Git.
   Cu phap application.yml/@Value/profile day o than bai. */
public class MoPhongCauHinh {

    /* Nguon cau hinh nhieu tang — tang them SAU co uu tien cao hon. */
    static class NguonCauHinh {
        final LinkedHashMap<String, Map<String, String>> tang = new LinkedHashMap<>();

        void themTang(String ten, Map<String, String> giaTri) { tang.put(ten, giaTri); }

        /* Duyet moi tang theo thu tu; tang sau ghi de gia tri cua tang truoc. */
        String doc(String khoa) {
            String gt = null;
            for (Map<String, String> t : tang.values()) if (t.containsKey(khoa)) gt = t.get(khoa);
            return gt;
        }

        /* Tang nao cung cap gia tri cuoi cung cho khoa nay? */
        String nguonCua(String khoa) {
            String nguon = null;
            for (var e : tang.entrySet()) if (e.getValue().containsKey(khoa)) nguon = e.getKey();
            return nguon;
        }

        String docBatBuoc(String khoa) {
            String gt = doc(khoa);
            if (gt == null) throw new IllegalStateException("thieu cau hinh bat buoc: " + khoa);
            return gt;
        }
    }

    public static void main(String[] args) {
        NguonCauHinh ch = new NguonCauHinh();
        ch.themTang("mac-dinh", Map.of("server.port", "8080"));
        ch.themTang("file", Map.of("server.port", "8080", "app.ten", "CuongThai"));
        System.out.println("1) tang uu tien: mac-dinh < file < profile < BIEN MOI TRUONG");
        System.out.println("2) doc 'server.port' (moi co file) -> " + ch.doc("server.port"));

        // (3) profile 'prod' ghi de cong
        ch.themTang("profile-prod", Map.of("server.port", "80"));
        System.out.println("3) profile 'prod' ghi de -> server.port=" + ch.doc("server.port"));

        // (4) bien moi truong ghi de TAT CA
        ch.themTang("bien-moi-truong", Map.of("server.port", "9000", "db.password", "secret123"));
        System.out.println("4) BIEN MOI TRUONG ghi de tat ca -> server.port=" + ch.doc("server.port"));

        // (5) bi mat CHI nam o bien moi truong, khong trong file/Git
        System.out.println("5) db.password co gia tri? " + (ch.doc("db.password") != null)
                + ", nguon: " + ch.nguonCua("db.password"));

        // (6) thieu cau hinh bat buoc (khong o dau) -> dung, khong chay lung tung
        String loi = null;
        try {
            ch.docBatBuoc("jwt.secret");
        } catch (IllegalStateException e) {
            loi = e.getMessage();
        }
        System.out.println("6) doc 'jwt.secret' (khong o dau) -> " + loi);
    }
}`,
  },
};
