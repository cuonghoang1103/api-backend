/**
 * Thẻ bài học "100 Ngày Java" — Ngày 78: JWT (JSON Web Token).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-78.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: thư viện JWT là NGOÀI, thẻ chạy JDK thuần. Chương trình dựng lại
 * ĐÚNG cơ chế: token = header.payload.chuKy, chữ ký = HMAC-SHA256(header.payload,
 * secret) — dùng javax.crypto.Mac + Base64 của JDK. HMAC + secret cố định →
 * output tái lập. Cú pháp jjwt/Spring Security dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 78,
  total: 100,
  titleLead: 'Java Day 78:',
  titleAccent: 'JWT',
  subtitle: 'Tấm vé đăng nhập cho API không nhớ trạng thái 🎫',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BA PHẦN: HEADER.PAYLOAD.CHỮ KÝ 🎫',
      code: `eyJhbGc...  .  eyJzdWIi...  .  Kf9x...
  header         payload        chu ky

// noi bang dau '.', ma base64url`,
      notes: [
        { mark: 'ok', text: 'Máy chủ phát vé sau khi bạn đăng nhập; request sau chỉ chìa vé' },
        { mark: 'dot', text: 'Không phải gõ lại mật khẩu mỗi lần bấm' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. PAYLOAD CHỈ MÃ, KHÔNG MẬT 👀',
      code: `giai base64 -> {"sub":"an","role":"USER"}

// ai cung DOC duoc payload!`,
      notes: [
        { mark: 'no', text: 'JWT chỉ **ký**, không **mã hoá** — đừng để mật khẩu/bí mật vào payload' },
        { mark: 'dot', text: 'Payload chứa danh tính + quyền, không chứa thứ nhạy cảm' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CHỮ KÝ CHỐNG GIẢ MẠO ✍️',
      code: `verify token that (dung secret) -> true

sua role->ADMIN (giu chu ky cu) -> false
ky lai bang secret sai         -> false`,
      notes: [
        { mark: 'ok', text: 'Sửa payload → chữ ký không khớp → bị từ chối' },
        { mark: 'no', text: 'Không có secret của server → không ký giả được, dù đọc được payload' },
      ],
    },
    {
      tone: 'green',
      title: '4. STATELESS: SERVER KHÔNG NHỚ GÌ 🗄️',
      code: `verify = TINH LAI chu ky HMAC roi so
// server KHONG luu session nao ca`,
      notes: [
        { mark: 'ok', text: 'Không lưu phiên → dễ mở rộng nhiều máy chủ, hợp API REST' },
        { mark: 'dot', text: 'Đánh đổi: khó thu hồi token trước hạn → đặt hạn ngắn (`exp`)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Đăng nhập → server ký JWT → client gửi kèm mỗi request (`Authorization: Bearer`)' },
        { mark: 'next', text: '**Ngày 79**: Spring Security — lớp gác dựng trước mọi API của bạn' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongJwt` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) token = header.payload.chuKy (3 phan), dai 89 ky tu',
      '2) giai payload (base64) -> {"sub":"an","role":"USER"}',
      '3) verify token that (dung secret) -> hop le? true',
      '4) sua payload role->ADMIN (giu chu ky cu) -> verify false (bi tu choi)',
      '5) ky lai bang secret doan sai -> verify false (khong gia duoc chu ky)',
      '6) stateless: server KHONG luu session, chi tinh lai chu ky HMAC de kiem',
    ],
  },

  verify: {
    className: 'MoPhongJwt',
    source: `import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/* Dung lai NGUYEN LY cua JWT bang JDK THUAN: token = header.payload.chuKy,
   chu ky = HMAC-SHA256(header.payload, secret). Server XAC MINH bang cach TINH
   LAI chu ky roi so — khong luu session (stateless). Sua payload hay dung sai
   secret la chu ky khong khop -> tu choi. HMAC voi secret co dinh -> tai lap. */
public class MoPhongJwt {

    static final String SECRET = "khoa-bi-mat-server";

    static String b64(String s) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }

    static String giaiB64(String s) {
        return new String(Base64.getUrlDecoder().decode(s), StandardCharsets.UTF_8);
    }

    static String kySo(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] sig = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(sig).substring(0, 16);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    static String taoToken(String payloadJson, String secret) {
        String header = b64("{\\"alg\\":\\"HS256\\",\\"typ\\":\\"JWT\\"}");
        String payload = b64(payloadJson);
        String chuKy = kySo(header + "." + payload, secret);
        return header + "." + payload + "." + chuKy;
    }

    /* Xac minh = tinh lai chu ky tu (header.payload) roi so voi chu ky trong token. */
    static boolean verify(String token, String secret) {
        String[] p = token.split("\\\\.");
        if (p.length != 3) return false;
        return kySo(p[0] + "." + p[1], secret).equals(p[2]);
    }

    public static void main(String[] args) {
        String token = taoToken("{\\"sub\\":\\"an\\",\\"role\\":\\"USER\\"}", SECRET);

        // (1) cau truc 3 phan
        System.out.println("1) token = header.payload.chuKy (3 phan), dai " + token.length() + " ky tu");

        // (2) payload KHONG bi ma hoa, chi ma base64 -> ai cung doc duoc
        System.out.println("2) giai payload (base64) -> " + giaiB64(token.split("\\\\.")[1]));

        // (3) verify token that
        System.out.println("3) verify token that (dung secret) -> hop le? " + verify(token, SECRET));

        // (4) ke tan cong SUA payload role->ADMIN nhung giu chu ky cu
        String[] p = token.split("\\\\.");
        String payloadGia = b64("{\\"sub\\":\\"an\\",\\"role\\":\\"ADMIN\\"}");
        String tokenSua = p[0] + "." + payloadGia + "." + p[2];
        System.out.println("4) sua payload role->ADMIN (giu chu ky cu) -> verify " + verify(tokenSua, SECRET)
                + " (bi tu choi)");

        // (5) ke tan cong tu KY LAI bang secret doan sai
        String tokenGia = taoToken("{\\"sub\\":\\"an\\",\\"role\\":\\"ADMIN\\"}", "secret-doan-sai");
        System.out.println("5) ky lai bang secret doan sai -> verify " + verify(tokenGia, SECRET)
                + " (khong gia duoc chu ky)");

        // (6) stateless
        System.out.println("6) stateless: server KHONG luu session, chi tinh lai chu ky HMAC de kiem");
    }
}`,
  },
};
