/**
 * Thẻ bài học "100 Ngày Java" — Ngày 94: Đóng gói bằng Docker.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-94.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: Docker là công cụ ngoài, thẻ chạy JDK thuần. Chương trình dựng
 * lại nguyên lý image nhiều tầng + cache theo tầng; tất định. Cú pháp Dockerfile
 * dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 94,
  total: 100,
  titleLead: 'Java Day 94:',
  titleAccent: 'Đóng gói Docker',
  subtitle: 'Gói cả JVM + app vào một hộp, chạy y hệt mọi nơi 📦',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. IMAGE = CÁC TẦNG XẾP CHỒNG 🧱',
      code: `[base (JDK) → deps → app]
build lan dau -> ca 3 tang phai lam`,
      notes: [
        { mark: 'ok', text: 'Gói JVM + thư viện + code + cấu hình vào một image bất biến' },
        { mark: 'dot', text: 'Mỗi lệnh Dockerfile là một tầng, xếp chồng lên nhau' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. CACHE THEO TẦNG ⚡',
      code: `sua app (deps khong doi)
-> base:CACHE deps:CACHE app:LAM (1 tang lam)`,
      notes: [
        { mark: 'ok', text: 'Tầng không đổi → tái dùng; build gần như tức thì' },
        { mark: 'dot', text: 'Sửa code chỉ làm lại tầng app, khỏi tải lại thư viện' },
      ],
    },
    {
      tone: 'pink',
      title: '3. ĐỔI TẦNG → LÀM LẠI TỪ ĐÓ 🔁',
      code: `sua deps -> deps:LAM app:LAM (2 tang)
// tang doi VA moi tang SAU phai lam lai`,
      notes: [
        { mark: 'no', text: 'Đổi một tầng làm mất cache của mọi tầng phía dưới nó' },
        { mark: 'ok', text: 'Vì vậy: xếp tầng ÍT ĐỔI lên trên (COPY pom trước COPY src)' },
      ],
    },
    {
      tone: 'green',
      title: '4. HẾT "MÁY TÔI CHẠY ĐƯỢC" ✅',
      code: `docker run app   // chay y het o moi may
// cung JVM, cung thu vien, cung cau hinh`,
      notes: [
        { mark: 'ok', text: 'Container mang theo MỌI thứ nó cần — máy chủ chỉ cần Docker' },
        { mark: 'dot', text: 'Chấm dứt "máy tôi khác máy bạn" (nhớ Ngày 57)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Multi-stage build: tầng build nặng riêng, image cuối chỉ JRE + jar' },
        { mark: 'next', text: '**Ngày 95**: CI/CD — máy tự build, test, triển khai mỗi lần đẩy code' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongDocker` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) image = cac tang xep chong: [base, deps, app]',
      '2) build lan dau -> [base:LAM, deps:LAM, app:LAM] (3 tang lam)',
      '3) sua app -> [base:CACHE, deps:CACHE, app:LAM] (1 tang lam)',
      '4) sua deps -> [base:CACHE, deps:LAM, app:LAM] (2 tang lam)',
      '5) khong doi gi -> 0 tang lam (tat ca CACHE, tuc thi)',
      '6) xep tang IT DOI len TREN (COPY pom truoc COPY src) -> tan dung cache',
    ],
  },

  verify: {
    className: 'MoPhongDocker',
    source: `import java.util.*;

/* Blog API — dong goi Docker. Docker la cong cu NGOAI; the chay JDK thuan nen
   dung lai NGUYEN LY quan trong nhat: image la cac TANG xep chong + CACHE
   theo tang. Doi mot tang thi tang do VA moi tang SAU phai lam lai; tang khong
   doi thi tai dung. Dem so tang phai lam -> tat dinh. */
public class MoPhongDocker {

    record Tang(String ten, String noiDung) {}   // noiDung dai dien "dau van tay" cua tang

    static int soTangPhaiLam = 0;

    /* Build co cache: tang doi (hoac co tang truoc doi) thi phai lam lai. */
    static List<String> build(List<Tang> layers, Map<String, String> cache) {
        List<String> ket = new ArrayList<>();
        boolean phaiLam = false;
        for (Tang t : layers) {
            String cu = cache.get(t.ten());
            if (phaiLam || cu == null || !cu.equals(t.noiDung())) {
                phaiLam = true;                    // tang nay + MOI tang sau phai lam lai
                soTangPhaiLam++;
                ket.add(t.ten() + ":LAM");
                cache.put(t.ten(), t.noiDung());
            } else {
                ket.add(t.ten() + ":CACHE");
            }
        }
        return ket;
    }

    public static void main(String[] args) {
        Map<String, String> cache = new HashMap<>();
        List<Tang> v1 = List.of(new Tang("base", "jdk21"), new Tang("deps", "pom-v1"), new Tang("app", "code-v1"));

        // (1)(2) build lan dau: ca 3 tang phai lam
        soTangPhaiLam = 0;
        List<String> r1 = build(new ArrayList<>(v1), cache);
        System.out.println("1) image = cac tang xep chong: [base, deps, app]");
        System.out.println("2) build lan dau -> " + r1 + " (" + soTangPhaiLam + " tang lam)");

        // (3) sua APP (deps khong doi) -> chi lam lai app
        soTangPhaiLam = 0;
        List<Tang> v2 = List.of(new Tang("base", "jdk21"), new Tang("deps", "pom-v1"), new Tang("app", "code-v2"));
        List<String> r2 = build(new ArrayList<>(v2), cache);
        System.out.println("3) sua app -> " + r2 + " (" + soTangPhaiLam + " tang lam)");

        // (4) sua DEPS -> lam lai deps + moi tang sau (app)
        soTangPhaiLam = 0;
        List<Tang> v3 = List.of(new Tang("base", "jdk21"), new Tang("deps", "pom-v2"), new Tang("app", "code-v2"));
        List<String> r3 = build(new ArrayList<>(v3), cache);
        System.out.println("4) sua deps -> " + r3 + " (" + soTangPhaiLam + " tang lam)");

        // (5) khong doi gi -> tat ca cache
        soTangPhaiLam = 0;
        build(new ArrayList<>(v3), cache);
        System.out.println("5) khong doi gi -> " + soTangPhaiLam + " tang lam (tat ca CACHE, tuc thi)");

        // (6) bai hoc xep thu tu tang
        System.out.println("6) xep tang IT DOI len TREN (COPY pom truoc COPY src) -> tan dung cache");
    }
}`,
  },
};
