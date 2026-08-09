/**
 * Thẻ bài học "100 Ngày Java" — Ngày 83: CRUD bài viết (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-83.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 1 + 6: vòng đời bài viết chạy JDK thuần; NGÀY ĐĂNG dùng hằng cố định
 * (không in now()). Cú pháp @Entity/service dạy ở thân bài.
 * ⚠ Escaping: regex `\\p{M}` trong verify.source cần BỐN dấu chéo (\\\\p{M}).
 */
export default {
  series: '100 NGÀY JAVA',
  day: 83,
  total: 100,
  titleLead: 'Java Day 83:',
  titleAccent: 'CRUD bài viết',
  subtitle: 'Miếng thịt đầu: đăng, nháp/công bố, sửa không vỡ link 📝',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ĐĂNG BÀI → TỰ SINH SLUG 📝',
      code: `dang 'Hoc Java' -> slug 'hoc-java', trang thai NHAP

// service tu goi taoSlug (Ngay 82) khi tao`,
      notes: [
        { mark: 'ok', text: 'Bài mới mặc định NHÁP — chưa ai thấy cho tới khi công bố' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. NHÁP vs ĐÃ ĐĂNG 🌓',
      code: `cong bo -> DA_DANG, ngay dang 2026-08-09

danh sach cong khai -> [hoc-java] (nhap bi an)`,
      notes: [
        { mark: 'ok', text: 'Danh sách công khai CHỈ trả bài đã đăng — nháp không lọt ra' },
        { mark: 'dot', text: 'Trạng thái là một cột `enum`, lọc bằng `WHERE` (Ngày 61)' },
      ],
    },
    {
      tone: 'pink',
      title: '3. SỬA TIÊU ĐỀ → SLUG GIỮ NGUYÊN 🔗',
      code: `sua tieu de -> 'Hoc Java Co Ban'
slug GIU NGUYEN 'hoc-java'`,
      notes: [
        { mark: 'ok', text: 'Đổi slug theo tiêu đề = **vỡ mọi link cũ** đã chia sẻ → đừng đổi' },
        { mark: 'dot', text: 'Slug chốt lúc đăng; sửa tiêu đề chỉ đổi hiển thị' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐỌC THEO SLUG, XOÁ 🗑️',
      code: `doc /bai-viet/hoc-java -> ra bai
xoa 'hoc-java' -> kho giam`,
      notes: [
        { mark: 'ok', text: 'URL đọc theo slug đẹp hơn theo id; CRUD đủ bốn động từ (Ngày 76)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Slug bất biến, trạng thái nháp/đăng, danh sách công khai lọc sạch' },
        { mark: 'next', text: '**Ngày 84**: phân trang + sắp xếp — trả 20 bài/trang, mới nhất trước' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongBaiViet` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) dang 'Hoc Java' -> slug 'hoc-java', trang thai NHAP",
      '2) cong bo -> DA_DANG, ngay dang 2026-08-09',
      "3) sua tieu de -> 'Học Java Cơ Bản', slug GIU NGUYEN 'hoc-java'",
      "4) doc theo slug 'hoc-java' -> tieu de 'Học Java Cơ Bản'",
      '5) danh sach cong khai -> [hoc-java] (bai nhap bi an)',
      "6) xoa 'hoc-java' -> con 1 bai trong kho",
    ],
  },

  verify: {
    className: 'MoPhongBaiViet',
    source: `import java.text.Normalizer;
import java.util.*;

/* Miếng thịt đầu của Blog API: vòng đời BÀI VIẾT. Tự sinh slug khi đăng (Ngày
   82), phân biệt NHÁP vs ĐÃ ĐĂNG, và giữ slug CỐ ĐỊNH khi đổi tiêu đề (không
   vỡ link cũ). Chạy JDK thuần, tất định — ngày đăng dùng hằng cố định (LUẬT 1:
   không in ngày chạy thật). */
public class MoPhongBaiViet {

    enum TrangThai { NHAP, DA_DANG }

    static class BaiViet {
        final String slug;
        String tieuDe, noiDung, ngayDang;
        TrangThai trangThai = TrangThai.NHAP;
        BaiViet(String slug, String tieuDe, String noiDung) {
            this.slug = slug; this.tieuDe = tieuDe; this.noiDung = noiDung;
        }
    }

    static final Map<String, BaiViet> REPO = new LinkedHashMap<>();

    static String taoSlug(String t) {
        String s = Normalizer.normalize(t.toLowerCase().replace('đ', 'd'), Normalizer.Form.NFD)
                .replaceAll("\\\\p{M}+", "").replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
        return s.isEmpty() ? "bai-viet" : s;
    }

    static BaiViet dang(String tieuDe, String noiDung) {
        String goc = taoSlug(tieuDe), slug = goc;
        for (int n = 2; REPO.containsKey(slug); n++) slug = goc + "-" + n;   // duy nhat
        BaiViet b = new BaiViet(slug, tieuDe, noiDung);
        REPO.put(slug, b);
        return b;
    }

    static void congBo(BaiViet b) {
        b.trangThai = TrangThai.DA_DANG;
        b.ngayDang = "2026-08-09";                       // hang co dinh, khong dung now()
    }

    /* Danh sach CONG KHAI: chi bai DA_DANG (bai nhap khong lot ra ngoai). */
    static List<String> danhSachCongKhai() {
        List<String> ket = new ArrayList<>();
        for (BaiViet b : REPO.values()) if (b.trangThai == TrangThai.DA_DANG) ket.add(b.slug);
        return ket;
    }

    public static void main(String[] args) {
        // (1) dang bai -> tu sinh slug, mac dinh NHAP
        BaiViet b1 = dang("Học Java", "noi dung...");
        System.out.println("1) dang 'Hoc Java' -> slug '" + b1.slug + "', trang thai " + b1.trangThai);

        // (2) mot bai nua giu NHAP
        dang("Mẹo Vặt", "...");

        // (3) cong bo bai 1 -> DA_DANG + ngay dang
        congBo(b1);
        System.out.println("2) cong bo -> " + b1.trangThai + ", ngay dang " + b1.ngayDang);

        // (4) sua tieu de -> slug GIU NGUYEN (khong vo link cu)
        b1.tieuDe = "Học Java Cơ Bản";
        System.out.println("3) sua tieu de -> '" + b1.tieuDe + "', slug GIU NGUYEN '" + b1.slug + "'");

        // (5) doc theo slug
        System.out.println("4) doc theo slug 'hoc-java' -> tieu de '" + REPO.get("hoc-java").tieuDe + "'");

        // (6) danh sach cong khai chi hien bai da dang
        System.out.println("5) danh sach cong khai -> " + danhSachCongKhai() + " (bai nhap bi an)");

        REPO.remove("hoc-java");
        System.out.println("6) xoa 'hoc-java' -> con " + REPO.size() + " bai trong kho");
    }
}`,
  },
};
