/**
 * Thẻ bài học "100 Ngày Java" — Ngày 97: Rà soát bảo mật cuối (OWASP).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-97.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: checklist bảo mật dựng bằng JDK thuần (gom bài học rải rác), tất
 * định. Danh sách OWASP + cấu hình bảo mật dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 97,
  total: 100,
  titleLead: 'Java Day 97:',
  titleAccent: 'Rà soát bảo mật',
  subtitle: 'Gom mọi bài học rải rác thành một checklist 🔒',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT CHECKLIST, KHÔNG NHỚ LỘN XỘN 📋',
      code: `checklist bao mat: 8 muc (gom bai hoc rai rac)
da co: 6/8`,
      notes: [
        { mark: 'ok', text: 'Rà soát có DANH SÁCH thì không bỏ sót loại lỗ hổng nào' },
        { mark: 'dot', text: 'Dựa trên OWASP Top 10 — 10 lỗ hổng web phổ biến & nguy hiểm nhất' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. NHỮNG GÌ ĐÃ LÀM TRONG SERIES ✅',
      code: `SQL injection (63) · bam mk (77) · JWT (78)
IDOR (80) · upload (87) · rate limit (88)`,
      notes: [
        { mark: 'ok', text: 'Từng mảnh đã học rải rác — giờ gom lại thấy bức tranh đầy đủ' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CÒN THIẾU → VIỆC PHẢI LÀM ⚠️',
      code: `- Buoc HTTPS (token khong bay tran) (Ngay 81)
- Che Actuator/Swagger nhay cam (Ngay 93)`,
      notes: [
        { mark: 'no', text: 'Rà soát để LỘ ra chỗ chưa làm — trước khi kẻ tấn công tìm thấy' },
      ],
    },
    {
      tone: 'green',
      title: '4. VÀI MỤC OWASP KHÁC ĐÁNG SOI 🔍',
      code: `- Kiem MOI dau vao (Ngay 69)
- Loi khong lo stack trace (73)
- Cap nhat thu vien (CVE)`,
      notes: [
        { mark: 'ok', text: 'Validation, xử lý lỗi kín, dependency vá lỗi — đều là bảo mật' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Bảo mật là thói quen rà soát định kỳ, không phải làm một lần rồi quên' },
        { mark: 'next', text: '**Ngày 98**: tối ưu hiệu năng cuối — đo, tìm điểm nóng, sửa' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongRaSoat` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) checklist bao mat: 8 muc (gom bai hoc rai rac)',
      '2) da co: 6/8 (SQL inj, bam mk, JWT, IDOR, upload, rate limit)',
      '3) con thieu: 2 muc phai bo sung',
      '4) - Buoc HTTPS (token khong bay tran) (Ngay 81)',
      '5) - Che Actuator/Swagger nhay cam (Ngay 93)',
      '6) ra soat co DANH SACH -> khong bo sot, tu kiem duoc moi du an',
    ],
  },

  verify: {
    className: 'MoPhongRaSoat',
    source: `import java.util.*;
import java.util.stream.*;

/* Blog API — ra soat bao mat cuoi. Gom moi bai hoc bao mat RAI RAC trong series
   thanh MOT checklist (kieu OWASP), moi muc danh gia da-co / con-thieu tren
   chinh Blog API. Chay JDK thuan, tat dinh. Ra soat co DANH SACH tot hon nho
   long leo. */
public class MoPhongRaSoat {

    record Muc(String ten, boolean daCo, int ngay) {}

    public static void main(String[] args) {
        List<Muc> checklist = List.of(
                new Muc("Chong SQL injection (PreparedStatement)", true, 63),
                new Muc("Bam mat khau (BCrypt, khong plaintext)", true, 77),
                new Muc("Xac thuc JWT + secret ngoai code", true, 78),
                new Muc("Phan quyen + chong IDOR (kiem so huu)", true, 80),
                new Muc("Upload an toan (magic bytes/size/path)", true, 87),
                new Muc("Rate limit (chong do mat khau)", true, 88),
                new Muc("Buoc HTTPS (token khong bay tran)", false, 81),
                new Muc("Che Actuator/Swagger nhay cam", false, 93));

        long dat = checklist.stream().filter(Muc::daCo).count();
        System.out.println("1) checklist bao mat: " + checklist.size() + " muc (gom bai hoc rai rac)");
        System.out.println("2) da co: " + dat + "/" + checklist.size()
                + " (SQL inj, bam mk, JWT, IDOR, upload, rate limit)");

        List<Muc> thieu = checklist.stream().filter(m -> !m.daCo()).collect(Collectors.toList());
        System.out.println("3) con thieu: " + thieu.size() + " muc phai bo sung");
        System.out.println("4) - " + thieu.get(0).ten() + " (Ngay " + thieu.get(0).ngay() + ")");
        System.out.println("5) - " + thieu.get(1).ten() + " (Ngay " + thieu.get(1).ngay() + ")");
        System.out.println("6) ra soat co DANH SACH -> khong bo sot, tu kiem duoc moi du an");
    }
}`,
  },
};
