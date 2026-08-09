/**
 * Thẻ bài học "100 Ngày Java" — Ngày 80: Phân quyền chi tiết.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-80.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: thẻ chạy JDK thuần. Chương trình dựng lại nguyên lý: quyền theo
 * VAI (role) + theo QUAN HỆ SỞ HỮU (chỉ sửa đồ của mình), và @PreAuthorize
 * chặn TRƯỚC khi thân hàm chạy. Cú pháp @PreAuthorize/hasRole dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 80,
  total: 100,
  titleLead: 'Java Day 80:',
  titleAccent: 'Phân quyền chi tiết',
  subtitle: 'Không chỉ "vai gì", mà còn "có phải đồ của bạn không" 🔑',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. QUYỀN THEO VAI (ROLE) 👥',
      code: `ADMIN xoa tai khoan -> cho phep
USER  xoa tai khoan -> 403 (chi ADMIN)`,
      notes: [
        { mark: 'ok', text: 'Vai (ADMIN/USER/EDITOR) quyết định được làm loại việc nào' },
        { mark: 'dot', text: 'Nhưng vai thôi chưa đủ cho mọi tình huống' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. QUYỀN THEO SỞ HỮU 🔑',
      code: `USER 'an' sua don CUA MINH (DH-1) -> da sua
USER 'an' sua don cua 'binh'      -> 403`,
      notes: [
        { mark: 'no', text: 'Cùng vai USER, nhưng chỉ sửa được đồ của CHÍNH MÌNH' },
        { mark: 'ok', text: 'Lỗ hổng kinh điển: quên kiểm sở hữu → ai cũng sửa đồ người khác' },
      ],
    },
    {
      tone: 'pink',
      title: '3. ADMIN VƯỢT SỞ HỮU 👑',
      code: `ADMIN sua don cua 'binh' (DH-2) -> da sua

// admin toan quyen, khong can la chu`,
      notes: [
        { mark: 'ok', text: 'Vai cao hơn thắng luật sở hữu — nhưng phải khai rõ, không mặc nhiên' },
      ],
    },
    {
      tone: 'green',
      title: '4. @PreAuthorize: CHẶN TRƯỚC KHI CHẠY 🚧',
      code: `@PreAuthorize("hasRole('ADMIN') or #don.chuSoHuu == authentication.name")
void suaDon(Don don) { ... }

// 3 lan goi -> than ham chay 2 (1 lan chan TRUOC)`,
      notes: [
        { mark: 'ok', text: 'Luật quyền gắn ngay trên phương thức, chặn trước khi thân hàm chạy' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Kiểm cả VAI lẫn SỞ HỮU; đừng bao giờ tin id tài nguyên client gửi' },
        { mark: 'next', text: '**Ngày 81**: khép cụm bảo mật — luồng đăng nhập → JWT → API đầy đủ' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongPhanQuyen` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) ADMIN xoa tai khoan -> cho phep',
      '2) USER xoa tai khoan -> 403 (chi ADMIN)',
      "3) USER 'an' sua don CUA MINH (DH-1) -> da sua DH-1",
      "4) USER 'an' sua don cua 'binh' (DH-2) -> 403 thieu quyen",
      "5) ADMIN sua don cua 'binh' (DH-2) -> da sua DH-2",
      '6) @PreAuthorize: 3 lan goi -> than ham chay 2 (1 lan chan TRUOC khi chay)',
    ],
  },

  verify: {
    className: 'MoPhongPhanQuyen',
    source: `import java.util.*;

/* Dung lai NGUYEN LY phan quyen chi tiet bang JDK THUAN: khong chi theo VAI
   (role) ma con theo QUAN HE SO HUU (chi sua do cua chinh minh). @PreAuthorize
   gan luat quyen ngay tren phuong thuc -> chan TRUOC khi than ham chay. */
public class MoPhongPhanQuyen {

    record NguoiDung(String ten, String vai) {}     // vai: USER / EDITOR / ADMIN
    record Don(String ma, String chuSoHuu) {}

    static int soLanThanHamChay = 0;                // dem so lan than ham thuc su chay

    /* Luat quyen: ADMIN lam duoc het; sua thi phai la CHU SO HUU; xoa tai khoan chi ADMIN. */
    static boolean choPhep(NguoiDung u, String hanhDong, Don don) {
        if ("ADMIN".equals(u.vai())) return true;                       // admin: toan quyen
        return switch (hanhDong) {
            case "xem"          -> true;                                // ai dang nhap cung xem
            case "sua"          -> don != null && don.chuSoHuu().equals(u.ten());   // chi chu so huu
            case "xoaTaiKhoan"  -> false;                               // chi ADMIN (chan o tren)
            default             -> false;
        };
    }

    /* Phuong thuc "co @PreAuthorize": kiem quyen TRUOC, than ham chi chay neu duoc phep. */
    static String suaDon(NguoiDung u, Don don) {
        if (!choPhep(u, "sua", don)) return "403 thieu quyen";          // chan truoc
        soLanThanHamChay++;                                            // than ham
        return "da sua " + don.ma();
    }

    public static void main(String[] args) {
        NguoiDung an = new NguoiDung("an", "USER");
        NguoiDung admin = new NguoiDung("admin", "ADMIN");
        Don donCuaAn = new Don("DH-1", "an");
        Don donCuaBinh = new Don("DH-2", "binh");

        // (1)(2) theo VAI: xoa tai khoan chi ADMIN
        System.out.println("1) ADMIN xoa tai khoan -> " + (choPhep(admin, "xoaTaiKhoan", null) ? "cho phep" : "403"));
        System.out.println("2) USER xoa tai khoan -> " + (choPhep(an, "xoaTaiKhoan", null) ? "cho phep" : "403 (chi ADMIN)"));

        // (3)(4) theo SO HUU: USER chi sua don cua chinh minh
        System.out.println("3) USER 'an' sua don CUA MINH (DH-1) -> " + suaDon(an, donCuaAn));
        System.out.println("4) USER 'an' sua don cua 'binh' (DH-2) -> " + suaDon(an, donCuaBinh));

        // (5) ADMIN sua don cua ai cung duoc
        System.out.println("5) ADMIN sua don cua 'binh' (DH-2) -> " + suaDon(admin, donCuaBinh));

        // (6) @PreAuthorize: than ham chi chay khi duoc phep (2 lan), 1 lan bi chan truoc
        System.out.println("6) @PreAuthorize: 3 lan goi -> than ham chay " + soLanThanHamChay
                + " (1 lan chan TRUOC khi chay)");
    }
}`,
  },
};
