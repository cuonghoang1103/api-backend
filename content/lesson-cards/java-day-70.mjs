/**
 * Thẻ bài học "100 Ngày Java" — Ngày 70: Spring Data JPA.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-70.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: Spring Data JPA là framework ngoài. Chương trình dựng lại đúng
 * CƠ CHẾ THẬT của nó bằng JDK thuần: java.lang.reflect.Proxy chặn lời gọi trên
 * một interface RỖNG và phân tích TÊN HÀM ('findByTrangThai' -> lọc theo
 * trường trangThai) — chính là cách Spring sinh repository lúc chạy. Cú pháp
 * @Entity/JpaRepository dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 70,
  total: 100,
  titleLead: 'Java Day 70:',
  titleAccent: 'Spring Data JPA',
  subtitle: 'Khai một interface rỗng, framework tự sinh CRUD 🪄',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. INTERFACE RỖNG → CRUD ĐẦY ĐỦ 🪄',
      code: `interface KhoDonHang
        extends JpaRepository<DonHang, String> {}

// khong viet than ham nao, van co:
// save, findById, findAll, delete, count...`,
      notes: [
        { mark: 'ok', text: 'Không một dòng SQL, không PreparedStatement — framework sinh lúc chạy' },
        { mark: 'dot', text: 'Cả Giai đoạn 8 (JDBC tay) gập lại thành một interface' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. @Entity: LỚP ↔ BẢNG 🗂️',
      code: `@Entity
class DonHang {
    @Id String ma;
    int soTien;
    String trangThai;
}`,
      notes: [
        { mark: 'ok', text: 'JPA tự ánh xạ đối tượng ↔ hàng, tự sinh câu SQL (Ngày 64)' },
        { mark: 'dot', text: '`@Id` đánh dấu khoá chính — như `PRIMARY KEY` của Ngày 61' },
      ],
    },
    {
      tone: 'pink',
      title: '3. TÊN HÀM = CÂU TRUY VẤN 🔤',
      code: `List<DonHang> findByTrangThai(String tt);
List<DonHang> findBySoTienGreaterThan(int n);

// phan tich: truong 'soTien' + phep 'GreaterThan'`,
      notes: [
        { mark: 'ok', text: 'Spring đọc tên phương thức, tự dựng truy vấn — bạn chỉ đặt tên đúng' },
        { mark: 'dot', text: 'Bên dưới là Proxy + phản chiếu, không có phép màu nào cả' },
      ],
    },
    {
      tone: 'green',
      title: '4. SQL TỰ VIẾT: 0 DÒNG 📉',
      code: `findByTrangThai('MOI')        -> [DH-1, DH-3]
findBySoTienGreaterThan(200000) -> [DH-2, DH-3]

// so dong SQL minh go tay: 0`,
      notes: [
        { mark: 'ok', text: 'Việc lặp đi lặp lại giao cho framework; bạn lo nghiệp vụ' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`@Entity` + `JpaRepository` = tầng dữ liệu trong vài dòng, không SQL tay' },
        { mark: 'next', text: '**Ngày 71**: quan hệ trong JPA — @OneToMany, @ManyToOne (khoá ngoại Ngày 62)' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongJpaRepo` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) khai interface rong -> framework sinh ban cai dat luc chay, count()=3',
      "2) save + findById('DH-2') -> DonHang[ma=DH-2, soTien=350000, trangThai=DA_GIAO]",
      "3) findByTrangThai('MOI') -> [DH-1, DH-3]",
      '4) findBySoTienGreaterThan(200000) -> [DH-2, DH-3]',
      "5) phan tich ten ham -> truong 'soTien' + phep 'GreaterThan'",
      '6) so dong SQL minh tu viet tay: 0',
    ],
  },

  verify: {
    className: 'MoPhongJpaRepo',
    source: `import java.lang.reflect.*;
import java.util.*;

/* Dung lai NGUYEN LY cua Spring Data JPA bang JDK THUAN: ban khai mot
   INTERFACE RONG, khong viet ban cai dat, va framework tu sinh no luc chay.
   Spring lam viec nay bang DYNAMIC PROXY + phan tich TEN HAM ('findByTrangThai'
   -> loc theo truong trangThai). Day dung la co che that, viet lai bang
   java.lang.reflect.Proxy. Cu phap @Entity/JpaRepository day o than bai. */
