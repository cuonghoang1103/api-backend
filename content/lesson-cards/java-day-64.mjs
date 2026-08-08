/**
 * Thẻ bài học "100 Ngày Java" — Ngày 64: ResultSet → đối tượng & mẫu DAO.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-64.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: không có JDBC trong thẻ. Chương trình dựng lại nguyên lý: một
 * ResultSet giả (con trỏ + next()), hàm ánh xạ một hàng thành một đối tượng,
 * và interface DAO che giấu chuyện lưu trữ — đổi từ "CSDL" sang bộ nhớ mà
 * nghiệp vụ không đổi dòng nào. Cú pháp JDBC thật dạy trong thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 64,
  total: 100,
  titleLead: 'Java Day 64:',
  titleAccent: 'ResultSet → Đối tượng',
  subtitle: 'Gom hết code chạm CSDL vào một chỗ: mẫu DAO 🗃️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ÁNH XẠ: MỘT HÀNG → MỘT ĐỐI TƯỢNG 🔄',
      code: `DonHang anXa(ResultSet rs) {
    return new DonHang(
        rs.getString("ma"),
        rs.getInt("so_tien"),
        rs.getString("trang_thai"));
}`,
      notes: [
        { mark: 'ok', text: 'Một chỗ duy nhất biết tên cột — đổi lược đồ chỉ sửa ở đây' },
        { mark: 'dot', text: 'Xong bước này, phần còn lại của app làm việc với `DonHang`, không với cột' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. VÒNG next() CUỘN HẾT KẾT QUẢ 🔁',
      code: `List<DonHang> ket = new ArrayList<>();
while (rs.next()) ket.add(anXa(rs));

// trang thai 'MOI' -> 2 don: [DH-1, DH-3]`,
      notes: [
        { mark: 'ok', text: 'Con trỏ bắt đầu TRƯỚC hàng đầu; `next()` vừa tiến vừa báo còn hàng không' },
        { mark: 'dot', text: 'Không thấy → `Optional.empty`, đừng trả `null` (Ngày 40)' },
      ],
    },
    {
      tone: 'pink',
      title: '3. DAO: CHE GIẤU NƠI LƯU 🗃️',
      code: `interface DonHangDAO {
    void them(DonHang d);
    Optional<DonHang> timTheoMa(String ma);
    List<DonHang> timTheoTrangThai(String tt);
    boolean xoa(String ma);
}`,
      notes: [
        { mark: 'ok', text: 'Nghiệp vụ chỉ thấy interface — không biết SQL, không thấy `Connection`' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐỔI RUỘT, NGHIỆP VỤ KHÔNG ĐỘNG 🔌',
      code: `demChuaGiao(new DonHangDaoJdbc())  -> 2
demChuaGiao(new DonHangDaoBoNho()) -> 1

// CUNG ham nghiep vu, khac ban luu tru`,
      notes: [
        { mark: 'ok', text: 'Bản bộ nhớ để test (Ngày 53) không cần CSDL thật vẫn chạy được' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Code chạm CSDL gom vào tầng DAO — phần còn lại sạch, dễ test' },
        { mark: 'next', text: '**Ngày 65**: giao dịch (transaction) — tất cả cùng xong, hoặc cùng huỷ' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongDAO` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) ResultSet -> doi tuong: DonHang[ma=DH-2, soTien=350000, trangThai=DA_GIAO]',
      '2) tim ma khong co -> Optional.empty',
      "3) tim theo trang thai 'MOI' -> 2 don: [DH-1, DH-3]",
      '4) nghiep vu dem don chua giao -> 2',
      '5) doi sang DAO bo nho, cung ham nghiep vu -> chua giao 1',
      '6) xoa DH-1 -> true; xoa lai DH-1 -> false',
    ],
  },

  verify: {
    className: 'MoPhongDAO',
    source: `import java.util.*;

/* Dung lai NGUYEN LY cua mau DAO bang JDK thuan: mot ResultSet gia (con tro
   chay tren cac hang), ham 'anXa' bien MOT hang thanh MOT doi tuong, va mot
   interface DAO che giau hoan toan chuyen luu tru — nen doi tu CSDL sang bo
   nho khong ai ben ngoai phai sua. */
public class MoPhongDAO {

    /* Doi tuong nghiep vu — thu ma phan con lai cua chuong trinh lam viec cung. */
    record DonHang(String ma, int soTien, String trangThai) {}

    /* ── ResultSet gia: con tro bat dau TRUOC hang dau, next() tien mot buoc ── */
    static class ResultSetGia {
        private final List<Map<String, Object>> hang;
        private int viTri = -1;
        ResultSetGia(List<Map<String, Object>> hang) { this.hang = hang; }
        boolean next() { return ++viTri < hang.size(); }
        String getString(String cot) { return (String) hang.get(viTri).get(cot); }
        int getInt(String cot) { return (Integer) hang.get(viTri).get(cot); }
    }

