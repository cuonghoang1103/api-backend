/**
 * Thẻ bài học "100 Ngày Java" — Ngày 49: mẫu thiết kế đa luồng.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-49.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Output tất định: mẫu giới hạn tốc độ
 * in NGƯỠNG ("đỉnh cao <= 2? true") chứ không in con số đo được.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 49,
  total: 100,
  titleLead: 'Java Day 49:',
  titleAccent: 'Mẫu đa luồng',
  subtitle: 'Bốn mẫu dùng đi dùng lại trong dự án thật 🧰',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. FAN-OUT / FAN-IN — CHIA RỒI GỘP 🍴',
      code: `for (moi phan) phan.add(pool.submit(() -> tinh(phan)));
for (Future f : phan) tong += f.get();     // gop lai
// tong 1..1000 -> 500500`,
      notes: [
        { mark: 'ok', text: 'Nộp HẾT rồi mới `get()` — `get()` ngay sau `submit` là mất song song (**Ngày 42**)' },
        { mark: 'dot', text: 'Việc nặng CPU thì `parallelStream` gọn hơn; có I/O thì mẫu này + luồng ảo' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. HẠN CHỜ + GIÁ TRỊ DỰ PHÒNG ⏱️',
      code: `try { kq = f.get(200, TimeUnit.MILLISECONDS); }
catch (TimeoutException e) { f.cancel(true); kq = "du phong"; }
// -> "gia tri du phong"`,
      notes: [
        { mark: 'no', text: '`get()` không hạn chờ = một dịch vụ treo kéo sập cả hệ thống' },
        { mark: 'ok', text: 'Nhớ `cancel(true)` để không bỏ quên luồng vẫn đang chạy' },
      ],
    },
    {
      tone: 'pink',
      title: '3. GIỚI HẠN TỐC ĐỘ 🎚️',
      code: `Semaphore gioiHan = new Semaphore(2);
gioiHan.acquire();
try { goiApi(); } finally { gioiHan.release(); }
// 20 viec, 10 luong -> chay dong thoi cao nhat <= 2`,
      notes: [{ mark: 'ok', text: 'Bảo vệ dịch vụ bên ngoài: DB chịu 10 kết nối, API cho 5 lời gọi/giây' }],
    },
    {
      tone: 'green',
      title: '4. THỬ LẠI CÓ LÙI DẦN 🔁',
      code: `for (int i = 0; i < soLan; i++) {
    try { return viec.call(); }
    catch (Exception e) { Thread.sleep(10L * (1L << i)); }   // 10, 20, 40ms
}
// -> thanh cong lan 3`,
      notes: [
        { mark: 'ok', text: 'Lùi dần (backoff) để không dội bom dịch vụ đang ốm' },
        { mark: 'no', text: 'Chỉ thử lại với lỗi TẠM THỜI — sai mật khẩu thì thử 100 lần vẫn sai' },
      ],
    },
    {
      tone: 'blue',
      title: '5. CHỌN CÔNG CỤ NÀO? 🧭',
      notes: [
        { mark: 'ok', text: 'Nặng CPU → `parallelStream` · Chờ I/O → luồng ảo · Luồng việc → `BlockingQueue`' },
        { mark: 'next', text: '**Ngày 50**: khép Giai đoạn 6 — dự án nhỏ đa luồng hoàn chỉnh' },
      ],
    },
  ],

  /* Output THẬT của `java MauThietKe` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) fan-out/fan-in tong 1..1000 -> 500500 (dung? true)',
      '2) timeout 200ms -> gia tri du phong',
      '3) Semaphore(2) -> so viec chay dong thoi cao nhat <= 2? true',
      '4) retry -> thanh cong lan 3',
      '5) da dong het ho boi? true',
    ],
  },

  verify: {
    className: 'MauThietKe',
    source: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class MauThietKe {
    public static void main(String[] args) throws Exception {

        try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<Integer>> phan = new ArrayList<>();
            for (int i = 0; i < 4; i++) {
                int batDau = i * 250 + 1, ketThuc = (i + 1) * 250;
                phan.add(pool.submit(() -> {
                    int s = 0;
                    for (int x = batDau; x <= ketThuc; x++) s += x;
                    return s;
                }));
            }
            int tong = 0;
            for (Future<Integer> f : phan) tong += f.get();
            System.out.println("1) fan-out/fan-in tong 1..1000 -> " + tong + " (dung? " + (tong == 500500) + ")");
        }

        ExecutorService pool = Executors.newFixedThreadPool(2);
        Future<String> cham = pool.submit(() -> { Thread.sleep(2000); return "ket qua that"; });
        String kq;
        try { kq = cham.get(200, TimeUnit.MILLISECONDS); }
        catch (TimeoutException e) { cham.cancel(true); kq = "gia tri du phong"; }
        System.out.println("2) timeout 200ms -> " + kq);

        Semaphore gioiHan = new Semaphore(2);
        AtomicInteger dinhCao = new AtomicInteger(), dangChay = new AtomicInteger();
        List<Callable<Void>> viec = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            viec.add(() -> {
                gioiHan.acquire();
                try {
                    int n = dangChay.incrementAndGet();
                    dinhCao.updateAndGet(cu -> Math.max(cu, n));
                    Thread.sleep(10);
                    dangChay.decrementAndGet();
                } finally { gioiHan.release(); }
                return null;
            });
        }
        ExecutorService p2 = Executors.newFixedThreadPool(10);
        p2.invokeAll(viec);
        System.out.println("3) Semaphore(2) -> so viec chay dong thoi cao nhat <= 2? " + (dinhCao.get() <= 2));

        AtomicInteger lanGoi = new AtomicInteger();
        String r = thuLai(3, () -> {
            if (lanGoi.incrementAndGet() < 3) throw new IllegalStateException("mang loi");
            return "thanh cong lan " + lanGoi.get();
        });
        System.out.println("4) retry -> " + r);

        pool.shutdown(); p2.shutdown();
        System.out.println("5) da dong het ho boi? " + (pool.isShutdown() && p2.isShutdown()));
    }

    static <T> T thuLai(int soLan, Callable<T> viec) throws Exception {
        Exception cuoi = null;
        for (int i = 0; i < soLan; i++) {
            try { return viec.call(); }
            catch (Exception e) { cuoi = e; Thread.sleep(10L * (1L << i)); }
        }
        throw cuoi;
    }
}`,
  },
};
