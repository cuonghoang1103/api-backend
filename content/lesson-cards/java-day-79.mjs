/**
 * Thẻ bài học "100 Ngày Java" — Ngày 79: Spring Security (filter chain).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-79.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: Spring Security là framework ngoài, thẻ chạy JDK thuần. Chương
 * trình dựng lại NGUYÊN LÝ: một chuỗi bộ lọc (Chain of Responsibility) gác
 * trước controller, xác thực thất bại -> 401, phân quyền thất bại -> 403, qua
 * hết -> controller (200). Cú pháp SecurityFilterChain dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 79,
  total: 100,
  titleLead: 'Java Day 79:',
  titleAccent: 'Spring Security',
  subtitle: 'Chuỗi bộ lọc đứng gác trước mọi API của bạn 🛡️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CHUỖI BỘ LỌC GÁC TRƯỚC 🛡️',
      code: `request -> [XacThuc] -> [PhanQuyen] -> controller

// bo loc nao chan thi DUNG ngay, khong toi controller`,
      notes: [
        { mark: 'ok', text: 'Lớp gác nằm TRƯỚC controller — chặn từ vòng ngoài' },
        { mark: 'dot', text: 'Controller quay lại chỉ lo nghiệp vụ, không tự kiểm quyền' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ĐƯỜNG CÔNG KHAI ĐI THẲNG 🚪',
      code: `GET /public khong token -> 200

// /public, /login duoc cau hinh cong khai`,
      notes: [
        { mark: 'ok', text: 'Khai rõ đường nào công khai, còn lại mặc định phải đăng nhập' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CHƯA ĐĂNG NHẬP → 401 🔒',
      code: `GET /don khong token
-> bo loc XacThuc chan -> 401 (chua dang nhap)`,
      notes: [
        { mark: 'ok', text: 'Bộ lọc xác thực đọc JWT (Ngày 78), thiếu/sai → 401 ngay' },
        { mark: 'dot', text: 'Request không hợp lệ dừng ở vòng ngoài, chưa chạm nghiệp vụ' },
      ],
    },
    {
      tone: 'green',
      title: '4. THIẾU QUYỀN → 403 ⛔',
      code: `DELETE /admin/users token USER -> 403 (thieu quyen)
DELETE /admin/users token ADMIN -> 200 (qua het)`,
      notes: [
        { mark: 'ok', text: '401 = chưa đăng nhập · 403 = đã đăng nhập nhưng không đủ quyền' },
        { mark: 'dot', text: 'Đã xác thực rồi mới tới bước phân quyền — đúng thứ tự Ngày 77' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Cấu hình một `SecurityFilterChain`, đừng rải kiểm quyền khắp controller' },
        { mark: 'next', text: '**Ngày 80**: phân quyền chi tiết — roles, @PreAuthorize, ai thấy gì' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongFilterChain` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) chuoi bo loc: [XacThuc, PhanQuyen] -> controller',
      '2) GET /public khong token -> 200 (bo loc cho qua)',
      '3) GET /don khong token -> 401 (chua dang nhap)',
      '4) GET /don token USER hop le -> 200 (qua het)',
      '5) DELETE /admin/users token USER -> 403 (thieu quyen)',
      '6) DELETE /admin/users token ADMIN -> 200 (qua het)',
    ],
  },

  verify: {
    className: 'MoPhongFilterChain',
    source: `import java.util.*;

/* Dung lai NGUYEN LY cua Spring Security bang JDK THUAN: mot CHUOI BO LOC
   (filter chain) dung gac TRUOC controller. Request di qua tung bo loc theo
   thu tu; bo loc nao chan thi dung ngay. Xac thuc that bai -> 401, phan quyen
   that bai -> 403, qua het -> toi controller (200). */
public class MoPhongFilterChain {

    record YeuCau(String method, String path, String token) {}
    record PhanHoi(int status, String ghiChu) {}

    interface BoLoc {
        String ten();
        PhanHoi loc(YeuCau yc);   // null = cho qua, khac null = chan
    }

    /* Duong dan cong khai thi khong can dang nhap. */
    static final Set<String> CONG_KHAI = Set.of("/public", "/login");
    /* Token hop le -> vai tro. Token khong nam day = gia/het han. */
    static final Map<String, String> TOKEN_HOP_LE = Map.of("tok-user", "USER", "tok-admin", "ADMIN");

    /* Bo loc 1: xac thuc (Authentication) — kiem JWT (Ngay 78). */
    static final BoLoc XAC_THUC = new BoLoc() {
        public String ten() { return "XacThuc"; }
        public PhanHoi loc(YeuCau yc) {
            if (CONG_KHAI.contains(yc.path())) return null;                 // cong khai -> bo qua
            if (yc.token() == null) return new PhanHoi(401, "chua dang nhap");
            if (!TOKEN_HOP_LE.containsKey(yc.token())) return new PhanHoi(401, "token khong hop le");
            return null;                                                    // xac thuc OK
        }
    };

    /* Bo loc 2: phan quyen (Authorization) — /admin can vai ADMIN. */
    static final BoLoc PHAN_QUYEN = new BoLoc() {
        public String ten() { return "PhanQuyen"; }
        public PhanHoi loc(YeuCau yc) {
            if (yc.path().startsWith("/admin")) {
                String vai = TOKEN_HOP_LE.get(yc.token());
                if (!"ADMIN".equals(vai)) return new PhanHoi(403, "thieu quyen");
            }
            return null;
        }
    };

    static final List<BoLoc> CHUOI = List.of(XAC_THUC, PHAN_QUYEN);

    static PhanHoi chay(YeuCau yc) {
        for (BoLoc f : CHUOI) {
            PhanHoi p = f.loc(yc);
            if (p != null) return p;                       // bi chan -> dung ngay
        }
        return new PhanHoi(200, "toi controller");         // qua het chuoi
    }

    public static void main(String[] args) {
        System.out.println("1) chuoi bo loc: [" + XAC_THUC.ten() + ", " + PHAN_QUYEN.ten()
                + "] -> controller");

        PhanHoi p2 = chay(new YeuCau("GET", "/public", null));
        System.out.println("2) GET /public khong token -> " + p2.status() + " (bo loc cho qua)");

        PhanHoi p3 = chay(new YeuCau("GET", "/don", null));
        System.out.println("3) GET /don khong token -> " + p3.status() + " (" + p3.ghiChu() + ")");

        PhanHoi p4 = chay(new YeuCau("GET", "/don", "tok-user"));
        System.out.println("4) GET /don token USER hop le -> " + p4.status() + " (qua het)");

        PhanHoi p5 = chay(new YeuCau("DELETE", "/admin/users", "tok-user"));
        System.out.println("5) DELETE /admin/users token USER -> " + p5.status() + " (" + p5.ghiChu() + ")");

        PhanHoi p6 = chay(new YeuCau("DELETE", "/admin/users", "tok-admin"));
        System.out.println("6) DELETE /admin/users token ADMIN -> " + p6.status() + " (qua het)");
    }
}`,
  },
};
