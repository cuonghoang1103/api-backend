// Pipeline.java — producer–consumer: 1 luồng đọc (nhanh) → hàng đợi → K luồng xử lý (chậm hơn). Hàng đợi có giới hạn
// hay không? Đo độ sâu hàng đợi lớn nhất, heap lớn nhất, và tổng thời gian.
//   java -Xmx256m Pipeline.java bounded|unbounded LINES K
// Kết thúc bằng "viên thuốc độc" (poison pill): producer đặt K dấu END, mỗi consumer gặp END thì dừng.
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Pipeline {
    static final String END = new String("END");          // so bằng ==, không trùng dòng thật nào

    public static void main(String[] a) throws Exception {
        boolean bounded = a[0].equals("bounded");
        int lines = Integer.parseInt(a[1]), k = Integer.parseInt(a[2]);
        BlockingQueue<String> q = bounded ? new ArrayBlockingQueue<>(1024) : new LinkedBlockingQueue<>();
        AtomicLong errors = new AtomicLong(), died = new AtomicLong(), maxDepth = new AtomicLong(), maxHeap = new AtomicLong();
        Runtime rt = Runtime.getRuntime();
        Thread mon = Thread.ofPlatform().daemon().start(() -> {           // lấy mẫu mỗi 20 ms
            while (true) {
                maxDepth.accumulateAndGet(q.size(), Math::max);
                maxHeap.accumulateAndGet(rt.totalMemory() - rt.freeMemory(), Math::max);
                try { Thread.sleep(20); } catch (InterruptedException e) { return; }
            }
        });
        long t0 = System.nanoTime();
        Thread[] cs = new Thread[k];
        for (int i = 0; i < k; i++) cs[i] = Thread.ofPlatform().start(() -> {
            try {
                for (String s; (s = q.take()) != END; ) {                    // take(): chờ khi hàng RỖNG
                    if (s.matches(".*\" (5\\d\\d) .*")) errors.incrementAndGet();   // "xử lý" một dòng: regex chậm cố ý
                }
            } catch (InterruptedException e) {
            } catch (OutOfMemoryError e) { died.incrementAndGet(); }            // consumer chết — không cấp phát gì thêm
        });
        try {
            for (int i = 0; i < lines; i++)                                  // put(): chờ khi hàng ĐẦY (chỉ với bounded)
                q.put("10.0." + (i & 255) + ".7 - - [29/Oct/2026] \"GET /api/v1/feed?page=" + i + " HTTP/1.1\" " + (i % 50 == 0 ? 503 : 200) + " 512");
            for (int i = 0; i < k; i++) q.put(END);
            for (Thread c : cs) c.join();
        } catch (OutOfMemoryError e) {
            int depth = q.size();
            q.clear();                                                       // nhả bộ nhớ trước, để còn in được
            System.out.printf("%-9s producer: OutOfMemoryError after %.0f ms — %,d lines were waiting in the queue%n", a[0], (System.nanoTime() - t0) / 1e6, depth);
            System.exit(1);
        }
        if (died.get() > 0) System.out.printf("%-9s %d of %d consumers DIED with OutOfMemoryError%n", a[0], died.get(), k);
        System.out.printf("%-9s lines=%,d errors=%,d  max queue depth=%,d  max heap=%,d MB  %6.0f ms%n", a[0], lines, errors.get(),
                maxDepth.get(), maxHeap.get() >> 20, (System.nanoTime() - t0) / 1e6);
    }
}
