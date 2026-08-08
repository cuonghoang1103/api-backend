/**
 * Thẻ bài học "100 Ngày Java" — Ngày 44: Luồng ảo (Java 21).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-44.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Phép đo in ra NGƯỠNG ("dưới 5s? true")
 * chứ không in số giây — số đó đổi theo máy và thẻ so khớp từng dòng.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 44,
  total: 100,
  titleLead: 'Java Day 44:',
  titleAccent: 'Luồng ảo',
  subtitle: 'Java 21 — một triệu luồng cũng không sao 🪶',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NHẸ TỚI MỨC KHÔNG CẦN TIẾT KIỆM 🪶',
      code: `Thread ao = Thread.ofVirtual().name("ao-1").start(() -> …);
ao.isVirtual();   // true

// luong OS: ~1MB stack, tao cham
// luong ao : vai tram byte, tao gan nhu tuc thi`,
      notes: [
        { mark: 'ok', text: 'JVM quản lý, không phải hệ điều hành — nên rẻ hơn hàng nghìn lần' },
        { mark: 'dot', text: 'Vẫn là `Thread` thật: `join`, `sleep`, `synchronized` dùng y như cũ' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. MƯỜI NGHÌN VIỆC CHỜ MẠNG ⚡',
      code: `try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++)
        pool.submit(() -> { Thread.sleep(50); return null; });
}   // close() doi tat ca xong
// tuan tu se mat 500s -> thuc te duoi 5s`,
      notes: [
        { mark: 'ok', text: 'Mỗi việc MỘT luồng ảo — không cần tính "hồ bơi bao nhiêu luồng" nữa' },
        { mark: 'dot', text: '`ExecutorService` nay là `AutoCloseable` → dùng `try(...)` của **Ngày 23**' },
      ],
    },
    {
      tone: 'pink',
      title: '3. VIẾT TUẦN TỰ, CHẠY SONG SONG 📖',
      code: `Thread.sleep(30);        // luong AO nhuong cho, luong OS KHONG bi chan
String s = f.get();      // van doc tu tren xuong duoi`,
      notes: [
        { mark: 'ok', text: 'Không callback, không dây chuyền — code dễ đọc như **Ngày 41**' },
        { mark: 'ok', text: 'Gỡ lỗi dễ hơn hẳn `CompletableFuture`: stack trace là stack thật' },
      ],
    },
    {
      tone: 'green',
      title: '4. DÙNG KHI NÀO 🧭',
      code: `// ✓ viec CHO DOI: goi API, truy van DB, doc file
// ✗ viec NANG CPU: tinh toan, ma hoa, nen anh
//   -> van dung newFixedThreadPool(so nhan)`,
      notes: [
        { mark: 'no', text: 'Luồng ảo KHÔNG làm CPU nhanh hơn — nó chỉ bỏ chi phí chờ' },
        { mark: 'no', text: 'Đừng gộp luồng ảo vào hồ bơi cố định: mất hết ý nghĩa' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Java 21+ và việc chờ I/O ⇒ mỗi việc một luồng ảo, khỏi đếm luồng' },
        { mark: 'next', text: '**Ngày 45**: khoá nâng cao — `ReentrantLock`, `Semaphore`, deadlock' },
      ],
    },
  ],

  /* Output THẬT của `java LuongAo` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) luong ao? true | ten ao-1',
      '2) luong he dieu hanh, isVirtual? false',
      '3) 10000 luong ao, hoan thanh du? true',
      '4) tuan tu se mat 500s, thuc te duoi 5s? true',
      '5) so nhan CPU it hon 10000 lan? true',
      '6) viet tuan tu, chay song song -> api-1 api-2 api-3',
    ],
  },

  verify: {
    className: 'LuongAo',
    source: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class LuongAo {
    public static void main(String[] args) throws Exception {
        Thread ao = Thread.ofVirtual().name("ao-1").start(() -> {});
        ao.join();
        System.out.println("1) luong ao? " + ao.isVirtual() + " | ten " + ao.getName());

        Thread nen = Thread.ofPlatform().name("he-dieu-hanh").unstarted(() -> {});
        System.out.println("2) luong he dieu hanh, isVirtual? " + nen.isVirtual());

        final int SO = 10_000;
        AtomicInteger xong = new AtomicInteger();
        long t = System.nanoTime();
        try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < SO; i++) {
                pool.submit(() -> { Thread.sleep(50); xong.incrementAndGet(); return null; });
            }
        }
        long giay = (System.nanoTime() - t) / 1_000_000_000;
        System.out.println("3) " + SO + " luong ao, hoan thanh du? " + (xong.get() == SO));
        System.out.println("4) tuan tu se mat " + (SO * 50 / 1000) + "s, thuc te duoi 5s? " + (giay < 5));

        System.out.println("5) so nhan CPU it hon 10000 lan? " + (Runtime.getRuntime().availableProcessors() < 10_000));

        try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<String>> ds = new ArrayList<>();
            for (int i = 1; i <= 3; i++) {
                int n = i;
                ds.add(pool.submit(() -> { Thread.sleep(30); return "api-" + n; }));
            }
            StringBuilder sb = new StringBuilder();
            for (Future<String> f : ds) sb.append(f.get()).append(" ");
            System.out.println("6) viet tuan tu, chay song song -> " + sb.toString().trim());
        }
    }
}`,
  },
};
