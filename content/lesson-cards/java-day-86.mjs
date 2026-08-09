/**
 * Thẻ bài học "100 Ngày Java" — Ngày 86: Bình luận & thẻ (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-86.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: dựng nguyên lý quan hệ JPA (Ngày 71) bằng JDK thuần — một-nhiều,
 * nhiều-nhiều qua bảng nối, đếm N+1 (cố định), cascade. Cú pháp @OneToMany/
 * @ManyToMany dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 86,
  total: 100,
  titleLead: 'Java Day 86:',
  titleAccent: 'Bình luận & Thẻ',
  subtitle: 'Một-nhiều, nhiều-nhiều — khép lô Blog API 💬',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT-NHIỀU: BÀI → BÌNH LUẬN 💬',
      code: `bai b1 -> 3 binh luan
bai b2 -> 1 binh luan

@OneToMany(mappedBy="baiViet")
List<BinhLuan> binhLuan;`,
      notes: [
        { mark: 'ok', text: 'Một bài nhiều bình luận — khoá ngoại `baiId` bên `BinhLuan` (Ngày 62)' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. NHIỀU-NHIỀU: BÀI ↔ THẺ 🏷️',
      code: `b1 = [java, oop]   b2 = [java]
-> the 'java' co [b1, b2]

@ManyToMany  // Spring tao BANG NOI`,
      notes: [
        { mark: 'ok', text: 'Một bài nhiều thẻ, một thẻ nhiều bài — cần một bảng nối ở giữa' },
        { mark: 'dot', text: 'Tra được cả hai chiều: bài→thẻ và thẻ→bài' },
      ],
    },
    {
      tone: 'pink',
      title: '3. LẠI BẪY N+1 🕳️',
      code: `dem binh luan 3 bai tung cai
-> 1 + 3 = 4 truy van

JOIN FETCH -> gom con 1`,
      notes: [
        { mark: 'no', text: 'Lặp bài rồi lấy bình luận từng bài → N+1 (Ngày 71)' },
        { mark: 'ok', text: 'Lấy kèm bằng `JOIN FETCH`/`@EntityGraph` → một truy vấn' },
      ],
    },
    {
      tone: 'green',
      title: '4. CASCADE: XOÁ BÀI, XOÁ BÌNH LUẬN 🗑️',
      code: `xoa b1 -> binh luan b1 mat theo (cascade)
the 'java' van con [b2]  // the KHONG bi xoa`,
      notes: [
        { mark: 'ok', text: 'Bình luận thuộc bài → xoá bài thì xoá theo (cascade)' },
        { mark: 'no', text: 'Thẻ dùng chung nhiều bài → KHÔNG xoá thẻ, chỉ gỡ liên kết' },
      ],
    },
    {
      tone: 'blue',
      title: '5. KHÉP LÔ — BLOG API RA DÁNG 🏁',
      notes: [
        { mark: 'ok', text: 'Bài · slug · nháp/đăng · phân trang · tìm kiếm · bình luận · thẻ' },
        { mark: 'next', text: '**Ngày 87**: ảnh bìa — upload file, lưu trữ, phục vụ ảnh' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongQuanHeBlog` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) bai b1 -> 3 binh luan (mot-nhieu)',
      '2) bai b2 -> 1 binh luan',
      "3) gan the: b1=[java, oop], b2=[java] -> the 'java' co [b1, b2] (nhieu-nhieu)",
      "4) tim bai theo the 'java' -> [b1, b2]",
      '5) N+1: dem binh luan 3 bai tung cai -> 1+3=4 truy van (JOIN FETCH gom con 1)',
      "6) xoa b1 -> binh luan b1 mat (cascade), the 'java' van con [b2]",
    ],
  },

  verify: {
    className: 'MoPhongQuanHeBlog',
    source: `import java.util.*;

/* Blog API — binh luan & the. Dung lai nguyen ly quan he JPA (Ngay 71) bang
   JDK thuan: MOT-NHIEU (bai -> binh luan), NHIEU-NHIEU (bai <-> the qua bang
   noi), tranh bay N+1 khi tai, va cascade xoa binh luan theo bai. Dem tat dinh. */
