/**
 * Thẻ bài học "100 Ngày Java" — Ngày 60: bài tổng hợp khép Giai đoạn 7.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-60.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ Bài khép giai đoạn nên chương trình phải ghép được CẢ NĂM chủ đề vào một
 * dòng chảy: khung test tí hon (53-55) → cổng CI (57) → đo bằng đếm phép tính
 * (59) → đổi cấu trúc dữ liệu → chạy LẠI cùng bộ test → log có ngưỡng + che dữ
 * liệu nhạy cảm (58). Maven/JUnit/Logback là công cụ ngoài nên vẫn theo LUẬT 6:
 * thẻ dựng nguyên lý bằng JDK thuần, thân bài dạy cú pháp thật.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 60,
  total: 100,
  titleLead: 'Java Day 60:',
  titleAccent: 'Khép Giai đoạn 7',
  subtitle: 'Đo → sửa → chạy lại test → CI gác cổng 🏁',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. TEST LÀ TẤM LƯỚI ĐỂ DÁM SỬA 🕸️',
      code: `// CUNG mot bo test chay cho CA HAI ban cai dat
KhoBangDanhSach -> 4/4 dat
KhoBangBangBam  -> 4/4 dat`,
      notes: [
        { mark: 'ok', text: 'Không có test thì không ai dám đụng vào code đang chạy được' },
        { mark: 'dot', text: 'Test bám vào `interface`, nên đổi ruột bên trong không phải sửa test' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ĐO RỒI MỚI SỬA 📏',
      code: `do TRUOC: 5000 tra cuu (List) -> 12 502 500 phep so sanh
sau khi doi HashMap           ->      5 000 phep so sanh`,
      notes: [
        { mark: 'ok', text: 'Nhanh hơn 2500 lần mà bản hợp đồng không đổi một chữ' },
        { mark: 'no', text: 'Sửa trước rồi mới đo là tự tước mất bằng chứng mình sửa đúng chỗ' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CỔNG CI QUYẾT ĐỊNH 🚦',
      code: `mvn package -> validate, compile, test, package

test do   -> khong tao .jar, khong cho gop
test xanh -> cho gop vao main`,
      notes: [
        { mark: 'ok', text: 'Máy canh cổng nên không ai phải nhớ chạy test (Ngày 56–57)' },
      ],
    },
    {
      tone: 'green',
      title: '4. LOG: BỎ BỚT & CHE BỚT 🔏',
      code: `nguong INFO -> 3/4 dong duoc ghi

INFO dang nhap u=an mk=***   <- mat khau bi che`,
      notes: [
        { mark: 'ok', text: 'File log bị sao lưu và gửi đi khắp nơi — đừng để lọt bí mật vào đó' },
      ],
    },
    {
      tone: 'blue',
      title: '5. KHÉP GIAI ĐOẠN 7 🏁',
      notes: [
        { mark: 'ok', text: 'JVM · rác · JUnit · Mockito · TDD · Maven · Git/CI · log · đo' },
        { mark: 'next', text: '**Ngày 61**: mở Giai đoạn 8 — dữ liệu sống lâu hơn chương trình' },
      ],
    },
  ],

  /* Output THẬT của `java DuAnKhepGiaiDoan7` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) pha 'test' cua vong doi Maven: 4 phep thu -> 4 dat, 0 hong",
      '2) cong CI: test xanh -> cho gop vao main? true',
      '3) do TRUOC: 5000 lan tra cuu (List) -> 12502500 phep so sanh',
      '4) doi sang HashMap -> 5000 phep so sanh, nhanh hon 2500 lan',
      '5) chay lai test SAU khi toi uu -> 4/4 dat, khong vo gi',
      '6) log nguong INFO -> 3 dong; INFO dang nhap u=an mk=***',
    ],
  },

  verify: {
    className: 'DuAnKhepGiaiDoan7',
    source: `import java.util.*;
import java.util.function.BooleanSupplier;

/* Bai tong hop khep Giai doan 7: ghep test (53-55), vong doi Maven (56),
   cong CI (57), log co nguong + che du lieu nhay cam (58) va do dac (59)
   vao MOT dong chay: do -> sua -> chay lai test de chac khong vo gi. */
public class DuAnKhepGiaiDoan7 {

    /* ── Nghiep vu: tra cuu don hang theo ma ─────────────────────────────── */
    record DonHang(String ma, int soTien) {}

    interface KhoDonHang {
        void them(DonHang d);
        DonHang tim(String ma);
    }

    static long soSanh = 0;

    /* Ban DAU: luu bang List — dung, nhung moi lan tim phai duyet ca kho. */
    static class KhoBangDanhSach implements KhoDonHang {
        private final List<DonHang> ds = new ArrayList<>();
        public void them(DonHang d) { ds.add(d); }
        public DonHang tim(String ma) {
            for (DonHang d : ds) {
                soSanh++;
                if (d.ma().equals(ma)) return d;
            }
            return null;
        }
    }

