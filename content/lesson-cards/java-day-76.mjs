/**
 * Thẻ bài học "100 Ngày Java" — Ngày 76: Bài tổng hợp khép Giai đoạn 9.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-76.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: bài khép giai đoạn ghép CẢ CHÍN mảng Spring vào một luồng CRUD
 * hoàn chỉnh, chạy bằng JDK thuần: validation (69) -> controller (68) -> service
 * (72) -> repository (70) -> advice bắt lỗi (73). Cú pháp Spring thật dạy ở
 * thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 76,
  total: 100,
  titleLead: 'Java Day 76:',
  titleAccent: 'Khép Giai đoạn 9',
  subtitle: 'Một REST API CRUD hoàn chỉnh, đi trọn mọi tầng 🏁',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CREATE: QUA MỌI TẦNG → 201 ✅',
      code: `POST /don {DH-9, 500000}
 validate -> controller -> service
 -> repository -> 201 Created`,
      notes: [
        { mark: 'ok', text: 'Một request đi trọn: kiểm dữ liệu → nghiệp vụ → lưu → trả 201' },
        { mark: 'dot', text: 'Mỗi tầng một việc, ghép lại thành luồng hoàn chỉnh' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. VALIDATION CHẶN Ở CỬA → 400 🛂',
      code: `POST /don {soTien: -5}
-> validation chan
-> 400, KHONG cham service`,
      notes: [
        { mark: 'no', text: 'Dữ liệu xấu dừng ngay ở cửa, không lọt vào nghiệp vụ (Ngày 69)' },
      ],
    },
    {
      tone: 'pink',
      title: '3. READ: THẤY → 200, KHÔNG → 404 🔍',
      code: `GET /don/DH-9   -> 200 + JSON
GET /don/DH-404 -> advice -> 404`,
      notes: [
        { mark: 'ok', text: 'Không tìm thấy → advice dịch thành 404 sạch (Ngày 73)' },
        { mark: 'dot', text: 'Client luôn nhận JSON đúng mã, không stack trace' },
      ],
    },
    {
      tone: 'green',
      title: '4. UPDATE 200 · DELETE 204 🔄',
      code: `PUT /don/DH-9 {600000} -> 200
DELETE /don/DH-9       -> 204
GET lai                -> 404`,
      notes: [
        { mark: 'ok', text: 'Vòng đời khép kín: tạo → đọc → sửa → xoá → không còn' },
      ],
    },
    {
      tone: 'blue',
      title: '5. KHÉP GIAI ĐOẠN 9 🏁',
      notes: [
        { mark: 'ok', text: 'DI · REST · validation · JPA · quan hệ · service · lỗi · cấu hình · test' },
        { mark: 'next', text: '**Ngày 77**: mở Giai đoạn 10 — bảo mật: đăng nhập, JWT, phân quyền' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongCrudHoanChinh` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) POST /don {DH-9,500000} -> 201 {"ma":"DH-9","soTien":500000,"trangThai":"MOI"}',
      '2) POST soTien am -> validation chan -> 400 {"loi":"\'soTien\' khong duoc am"}',
      '3) GET /don/DH-9 -> 200 {"ma":"DH-9","soTien":500000,"trangThai":"MOI"}',
      '4) GET /don/DH-404 -> advice -> 404 {"loi":"khong co don DH-404"}',
      '5) PUT /don/DH-9 {600000} -> 200 {"ma":"DH-9","soTien":600000,"trangThai":"MOI"}',
      '6) DELETE /don/DH-9 -> 204; GET lai -> 404',
    ],
  },

  verify: {
    className: 'MoPhongCrudHoanChinh',
    source: `import java.util.*;

/* Bai tong hop khep Giai doan 9: ghep CA CHIN mang cua Spring Boot vao MOT
   luong CRUD hoan chinh, chay bang JDK thuan (LUAT 6). Mot request di tron:
   validation (69) -> controller/router (68) -> service coi nhu @Transactional
   (72) -> repository (70) -> va advice bat loi thanh dung ma HTTP (73). */
public class MoPhongCrudHoanChinh {

    record Don(String ma, int soTien, String trangThai) {}
    record PhanHoi(int status, String than) {}

    static class KhongTimThay extends RuntimeException { KhongTimThay(String m) { super(m); } }
    static class DuLieuSai extends RuntimeException { DuLieuSai(String m) { super(m); } }