public class MoPhongQuanHeBlog {

    record BinhLuan(String id, String noiDung) {}

    /* MOT-NHIEU: mot bai co nhieu binh luan. */
    static final Map<String, List<BinhLuan>> BINH_LUAN = new LinkedHashMap<>();
    /* NHIEU-NHIEU: hai chieu qua "bang noi". */
    static final Map<String, Set<String>> THE_CUA_BAI = new LinkedHashMap<>();   // bai -> the
    static final Map<String, Set<String>> BAI_CUA_THE = new TreeMap<>();         // the -> bai

    static long soTruyVan = 0;

    static void themBinhLuan(String baiId, String noiDung) {
        BINH_LUAN.computeIfAbsent(baiId, k -> new ArrayList<>())
                .add(new BinhLuan("bl" + (BINH_LUAN.getOrDefault(baiId, List.of()).size() + 1), noiDung));
    }

    static void ganThe(String baiId, String the) {
        THE_CUA_BAI.computeIfAbsent(baiId, k -> new LinkedHashSet<>()).add(the);
        BAI_CUA_THE.computeIfAbsent(the, k -> new LinkedHashSet<>()).add(baiId);
    }

    static List<BinhLuan> layBinhLuan(String baiId) {
        soTruyVan++;                                    // moi lan hoi CSDL = 1 truy van
        return BINH_LUAN.getOrDefault(baiId, List.of());
    }

    static void xoaBai(String baiId) {
        BINH_LUAN.remove(baiId);                         // cascade: binh luan mat theo
        for (String the : THE_CUA_BAI.getOrDefault(baiId, Set.of())) BAI_CUA_THE.get(the).remove(baiId);
        THE_CUA_BAI.remove(baiId);                       // nhung THE khong bi xoa
    }

    public static void main(String[] args) {
        // (1) MOT-NHIEU: bai b1 co 3 binh luan
        themBinhLuan("b1", "hay qua");
        themBinhLuan("b1", "cam on tac gia");
        themBinhLuan("b1", "de hieu");
        System.out.println("1) bai b1 -> " + BINH_LUAN.get("b1").size() + " binh luan (mot-nhieu)");

        // (2) bai b2 co 1 binh luan
        themBinhLuan("b2", "xin bai tiep theo");
        System.out.println("2) bai b2 -> " + BINH_LUAN.get("b2").size() + " binh luan");

        // (3) NHIEU-NHIEU: gan the
        ganThe("b1", "java"); ganThe("b1", "oop");
        ganThe("b2", "java");
        System.out.println("3) gan the: b1=" + THE_CUA_BAI.get("b1") + ", b2=" + THE_CUA_BAI.get("b2")
                + " -> the 'java' co " + BAI_CUA_THE.get("java") + " (nhieu-nhieu)");

        // (4) tim bai theo the (chieu nguoc)
        System.out.println("4) tim bai theo the 'java' -> " + BAI_CUA_THE.get("java"));

        // (5) N+1 vs gom: dem binh luan 3 bai
        soTruyVan = 0;
        List<String> ds = List.of("b1", "b2", "b3");
        for (String id : ds) layBinhLuan(id);            // 3 truy van, + 1 lay danh sach bai
        long n1 = soTruyVan + 1;
        System.out.println("5) N+1: dem binh luan 3 bai tung cai -> 1+" + soTruyVan
                + "=" + n1 + " truy van (JOIN FETCH gom con 1)");

        // (6) cascade xoa
        xoaBai("b1");
        System.out.println("6) xoa b1 -> binh luan b1 mat (cascade), the 'java' van con " + BAI_CUA_THE.get("java"));
    }
}`,
  },
};
