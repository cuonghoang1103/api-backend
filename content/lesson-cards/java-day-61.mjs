/**
 * Thẻ bài học "100 Ngày Java" — Ngày 61: CSDL quan hệ & SQL căn bản.
 * Mở Giai đoạn 8.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-61.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: PostgreSQL là phần mềm NGOÀI, `gen-lesson-card` chỉ chạy
 * javac + java JDK thuần (không trình điều khiển JDBC). Nên chương trình dựng
 * lại NGUYÊN LÝ của một bảng: lược đồ có kiểu, khoá chính không trùng, và bốn
 * phép làm việc theo ĐIỀU KIỆN. Cú pháp SQL thật dạy trong thân bài — và đã
 * được chạy thật trên PostgreSQL 15.4 để lấy đúng thông báo lỗi:
 *   ERROR: duplicate key value violates unique constraint "don_hang_pkey"
 *   ERROR: invalid input syntax for type integer: "nhieu"
 * Kết quả của Java và của Postgres khớp nhau từng dòng.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 61,
  total: 100,
  titleLead: 'Java Day 61:',
  titleAccent: 'CSDL & SQL',
  subtitle: 'Để dữ liệu sống lâu hơn chương trình 🗄️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BẢNG CÓ LƯỢC ĐỒ, KHÔNG PHẢI FILE 📋',
      code: `CREATE TABLE don_hang (
    ma          VARCHAR(20) PRIMARY KEY,
    so_tien     INTEGER     NOT NULL,
    trang_thai  VARCHAR(20) NOT NULL DEFAULT 'MOI'
);`,
      notes: [
        { mark: 'ok', text: 'Mỗi cột có KIỂU — dữ liệu sai bị chặn ngay lúc ghi, không đợi lúc đọc' },
        { mark: 'no', text: 'File văn bản thì ghi gì vào cũng lọt, hỏng lặng lẽ' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. KHOÁ CHÍNH: KHÔNG THỂ TRÙNG 🔑',
      code: `INSERT INTO don_hang VALUES ('DH-2', 10000, 'MOI');

ERROR: duplicate key value violates unique
       constraint "don_hang_pkey"`,
      notes: [
        { mark: 'ok', text: 'CSDL tự canh ràng buộc — không phụ thuộc dòng code nào nhớ kiểm' },
        { mark: 'dot', text: 'Sai kiểu cũng bị chặn: `invalid input syntax for type integer`' },
      ],
    },
    {
      tone: 'pink',
      title: '3. LÀM VIỆC THEO ĐIỀU KIỆN 🔍',
      code: `SELECT ma, so_tien FROM don_hang
WHERE so_tien > 200000
ORDER BY so_tien DESC;

-- -> DH-3 (990000), DH-2 (350000)`,
      notes: [
        { mark: 'ok', text: 'Bạn tả THỨ MÌNH MUỐN, máy tự lo cách đi tìm' },
      ],
    },
    {
      tone: 'green',
      title: '4. UPDATE/DELETE CŨNG THEO WHERE ⚠️',
      code: `UPDATE don_hang SET trang_thai='DA_GIAO'
  WHERE ma='DH-1';            -- UPDATE 1

DELETE FROM don_hang
  WHERE trang_thai='HUY';     -- DELETE 1`,
      notes: [
        { mark: 'no', text: 'QUÊN `WHERE` là sửa/xoá SẠCH cả bảng, và không có nút hoàn tác' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Tắt máy chủ rồi bật lại, dữ liệu vẫn còn — đó là lý do CSDL tồn tại' },
        { mark: 'next', text: '**Ngày 62**: JOIN & GROUP BY — nối hai bảng và tổng hợp số liệu' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongBang` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) chen 4 dong vao bang 'don_hang' -> 4 dong",
      "2) chen lai ma 'DH-2' -> BI TU CHOI: khoa chinh trung",
      "3) chen so_tien = 'nhieu' -> BI TU CHOI: cot so_tien phai la Integer",
      '4) WHERE so_tien > 200000 ORDER BY so_tien DESC -> [DH-3, DH-2]',
      "5) UPDATE trang_thai WHERE ma='DH-1' -> 1 dong bi doi",
      "6) DELETE WHERE trang_thai='HUY' -> xoa 1 dong, con 3 dong",
    ],
  },

  verify: {
    className: 'MoPhongBang',
    source: `import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/* Dung lai NGUYEN LY cua mot BANG trong CSDL quan he bang JDK thuan:
   luoc do co kieu, khoa chinh khong duoc trung, va bon phep SELECT / INSERT /
   UPDATE / DELETE deu lam viec theo DIEU KIEN chu khong theo vi tri dong. */
public class MoPhongBang {

