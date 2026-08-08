/**
 * Thẻ bài học "100 Ngày Java" — Ngày 62: JOIN & GROUP BY.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-62.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: PostgreSQL là phần mềm ngoài. Chương trình dựng lại nguyên lý
 * (bảng dẹt gây lặp, khoá ngoại, nested-loop join + đếm phép so sánh, gom
 * nhóm, LEFT JOIN); cú pháp SQL dạy trong thân bài và ĐÃ CHẠY THẬT trên
 * PostgreSQL 15.4 — kết quả khớp Java từng dòng (An 3 đơn/660000,
 * Binh 2 đơn/1240000, Chi 0 đơn chỉ hiện với LEFT JOIN), và khoá ngoại thật
 * báo: violates foreign key constraint "don_ma_khach_fkey".
 *
 * ⚠ Gom nhóm phải bọc TreeMap — HashMap không hứa thứ tự in ra (LUẬT 1).
 */
export default {
  series: '100 NGÀY JAVA',
  day: 62,
  total: 100,
  titleLead: 'Java Day 62:',
  titleAccent: 'JOIN & GROUP BY',
  subtitle: 'Tách bảng để khỏi lặp, nối lại khi cần 🔗',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ĐỪNG NHỒI HẾT VÀO MỘT BẢNG 🧱',
      code: `don_det: ma | ten_khach | sdt_khach | so_tien

// khach 'An' nam o 3 dong
// doi so dien thoai -> phai sua 3 cho`,
      notes: [
        { mark: 'no', text: 'Dữ liệu chép nhiều nơi thì sớm muộn cũng lệch nhau, sót một dòng là mâu thuẫn' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. KHOÁ NGOẠI NỐI HAI BẢNG 🔗',
      code: `CREATE TABLE don (
    ma       VARCHAR(20) PRIMARY KEY,
    ma_khach VARCHAR(20) NOT NULL
             REFERENCES khach_hang(ma),
    so_tien  INTEGER NOT NULL
);`,
      notes: [
        { mark: 'ok', text: 'Thông tin khách nằm đúng MỘT chỗ — sửa một dòng là xong' },
        { mark: 'no', text: 'Đơn trỏ tới khách không có thật bị chặn: `violates foreign key constraint`' },
      ],
    },
    {
      tone: 'pink',
      title: '3. JOIN GHÉP DÒNG THEO KHOÁ 🧩',
      code: `SELECT k.ten, d.ma, d.so_tien
FROM khach_hang k
JOIN don d ON d.ma_khach = k.ma;

-- 3 khach x 5 don -> 15 phep so sanh, ra 5 dong`,
      notes: [
        { mark: 'ok', text: 'Không có chỉ mục thì máy phải thử mọi cặp — nhớ lại Ngày 59' },
      ],
    },
    {
      tone: 'green',
      title: '4. GROUP BY: MỘT CÂU RA BÁO CÁO 📊',
      code: `SELECT k.ten, count(d.ma), sum(d.so_tien)
FROM khach_hang k JOIN don d ON d.ma_khach = k.ma
GROUP BY k.ten;

-- Binh: 2 don, 1 240 000 | An: 3 don, 660 000`,
      notes: [
        { mark: 'ok', text: 'Kéo cả bảng về Java rồi tự cộng là làm hộ CSDL việc nó giỏi hơn bạn' },
        { mark: 'dot', text: '`LEFT JOIN` giữ cả khách chưa có đơn nào (Chi → 0)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Tách bảng để không lặp, JOIN để nối lại — đó là chữ "quan hệ"' },
        { mark: 'next', text: '**Ngày 63**: JDBC — nối Java với CSDL, và lỗ hổng SQL injection' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongJoin` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) nhoi tat ca vao 1 bang -> khach 'An' nam o 3 dong, doi sdt phai sua 3 cho",
      '2) tach 2 bang + khoa ngoai -> doi sdt chi sua 1 cho',
      '3) JOIN 3 khach x 5 don -> 15 phep so sanh, ghep duoc 5 dong',
      '4) GROUP BY khach -> {An=660000, Binh=1240000}',
      '5) LEFT JOIN giu khach chua co don -> [Chi]',
      '6) chen don cho khach K-99 -> BI TU CHOI: vi pham khoa ngoai',
    ],
  },

  verify: {
    className: 'MoPhongJoin',
    source: `import java.util.*;

/* Dung lai NGUYEN LY cua quan he giua cac bang bang JDK thuan:
   vi sao nhoi tat ca vao mot bang la sai, khoa ngoai canh cai gi,
   JOIN ghep dong the nao (va ton bao nhieu phep so sanh), GROUP BY gom ra sao,
   va LEFT JOIN khac INNER JOIN o cho nao. */
public class MoPhongJoin {

    record Khach(String ma, String ten, String sdt) {}

    record Don(String ma, String maKhach, int soTien) {}

    /* Bang "det": moi don chep lai ca thong tin khach — nguon goc cua mau thuan. */
    record DonDet(String ma, String tenKhach, String sdtKhach, int soTien) {}

    static final List<Khach> KHACH = List.of(
            new Khach("K-1", "An", "0901"),
            new Khach("K-2", "Binh", "0902"),
            new Khach("K-3", "Chi", "0903"));

    static final List<Don> DON = List.of(
            new Don("DH-1", "K-1", 150_000),
            new Don("DH-2", "K-1", 390_000),
            new Don("DH-3", "K-2", 990_000),
            new Don("DH-4", "K-1", 120_000),
            new Don("DH-5", "K-2", 250_000));

    /* JOIN kieu ngay tho: duyet moi cap. Day dung la cach CSDL lam khi khong
       co chi muc — va la ly do phai hoc chi muc o Ngay 66. */
    static List<String> noiTrong(List<Long> demSoSanh) {
        List<String> ket = new ArrayList<>();
        long soSanh = 0;
        for (Khach k : KHACH) {
            for (Don d : DON) {
                soSanh++;
                if (k.ma().equals(d.maKhach())) ket.add(k.ten() + "/" + d.ma());
            }
        }
        demSoSanh.add(soSanh);
        return ket;
    }

    public static void main(String[] args) {
        // (1) neu nhoi tat ca vao MOT bang: thong tin khach bi chep lai
        List<DonDet> bangDet = new ArrayList<>();
        for (Don d : DON) {
            Khach k = KHACH.stream().filter(x -> x.ma().equals(d.maKhach())).findFirst().orElseThrow();
            bangDet.add(new DonDet(d.ma(), k.ten(), k.sdt(), d.soTien()));
        }
        long soDongCoAn = bangDet.stream().filter(d -> d.tenKhach().equals("An")).count();
        System.out.println("1) nhoi tat ca vao 1 bang -> khach 'An' nam o " + soDongCoAn
                + " dong, doi sdt phai sua " + soDongCoAn + " cho");

        // (2) tach 2 bang: thong tin khach chi nam DUNG mot cho
        long soDongKhachAn = KHACH.stream().filter(k -> k.ten().equals("An")).count();
        System.out.println("2) tach 2 bang + khoa ngoai -> doi sdt chi sua "
                + soDongKhachAn + " cho");

        // (3) INNER JOIN: ghep dong theo khoa
        List<Long> demSoSanh = new ArrayList<>();
        List<String> ghep = noiTrong(demSoSanh);
        System.out.println("3) JOIN " + KHACH.size() + " khach x " + DON.size() + " don -> "
                + demSoSanh.get(0) + " phep so sanh, ghep duoc " + ghep.size() + " dong");

        // (4) GROUP BY: gom theo khach roi tong hop (TreeMap de thu tu on dinh)
        Map<String, Integer> tongTheoKhach = new TreeMap<>();
        for (Khach k : KHACH) {
            for (Don d : DON) {
                if (k.ma().equals(d.maKhach())) {
                    tongTheoKhach.merge(k.ten(), d.soTien(), Integer::sum);
                }
            }
        }
        System.out.println("4) GROUP BY khach -> " + tongTheoKhach);

        // (5) LEFT JOIN: giu ca khach CHUA co don nao
        List<String> khachKhongDon = new ArrayList<>();
        for (Khach k : KHACH) {
            boolean coDon = DON.stream().anyMatch(d -> d.maKhach().equals(k.ma()));
            if (!coDon) khachKhongDon.add(k.ten());
        }
        System.out.println("5) LEFT JOIN giu khach chua co don -> " + khachKhongDon);

        // (6) khoa ngoai: khong the tao don cho mot khach khong ton tai
        String maKhachLa = "K-99";
        boolean tonTai = KHACH.stream().anyMatch(k -> k.ma().equals(maKhachLa));
        System.out.println("6) chen don cho khach " + maKhachLa + " -> "
                + (tonTai ? "OK" : "BI TU CHOI: vi pham khoa ngoai"));
    }
}`,
  },
};