    /* Tang repository (Ngay 70). */
    static final Map<String, Don> REPO = new LinkedHashMap<>();

    /* Validation (Ngay 69): du lieu xau bi chan TRUOC khi cham service. */
    static void validate(Map<String, String> body) {
        if (body == null || !body.containsKey("ma") || body.get("ma").isBlank())
            throw new DuLieuSai("thieu truong 'ma'");
        int soTien;
        try { soTien = Integer.parseInt(body.getOrDefault("soTien", "x")); }
        catch (NumberFormatException e) { throw new DuLieuSai("'soTien' phai la so"); }
        if (soTien < 0) throw new DuLieuSai("'soTien' khong duoc am");
    }

    /* Tang service (Ngay 72). */
    static Don taoDon(Map<String, String> body) {
        Don d = new Don(body.get("ma"), Integer.parseInt(body.get("soTien")), "MOI");
        REPO.put(d.ma(), d);
        return d;
    }

    static Don timDon(String ma) {
        Don d = REPO.get(ma);
        if (d == null) throw new KhongTimThay("khong co don " + ma);
        return d;
    }

    static String json(Don d) {
        return "{\\"ma\\":\\"" + d.ma() + "\\",\\"soTien\\":" + d.soTien()
                + ",\\"trangThai\\":\\"" + d.trangThai() + "\\"}";
    }

    /* Controller + advice (68 + 73): dieu phoi, bat exception -> dung ma HTTP. */
    static PhanHoi xuLy(String method, String ma, Map<String, String> body) {
        try {
            switch (method) {
                case "POST":
                    validate(body);
                    return new PhanHoi(201, json(taoDon(body)));
                case "GET":
                    return new PhanHoi(200, json(timDon(ma)));
                case "PUT": {
                    Don cu = timDon(ma);
                    Don moi = new Don(cu.ma(), Integer.parseInt(body.get("soTien")), cu.trangThai());
                    REPO.put(ma, moi);
                    return new PhanHoi(200, json(moi));
                }
                case "DELETE":
                    timDon(ma);
                    REPO.remove(ma);
                    return new PhanHoi(204, "");
                default:
                    return new PhanHoi(405, "");
            }
        } catch (DuLieuSai e) {
            return new PhanHoi(400, "{\\"loi\\":\\"" + e.getMessage() + "\\"}");
        } catch (KhongTimThay e) {
            return new PhanHoi(404, "{\\"loi\\":\\"" + e.getMessage() + "\\"}");
        }
    }

    static Map<String, String> body(String... kv) {
        Map<String, String> m = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) m.put(kv[i], kv[i + 1]);
        return m;
    }

    public static void main(String[] args) {
        // (1) CREATE: validation qua -> service -> repo -> 201
        PhanHoi p1 = xuLy("POST", null, body("ma", "DH-9", "soTien", "500000"));
        System.out.println("1) POST /don {DH-9,500000} -> " + p1.status() + " " + p1.than());

        // (2) CREATE du lieu xau: validation chan, KHONG cham service -> 400
        PhanHoi p2 = xuLy("POST", null, body("ma", "DH-8", "soTien", "-5"));
        System.out.println("2) POST soTien am -> validation chan -> " + p2.status() + " " + p2.than());

        // (3) READ co that -> 200
        PhanHoi p3 = xuLy("GET", "DH-9", null);
        System.out.println("3) GET /don/DH-9 -> " + p3.status() + " " + p3.than());

        // (4) READ khong co -> advice -> 404
        PhanHoi p4 = xuLy("GET", "DH-404", null);
        System.out.println("4) GET /don/DH-404 -> advice -> " + p4.status() + " " + p4.than());

        // (5) UPDATE -> 200
        PhanHoi p5 = xuLy("PUT", "DH-9", body("soTien", "600000"));
        System.out.println("5) PUT /don/DH-9 {600000} -> " + p5.status() + " " + p5.than());

        // (6) DELETE -> 204, roi GET lai -> 404 (vong doi khep kin)
        int xoa = xuLy("DELETE", "DH-9", null).status();
        int timLai = xuLy("GET", "DH-9", null).status();
        System.out.println("6) DELETE /don/DH-9 -> " + xoa + "; GET lai -> " + timLai);
    }
}`,
  },
};
