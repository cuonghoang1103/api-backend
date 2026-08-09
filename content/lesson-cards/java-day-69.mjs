/**
 * Thẻ bài học "100 Ngày Java" — Ngày 69: Nhận dữ liệu vào.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-69.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: Spring là framework ngoài, thẻ chạy JDK thuần. Chương trình dựng
 * lại NGUYÊN LÝ: tách chuỗi truy vấn thành tham số (có mặc định), phân tích
 * thân JSON thành đối tượng (đảo ngược Ngày 68), ép kiểu, và KIỂM TRA vì mọi
 * thứ client gửi đều đáng nghi. Cú pháp @RequestParam/@RequestBody dạy ở
 * thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 69,
  total: 100,
  titleLead: 'Java Day 69:',
  titleAccent: 'Nhận dữ liệu vào',
  subtitle: 'Đọc thân JSON & tham số URL — và đừng tin client 🛂',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. @RequestParam: THAM SỐ TRÊN URL 🔗',
      code: `GET /don?trangThai=MOI&trang=2

@RequestParam String trangThai   // "MOI"
@RequestParam(defaultValue="1") int trang`,
      notes: [
        { mark: 'ok', text: 'Dùng cho lọc, tìm kiếm, phân trang — thứ không định danh tài nguyên' },
        { mark: 'dot', text: 'Thiếu tham số → lấy `defaultValue`, không nổ' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. @RequestBody: CẢ THÂN JSON → OBJECT 📥',
      code: `POST /don   body: {"ma":"DH-9","soTien":500000}

@PostMapping("/don")
DonHang tao(@RequestBody DonHang moi) { ... }`,
      notes: [
        { mark: 'ok', text: 'Jackson tự phân tích JSON thành đối tượng — đảo ngược của Ngày 68' },
        { mark: 'ok', text: 'Chuỗi số `"350000"` tự ép thành `int` đúng kiểu trường' },
      ],
    },
    {
      tone: 'pink',
      title: '3. ĐỪNG TIN CLIENT 🛂',
      code: `thieu 'ma'    -> 400 Bad Request
soTien = -5   -> 400 Bad Request`,
      notes: [
        { mark: 'no', text: 'Mọi thứ client gửi đều đáng nghi — kiểm trước khi dùng' },
        { mark: 'dot', text: 'Dữ liệu sai là lỗi client (4xx), không phải lỗi server (5xx)' },
      ],
    },
    {
      tone: 'green',
      title: '4. BA NGUỒN DỮ LIỆU VÀO 🚪',
      code: `/don/{ma}         -> @PathVariable  (dinh danh)
?trangThai=MOI    -> @RequestParam (loc, phan trang)
body JSON         -> @RequestBody  (tao/sua)`,
      notes: [
        { mark: 'ok', text: 'Mỗi nguồn một mục đích — chọn đúng nguồn là API tự rõ nghĩa' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`@PathVariable` định danh · `@RequestParam` lọc · `@RequestBody` tạo/sửa' },
        { mark: 'next', text: '**Ngày 70**: Spring Data JPA — hết viết JDBC tay, kho tự sinh' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongNhanDuLieu` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) query '?trangThai=MOI&trang=2' -> {trangThai=MOI, trang=2}",
      '2) @RequestParam trang(md=1)=2, co(md=20, thieu)=20',
      '3) @RequestBody hop le -> DonHang[ma=DH-9, soTien=500000, trangThai=MOI]',
      '4) ep kieu chuoi "350000" -> DonHang[ma=DH-8, soTien=350000, trangThai=MOI]',
      "5) thieu 'ma' -> 400: thieu truong 'ma'",
      "6) soTien am -> 400: 'soTien' khong duoc am",
    ],
  },

  verify: {
    className: 'MoPhongNhanDuLieu',
    source: `import java.util.*;

/* Dung lai NGUYEN LY cua @RequestParam / @RequestBody bang JDK THUAN:
   tach chuoi truy van '?a=1&b=2' thanh tham so (co gia tri mac dinh), va
   phan tich mot than JSON phang thanh doi tuong (dao nguoc cua Ngay 68), co
   ep kieu chuoi->so. Ket bang bai hoc: MOI thu client gui len deu phai bi
   NGHI NGO cho toi khi kiem tra. */