    /* SAU khi do: luu bang HashMap — van dung y het, chi doi cau truc. */
    static class KhoBangBangBam implements KhoDonHang {
        private final Map<String, DonHang> bang = new HashMap<>();
        public void them(DonHang d) { bang.put(d.ma(), d); }
        public DonHang tim(String ma) { soSanh++; return bang.get(ma); }
    }

    /* ── Khung test ti hon (Ngay 53) ─────────────────────────────────────── */
    static int dat = 0, hong = 0;

    static void phepThu(String ten, BooleanSupplier dieuKien) {
        boolean ok;
        try { ok = dieuKien.getAsBoolean(); } catch (RuntimeException e) { ok = false; }
        if (ok) dat++; else hong++;
    }

    /* CUNG mot bo test chay cho CA HAI ban cai dat — nho vay doi cau truc
       xong van biet ngay minh co lam vo gi khong. */
    static void chayBoTest(KhoDonHang kho) {
        dat = 0; hong = 0;
        kho.them(new DonHang("DH-1", 199000));
        kho.them(new DonHang("DH-2", 350000));
        phepThu("tim ma co that", () -> kho.tim("DH-1") != null);
        phepThu("dung so tien", () -> kho.tim("DH-2").soTien() == 350000);
        phepThu("ma khong co -> null", () -> kho.tim("DH-404") == null);
        phepThu("ma rong -> null, khong no", () -> kho.tim("") == null);
    }

    /* ── Log co nguong + che du lieu nhay cam (Ngay 58) ──────────────────── */
    enum Muc { DEBUG, INFO, ERROR }

    static final List<String> NHAT_KY = new ArrayList<>();

    static void ghi(Muc muc, Muc nguong, String noiDung) {
        if (muc.ordinal() < nguong.ordinal()) return;
        NHAT_KY.add(muc + " " + che(noiDung));
    }

    /* Mat khau/token khong bao gio duoc ra file log. */
    static String che(String noiDung) {
        return noiDung.replaceAll("mk=[^ ]+", "mk=***");
    }

    public static void main(String[] args) {
        final int SO_DON = 5_000;

        // (1)(2) pha 'test' cua vong doi build, roi cong CI quyet dinh
        KhoDonHang banDau = new KhoBangDanhSach();
        chayBoTest(banDau);
        System.out.println("1) pha 'test' cua vong doi Maven: " + (dat + hong)
                + " phep thu -> " + dat + " dat, " + hong + " hong");
        boolean choGop = hong == 0;
        System.out.println("2) cong CI: test xanh -> cho gop vao main? " + choGop);

        // (3) DO TRUOC khi sua — dung kho rieng cho phep do, khong dung lai kho tren
        KhoDonHang khoList = new KhoBangDanhSach();
        for (int i = 0; i < SO_DON; i++) khoList.them(new DonHang("DH-" + i, 1000 * i));
        soSanh = 0;
        for (int i = 0; i < SO_DON; i++) khoList.tim("DH-" + i);
        long soSanhList = soSanh;
        System.out.println("3) do TRUOC: " + SO_DON + " lan tra cuu (List) -> "
                + soSanhList + " phep so sanh");

        // (4) SUA: doi cau truc du lieu, do lai bang dung phep do do
        KhoDonHang khoBam = new KhoBangBangBam();
        for (int i = 0; i < SO_DON; i++) khoBam.them(new DonHang("DH-" + i, 1000 * i));
        soSanh = 0;
        for (int i = 0; i < SO_DON; i++) khoBam.tim("DH-" + i);
        long soSanhBam = soSanh;
        System.out.println("4) doi sang HashMap -> " + soSanhBam + " phep so sanh, nhanh hon "
                + (soSanhList / soSanhBam) + " lan");

        // (5) DIEU QUAN TRONG NHAT: chay lai CUNG bo test tren ban da toi uu
        chayBoTest(new KhoBangBangBam());
        System.out.println("5) chay lai test SAU khi toi uu -> " + dat + "/" + (dat + hong)
                + " dat, khong vo gi");

        // (6) log: duoi nguong bi bo, mat khau bi che
        Muc nguong = Muc.INFO;
        ghi(Muc.DEBUG, nguong, "vao ham tra cuu");
        ghi(Muc.INFO, nguong, "dang nhap u=an mk=matkhau123");
        ghi(Muc.INFO, nguong, "tra cuu xong " + SO_DON + " don");
        ghi(Muc.ERROR, nguong, "khong goi duoc cong thanh toan");
        System.out.println("6) log nguong INFO -> " + NHAT_KY.size() + " dong; "
                + NHAT_KY.get(0));
    }
}`,
  },
};
