/**
 * Thẻ bài học "100 Ngày Java" — Ngày 68: REST API đầu tiên.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-68.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: Spring MVC là framework ngoài, thẻ chạy JDK thuần. Chương trình
 * dựng lại NGUYÊN LÝ: một bảng tuyến ánh xạ 'method HTTP + đường dẫn' tới hàm
 * xử lý, khớp biến đường dẫn {ma}, tự biến đối tượng thành JSON, trả mã HTTP.
 * Đúng thứ @RestController/@GetMapping làm bên trong. Cú pháp Spring dạy ở
 * thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 68,
  total: 100,
  titleLead: 'Java Day 68:',
  titleAccent: 'REST API đầu tiên',
  subtitle: 'Biến một phương thức Java thành địa chỉ web trả JSON 🌐',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ROUTE: ĐƯỜNG DẪN → PHƯƠNG THỨC 🗺️',
      code: `@RestController
class DonController {
    @GetMapping("/don/{ma}")
    DonHang xem(@PathVariable String ma) { ... }
}`,
      notes: [
        { mark: 'ok', text: 'Spring ánh xạ `GET /don/DH-2` tới đúng phương thức, rút `ma = DH-2`' },
        { mark: 'dot', text: 'Bạn viết hàm Java, framework lo phần nghe HTTP' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. TRẢ VỀ OBJECT → TỰ THÀNH JSON 📦',
      code: `return new DonHang("DH-2", 350000, "DA_GIAO");

// client nhan:
{"ma":"DH-2","soTien":350000,"trangThai":"DA_GIAO"}`,
      notes: [
        { mark: 'ok', text: 'Không tự nối chuỗi JSON — Spring (Jackson) tự chuyển đối tượng' },
        { mark: 'dot', text: 'REST = trả **dữ liệu** (JSON), không trả trang HTML' },
      ],
    },
    {
      tone: 'pink',
      title: '3. ĐỘNG TỪ HTTP = HÀNH ĐỘNG 🔤',
      code: `GET  /don       -> danh sach
GET  /don/{ma}  -> mot don   (404 neu khong co)
POST /don       -> tao moi   (201)`,
      notes: [
        { mark: 'ok', text: 'GET đọc · POST tạo · PUT sửa · DELETE xoá — cùng đường dẫn, khác việc' },
        { mark: 'no', text: 'Không route nào khớp → 404, không phải trang trắng' },
      ],
    },
    {
      tone: 'green',
      title: '4. MÃ TRẠNG THÁI NÓI KẾT QUẢ 🚦',
      code: `200 OK        thanh cong
201 Created   vua tao moi
404 Not Found khong thay
400 / 500     loi client / server`,
      notes: [
        { mark: 'ok', text: 'Client đọc mã số để biết chuyện gì xảy ra, trước cả khi đọc thân' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`@RestController` + `@GetMapping` = một API chạy được trong ~20 dòng' },
        { mark: 'next', text: '**Ngày 69**: nhận dữ liệu vào — @RequestBody, @PathVariable, @RequestParam' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongRestApi` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) dang ky 3 route: GET /don, GET /don/{ma}, POST /don',
      "2) GET /don/DH-2 -> khop 'GET /don/{ma}', HTTP 200",
      '3) than JSON tra ve: {"ma":"DH-2","soTien":350000,"trangThai":"DA_GIAO"}',
      '4) GET /don/DH-404 -> khong co don -> HTTP 404',
      '5) DELETE /don/DH-1 -> khong route nao khop -> HTTP 404',
      '6) POST /don -> tao moi -> HTTP 201, kho co 3 don',
    ],
  },

  verify: {
    className: 'MoPhongRestApi',
    source: `import java.util.*;
import java.util.function.Function;

/* Dung lai NGUYEN LY cua Spring MVC bang JDK THUAN: mot bang tuyen (route
   table) anh xa 'phuong thuc HTTP + duong dan' toi mot ham xu ly, khop bien
   duong dan {ma}, va tu bien doi tuong tra ve thanh JSON. Day dung la thu
   @RestController/@GetMapping lam ben trong. Cu phap Spring day o than bai. */
public class MoPhongRestApi {

    record DonHang(String ma, int soTien, String trangThai) {}

