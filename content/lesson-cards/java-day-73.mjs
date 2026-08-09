/**
 * Thẻ bài học "100 Ngày Java" — Ngày 73: Xử lý lỗi gọn (@ControllerAdvice).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-73.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: thẻ chạy JDK thuần. Chương trình dựng lại nguyên lý: một sổ tra
 * cứu 'loại exception -> (mã HTTP, JSON)', khớp theo LỚP CHA, trả JSON sạch
 * thay 500+stack trace. Cú pháp @ControllerAdvice/@ExceptionHandler dạy ở
 * thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 73,
  total: 100,
  titleLead: 'Java Day 73:',
  titleAccent: 'Xử lý lỗi gọn',
  subtitle: 'Biến exception thành JSON sạch, đúng mã trạng thái 🧯',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. LỖI THÔ LÀM LỘ NỘI BỘ 🚨',
      code: `throw new KhongTimThay("...");

// khong xu ly -> client nhan:
// HTTP 500 + ca stack trace lo ten lop`,
      notes: [
        { mark: 'no', text: 'Trả 500 kèm stack trace: vừa khó dùng, vừa lộ cấu trúc bên trong' },
        { mark: 'dot', text: 'Lỗi "không tìm thấy" đáng là 404, không phải 500' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. @ControllerAdvice: MỘT CHỖ CHO MỌI LỖI 🧯',
      code: `@ControllerAdvice
class BoXuLyLoi {
  @ExceptionHandler(KhongTimThay.class)
  ResponseEntity<?> xuLy(KhongTimThay e) {
    return ResponseEntity.status(404)...
  }
}`,
      notes: [
        { mark: 'ok', text: 'Gom xử lý lỗi về một chỗ, mọi controller dùng chung' },
        { mark: 'ok', text: 'Controller ném lỗi tự nhiên, không `try/catch` khắp nơi' },
      ],
    },
    {
      tone: 'pink',
      title: '3. MỖI LOẠI LỖI → ĐÚNG MÃ 🎯',
      code: `KhongTimThay -> 404 {"loi":"khong co don"}
DuLieuSai    -> 400 {"loi":"soTien am"}
chua dang ky -> 500 {"loi":"loi he thong"}`,
      notes: [
        { mark: 'ok', text: 'Client nhận JSON sạch đúng mã, không bao giờ thấy stack trace' },
        { mark: 'dot', text: 'Lỗi lạ vẫn về 500 nhưng thân đã được dọn, không lộ nội bộ' },
      ],
    },
    {
      tone: 'green',
      title: '4. KHỚP THEO LỚP CHA 🧬',
      code: `ThieuTruong extends DuLieuSai
// nem ThieuTruong -> van khop handler
// cua DuLieuSai -> 400`,
      notes: [
        { mark: 'ok', text: 'Handler cho lớp cha bắt luôn mọi lớp con (đa hình, Ngày 16)' },
        { mark: 'dot', text: 'Đặt một handler `Exception.class` làm lưới cuối cùng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Ném exception có ý nghĩa, để `@ControllerAdvice` dịch ra HTTP' },
        { mark: 'next', text: '**Ngày 74**: cấu hình & hồ sơ — application.yml, @Value, profiles, bí mật' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongXuLyLoi` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) khong advice: client nhan 500, than lo: KhongTimThay: khong co don DH-404',
      '2) @ControllerAdvice: KhongTimThay->404, DuLieuSai->400',
      '3) nem KhongTimThay -> HTTP 404 {"loi":"khong co don DH-404"}',
      '4) nem DuLieuSai -> HTTP 400 {"loi":"soTien khong duoc am"}',
      '5) exception la chua dang ky -> HTTP 500 {"loi":"loi he thong"}',
      '6) ThieuTruong (con cua DuLieuSai) -> HTTP 400 (khop theo lop cha)',
    ],
  },

  verify: {
    className: 'MoPhongXuLyLoi',
    source: `import java.util.*;
import java.util.function.Function;

/* Dung lai NGUYEN LY cua @ControllerAdvice/@ExceptionHandler bang JDK THUAN:
   mot so tra cuu 'loai exception -> (ma HTTP, than JSON)'. Khi handler nem loi,
   bo xu ly tim luat KHOP GAN NHAT (di nguoc chuoi lop cha), tra ve JSON sach
   thay cho 500 kem stack trace. Cu phap @ControllerAdvice day o than bai. */
