/**
 * Thẻ bài học "100 Ngày Java" — Ngày 85: Tìm kiếm bài viết (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-85.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: dựng nguyên lý full-text bằng JDK thuần — chỉ mục ngược (inverted
 * index) + giao tập + xếp hạng theo tần số. Cú pháp full-text PostgreSQL/@Query
 * dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 85,
  total: 100,
  titleLead: 'Java Day 85:',
  titleAccent: 'Tìm kiếm bài viết',
  subtitle: 'Từ LIKE ngây thơ tới chỉ mục toàn văn 🔎',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. LIKE %...% QUÉT CẢ BẢNG 🐌',
      code: `LIKE '%java%' -> quet ca 5 bai

// dau % o dau -> khong dung duoc chi muc (Ngay 66)`,
      notes: [
        { mark: 'no', text: '`LIKE %x%` phải duyệt từng bài — chậm khi bảng lớn' },
        { mark: 'dot', text: 'Được cho bảng nhỏ; sai lầm khi blog có hàng vạn bài' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. CHỈ MỤC NGƯỢC: TỪ → CÁC BÀI 📇',
      code: `'java'   -> [b1, b3, b5]
'stream' -> [b3, b5]

// tra ngay danh sach, khong quet`,
      notes: [
        { mark: 'ok', text: 'Chỉ mục ngược: mỗi từ trỏ tới các bài chứa nó — nhảy thẳng' },
        { mark: 'dot', text: 'Đây là cách máy tìm kiếm thật hoạt động bên trong' },
      ],
    },
    {
      tone: 'pink',
      title: '3. NHIỀU TỪ = GIAO CÁC TẬP 🔗',
      code: `'java stream' (ca hai)
-> giao([b1,b3,b5], [b3,b5]) = [b3, b5]`,
      notes: [
        { mark: 'ok', text: 'Tìm nhiều từ = giao các danh sách bài của từng từ' },
      ],
    },
    {
      tone: 'green',
      title: '4. XẾP HẠNG THEO ĐỘ LIÊN QUAN 🏆',
      code: `'java' trong b5 xuat hien 3 lan
-> b5 xep dau (lien quan hon)

chuan hoa: JAVA = Java = java`,
      notes: [
        { mark: 'ok', text: 'Từ xuất hiện nhiều → bài liên quan hơn → xếp trên' },
        { mark: 'dot', text: 'Chuẩn hoá (thường hoá, bỏ dấu) để gõ kiểu nào cũng ra' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Thật thì dùng full-text của PostgreSQL (`tsvector`), đừng tự dựng index' },
        { mark: 'next', text: '**Ngày 86**: khép lô — bình luận & thẻ (quan hệ nhiều-nhiều)' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongTimKiem` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) LIKE '%java%' -> quet 5 bai (khong dung chi muc), ra [b1, b3, b5]",
      "2) chi muc nguoc: 'java' -> [b1, b3, b5] (khong quet)",
      "3) 'stream' -> [b3, b5]",
      "4) 'java stream' (ca hai) -> giao = [b3, b5]",
      "5) xep hang 'java' theo tan so -> dau la b5 (3 lan)",
      "6) chuan hoa 'JAVA'='Java'='java' -> cung 1 khoa chi muc? true",
    ],
  },

  verify: {
    className: 'MoPhongTimKiem',
    source: `import java.util.*;

/* Blog API — tim kiem bai viet. Dung lai nguyen ly full-text bang JDK thuan:
   LIKE '%tu%' phai QUET tung bai (khong dung chi muc), con CHI MUC NGUOC
   (inverted index: tu -> cac bai chua tu) tra ngay khong quet. Nhieu tu = GIAO
   cac tap; xep hang theo TAN SO. Dem tat dinh. */
public class MoPhongTimKiem {

    record BaiViet(String id, String noiDung) {}

    static final List<BaiViet> BAI = List.of(
            new BaiViet("b1", "Hoc Java co ban"),
            new BaiViet("b2", "Python cho nguoi moi"),
            new BaiViet("b3", "Java Stream API"),
            new BaiViet("b4", "CSDL PostgreSQL"),
            new BaiViet("b5", "Java Stream va Java lambda va Java"));   // java xuat hien 3 lan

    static long soLanQuet = 0;

    /* LIKE '%tu%': phai duyet TUNG bai. */
    static List<String> timLike(String tu) {
        List<String> ket = new ArrayList<>();
        for (BaiViet b : BAI) {
            soLanQuet++;
            if (b.noiDung().toLowerCase().contains(tu)) ket.add(b.id());
        }
        return ket;
    }

    /* Chi muc nguoc: tu -> {maBai -> so lan xuat hien}. */
    static final Map<String, Map<String, Integer>> CHI_MUC = new TreeMap<>();

    static List<String> tach(String s) {
        List<String> ket = new ArrayList<>();
        for (String t : s.toLowerCase().split("[^a-z0-9]+")) if (!t.isEmpty()) ket.add(t);
        return ket;
    }

    static void dungChiMuc() {
        for (BaiViet b : BAI)
            for (String tu : tach(b.noiDung()))
                CHI_MUC.computeIfAbsent(tu, k -> new LinkedHashMap<>()).merge(b.id(), 1, Integer::sum);
    }

    static Set<String> tim(String tu) {
        return new LinkedHashSet<>(CHI_MUC.getOrDefault(tu, Map.of()).keySet());
    }

    public static void main(String[] args) {
        // (1) LIKE: quet ca 5 bai
        soLanQuet = 0;
        List<String> like = timLike("java");
        System.out.println("1) LIKE '%java%' -> quet " + soLanQuet + " bai (khong dung chi muc), ra " + like);

        // (2) dung chi muc nguoc
        dungChiMuc();
        System.out.println("2) chi muc nguoc: 'java' -> " + tim("java") + " (khong quet)");

        // (3) tim tu khac
        System.out.println("3) 'stream' -> " + tim("stream"));

        // (4) nhieu tu = GIAO cac tap
        Set<String> giao = new LinkedHashSet<>(tim("java"));
        giao.retainAll(tim("stream"));
        System.out.println("4) 'java stream' (ca hai) -> giao = " + giao);

        // (5) xep hang theo TAN SO (so lan xuat hien)
        List<Map.Entry<String, Integer>> hang = new ArrayList<>(CHI_MUC.get("java").entrySet());
        hang.sort((a, c) -> c.getValue() - a.getValue());
        System.out.println("5) xep hang 'java' theo tan so -> dau la " + hang.get(0).getKey()
                + " (" + hang.get(0).getValue() + " lan)");

        // (6) chuan hoa: JAVA / Java / java ve cung khoa
        boolean cungKhoa = tach("JAVA").get(0).equals(tach("Java").get(0))
                && tach("Java").get(0).equals(tach("java").get(0));
        System.out.println("6) chuan hoa 'JAVA'='Java'='java' -> cung 1 khoa chi muc? " + cungKhoa);
    }
}`,
  },
};