    /* Ket qua mot lan xu ly: ma trang thai HTTP + than JSON. */
    record PhanHoi(int maHttp, String than) {}

    /* Ham xu ly nhan bien duong dan, tra ve phan hoi. */
    interface XuLy { PhanHoi chay(Map<String, String> bienDuongDan); }

    /* ── Bo dinh tuyen ti hon ────────────────────────────────────────────── */
    static class BoDinhTuyen {
        record Tuyen(String method, String[] mau, XuLy xuLy) {}
        private final List<Tuyen> tuyen = new ArrayList<>();

        void dangKy(String method, String duongDan, XuLy xuLy) {
            tuyen.add(new Tuyen(method, duongDan.substring(1).split("/"), xuLy));
        }

        /* Khop 'GET /don/DH-2' voi mau 'GET /don/{ma}', rut ra ma=DH-2. */
        PhanHoi xuLy(String method, String duongDan) {
            String[] phan = duongDan.substring(1).split("/");
            for (Tuyen t : tuyen) {
                if (!t.method().equals(method) || t.mau().length != phan.length) continue;
                Map<String, String> bien = new LinkedHashMap<>();
                boolean khop = true;
                for (int i = 0; i < phan.length; i++) {
                    String m = t.mau()[i];
                    if (m.startsWith("{") && m.endsWith("}")) {
                        bien.put(m.substring(1, m.length() - 1), phan[i]);   // bien duong dan
                    } else if (!m.equals(phan[i])) {
                        khop = false; break;
                    }
                }
                if (khop) return t.xuLy().chay(bien);
            }
            return new PhanHoi(404, "{\\"loi\\":\\"khong tim thay duong dan\\"}");   // khong khop
        }
    }

    /* Tu bien mot DonHang thanh JSON — dung thu tu truong co dinh cua record. */
    static String sangJson(DonHang d) {
        return "{\\"ma\\":\\"" + d.ma() + "\\",\\"soTien\\":" + d.soTien()
                + ",\\"trangThai\\":\\"" + d.trangThai() + "\\"}";
    }

    static final Map<String, DonHang> KHO = new LinkedHashMap<>();
    static {
        KHO.put("DH-1", new DonHang("DH-1", 150000, "MOI"));
        KHO.put("DH-2", new DonHang("DH-2", 350000, "DA_GIAO"));
    }

    public static void main(String[] args) {
        BoDinhTuyen router = new BoDinhTuyen();

        // GET /don  -> danh sach
        router.dangKy("GET", "/don", bien -> new PhanHoi(200,
                "[" + String.join(",", KHO.values().stream().map(MoPhongRestApi::sangJson).toList()) + "]"));

        // GET /don/{ma}  -> mot don, hoac 404
        router.dangKy("GET", "/don/{ma}", bien -> {
            DonHang d = KHO.get(bien.get("ma"));
            return d == null ? new PhanHoi(404, "{\\"loi\\":\\"khong co don\\"}")
                             : new PhanHoi(200, sangJson(d));
        });

        // POST /don  -> tao moi, 201
        router.dangKy("POST", "/don", bien -> {
            KHO.put("DH-3", new DonHang("DH-3", 990000, "MOI"));
            return new PhanHoi(201, sangJson(KHO.get("DH-3")));
        });

        System.out.println("1) dang ky 3 route: GET /don, GET /don/{ma}, POST /don");

        PhanHoi p2 = router.xuLy("GET", "/don/DH-2");
        System.out.println("2) GET /don/DH-2 -> khop 'GET /don/{ma}', HTTP " + p2.maHttp());
        System.out.println("3) than JSON tra ve: " + p2.than());

        PhanHoi p4 = router.xuLy("GET", "/don/DH-404");
        System.out.println("4) GET /don/DH-404 -> khong co don -> HTTP " + p4.maHttp());

        PhanHoi p5 = router.xuLy("DELETE", "/don/DH-1");
        System.out.println("5) DELETE /don/DH-1 -> khong route nao khop -> HTTP " + p5.maHttp());

        PhanHoi p6 = router.xuLy("POST", "/don");
        System.out.println("6) POST /don -> tao moi -> HTTP " + p6.maHttp() + ", kho co "
                + KHO.size() + " don");
    }
}`,
  },
};