public class MoPhongXuLyLoi {

    /* Exception nghiep vu — moi loai mot y nghia. */
    static class KhongTimThay extends RuntimeException { KhongTimThay(String m) { super(m); } }
    static class DuLieuSai extends RuntimeException { DuLieuSai(String m) { super(m); } }
    static class ThieuTruong extends DuLieuSai { ThieuTruong(String m) { super(m); } }   // con cua DuLieuSai

    record PhanHoi(int maHttp, String than) {}

    /* "@ControllerAdvice": mot cho duy nhat anh xa exception -> phan hoi. */
    static class BoXuLyLoi {
        record Luat(int ma, Function<Throwable, String> than) {}
        final LinkedHashMap<Class<?>, Luat> luat = new LinkedHashMap<>();

        void dangKy(Class<?> loai, int ma) {
            luat.put(loai, new Luat(ma, e -> "{\\"loi\\":\\"" + e.getMessage() + "\\"}"));
        }

        /* Khop theo LOP CHA: di nguoc chuoi superclass tim luat gan nhat. */
        PhanHoi xuLy(Throwable e) {
            for (Class<?> c = e.getClass(); c != null; c = c.getSuperclass()) {
                Luat l = luat.get(c);
                if (l != null) return new PhanHoi(l.ma(), l.than().apply(e));
            }
            return new PhanHoi(500, "{\\"loi\\":\\"loi he thong\\"}");   // mac dinh, van JSON sach
        }
    }

    public static void main(String[] args) {
        // (1) KHONG co bo xu ly: exception tho lot ra ngoai -> 500 + lo noi bo
        Throwable tho = new KhongTimThay("khong co don DH-404");
        System.out.println("1) khong advice: client nhan 500, than lo: "
                + tho.getClass().getSimpleName() + ": " + tho.getMessage());

        // (2) dang ky bo xu ly trung tam
        BoXuLyLoi advice = new BoXuLyLoi();
        advice.dangKy(KhongTimThay.class, 404);
        advice.dangKy(DuLieuSai.class, 400);
        System.out.println("2) @ControllerAdvice: KhongTimThay->404, DuLieuSai->400");

        // (3) nem KhongTimThay -> 404 JSON sach
        PhanHoi p3 = advice.xuLy(new KhongTimThay("khong co don DH-404"));
        System.out.println("3) nem KhongTimThay -> HTTP " + p3.maHttp() + " " + p3.than());

        // (4) nem DuLieuSai -> 400
        PhanHoi p4 = advice.xuLy(new DuLieuSai("soTien khong duoc am"));
        System.out.println("4) nem DuLieuSai -> HTTP " + p4.maHttp() + " " + p4.than());

        // (5) exception CHUA dang ky -> 500 mac dinh, van JSON sach (khong stack trace)
        PhanHoi p5 = advice.xuLy(new IllegalArgumentException("loi la"));
        System.out.println("5) exception la chua dang ky -> HTTP " + p5.maHttp() + " " + p5.than());

        // (6) khop theo LOP CHA: ThieuTruong la con cua DuLieuSai -> van 400
        PhanHoi p6 = advice.xuLy(new ThieuTruong("thieu truong 'ma'"));
        System.out.println("6) ThieuTruong (con cua DuLieuSai) -> HTTP " + p6.maHttp()
                + " (khop theo lop cha)");
    }
}`,
  },
};
