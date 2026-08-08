/**
 * Thẻ bài học "100 Ngày Java" — Ngày 63: JDBC & SQL injection.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-63.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: không có trình điều khiển JDBC trong thẻ (javac + java JDK
 * thuần), nên chương trình dựng lại đúng nguyên lý: nối chuỗi biến dữ liệu
 * thành CÚ PHÁP, còn tham số `?` thì cấu trúc câu lệnh đã chốt trước. Mục 4
 * dùng `AutoCloseable` THẬT nên thứ tự đóng là do JVM in ra, không phải tôi
 * sắp xếp.
 *
 * ✅ Đã đối chiếu với PostgreSQL 15.4 thật (DB tạm `hoc_java_sql`), gửi từng
 * câu bằng `psql -c` đúng như JDBC `Statement` gửi:
 *   ten='an' AND mk='123'          -> (0 rows)
 *   ten='' OR '1'='1' --           -> (2 rows)  ĐĂNG NHẬP ĐƯỢC
 *   ten=''; DROP TABLE nguoi_dung; -> DROP TABLE, rồi
 *                                     ERROR: relation "nguoi_dung" does not exist
 */
export default {
  series: '100 NGÀY JAVA',
  day: 63,
  total: 100,
  titleLead: 'Java Day 63:',
  titleAccent: 'JDBC',
  subtitle: 'Nối Java với CSDL — và lỗ hổng nổi tiếng nhất lịch sử web 💉',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NỐI CHUỖI = MỞ TOANG CỬA 🚪',
      code: `"... WHERE ten='" + ten + "' AND mk='" + mk + "'"

// nguoi dung go vao o TEN:   ' OR '1'='1' --
// -> tra ve CA BANG, dang nhap thanh 'an'`,
      notes: [
        { mark: 'no', text: 'Dữ liệu người dùng biến thành CÚ PHÁP — đó là toàn bộ lỗ hổng' },
        { mark: 'dot', text: 'Dấu `--` vứt bỏ phần còn lại của câu lệnh, kể cả phép kiểm mật khẩu' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. TỆ HƠN: CẮT ĐÔI CÂU LỆNH 💣',
      code: `go vao o ten:   '; DROP TABLE nguoi_dung; --

-- PostgreSQL that tra ve:
DROP TABLE
ERROR: relation "nguoi_dung" does not exist`,
      notes: [
        { mark: 'no', text: 'Bảng bị xoá thật. Không có nút hoàn tác, không có ai hỏi lại bạn' },
      ],
    },
    {
      tone: 'pink',
      title: '3. PREPAREDSTATEMENT ĐÓNG CỬA 🔒',
      code: `var ps = conn.prepareStatement(
    "SELECT * FROM nguoi_dung WHERE ten=? AND mk=?");
ps.setString(1, ten);   // chi so bat dau tu 1
ps.setString(2, mk);
// CUNG chuoi doc do -> tim thay 0 nguoi dung`,
      notes: [
        { mark: 'ok', text: 'Cấu trúc câu lệnh CHỐT xong mới nhận tham số — tham số hết đường thành cú pháp' },
        { mark: 'dot', text: 'Không phải "lọc ký tự lạ" cho sạch, mà là không cho vào chỗ cú pháp' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐÓNG TÀI NGUYÊN ĐÚNG THỨ TỰ 🧹',
      code: `try (Connection c = ...;
     PreparedStatement p = ...;
     ResultSet r = p.executeQuery()) { ... }

// tu dong: [ResultSet, PreparedStatement, Connection]`,
      notes: [
        { mark: 'ok', text: 'Quên đóng `Connection` là rò rỉ — vài giờ sau hết chỗ kết nối (Ngày 23)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Mọi giá trị từ bên ngoài đi bằng `?` — không ngoại lệ, kể cả "chỉ là số"' },
        { mark: 'next', text: '**Ngày 64**: ResultSet → đối tượng Java, và mẫu DAO' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongTiemSQL` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) go sai mat khau -> tim thay 0 nguoi dung',
      "2) go [' OR '1'='1' --] -> tim thay 2 nguoi dung, dang nhap thanh an",
      "3) go ['; DROP TABLE ...] -> bi cat thanh 2 cau, cau 2 = DROP TABLE nguoi_dung",
      '4) PreparedStatement gui truoc cau lenh: SELECT * FROM nguoi_dung WHERE ten=? AND mk=?',
      '5) cung chuoi doc do, nhung la THAM SO -> tim thay 0 nguoi dung',
      '6) try-with-resources tu dong dong: [ResultSet, PreparedStatement, Connection]',
    ],
  },

  verify: {
    className: 'MoPhongTiemSQL',
    source: `import java.util.*;

/* Dung lai NGUYEN LY cua JDBC bang JDK thuan: vi sao NOI CHUOI mo cua cho
   tiem SQL, va vi sao PreparedStatement dong cua lai — cau truc cau lenh
   duoc CHOT truoc khi biet tham so, nen tham so khong bao gio thanh cu phap.
   Ket bang thu tu dong tai nguyen that cua try-with-resources. */
public class MoPhongTiemSQL {

    record NguoiDung(String ten, String mk) {}

    static final List<NguoiDung> BANG = List.of(
            new NguoiDung("an", "matkhau_that"),
            new NguoiDung("binh", "abc123"));

    /* ── CACH SAI: ghep thang du lieu nguoi dung vao cau lenh ─────────────── */
    static String noiChuoi(String ten, String mk) {
        return "SELECT * FROM nguoi_dung WHERE ten='" + ten + "' AND mk='" + mk + "'";
    }

    /* CSDL bo qua moi thu sau '--' den het dong — day la thu ke tan cong dung
       de vut bo phan con lai cua cau lenh. */
    static String boBinhLuan(String sql) {
        int i = sql.indexOf("--");
        return i < 0 ? sql : sql.substring(0, i);
    }

    static List<String> tachCauLenh(String sql) {
        List<String> ket = new ArrayList<>();
        for (String phan : boBinhLuan(sql).split(";")) {
            if (!phan.isBlank()) ket.add(phan.trim());
        }
        return ket;
    }

    static String docGiaTri(String hang, NguoiDung d) {
        if (hang.length() >= 2 && hang.startsWith("'") && hang.endsWith("'")) {
            return hang.substring(1, hang.length() - 1);
        }
        if (hang.equals("ten")) return d.ten();
        if (hang.equals("mk")) return d.mk();
        return hang;
    }

    static boolean soSanh(String ve, NguoiDung d) {
        String[] hai = ve.split("=", 2);
        return docGiaTri(hai[0].trim(), d).equals(docGiaTri(hai[1].trim(), d));
    }

    /* AND rang hon OR — dung thu tu uu tien that cua SQL. */
    static boolean danhGia(String dieuKien, NguoiDung d) {
        for (String nhomHoac : dieuKien.split("(?i) OR ")) {
            boolean tatCa = true;
            for (String phanVa : nhomHoac.split("(?i) AND ")) {
                if (!soSanh(phanVa, d)) { tatCa = false; break; }
            }
            if (tatCa) return true;
        }
        return false;
    }

    static String layDieuKien(String cauSelect) {
        return cauSelect.substring(cauSelect.toUpperCase().indexOf("WHERE") + 5).trim();
    }

    static List<NguoiDung> chay(String cauSelect) {
        String dieuKien = layDieuKien(cauSelect);
        List<NguoiDung> ket = new ArrayList<>();
        for (NguoiDung d : BANG) if (danhGia(dieuKien, d)) ket.add(d);
        return ket;
    }

    /* ── CACH DUNG: cau truc CHOT tu cai mau co dau ?, tham so chi duoc dat
       vao o trong nhu MOT GIA TRI, khong bao gio duoc doc lai nhu cu phap. ── */
    static List<NguoiDung> chayCoThamSo(String mau, List<String> thamSo) {
        String[] cacVe = layDieuKien(mau).split("(?i) AND ");
        List<NguoiDung> ket = new ArrayList<>();
        for (NguoiDung d : BANG) {
            boolean khop = true;
            int oTrong = 0;
            for (String ve : cacVe) {
                String[] hai = ve.split("=", 2);
                String phai = hai[1].trim();
                String giaTri = phai.equals("?") ? thamSo.get(oTrong++) : docGiaTri(phai, d);
                if (!docGiaTri(hai[0].trim(), d).equals(giaTri)) { khop = false; break; }
            }
            if (khop) ket.add(d);
        }
        return ket;
    }

    /* ── Tai nguyen tu dong dong (Ngay 23) ───────────────────────────────── */
    static final List<String> DA_DONG = new ArrayList<>();

    record TaiNguyen(String ten) implements AutoCloseable {
        @Override public void close() { DA_DONG.add(ten); }
    }

    public static void main(String[] args) {
        // (1) nguoi dung that go sai mat khau -> khong vao duoc, dung nhu mong doi
        System.out.println("1) go sai mat khau -> tim thay "
                + chay(tachCauLenh(noiChuoi("an", "123")).get(0)).size() + " nguoi dung");

        // (2) ke tan cong go chuoi nay vao O TEN DANG NHAP
        String doc = "' OR '1'='1' --";
        List<NguoiDung> lot = chay(tachCauLenh(noiChuoi(doc, "sai_bet")).get(0));
        System.out.println("2) go [' OR '1'='1' --] -> tim thay " + lot.size()
                + " nguoi dung, dang nhap thanh " + lot.get(0).ten());

        // (3) te hon: dau ';' cat cau lenh lam hai
        List<String> cacCau = tachCauLenh(noiChuoi("'; DROP TABLE nguoi_dung; --", "x"));
        System.out.println("3) go ['; DROP TABLE ...] -> bi cat thanh " + cacCau.size()
                + " cau, cau 2 = " + cacCau.get(1));

        // (4)(5) PreparedStatement: CUNG chuoi doc do, nhung di duong tham so
        String mau = "SELECT * FROM nguoi_dung WHERE ten=? AND mk=?";
        System.out.println("4) PreparedStatement gui truoc cau lenh: " + mau);
        System.out.println("5) cung chuoi doc do, nhung la THAM SO -> tim thay "
                + chayCoThamSo(mau, List.of(doc, "sai_bet")).size() + " nguoi dung");

        // (6) thu tu dong tai nguyen — do chinh JVM lam, khong phai minh sap xep
        try (TaiNguyen c = new TaiNguyen("Connection");
             TaiNguyen p = new TaiNguyen("PreparedStatement");
             TaiNguyen r = new TaiNguyen("ResultSet")) {
            // lam viec voi r
        }
        System.out.println("6) try-with-resources tu dong dong: " + DA_DONG);
    }
}`,
  },
};