public class MoPhongJpaRepo {

    record DonHang(String ma, int soTien, String trangThai) {}

    /* "Repository": chi co chu ky, KHONG than ham — y het Spring Data. */
    interface KhoDonHang {
        DonHang save(DonHang d);
        DonHang findById(String ma);
        long count();
        List<DonHang> findByTrangThai(String trangThai);
        List<DonHang> findBySoTienGreaterThan(int nguong);
    }

    static int soDongSqlTuViet = 0;   // dem SQL minh phai go tay -> muc tieu 0

    /* Phan tich ten ham thanh (ten truong, phep so sanh) — trai tim cua magic. */
    record TruyVan(String truong, String phep) {}

    static TruyVan phanTich(String tenHam) {
        String phan = tenHam.substring("findBy".length());       // bo 'findBy'
        String phep = "Equals";
        for (String o : new String[]{"GreaterThan", "LessThan"}) {
            if (phan.endsWith(o)) { phep = o; phan = phan.substring(0, phan.length() - o.length()); break; }
        }
        String truong = Character.toLowerCase(phan.charAt(0)) + phan.substring(1);
        return new TruyVan(truong, phep);
    }

    /* Bo sinh: bat moi loi goi phuong thuc tren interface va tu tra loi. */
    static class BoSinh implements InvocationHandler {
        final Map<String, DonHang> data = new LinkedHashMap<>();

        public Object invoke(Object proxy, Method m, Object[] args) throws Exception {
            switch (m.getName()) {
                case "save":     { DonHang d = (DonHang) args[0]; data.put(d.ma(), d); return d; }
                case "findById": return data.get(args[0]);
                case "count":    return (long) data.size();
            }
            // findByXxx -> phan tich ten, loc bang reflection tren record accessor
            TruyVan tv = phanTich(m.getName());
            Method accessor = DonHang.class.getMethod(tv.truong());
            Object nguong = args[0];
            List<DonHang> ket = new ArrayList<>();
            for (DonHang d : data.values()) {
                Object giaTri = accessor.invoke(d);
                boolean khop = switch (tv.phep()) {
                    case "GreaterThan" -> (int) giaTri > (int) nguong;
                    case "LessThan"    -> (int) giaTri < (int) nguong;
                    default            -> giaTri.equals(nguong);
                };
                if (khop) ket.add(d);
            }
            return ket;
        }
    }

    public static void main(String[] args) {
        KhoDonHang kho = (KhoDonHang) Proxy.newProxyInstance(
                KhoDonHang.class.getClassLoader(),
                new Class[]{KhoDonHang.class},
                new BoSinh());

        kho.save(new DonHang("DH-1", 150000, "MOI"));
        kho.save(new DonHang("DH-2", 350000, "DA_GIAO"));
        kho.save(new DonHang("DH-3", 990000, "MOI"));

        System.out.println("1) khai interface rong -> framework sinh ban cai dat luc chay, count()=" + kho.count());
        System.out.println("2) save + findById('DH-2') -> " + kho.findById("DH-2"));

        List<String> moi = kho.findByTrangThai("MOI").stream().map(DonHang::ma).toList();
        System.out.println("3) findByTrangThai('MOI') -> " + moi);

        List<String> lon = kho.findBySoTienGreaterThan(200000).stream().map(DonHang::ma).toList();
        System.out.println("4) findBySoTienGreaterThan(200000) -> " + lon);

        TruyVan tv = phanTich("findBySoTienGreaterThan");
        System.out.println("5) phan tich ten ham -> truong '" + tv.truong() + "' + phep '" + tv.phep() + "'");

        System.out.println("6) so dong SQL minh tu viet tay: " + soDongSqlTuViet);
    }
}`,
  },
};