    /* Mot cot co TEN va KIEU — hai thu do la "luoc do" (schema) cua bang. */
    record Cot(String ten, Class<?> kieu) {}

    static class Bang {
        final String ten;
        final List<Cot> cot;
        final String khoaChinh;
        final List<Map<String, Object>> dong = new ArrayList<>();

        Bang(String ten, List<Cot> cot, String khoaChinh) {
            this.ten = ten; this.cot = cot; this.khoaChinh = khoaChinh;
        }

        /* CSDL tu choi du lieu sai NGAY LUC CHEN — day la khac biet lon nhat
           so voi mot file van ban, noi ban muon ghi gi vao cung duoc. */
        String chen(Map<String, Object> ban) {
            for (Cot c : cot) {
                Object giaTri = ban.get(c.ten());
                if (giaTri != null && !c.kieu().isInstance(giaTri)) {
                    return "BI TU CHOI: cot " + c.ten() + " phai la " + c.kieu().getSimpleName();
                }
            }
            Object khoa = ban.get(khoaChinh);
            if (khoa == null) return "BI TU CHOI: khoa chinh khong duoc rong";
            for (Map<String, Object> d : dong) {
                if (khoa.equals(d.get(khoaChinh))) return "BI TU CHOI: khoa chinh trung";
            }
            dong.add(new LinkedHashMap<>(ban));
            return "OK";
        }

        List<Map<String, Object>> chon(Predicate<Map<String, Object>> dieuKien,
                                       Comparator<Map<String, Object>> thuTu) {
            List<Map<String, Object>> ket = dong.stream().filter(dieuKien)
                    .collect(Collectors.toCollection(ArrayList::new));
            if (thuTu != null) ket.sort(thuTu);
            return ket;
        }

        int capNhat(Predicate<Map<String, Object>> dieuKien, String cot, Object giaTriMoi) {
            int soDong = 0;
            for (Map<String, Object> d : dong) {
                if (dieuKien.test(d)) { d.put(cot, giaTriMoi); soDong++; }
            }
            return soDong;
        }

        int xoa(Predicate<Map<String, Object>> dieuKien) {
            int truoc = dong.size();
            dong.removeIf(dieuKien);
            return truoc - dong.size();
        }
    }

    static Map<String, Object> ban(String ma, int soTien, String trangThai) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("ma", ma); m.put("so_tien", soTien); m.put("trang_thai", trangThai);
        return m;
    }

    public static void main(String[] args) {
        Bang donHang = new Bang("don_hang", List.of(
                new Cot("ma", String.class),
                new Cot("so_tien", Integer.class),
                new Cot("trang_thai", String.class)), "ma");

        // (1) chen du lieu hop le
        donHang.chen(ban("DH-1", 150000, "MOI"));
        donHang.chen(ban("DH-2", 350000, "DA_GIAO"));
        donHang.chen(ban("DH-3", 990000, "MOI"));
        donHang.chen(ban("DH-4", 120000, "HUY"));
        System.out.println("1) chen 4 dong vao bang 'don_hang' -> " + donHang.dong.size() + " dong");

        // (2) khoa chinh: khong the co hai don cung ma
        System.out.println("2) chen lai ma 'DH-2' -> " + donHang.chen(ban("DH-2", 10000, "MOI")));

        // (3) kieu du lieu: cot so tien khong nhan chu
        Map<String, Object> saiKieu = new LinkedHashMap<>();
        saiKieu.put("ma", "DH-9"); saiKieu.put("so_tien", "nhieu"); saiKieu.put("trang_thai", "MOI");
        System.out.println("3) chen so_tien = 'nhieu' -> " + donHang.chen(saiKieu));

        // (4) SELECT ... WHERE ... ORDER BY: loc theo DIEU KIEN, khong theo vi tri
        List<String> loc = donHang.chon(
                d -> (Integer) d.get("so_tien") > 200_000,
                Comparator.comparingInt(d -> -(Integer) d.get("so_tien")))
                .stream().map(d -> (String) d.get("ma")).toList();
        System.out.println("4) WHERE so_tien > 200000 ORDER BY so_tien DESC -> " + loc);

        // (5) UPDATE cung chay theo dieu kien
        int daDoi = donHang.capNhat(d -> "DH-1".equals(d.get("ma")), "trang_thai", "DA_GIAO");
        System.out.println("5) UPDATE trang_thai WHERE ma='DH-1' -> " + daDoi + " dong bi doi");

        // (6) DELETE co the cham nhieu dong — thieu WHERE la xoa sach
        int daXoa = donHang.xoa(d -> "HUY".equals(d.get("trang_thai")));
        System.out.println("6) DELETE WHERE trang_thai='HUY' -> xoa " + daXoa
                + " dong, con " + donHang.dong.size() + " dong");
    }
}`,
  },
};
