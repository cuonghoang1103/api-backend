/**
 * Thẻ bài học "100 Ngày Java" — Ngày 92: Tài liệu API (OpenAPI/Swagger).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-92.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 1 + 6: dùng reflection đọc chú thích sinh spec — getDeclaredMethods
 * KHÔNG hứa thứ tự nên PHẢI sort (đã sort theo path+method) → tất định. Cú
 * pháp springdoc/@Operation dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 92,
  total: 100,
  titleLead: 'Java Day 92:',
  titleAccent: 'Tài liệu API',
  subtitle: 'Tự sinh từ code — không viết tay, không lệch thực tế 📖',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. SINH TỪ CODE BẰNG REFLECTION 🔍',
      code: `quet controller (@GetMapping...) bang reflection
-> 4 diem cuoi tu sinh, KHONG viet tay`,
      notes: [
        { mark: 'ok', text: 'Đọc chú thích trên phương thức → danh sách endpoint (như Ngày 70)' },
        { mark: 'dot', text: 'Tài liệu đến từ chính code đang chạy' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. LIỆT KÊ MỌI ĐIỂM CUỐI 📋',
      code: `GET    /bai-viet
POST   /bai-viet
DELETE /bai-viet/{slug}
GET    /bai-viet/{slug}`,
      notes: [
        { mark: 'ok', text: 'Người khác biết ngay có API nào, nhận gì, trả gì' },
        { mark: 'dot', text: 'Swagger UI cho THỬ API ngay trên trình duyệt' },
      ],
    },
    {
      tone: 'pink',
      title: '3. KHÔNG BAO GIỜ LỆCH THỰC TẾ ✅',
      code: `them 1 route trong code
-> spec TU CO route do (khong cap nhat tay)`,
      notes: [
        { mark: 'ok', text: 'Tài liệu viết tay luôn lỗi thời; sinh từ code thì luôn khớp' },
        { mark: 'no', text: 'Sửa API mà quên sửa docs viết tay = tài liệu nói dối' },
      ],
    },
    {
      tone: 'green',
      title: '4. springdoc: MỘT DÒNG STARTER 🌱',
      code: `// pom.xml: springdoc-openapi-starter-webmvc-ui
// -> /swagger-ui.html tu co, khong code them`,
      notes: [
        { mark: 'ok', text: 'Thêm một starter là có trang tài liệu tương tác' },
        { mark: 'dot', text: '`@Operation`, `@Schema` để mô tả rõ hơn khi cần' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'API công khai thì tài liệu là bắt buộc; để nó tự sinh, đừng viết tay' },
        { mark: 'next', text: '**Ngày 93**: giám sát & sức khỏe — Actuator, health, metrics' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongOpenApi` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) quet controller bang reflection -> 4 diem cuoi tu sinh',
      '2) GET /bai-viet (danhSach)',
      '3) POST /bai-viet (tao)',
      '4) DELETE /bai-viet/{slug} (xoa)',
      '5) GET /bai-viet/{slug} (xem)',
      '6) doc SINH TU CODE -> khong bao gio lech thuc te (them route la spec tu co)',
    ],
  },

  verify: {
    className: 'MoPhongOpenApi',
    source: `import java.lang.annotation.*;
import java.lang.reflect.*;
import java.util.*;

/* Blog API — tai lieu API. Dung lai NGUYEN LY cua OpenAPI/springdoc bang JDK
   thuan: doc CHU THICH tren cac phuong thuc controller bang REFLECTION roi TU
   SINH danh sach diem cuoi (spec). Vi sinh tu code nen khong bao gio lech thuc
   te. Sap xep ket qua -> tat dinh (getDeclaredMethods khong hua thu tu). */
public class MoPhongOpenApi {

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    @interface Route { String method(); String path(); }

    /* "Controller" — moi phuong thuc mot diem cuoi, dan chu thich Route. */
    static class BaiVietController {
        @Route(method = "GET", path = "/bai-viet") public void danhSach() {}
        @Route(method = "GET", path = "/bai-viet/{slug}") public void xem() {}
        @Route(method = "POST", path = "/bai-viet") public void tao() {}
        @Route(method = "DELETE", path = "/bai-viet/{slug}") public void xoa() {}
    }

    record DiemCuoi(String method, String path, String ham) {}

    /* Sinh spec tu code bang reflection — dung cach springdoc doc @GetMapping... */
    static List<DiemCuoi> sinhSpec(Class<?> ctrl) {
        List<DiemCuoi> ds = new ArrayList<>();
        for (Method m : ctrl.getDeclaredMethods()) {
            Route r = m.getAnnotation(Route.class);
            if (r != null) ds.add(new DiemCuoi(r.method(), r.path(), m.getName()));
        }
        ds.sort(Comparator.comparing(DiemCuoi::path).thenComparing(DiemCuoi::method));  // on dinh
        return ds;
    }

    public static void main(String[] args) {
        List<DiemCuoi> spec = sinhSpec(BaiVietController.class);
        System.out.println("1) quet controller bang reflection -> " + spec.size() + " diem cuoi tu sinh");
        int i = 2;
        for (DiemCuoi e : spec) {
            System.out.println(i + ") " + e.method() + " " + e.path() + " (" + e.ham() + ")");
            i++;
        }
        System.out.println("6) doc SINH TU CODE -> khong bao gio lech thuc te (them route la spec tu co)");
    }
}`,
  },
};
