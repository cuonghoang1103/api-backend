/**
 * Thẻ bài học "100 Ngày Java" — Ngày 50: dự án nhỏ đa luồng. Khép Giai đoạn 6,
 * mốc NỬA CHẶNG ĐƯỜNG.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-50.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Chương trình ghép cả bốn mẫu của Ngày
 * 49; output tất định vì chỉ in TỔNG KẾT và NGƯỠNG, còn nguồn "rất chậm" thì
 * chắc chắn quá hạn (2000ms so với hạn 500ms).
 */
export default {
  series: '100 NGÀY JAVA',
  day: 50,
  total: 100,
  titleLead: 'Java Day 50:',
  titleAccent: 'Bộ tải dữ liệu',
  subtitle: 'Ghép cả bốn mẫu — nửa chặng đường 🏁',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. FAN-OUT RỒI FAN-IN 🍴',
      code: `try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
    for (String n : nguon) giao.put(n, pool.submit(() -> thuLai(n, 3)));
    for (var e : giao.entrySet()) ket.add(thu(e));
}
// tai 6 nguon -> nhan du ket qua? true`,
      notes: [{ mark: 'ok', text: 'Luồng ảo (**Ngày 44**) vì đây là việc CHỜ, không phải việc tính' }],
    },
    {
      tone: 'yellow',
      title: '2. HẠN CHỜ CỨU CẢ HỆ THỐNG ⏱️',
      code: `try { ket.add(f.get(500, MILLISECONDS)); }
catch (TimeoutException t) { f.cancel(true); ket.add(DU_PHONG); }
// nguon "rat-cham" (2000ms) -> bi timeout, tra du phong`,
      notes: [{ mark: 'no', text: 'Không có hạn chờ thì MỘT nguồn chậm giữ luôn cả sáu kết quả' }],
    },
    {
      tone: 'pink',
      title: '3. THỬ LẠI + GIỚI HẠN TỐC ĐỘ 🔁',
      code: `Semaphore GIOI_HAN = new Semaphore(3);   // bao ve nguon
// nguon "hay-loi" hong 2 lan dau -> thu lai lan 3 thanh cong
// dong thoi cao nhat <= 3? true`,
      notes: [{ mark: 'ok', text: 'Hai mẫu chạy chung: thử lại KHÔNG được phá vỡ giới hạn tốc độ' }],
    },
    {
      tone: 'green',
      title: '4. GẦN NHƯ MỌI THỨ ĐÃ HỌC 🧩',
      code: `record + Stream + Collectors    (GD 4-5)
Semaphore + luong ao + Future   (GD 6)
ConcurrentHashMap + ngoai le    (GD 3+6)`,
      notes: [{ mark: 'ok', text: 'Sáu nguồn, một hỏng hai lần, một quá chậm — vẫn trả về đủ 6 kết quả' }],
    },
    {
      tone: 'blue',
      title: '5. NỬA CHẶNG ĐƯỜNG 🏁',
      notes: [
        { mark: 'ok', text: 'GĐ1 nền tảng · GĐ2 OOP · GĐ3 ngoại lệ · GĐ4 collections · GĐ5 Java hiện đại · GĐ6 đa luồng' },
        { mark: 'next', text: '**Ngày 51**: JVM — bộ nhớ, stack vs heap, và bộ dọn rác' },
      ],
    },
  ],

  /* Output THẬT của `java BoTaiDuLieu` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) tai 6 nguon -> nhan du ket qua? true',
      '2) so nguon phai dung du phong -> 1',
      '3) nguon cham bi timeout? true',
      '4) nguon hay loi da thu lai 3 lan -> thanh cong? true',
      '5) gioi han 3 -> dong thoi cao nhat <= 3? true',
      '6) ket qua thanh cong -> [api-a:ok, api-b:ok, api-c:ok, api-d:ok, hay-loi:ok]',
    ],
  },

  verify: {
    className: 'BoTaiDuLieu',
    source: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class BoTaiDuLieu {

    record KetQua(String nguon, String noiDung, boolean duPhong) { }

    static final Semaphore GIOI_HAN = new Semaphore(3);
    static final AtomicInteger dinhCao = new AtomicInteger(), dangChay = new AtomicInteger();
    static final ConcurrentHashMap<String, Integer> soLanGoi = new ConcurrentHashMap<>();

    static String goiNguon(String nguon) throws Exception {
        GIOI_HAN.acquire();
        try {
            int n = dangChay.incrementAndGet();
            dinhCao.updateAndGet(cu -> Math.max(cu, n));
            int lan = soLanGoi.merge(nguon, 1, Integer::sum);
            Thread.sleep(20);
            if (nguon.equals("hay-loi") && lan < 3) throw new IllegalStateException("tam thoi");
            if (nguon.equals("rat-cham")) Thread.sleep(2000);
            return nguon + ":ok";
        } finally {
            dangChay.decrementAndGet();
            GIOI_HAN.release();
        }
    }

    static String thuLai(String nguon, int soLan) throws Exception {
        Exception cuoi = null;
        for (int i = 0; i < soLan; i++) {
            try { return goiNguon(nguon); }
            catch (IllegalStateException e) { cuoi = e; Thread.sleep(5L * (1L << i)); }
        }
        throw cuoi;
    }

    public static void main(String[] args) throws Exception {
        List<String> nguon = List.of("api-a", "api-b", "api-c", "hay-loi", "rat-cham", "api-d");

        List<KetQua> ket = new ArrayList<>();
        try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
            Map<String, Future<String>> giao = new LinkedHashMap<>();
            for (String n : nguon) giao.put(n, pool.submit(() -> thuLai(n, 3)));

            for (var e : giao.entrySet()) {
                try {
                    ket.add(new KetQua(e.getKey(), e.getValue().get(500, TimeUnit.MILLISECONDS), false));
                } catch (TimeoutException t) {
                    e.getValue().cancel(true);
                    ket.add(new KetQua(e.getKey(), "du-phong", true));
                } catch (ExecutionException x) {
                    ket.add(new KetQua(e.getKey(), "loi", true));
                }
            }
        }

        System.out.println("1) tai " + nguon.size() + " nguon -> nhan du ket qua? " + (ket.size() == nguon.size()));
        System.out.println("2) so nguon phai dung du phong -> " + ket.stream().filter(KetQua::duPhong).count());
        System.out.println("3) nguon cham bi timeout? " + ket.stream()
                .anyMatch(k -> k.nguon().equals("rat-cham") && k.duPhong()));
        System.out.println("4) nguon hay loi da thu lai " + soLanGoi.get("hay-loi") + " lan -> thanh cong? "
                + ket.stream().anyMatch(k -> k.nguon().equals("hay-loi") && !k.duPhong()));
        System.out.println("5) gioi han 3 -> dong thoi cao nhat <= 3? " + (dinhCao.get() <= 3));
        System.out.println("6) ket qua thanh cong -> " + ket.stream()
                .filter(k -> !k.duPhong()).map(KetQua::noiDung).sorted().toList());
    }
}`,
  },
};
