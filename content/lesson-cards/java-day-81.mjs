/**
 * Thẻ bài học "100 Ngày Java" — Ngày 81: Khép cụm bảo mật (luồng đăng nhập).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-81.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 5 + 6: ghép cả bốn ngày bảo mật vào một luồng đầu-cuối, chạy JDK
 * thuần. SHA-256 salt cố định + HMAC secret cố định -> hash & token TÁI LẬP
 * (không đổi theo lần chạy). Cú pháp Spring Security thật dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 81,
  total: 100,
  titleLead: 'Java Day 81:',
  titleAccent: 'Khép cụm bảo mật',
  subtitle: 'Một luồng đăng nhập đầu-cuối, chạy được 🔐',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ĐĂNG KÝ: LƯU HASH (Ngày 77) 🔑',
      code: `dang ky 'an' -> luu hash f29500adbfbd

// khong bao gio luu mat khau nguyen ban`,
      notes: [
        { mark: 'ok', text: 'Mật khẩu băm một chiều trước khi vào DB' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ĐĂNG NHẬP: VERIFY → PHÁT JWT (78) 🎫',
      code: `sai mat khau -> tu choi, khong phat token
dung mat khau -> phat JWT (73 ky tu)`,
      notes: [
        { mark: 'ok', text: 'Băm lại mật khẩu nhập, khớp hash thì phát tấm vé JWT đã ký' },
        { mark: 'no', text: 'Sai mật khẩu → không có token, không vào được' },
      ],
    },
    {
      tone: 'pink',
      title: '3. FILTER XÁC THỰC MỖI REQUEST (79) 🛡️',
      code: `goi API khong token -> 401 chua dang nhap

// filter kiem chu ky JWT truoc controller`,
      notes: [
        { mark: 'ok', text: 'Không token / chữ ký sai → 401 ngay ở vòng ngoài' },
      ],
    },
    {
      tone: 'green',
      title: '4. PHÂN QUYỀN THEO VAI + SỞ HỮU (80) ⛔',
      code: `USER 'an' suaDon cua 'an'    -> 200 (chu so huu)
USER 'an' xoaTaiKhoan        -> 403 (can ADMIN)`,
      notes: [
        { mark: 'ok', text: 'Đã xác thực rồi mới xét quyền: sở hữu cho 200, thiếu vai cho 403' },
      ],
    },
    {
      tone: 'blue',
      title: '5. KHÉP CỤM BẢO MẬT 🏁',
      notes: [
        { mark: 'ok', text: 'Băm → verify+JWT → filter → phân quyền: một luồng đăng nhập trọn vẹn' },
        { mark: 'next', text: '**Ngày 82**: mở dự án cuối — dựng một ứng dụng thật từ số 0' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongLuongDangNhap` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) dang ky 'an' -> luu hash f29500adbfbd (khong luu mat khau)",
      '2) dang nhap sai mat khau -> tu choi, khong phat token',
      '3) dang nhap dung -> phat JWT dai 73 ky tu',
      '4) goi API khong token -> 401 chua dang nhap',
      "5) token USER 'an' suaDon cua 'an' -> 200 suaDon OK",
      "6) token USER 'an' xoaTaiKhoan (can ADMIN) -> 403 thieu quyen",
    ],
  },

  verify: {
    className: 'MoPhongLuongDangNhap',
    source: `import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

/* Bai tong hop khep cum bao mat: ghep CA BON ngay vao MOT luong dang nhap
   dau-cuoi, chay bang JDK thuan (LUAT 6). Bam mat khau (77) -> verify + phat
   JWT (78) -> filter xac thuc token (79) -> phan quyen theo vai + so huu (80). */
public class MoPhongLuongDangNhap {

    static final String SECRET = "khoa-bi-mat-server";

    /* ── (77) Bam mat khau: luu hash, khong luu mat khau ─────────────────── */
    record TaiKhoan(String ten, String vai, String hashMatKhau) {}
    static final Map<String, TaiKhoan> DB = new LinkedHashMap<>();

    static String bam(String salt, String matKhau) {
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] d = sha.digest((salt + ":" + matKhau).getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : d) hex.append(String.format("%02x", b));
            return hex.substring(0, 12);
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    static void dangKy(String ten, String vai, String matKhau) {
        DB.put(ten, new TaiKhoan(ten, vai, bam(ten, matKhau)));   // salt = ten (co dinh)
    }

    /* ── (78) JWT: verify mat khau xong thi phat token da ky ─────────────── */
    static String b64(String s) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }

    static String kySo(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8))).substring(0, 16);
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    static String dangNhap(String ten, String matKhau) {
        TaiKhoan tk = DB.get(ten);
        if (tk == null || !tk.hashMatKhau().equals(bam(ten, matKhau))) return null;   // verify
        String header = b64("{\\"alg\\":\\"HS256\\"}");
        String payload = b64("{\\"sub\\":\\"" + ten + "\\",\\"role\\":\\"" + tk.vai() + "\\"}");
        return header + "." + payload + "." + kySo(header + "." + payload);           // phat JWT
    }

    /* ── (79) Filter: xac thuc token o moi request ───────────────────────── */
    record DanhTinh(String ten, String vai) {}

    static DanhTinh xacThuc(String token) {
        if (token == null) return null;
        String[] p = token.split("\\\\.");
        if (p.length != 3 || !kySo(p[0] + "." + p[1]).equals(p[2])) return null;      // chu ky sai
        String json = new String(Base64.getUrlDecoder().decode(p[1]), StandardCharsets.UTF_8);
        return new DanhTinh(trich(json, "sub"), trich(json, "role"));
    }

    static String trich(String json, String khoa) {
        int i = json.indexOf("\\"" + khoa + "\\":\\"") + khoa.length() + 4;
        return json.substring(i, json.indexOf("\\"", i));
    }

    /* ── (80) Phan quyen: xoa tai khoan can ADMIN; sua don can chu so huu ── */
    static String goiApi(String token, String hanhDong, String chuTaiNguyen) {
        DanhTinh dt = xacThuc(token);
        if (dt == null) return "401 chua dang nhap";                                  // (79)
        boolean choPhep = "ADMIN".equals(dt.vai())
                || ("suaDon".equals(hanhDong) && dt.ten().equals(chuTaiNguyen));      // (80)
        return choPhep ? "200 " + hanhDong + " OK" : "403 thieu quyen";
    }

    public static void main(String[] args) {
        // (1) dang ky: luu hash chu khong luu mat khau
        dangKy("an", "USER", "matkhau-an");
        System.out.println("1) dang ky 'an' -> luu hash " + DB.get("an").hashMatKhau() + " (khong luu mat khau)");

        // (2) dang nhap sai mat khau -> khong phat token
        System.out.println("2) dang nhap sai mat khau -> " + (dangNhap("an", "sai") == null ? "tu choi, khong phat token" : "?"));

        // (3) dang nhap dung -> phat JWT
        String token = dangNhap("an", "matkhau-an");
        System.out.println("3) dang nhap dung -> phat JWT dai " + token.length() + " ky tu");

        // (4) goi API khong token -> 401
        System.out.println("4) goi API khong token -> " + goiApi(null, "suaDon", "an"));

        // (5) goi API co token, sua don CUA MINH -> 200
        System.out.println("5) token USER 'an' suaDon cua 'an' -> " + goiApi(token, "suaDon", "an"));

        // (6) goi API co token USER, xoa tai khoan (can ADMIN) -> 403
        System.out.println("6) token USER 'an' xoaTaiKhoan (can ADMIN) -> " + goiApi(token, "xoaTaiKhoan", "an"));
    }
}`,
  },
};
