/**
 * Thẻ bài học "100 Ngày Java" — Ngày 82: Mở dự án cuối (Blog API) + slug.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-82.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: viên gạch đầu của dự án cuối — sinh slug bằng JDK thuần
 * (java.text.Normalizer bỏ dấu tiếng Việt). Thuật toán tất định nên cùng tiêu
 * đề luôn ra cùng slug. Kiến trúc Spring dạy ở thân bài.
 *
 * ⚠ Escaping: regex `\\p{M}` trong verify.source cần BỐN dấu chéo (\\\\p{M}).
 */
export default {
  series: '100 NGÀY JAVA',
  day: 82,
  total: 100,
  titleLead: 'Java Day 82:',
  titleAccent: 'Mở dự án cuối',
  subtitle: 'Blog API từ số 0 — và viên gạch đầu: sinh slug 🧱',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. DỰNG KHUNG THEO TẦNG 🏛️',
      code: `blog-api/
├── controller/   REST (Ngay 68)
├── service/      nghiep vu + @Transactional (72)
├── repository/   JPA (70)
└── config/       bao mat (79)`,
      notes: [
        { mark: 'ok', text: 'Không học khái niệm mới nữa — GHÉP những gì đã biết thành sản phẩm' },
        { mark: 'dot', text: 'Cấu trúc tầng rõ ràng ngay từ commit đầu' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. SLUG: TIÊU ĐỀ → ĐƯỜNG DẪN 🔗',
      code: `'Bài Viết Đầu Tiên!' -> 'bai-viet-dau-tien'

// URL sach: /bai-viet/bai-viet-dau-tien`,
      notes: [
        { mark: 'ok', text: 'Mọi blog cần biến tiêu đề thành đường dẫn đọc được' },
        { mark: 'dot', text: 'Bỏ dấu tiếng Việt bằng `Normalizer` (NFD), đ→d làm tay' },
      ],
    },
    {
      tone: 'pink',
      title: '3. LÀM SẠCH KÝ TỰ 🧹',
      code: `'Lập Trình Java' -> 'lap-trinh-java'
'A  B---C!!'    -> 'a-b-c'   // gop gach
'!!!@@@'        -> 'bai-viet' // fallback`,
      notes: [
        { mark: 'ok', text: 'Ký tự lạ + khoảng trắng → một gạch; rỗng → giá trị mặc định' },
      ],
    },
    {
      tone: 'green',
      title: '4. BẢO ĐẢM DUY NHẤT 🔑',
      code: `slug 'bai-viet' da co
-> tao 'bai-viet-2'`,
      notes: [
        { mark: 'ok', text: 'Trùng slug → thêm hậu tố; đường dẫn phải là duy nhất (Ngày 61)' },
        { mark: 'dot', text: 'Thật thì kèm ràng buộc UNIQUE ở CSDL cho chắc' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Bắt đầu dự án: dựng khung tầng, làm một tính năng chạy được rồi mở rộng' },
        { mark: 'next', text: '**Ngày 83**: bài viết CRUD đầy đủ — thịt đầu tiên của dự án' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongSlug` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) 'Bai Viet Dau Tien!' -> 'bai-viet-dau-tien'",
      "2) bo dau: 'Lap Trinh Java' -> 'lap-trinh-java'",
      "3) d/D -> d: 'Duong Dan' -> 'duong-dan'",
      "4) ky tu la + khoang trang -> gop: 'A  B---C!!' -> 'a-b-c'",
      "5) trung slug 'bai-viet' -> 'bai-viet-2'",
      "6) tieu de toan ky tu la '!!!@@@' -> 'bai-viet' (fallback)",
    ],
  },

  verify: {
    className: 'MoPhongSlug',
    source: `import java.text.Normalizer;
import java.util.*;

/* Vien gach dau cua du an cuoi (Blog API): sinh SLUG tu tieu de — chuoi
   URL-an-toan, bo dau tieng Viet, gop ky tu la, va bao dam DUY NHAT. Thuat
   toan tat dinh (JDK thuan) nen cung tieu de luon ra cung slug. */
public class MoPhongSlug {

    static String taoSlug(String tieuDe) {
        String s = tieuDe.toLowerCase();
        s = s.replace('đ', 'd').replace('Đ', 'd');              // NFD khong tach 'd' -> lam tay
        s = Normalizer.normalize(s, Normalizer.Form.NFD);       // tach dau ra khoi chu
        s = s.replaceAll("\\\\p{M}+", "");                        // bo cac dau ket hop
        s = s.replaceAll("[^a-z0-9]+", "-");                    // ky tu la/khoang trang -> gach
        s = s.replaceAll("^-+|-+$", "");                        // bo gach o hai dau
        return s.isEmpty() ? "bai-viet" : s;                    // rong thi lay mac dinh
    }

    /* Bao dam DUY NHAT: neu slug da co, them hau to -2, -3, ... */
    static String taoSlugDuyNhat(String tieuDe, Set<String> daCo) {
        String goc = taoSlug(tieuDe);
        if (!daCo.contains(goc)) return goc;
        int n = 2;
        while (daCo.contains(goc + "-" + n)) n++;
        return goc + "-" + n;
    }

    public static void main(String[] args) {
        System.out.println("1) 'Bai Viet Dau Tien!' -> '" + taoSlug("Bài Viết Đầu Tiên!") + "'");
        System.out.println("2) bo dau: 'Lap Trinh Java' -> '" + taoSlug("Lập Trình Java") + "'");
        System.out.println("3) d/D -> d: 'Duong Dan' -> '" + taoSlug("Đường Dẫn") + "'");
        System.out.println("4) ky tu la + khoang trang -> gop: 'A  B---C!!' -> '" + taoSlug("A  B---C!!") + "'");

        Set<String> daCo = new LinkedHashSet<>();
        daCo.add(taoSlug("Bài Viết"));                          // "bai-viet"
        String moi = taoSlugDuyNhat("Bài Viết", daCo);          // trung -> bai-viet-2
        System.out.println("5) trung slug 'bai-viet' -> '" + moi + "'");

        System.out.println("6) tieu de toan ky tu la '!!!@@@' -> '" + taoSlug("!!!@@@") + "' (fallback)");
    }
}`,
  },
};
