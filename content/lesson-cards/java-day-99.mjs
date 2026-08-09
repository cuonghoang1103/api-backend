/**
 * Thẻ bài học "100 Ngày Java" — Ngày 99: Tổng kết dự án Blog API.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-99.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: dựng nguyên lý "kiến trúc sạch" (phụ thuộc một chiều) bằng JDK
 * thuần; tất định. Bức tranh kiến trúc đầy đủ dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 99,
  total: 100,
  titleLead: 'Java Day 99:',
  titleAccent: 'Tổng kết Blog API',
  subtitle: 'Nhìn lại kiến trúc một backend hoàn chỉnh 🏛️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BỐN TẦNG, TRÁCH NHIỆM RÕ RÀNG 🏛️',
      code: `Controller > Service > Repository > Entity
  (HTTP)   (nghiep vu)  (CSDL)   (du lieu)`,
      notes: [
        { mark: 'ok', text: 'Mỗi tầng một việc: controller mỏng, service dày, repo chỉ CRUD' },
        { mark: 'dot', text: 'Bức tranh của cả Giai đoạn 9-10 gói trong 4 tầng này' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. PHỤ THUỘC CHỈ ĐI XUỐNG ⬇️',
      code: `Controller->Service, Service->Repo, Repo->Entity
hop le (di xuong): 3/4`,
      notes: [
        { mark: 'ok', text: 'Tầng trên biết tầng dưới, không ngược lại' },
        { mark: 'dot', text: 'Nhờ đó đổi ruột một tầng không vỡ tầng khác (Ngày 64)' },
      ],
    },
    {
      tone: 'pink',
      title: '3. ĐI LÊN = VI PHẠM ⛔',
      code: `Repository->Controller -> VI PHAM
kiem 4 phu thuoc -> 3 sach, 1 vi pham`,
      notes: [
        { mark: 'no', text: 'Repo phụ thuộc Controller là rối vòng, khó test, khó tách' },
        { mark: 'ok', text: 'Giữ phụ thuộc một chiều là giữ dự án dễ bảo trì' },
      ],
    },
    {
      tone: 'green',
      title: '4. TẤT CẢ MẢNH ĐÃ GHÉP 🧩',
      code: `auth · CRUD · phan trang · tim kiem · cache
· viec nen · realtime · docs · monitor · CI/CD`,
      notes: [
        { mark: 'ok', text: 'Từ trang giấy trắng (Ngày 82) tới backend đi làm được' },
      ],
    },
    {
      tone: 'blue',
      title: '5. 99 NGÀY 🏁',
      notes: [
        { mark: 'ok', text: "Từ 'Hello World' (Ngày 1) tới một ứng dụng Java hiện đại" },
        { mark: 'next', text: '**Ngày 100**: khép khoá — nhìn lại hành trình & học tiếp gì' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongKienTruc` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) Blog API — 4 tang: Controller > Service > Repository > Entity',
      '2) phu thuoc hop le (di xuong): 3/4',
      '3) phu thuoc CAM (di len): [Repository->Controller] -> VI PHAM',
      '4) kiem 4 phu thuoc -> 3 sach, 1 vi pham',
      '5) kien truc sach: phu thuoc 1 chieu -> de test, de doi tung tang',
      "6) tu 'Hello World' (Ngay 1) den backend hoan chinh (Ngay 99)",
    ],
  },

  verify: {
    className: 'MoPhongKienTruc',
    source: `import java.util.*;
import java.util.stream.*;

/* Blog API — tong ket kien truc. Dung lai NGUYEN LY "kien truc sach": phu
   thuoc chi duoc di MOT CHIEU (xuong duoi). Controller phu thuoc Service,
   Service phu thuoc Repository, Repository phu thuoc Entity — nhung KHONG
   duoc nguoc lai. Kiem tra bang JDK thuan, tat dinh. */
public class MoPhongKienTruc {

    /* Thu tu tang: cang TREN cang nho, duoc phep phu thuoc xuong duoi. */
    static final Map<String, Integer> TANG = Map.of(
            "Controller", 0, "Service", 1, "Repository", 2, "Entity", 3);

    /* Hop le neu di XUONG: tang tren (so nho) phu thuoc tang duoi (so lon). */
    static boolean hopLe(String tu, String den) {
        return TANG.get(tu) < TANG.get(den);
    }

    record PhuThuoc(String tu, String den) {}

    public static void main(String[] args) {
        List<PhuThuoc> deps = List.of(
                new PhuThuoc("Controller", "Service"),
                new PhuThuoc("Service", "Repository"),
                new PhuThuoc("Repository", "Entity"),
                new PhuThuoc("Repository", "Controller"));   // VI PHAM: di len

        System.out.println("1) Blog API — 4 tang: Controller > Service > Repository > Entity");

        long ok = deps.stream().filter(d -> hopLe(d.tu(), d.den())).count();
        long viPham = deps.size() - ok;
        System.out.println("2) phu thuoc hop le (di xuong): " + ok + "/" + deps.size());

        List<String> xau = deps.stream().filter(d -> !hopLe(d.tu(), d.den()))
                .map(d -> d.tu() + "->" + d.den()).collect(Collectors.toList());
        System.out.println("3) phu thuoc CAM (di len): " + xau + " -> VI PHAM");

        System.out.println("4) kiem " + deps.size() + " phu thuoc -> " + ok + " sach, " + viPham + " vi pham");
        System.out.println("5) kien truc sach: phu thuoc 1 chieu -> de test, de doi tung tang");
        System.out.println("6) tu 'Hello World' (Ngay 1) den backend hoan chinh (Ngay 99)");
    }
}`,
  },
};