public class MoPhongNhanDuLieu {

    record DonHang(String ma, int soTien, String trangThai) {}

    /* '?trangThai=MOI&trang=2' -> {trangThai=MOI, trang=2} */
    static Map<String, String> tachTruyVan(String q) {
        Map<String, String> ket = new LinkedHashMap<>();
        if (q.startsWith("?")) q = q.substring(1);
        for (String cap : q.split("&")) {
            if (cap.isBlank()) continue;
            String[] hai = cap.split("=", 2);
            ket.put(hai[0], hai.length > 1 ? hai[1] : "");
        }
        return ket;
    }

    /* @RequestParam co gia tri mac dinh khi thieu. */
    static int thamSo(Map<String, String> q, String ten, int macDinh) {
        return q.containsKey(ten) ? Integer.parseInt(q.get(ten)) : macDinh;
    }

    /* Phan tich JSON PHANG {"ma":"DH-9","soTien":500000,...} -> Map. */
    static Map<String, String> tachJson(String json) {
        Map<String, String> ket = new LinkedHashMap<>();
        String than = json.trim().replaceAll("^\\\\{|\\\\}$", "");
        for (String cap : than.split(",")) {
            String[] hai = cap.split(":", 2);
            String khoa = hai[0].trim().replaceAll("^\\"|\\"$", "");
            String giaTri = hai[1].trim().replaceAll("^\\"|\\"$", "");
            ket.put(khoa, giaTri);
        }
        return ket;
    }

    /* Bind Map -> DonHang, co KIEM TRA: thieu truong / kieu sai / gia tri xau. */
    static Object bind(Map<String, String> j) {
        if (!j.containsKey("ma") || j.get("ma").isBlank()) return "400: thieu truong 'ma'";
        int soTien;
        try {
            soTien = Integer.parseInt(j.get("soTien"));   // ep kieu chuoi -> so
        } catch (NumberFormatException e) {
            return "400: 'soTien' phai la so";
        }
        if (soTien < 0) return "400: 'soTien' khong duoc am";
        return new DonHang(j.get("ma"), soTien, j.getOrDefault("trangThai", "MOI"));
    }

    public static void main(String[] args) {
        // (1) tach chuoi truy van
        Map<String, String> q = tachTruyVan("?trangThai=MOI&trang=2");
        System.out.println("1) query '?trangThai=MOI&trang=2' -> " + q);

        // (2) @RequestParam voi gia tri mac dinh
        System.out.println("2) @RequestParam trang(md=1)=" + thamSo(q, "trang", 1)
                + ", co(md=20, thieu)=" + thamSo(q, "co", 20));

        // (3) @RequestBody: JSON hop le -> doi tuong
        System.out.println("3) @RequestBody hop le -> "
                + bind(tachJson("{\\"ma\\":\\"DH-9\\",\\"soTien\\":500000,\\"trangThai\\":\\"MOI\\"}")));

        // (4) ep kieu: soTien trong JSON la chuoi so, ra int
        Object ok = bind(tachJson("{\\"ma\\":\\"DH-8\\",\\"soTien\\":\\"350000\\"}"));
        System.out.println("4) ep kieu chuoi \\"350000\\" -> " + ok);

        // (5) thieu truong bat buoc -> 400
        System.out.println("5) thieu 'ma' -> " + bind(tachJson("{\\"soTien\\":100000}")));

        // (6) gia tri xau (so am) -> 400: dung tin client
        System.out.println("6) soTien am -> " + bind(tachJson("{\\"ma\\":\\"DH-7\\",\\"soTien\\":-5}")));
    }
}`,
  },
};