    /* MOT cho duy nhat biet cach doc mot hang thanh doi tuong. Sua luoc do
       CSDL thi chi sua o day, khong phai luc tim khap chuong trinh. */
    static DonHang anXa(ResultSetGia rs) {
        return new DonHang(rs.getString("ma"), rs.getInt("so_tien"), rs.getString("trang_thai"));
    }

    /* ── Ban hop dong: phan con lai cua app chi biet interface nay ────────── */
    interface DonHangDAO {
        void them(DonHang d);
        Optional<DonHang> timTheoMa(String ma);
        List<DonHang> timTheoTrangThai(String trangThai);
        boolean xoa(String ma);
    }

    /* Ban cai dat "CSDL": ResultSet -> anXa -> doi tuong. */
    static class DonHangDaoJdbc implements DonHangDAO {
        private final List<Map<String, Object>> bang = new ArrayList<>();

        public void them(DonHang d) {
            Map<String, Object> h = new LinkedHashMap<>();
            h.put("ma", d.ma()); h.put("so_tien", d.soTien()); h.put("trang_thai", d.trangThai());
            bang.add(h);
        }
        public Optional<DonHang> timTheoMa(String ma) {
            var rs = new ResultSetGia(bang.stream().filter(h -> ma.equals(h.get("ma"))).toList());
            return rs.next() ? Optional.of(anXa(rs)) : Optional.empty();
        }
        public List<DonHang> timTheoTrangThai(String tt) {
            var rs = new ResultSetGia(bang.stream().filter(h -> tt.equals(h.get("trang_thai"))).toList());
            List<DonHang> ket = new ArrayList<>();
            while (rs.next()) ket.add(anXa(rs));   // vong lap next() chuan cua JDBC
            return ket;
        }
        public boolean xoa(String ma) { return bang.removeIf(h -> ma.equals(h.get("ma"))); }
    }

    /* Ban cai dat "trong bo nho" cho test (Ngay 54): CUNG interface, khac ruot. */
    static class DonHangDaoBoNho implements DonHangDAO {
        private final Map<String, DonHang> map = new LinkedHashMap<>();
        public void them(DonHang d) { map.put(d.ma(), d); }
        public Optional<DonHang> timTheoMa(String ma) { return Optional.ofNullable(map.get(ma)); }
        public List<DonHang> timTheoTrangThai(String tt) {
            return map.values().stream().filter(d -> d.trangThai().equals(tt)).toList();
        }
        public boolean xoa(String ma) { return map.remove(ma) != null; }
    }

    /* Nghiep vu chi nhan interface — khong he biet dang chay tren CSDL hay bo nho. */
    static int demChuaGiao(DonHangDAO dao) {
        return dao.timTheoTrangThai("MOI").size();
    }

    public static void main(String[] args) {
        DonHangDAO dao = new DonHangDaoJdbc();
        dao.them(new DonHang("DH-1", 150000, "MOI"));
        dao.them(new DonHang("DH-2", 350000, "DA_GIAO"));
        dao.them(new DonHang("DH-3", 990000, "MOI"));

        // (1) anh xa MOT hang thanh MOT doi tuong
        DonHang d = dao.timTheoMa("DH-2").orElseThrow();
        System.out.println("1) ResultSet -> doi tuong: " + d);

        // (2) khong thay -> Optional rong, khong tra ve null
        System.out.println("2) tim ma khong co -> " + dao.timTheoMa("DH-404"));

        // (3) vong next() cuon het cac hang
        System.out.println("3) tim theo trang thai 'MOI' -> " + dao.timTheoTrangThai("MOI").size()
                + " don: " + dao.timTheoTrangThai("MOI").stream().map(DonHang::ma).toList());

        // (4) nghiep vu goi qua interface
        System.out.println("4) nghiep vu dem don chua giao -> " + demChuaGiao(dao));

        // (5) DOI HAN ban luu tru sang bo nho — nghiep vu KHONG doi mot dong
        DonHangDAO daoKhac = new DonHangDaoBoNho();
        daoKhac.them(new DonHang("DH-9", 500000, "MOI"));
        System.out.println("5) doi sang DAO bo nho, cung ham nghiep vu -> chua giao "
                + demChuaGiao(daoKhac));

        // (6) xoa tra ve co cham dong nao khong
        System.out.println("6) xoa DH-1 -> " + dao.xoa("DH-1") + "; xoa lai DH-1 -> " + dao.xoa("DH-1"));
    }
}`,
  },
};
