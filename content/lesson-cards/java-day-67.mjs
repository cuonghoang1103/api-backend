/**
 * Thẻ bài học "100 Ngày Java" — Ngày 67: Spring Boot (mở Giai đoạn 9).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-67.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: Spring là FRAMEWORK NGOÀI, `gen-lesson-card` chỉ chạy javac+java
 * JDK thuần (không có Spring trên classpath). Nên chương trình dựng lại
 * NGUYÊN LÝ CỐT LÕI của Spring — Dependency Injection / IoC — bằng một
 * container tí hon viết bằng reflection JDK thuần: đọc constructor, tự giải
 * phụ thuộc (đệ quy), cache singleton, đổi bản cài đặt sau interface. Cú pháp
 * @Component / @Autowired / @SpringBootApplication dạy trong thân bài. Cùng
 * cách đã dùng cho JUnit (53), Maven (56), JDBC (63).
 */
export default {
  series: '100 NGÀY JAVA',
  day: 67,
  total: 100,
  titleLead: 'Java Day 67:',
  titleAccent: 'Spring Boot',
  subtitle: 'Để framework lo phần lắp ráp, bạn viết nghiệp vụ 🌱',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. IoC: ĐẢO NGƯỢC QUYỀN TẠO 🔄',
      code: `// TU LAM: minh new va tu noi day
var kho = new KhoDonHangJdbc();
var dv  = new DichVuDonHang(kho);

// SPRING: container tu new + tu tiem`,
      notes: [
        { mark: 'ok', text: 'Container tự tạo cả chuỗi phụ thuộc — code nghiệp vụ gọi `new` 0 lần' },
        { mark: 'dot', text: 'IoC = Inversion of Control: quyền tạo đối tượng trao cho framework' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. @Autowired: TIÊM QUA CONSTRUCTOR 💉',
      code: `@Service
class DichVuDonHang {
    private final KhoDonHang kho;
    DichVuDonHang(KhoDonHang kho) {   // Spring tự tiêm
        this.kho = kho;
    }
}`,
      notes: [
        { mark: 'ok', text: 'Container đọc constructor, tự tìm bean khớp kiểu để đưa vào' },
        { mark: 'dot', text: 'Đúng mẫu DAO của Ngày 64 — service chỉ phụ thuộc interface' },
      ],
    },
    {
      tone: 'pink',
      title: '3. BEAN LÀ SINGLETON 1️⃣',
      code: `lay DichVuDonHang 2 lan
-> cung MOT the hien? true`,
      notes: [
        { mark: 'ok', text: 'Mặc định mỗi bean chỉ tạo một lần, dùng chung toàn ứng dụng' },
        { mark: 'no', text: 'Nên bean phải KHÔNG giữ trạng thái riêng của một request (Ngày 41)' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐỔI RUỘT KHÔNG SỬA NGƯỜI DÙNG 🔌',
      code: `dang ky KhoDonHang -> JDBC   : nguon 'JDBC'
dang ky KhoDonHang -> BoNho  : nguon 'BoNho'
// DichVuDonHang y nguyen, khong sua dong nao`,
      notes: [
        { mark: 'ok', text: 'Test dùng bản bộ nhớ, chạy thật dùng JDBC — cùng một service (Ngày 18)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Spring lo lắp ráp + vòng đời; bạn khai "cần gì", không khai "tạo sao"' },
        { mark: 'next', text: '**Ngày 68**: dựng REST API đầu tiên — @RestController, chạy trong 20 dòng' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongIoC` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) dang ky 2 bean vao container',
      "2) lay DichVuDonHang -> container tu tiem kho 'JDBC', khong ai goi new",
      '3) singleton: lay 2 lan -> cung mot the hien? true',
      "4) doi binding sang BoNho -> service dung nguon 'BoNho', DichVuDonHang y nguyen",
      '5) code nghiep vu tu goi new: 0 lan; container tao ho: 2 bean',
      '6) thu tu container tao: [KhoDonHangJdbc, DichVuDonHang]',
    ],
  },

  verify: {
    className: 'MoPhongIoC',
    source: `import java.lang.reflect.*;
import java.util.*;

/* Dung lai NGUYEN LY cot loi cua Spring bang JDK THUAN: Dependency Injection /
   Inversion of Control. Thay vi code TU goi 'new' de tao phu thuoc, mot
   CONTAINER tu tao va "tiem" chung vao. Container ti hon nay dung reflection
   y het cach Spring lam that: doc constructor, tu giai phu thuoc (de quy),
   cache singleton, va cho phep doi ban cai dat sau mot interface. */
public class MoPhongIoC {

    /* Dem so lan CODE NGHIEP VU tu goi 'new' — muc tieu la 0. */
    static int soLanNghiepVuGoiNew = 0;

    /* ── Container: dang ky bean, tu wiring qua constructor, giu singleton ── */
    static class Container {
        private final Map<Class<?>, Class<?>> binding = new LinkedHashMap<>();
        private final Map<Class<?>, Object> singleton = new LinkedHashMap<>();
        int soLanContainerTao = 0;
        final List<String> thuTuTao = new ArrayList<>();

        /* Bean thuong: kieu tu tro toi chinh no. */
        void dangKy(Class<?> loai) { binding.put(loai, loai); }

        /* Bean qua interface: giao dien -> ban cai dat cu the. */
        void dangKy(Class<?> giaoDien, Class<?> banCaiDat) { binding.put(giaoDien, banCaiDat); }

        @SuppressWarnings("unchecked")
        <T> T lay(Class<T> loai) {
            Class<?> impl = binding.getOrDefault(loai, loai);
            if (singleton.containsKey(impl)) return (T) singleton.get(impl);   // da tao -> tra lai
            Object obj = taoMoi(impl);
            singleton.put(impl, obj);
            return (T) obj;
        }

        /* Trai tim cua DI: doc constructor, TU giai tung tham so tu container. */
        private Object taoMoi(Class<?> impl) {
            try {
                Constructor<?> ctor = impl.getDeclaredConstructors()[0];
                Class<?>[] thamSo = ctor.getParameterTypes();
                Object[] doiSo = new Object[thamSo.length];
                for (int i = 0; i < thamSo.length; i++) doiSo[i] = lay(thamSo[i]);  // de quy
                soLanContainerTao++;
                thuTuTao.add(impl.getSimpleName());
                return ctor.newInstance(doiSo);
            } catch (ReflectiveOperationException e) {
                throw new RuntimeException("khong tao duoc bean " + impl, e);
            }
        }
    }

    /* ── Nghiep vu: tang truy cap du lieu (Ngay 64) ──────────────────────── */
    interface KhoDonHang { String ten(); }

    static class KhoDonHangJdbc implements KhoDonHang {
        public String ten() { return "JDBC"; }
    }

    static class KhoDonHangBoNho implements KhoDonHang {
        public String ten() { return "BoNho"; }
    }

    /* Service PHU THUOC vao KhoDonHang — nhan qua constructor, khong tu new. */
    static class DichVuDonHang {
        private final KhoDonHang kho;
        DichVuDonHang(KhoDonHang kho) { this.kho = kho; }
        String nguonDuLieu() { return kho.ten(); }
    }

    public static void main(String[] args) {
        // (1) dang ky bean: interface -> ban cai dat, + service
        Container c = new Container();
        c.dangKy(KhoDonHang.class, KhoDonHangJdbc.class);
        c.dangKy(DichVuDonHang.class);
        System.out.println("1) dang ky 2 bean vao container");

        // (2) chi YEU CAU bean dau ra; container tu tao ca chuoi phu thuoc
        DichVuDonHang dv = c.lay(DichVuDonHang.class);
        System.out.println("2) lay DichVuDonHang -> container tu tiem kho '" + dv.nguonDuLieu()
                + "', khong ai goi new");

        // (3) singleton: lay 2 lan -> CUNG mot the hien
        DichVuDonHang dv2 = c.lay(DichVuDonHang.class);
        System.out.println("3) singleton: lay 2 lan -> cung mot the hien? " + (dv == dv2));

        // (4) doi ban cai dat sau interface -> code service KHONG doi mot dong
        Container c2 = new Container();
        c2.dangKy(KhoDonHang.class, KhoDonHangBoNho.class);   // chi doi dong nay
        c2.dangKy(DichVuDonHang.class);
        System.out.println("4) doi binding sang BoNho -> service dung nguon '"
                + c2.lay(DichVuDonHang.class).nguonDuLieu() + "', DichVuDonHang y nguyen");

        // (5) code nghiep vu tu goi 'new' bao nhieu lan? (muc tieu: 0)
        System.out.println("5) code nghiep vu tu goi new: " + soLanNghiepVuGoiNew
                + " lan; container tao ho: " + c.soLanContainerTao + " bean");

        // (6) thu tu tao: phu thuoc TRUOC, nguoi can phu thuoc SAU
        System.out.println("6) thu tu container tao: " + c.thuTuTao);
    }
}`,
  },
};
