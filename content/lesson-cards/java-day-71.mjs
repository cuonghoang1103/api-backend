/**
 * Thẻ bài học "100 Ngày Java" — Ngày 71: Quan hệ trong JPA & bẫy N+1.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-71.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 5 + 6: đếm SỐ TRUY VẤN (cố định) chứ không đo thời gian. Chương
 * trình dựng lại bằng JDK thuần: bẫy N+1 (1 + N truy vấn) vs JOIN FETCH (1
 * truy vấn), và lazy loading. Cú pháp @OneToMany/@ManyToOne/@Query dạy ở
 * thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 71,
  total: 100,
  titleLead: 'Java Day 71:',
  titleAccent: 'Quan hệ JPA',
  subtitle: 'Nối bảng thành liên kết đối tượng — và bẫy N+1 🕳️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. KHOÁ NGOẠI → LIÊN KẾT ĐỐI TƯỢNG 🔗',
      code: `@Entity class Don {
    @ManyToOne Khach khach;        // nhieu don - mot khach
}
@Entity class Khach {
    @OneToMany(mappedBy="khach")
    List<Don> danhSachDon;         // mot khach - nhieu don
}`,
      notes: [
        { mark: 'ok', text: 'khoá ngoại của Ngày 62 thành `khach.getDanhSachDon()` — đối tượng, không JOIN tay' },
        { mark: 'dot', text: '`mappedBy` nói phía nào giữ cột khoá ngoại (phía `Don`)' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. BẪY N+1: TRĂM TRUY VẤN LÉN 🕳️',
      code: `for (Khach k : layTatCaKhach())      // 1 truy van
    k.getDanhSachDon();              // + N truy van

// 3 khach -> 1 + 3 = 4 truy van`,
      notes: [
        { mark: 'no', text: 'Lặp qua N bản ghi, mỗi bản lại hỏi CSDL một câu → 1+N câu' },
        { mark: 'no', text: '100 khách = 101 truy vấn cho một trang — chậm mà nhìn code không thấy' },
      ],
    },
    {
      tone: 'pink',
      title: '3. JOIN FETCH: GOM VỀ 1 TRUY VẤN ✅',
      code: `@Query("SELECT k FROM Khach k
        JOIN FETCH k.danhSachDon")
List<Khach> layKemDon();

// 4 truy van -> 1 truy van`,
      notes: [
        { mark: 'ok', text: 'Lấy khách KÈM đơn trong một câu — đúng JOIN của Ngày 62' },
      ],
    },
    {
      tone: 'green',
      title: '4. LAZY vs EAGER ⏳',
      code: `LAZY: chi lay khach -> 1 truy van
      (don tai khi CAN dung)

@ManyToOne mac dinh EAGER
@OneToMany mac dinh LAZY`,
      notes: [
        { mark: 'ok', text: 'Lazy tránh tải thừa; nhưng lặp trên quan hệ lazy chính là nguồn N+1' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Quan hệ tiện, nhưng luôn hỏi: một trang này chạy bao nhiêu truy vấn?' },
        { mark: 'next', text: '**Ngày 72**: tầng service & @Transactional — giao dịch của Ngày 65 trong Spring' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongQuanHe` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) lay 3 khach roi lay don TUNG NGUOI -> tong 4 don',
      '2) N+1: 1 + 3 = 4 truy van',
      '3) JOIN FETCH: lay khach KEM don 1 luot -> tong 4 don',
      '4) giam tu 4 xuong 1 truy van',
      '5) LAZY: chi lay khach, chua dung don -> 1 truy van (don tai khi CAN)',
      '6) mac dinh JPA: @ManyToOne EAGER, @OneToMany LAZY',
    ],
  },

  verify: {
    className: 'MoPhongQuanHe',
    source: `import java.util.*;

/* Dung lai NGUYEN LY quan he JPA bang JDK THUAN: khoa ngoai (Ngay 62) tro
   thanh lien ket doi tuong. Trong tam la BAY N+1: lap qua N khach, moi khach
   lai hoi CSDL mot cau lay don -> 1 + N truy van. JOIN FETCH gom lai 1 truy
   van. Dem SO TRUY VAN (co dinh) chu khong do thoi gian. */
public class MoPhongQuanHe {

    record Don(String ma, String maKhach, int soTien) {}
    record Khach(String id, String ten) {}

    /* "CSDL" gia — dem moi lan bi hoi mot cau truy van. */
    static int soTruyVan = 0;

    static final List<Khach> KHACH = List.of(
            new Khach("K-1", "An"), new Khach("K-2", "Binh"), new Khach("K-3", "Chi"));
    static final List<Don> DON = List.of(
            new Don("DH-1", "K-1", 150000), new Don("DH-2", "K-1", 390000),
            new Don("DH-3", "K-2", 990000), new Don("DH-4", "K-3", 120000));

    static List<Khach> layTatCaKhach() { soTruyVan++; return KHACH; }        // 1 truy van

    static List<Don> layDonCuaKhach(String maKhach) {                        // 1 truy van MOI lan
        soTruyVan++;
        List<Don> ket = new ArrayList<>();
        for (Don d : DON) if (d.maKhach().equals(maKhach)) ket.add(d);
        return ket;
    }

    /* JOIN FETCH: lay khach KEM don trong DUNG mot cau. */
    static Map<String, List<Don>> layTatCaKemDon() {                         // 1 truy van
        soTruyVan++;
        Map<String, List<Don>> m = new LinkedHashMap<>();
        for (Khach k : KHACH) m.put(k.id(), new ArrayList<>());
        for (Don d : DON) m.get(d.maKhach()).add(d);
        return m;
    }

    public static void main(String[] args) {
        // (1)(2) BAY N+1: lay danh sach khach (1), roi moi khach lay don rieng (N)
        soTruyVan = 0;
        List<Khach> ds = layTatCaKhach();                       // 1
        int tongDon = 0;
        for (Khach k : ds) tongDon += layDonCuaKhach(k.id()).size();   // + N
        int truyVanN1 = soTruyVan;
        System.out.println("1) lay " + ds.size() + " khach roi lay don TUNG NGUOI -> tong " + tongDon + " don");
        System.out.println("2) N+1: 1 + " + ds.size() + " = " + truyVanN1 + " truy van");

        // (3)(4) JOIN FETCH: gom lai 1 truy van
        soTruyVan = 0;
        Map<String, List<Don>> gom = layTatCaKemDon();          // 1
        int tong2 = gom.values().stream().mapToInt(List::size).sum();
        int truyVanFetch = soTruyVan;
        System.out.println("3) JOIN FETCH: lay khach KEM don 1 luot -> tong " + tong2 + " don");
        System.out.println("4) giam tu " + truyVanN1 + " xuong " + truyVanFetch + " truy van");

        // (5) LAZY: chua truy cap .getDon() thi CHUA tai don
        soTruyVan = 0;
        layTatCaKhach();                                        // 1, chua dung don
        System.out.println("5) LAZY: chi lay khach, chua dung don -> " + soTruyVan
                + " truy van (don tai khi CAN)");

        // (6) mac dinh JPA
        System.out.println("6) mac dinh JPA: @ManyToOne EAGER, @OneToMany LAZY");
    }
}`,
  },
};
