/**
 * Thẻ bài học "100 Ngày Java" — Ngày 77: Bảo mật & băm mật khẩu (mở Giai đoạn 10).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-77.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 5 + 6: BCrypt/Argon2 (đúng chuẩn băm mật khẩu) có SALT NGẪU NHIÊN →
 * hash đổi mỗi lần chạy, KHÔNG in được lên thẻ so khớp từng dòng. Nên chương
 * trình dựng lại NGUYÊN LÝ (một chiều + salt + verify) bằng SHA-256 với salt
 * CỐ ĐỊNH để output ổn định — KHÔNG phải vì SHA-256 hợp để băm mật khẩu. Thân
 * bài dạy BCrypt + PasswordEncoder của Spring Security thật.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 77,
  total: 100,
  titleLead: 'Java Day 77:',
  titleAccent: 'Bảo mật & mật khẩu',
  subtitle: 'Không bao giờ lưu mật khẩu — chỉ lưu dấu vết một chiều 🔐',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. XÁC THỰC ≠ PHÂN QUYỀN 🪪',
      code: `Authentication: BẠN LÀ AI?    (đăng nhập)
Authorization:  ĐƯỢC LÀM GÌ?   (quyền)

// hai câu hỏi khác nhau, đừng lẫn`,
      notes: [
        { mark: 'ok', text: 'Xác thực trước (bạn là ai), rồi mới phân quyền (được làm gì)' },
        { mark: 'dot', text: 'Cả Giai đoạn 10 xoay quanh hai câu hỏi này' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ĐỪNG LƯU MẬT KHẨU, LƯU HASH 🚫',
      code: `// SAI: luu '123456' -> DB lo la lo het
// DUNG: luu hash mot chieu
bam("123456") -> 2418b74a6f2d`,
      notes: [
        { mark: 'no', text: 'Lưu nguyên bản: DB rò là mọi mật khẩu người dùng lộ sạch' },
        { mark: 'ok', text: 'Hash một chiều: không có hàm giải ngược ra mật khẩu' },
      ],
    },
    {
      tone: 'pink',
      title: '3. VERIFY: BĂM LẠI RỒI SO 🔁',
      code: `// dang nhap KHONG giai ma hash
nhap '123456' -> bam lai -> khop? true
nhap 'abc'    -> bam lai -> khop? false`,
      notes: [
        { mark: 'ok', text: 'So hai hash, không bao giờ cần biết mật khẩu gốc' },
      ],
    },
    {
      tone: 'green',
      title: '4. SALT: CHỐNG BẢNG TRA SẴN 🧂',
      code: `an & binh CUNG '123456'
-> hash KHAC nhau (moi nguoi salt rieng)

doi 1 ky tu -> hash doi hoan toan`,
      notes: [
        { mark: 'ok', text: 'Salt riêng mỗi người → bảng tra hash sẵn (rainbow table) vô dụng' },
        { mark: 'no', text: 'Mật khẩu yếu + băm nhanh vẫn đoán được → dùng BCrypt (chậm có chủ đích)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Thật thì dùng `BCryptPasswordEncoder`, KHÔNG tự viết SHA (bài này chỉ minh hoạ)' },
        { mark: 'next', text: '**Ngày 78**: JWT — tấm vé đăng nhập cho API không nhớ trạng thái' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongBamMatKhau` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) luu plaintext '123456' -> ai doc duoc DB la thay mat khau that (NGUY HIEM)",
      "2) bam mot chieu (SHA-256, salt='u_an') -> luu 2418b74a6f2d",
      "3) verify: nhap dung '123456' -> true; nhap sai 'abc' -> false",
      "4) an & binh CUNG mat khau '123456' -> hash khac nhau? true",
      "5) doi 1 ky tu '123456'->'123457' -> hash doi hoan toan? true",
      "6) mot chieu: chi THU tung cai moi ra '123456' (khong dao nguoc truc tiep)",
    ],
  },

  verify: {
    className: 'MoPhongBamMatKhau',
    source: `import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/* Dung lai NGUYEN LY bam mat khau bang JDK THUAN: mot chieu + salt + verify.
   ⚠ That thi dung BCrypt/Argon2 (cham co chu dinh, salt NGAU NHIEN). O day
   dung SHA-256 voi salt CO DINH chi de thay output ON DINH tren the (LUAT 5:
   khong in thu doi theo lan chay) — KHONG phai vi SHA-256 hop de bam mat khau. */
public class MoPhongBamMatKhau {

    /* Bam mot chieu: tu (salt, mat khau) ra chuoi hex. Salt co dinh -> tai lap. */
    static String bam(String salt, String matKhau) {
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] d = sha.digest((salt + ":" + matKhau).getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : d) hex.append(String.format("%02x", b));
            return hex.substring(0, 12);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /* verify: bam lai mat khau nhap roi so voi hash da luu — khong bao gio giai ma. */
    static boolean verify(String salt, String hashLuu, String matKhauNhap) {
        return bam(salt, matKhauNhap).equals(hashLuu);
    }

    public static void main(String[] args) {
        String saltAn = "u_an", saltBinh = "u_binh";
        String hashAn = bam(saltAn, "123456");

        // (1) sai lam chet nguoi: luu mat khau nguyen ban
        System.out.println("1) luu plaintext '123456' -> ai doc duoc DB la thay mat khau that (NGUY HIEM)");

        // (2) luu HASH mot chieu thay vi mat khau
        System.out.println("2) bam mot chieu (SHA-256, salt='" + saltAn + "') -> luu " + hashAn);

        // (3) dang nhap = bam lai roi so, khong giai ma
        System.out.println("3) verify: nhap dung '123456' -> " + verify(saltAn, hashAn, "123456")
                + "; nhap sai 'abc' -> " + verify(saltAn, hashAn, "abc"));

        // (4) SALT: hai nguoi cung mat khau -> hash KHAC nhau (chong bang tra san)
        String hashBinh = bam(saltBinh, "123456");
        System.out.println("4) an & binh CUNG mat khau '123456' -> hash khac nhau? " + !hashAn.equals(hashBinh));

        // (5) doi DUNG 1 ky tu -> hash doi hoan toan (hieu ung tuyet lo)
        String hashDoi = bam(saltAn, "123457");
        System.out.println("5) doi 1 ky tu '123456'->'123457' -> hash doi hoan toan? " + !hashAn.equals(hashDoi));

        // (6) mot chieu: khong co ham nguoc, ke tan cong chi THU tung cai (nen mat
        //     khau yeu + bam nhanh la nguy hiem -> ly do dung BCrypt cham)
        String[] tuDien = {"111111", "qwerty", "123456", "password"};
        String doanRa = null;
        for (String thu : tuDien) if (bam(saltAn, thu).equals(hashAn)) { doanRa = thu; break; }
        System.out.println("6) mot chieu: chi THU tung cai moi ra '" + doanRa + "' (khong dao nguoc truc tiep)");
    }
}`,
  },
};
