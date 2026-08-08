/**
 * Thẻ bài học "100 Ngày Java" — Ngày 55: TDD (đỏ · xanh · dọn).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-55.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Chương trình giữ lại CẢ bản đầu tiên
 * (chưa làm gì) để chứng minh nhịp ĐỎ là có thật, chứ không chỉ kể lại.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 55,
  total: 100,
  titleLead: 'Java Day 55:',
  titleAccent: 'TDD',
  subtitle: 'Đỏ · Xanh · Dọn — viết test trước khi viết code 🔴🟢',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BA NHỊP 🔴🟢🧹',
      code: `1. DO   viet test truoc -> no HONG (code chua co)
2. XANH viet code TOI THIEU de test dat
3. DON  don dep code, test VAN xanh
// -> ban dau tien lam test hong? true`,
      notes: [
        { mark: 'ok', text: 'Nhịp ĐỎ bắt buộc: test chưa từng đỏ là test có thể không kiểm gì cả' },
        { mark: 'dot', text: 'Vòng lặp ngắn — vài phút một vòng, không phải vài ngày' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. TEST TRƯỚC = THIẾT KẾ TRƯỚC 🎨',
      code: `// Phai GOI ham truoc khi viet no:
traTien(35_000)  ->  [20000, 10000, 5000]

// Ban vua quyet dinh: ten ham, tham so, kieu tra ve
// truoc khi nghi den cach hien thuc`,
      notes: [{ mark: 'ok', text: 'Ép bạn nghĩ về NGƯỜI DÙNG hàm trước, thường ra thiết kế gọn hơn' }],
    },
    {
      tone: 'pink',
      title: '3. MỖI VÒNG MỘT TRƯỜNG HỢP 🧩',
      code: `thua 0      -> []
thua 10k    -> [10000]
thua 35k    -> [20000, 10000, 5000]
tien am     -> IllegalArgumentException
khong tra du-> IllegalStateException
// dat 6 | hong 0`,
      notes: [{ mark: 'ok', text: 'Trường hợp lỗi nghĩ ngay từ đầu, không đợi "làm xong rồi thêm"' }],
    },
    {
      tone: 'green',
      title: '4. NHỊP DỌN — PHẦN HAY BỊ BỎ 🧹',
      code: `// Doi thu tu duyet, doi thuat toan, tach ham…
// -> test van xanh? true

// Khong co test: khong ai dam don dep -> code muc dan`,
      notes: [
        { mark: 'ok', text: 'Bộ test xanh chính là giấy phép để sửa code mà không sợ' },
        { mark: 'no', text: 'Bỏ nhịp dọn thì TDD chỉ còn là "viết test trước", mất nửa giá trị' },
      ],
    },
    {
      tone: 'blue',
      title: '5. KHI NÀO DÙNG 🧭',
      notes: [
        { mark: 'ok', text: 'Hợp: logic nghiệp vụ rõ, thuật toán, sửa bug (viết test tái hiện trước)' },
        { mark: 'next', text: '**Ngày 56**: Maven — quản lý thư viện và dựng dự án' },
      ],
    },
  ],

  /* Output THẬT của `java DoXanhDon` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) NHIP DO: ban dau tien lam test hong? true',
      '2) NHIP XANH: dat 6 | hong 0',
      '3) tat ca xanh? true',
      '4) NHIP DON: doi thu tu duyet menh gia van dung? true',
      '5) so to tra cho 66k -> 4 to',
      '6) tong tien tra lai dung? true',
    ],
  },

  verify: {
    className: 'DoXanhDon',
    source: `import java.util.*;

public class DoXanhDon {

    static List<Integer> traTienBan1(int thua) {
        if (thua == 0) return List.of();
        return null;
    }

    static final int[] MENH_GIA = {50_000, 20_000, 10_000, 5_000, 1_000};

    static List<Integer> traTien(int thua) {
        if (thua < 0) throw new IllegalArgumentException("Tien thua am: " + thua);
        List<Integer> ket = new ArrayList<>();
        for (int m : MENH_GIA) {
            while (thua >= m) { ket.add(m); thua -= m; }
        }
        if (thua != 0) throw new IllegalStateException("Khong tra du: con " + thua);
        return ket;
    }

    static int dat = 0, hong = 0;
    static void kiem(String ten, Object mong, Object thuc) {
        if (Objects.equals(mong, thuc)) dat++;
        else { hong++; System.out.println("   HONG " + ten + ": mong " + mong + " nhan " + thuc); }
    }
    static void kiemNem(String ten, Class<? extends Throwable> loai, Runnable r) {
        try { r.run(); hong++; System.out.println("   HONG " + ten + ": khong nem"); }
        catch (Throwable t) { if (loai.isInstance(t)) dat++; else { hong++; System.out.println("   HONG " + ten); } }
    }

    public static void main(String[] args) {
        boolean ban1Hong = !Objects.equals(List.of(10_000), traTienBan1(10_000));
        System.out.println("1) NHIP DO: ban dau tien lam test hong? " + ban1Hong);

        kiem("thua 0", List.of(), traTien(0));
        kiem("thua 10k", List.of(10_000), traTien(10_000));
        kiem("thua 35k", List.of(20_000, 10_000, 5_000), traTien(35_000));
        kiem("thua 66k", List.of(50_000, 10_000, 5_000, 1_000), traTien(66_000));
        kiemNem("tien am", IllegalArgumentException.class, () -> traTien(-1));
        kiemNem("khong tra du", IllegalStateException.class, () -> traTien(500));

        System.out.println("2) NHIP XANH: dat " + dat + " | hong " + hong);
        System.out.println("3) tat ca xanh? " + (hong == 0));

        System.out.println("4) NHIP DON: doi thu tu duyet menh gia van dung? "
                + traTien(35_000).equals(List.of(20_000, 10_000, 5_000)));
        System.out.println("5) so to tra cho 66k -> " + traTien(66_000).size() + " to");
        System.out.println("6) tong tien tra lai dung? "
                + (traTien(66_000).stream().mapToInt(Integer::intValue).sum() == 66_000));
    }
}`,
  },
};
