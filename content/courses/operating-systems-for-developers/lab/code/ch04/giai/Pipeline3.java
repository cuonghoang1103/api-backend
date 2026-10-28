// giai/Pipeline3.java — LỜI GIẢI bài tự viết 4.7: đường ống BA tầng có giới hạn + hạn chót cho cả việc.
//   reader (1 luồng) → [hàng 1024] → parser (K luồng) → [hàng 1024] → aggregator (1 luồng)
//   java Pipeline3.java FILE K DEADLINE_MS
// Kết thúc êm: reader đặt K viên thuốc độc, mỗi parser chuyển MỘT viên sang hàng sau rồi dừng; aggregator đếm đủ K
// viên thì xong. Quá hạn: shutdownNow() ⇒ interrupt mọi luồng (take/put đều ném InterruptedException) ⇒ in kết quả DỞ.
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

public class Pipeline3 {
    static final String END = new String("END");
    public static void main(String[] a) throws Exception {
        Path file = Path.of(a[0]);
        int k = Integer.parseInt(a[1]);
        long deadline = Long.parseLong(a[2]);
        BlockingQueue<String> lines = new ArrayBlockingQueue<>(1024);
        BlockingQueue<Object> codes = new ArrayBlockingQueue<>(1024);
        Map<String, Long> counts = new ConcurrentHashMap<>();
        ExecutorService ex = Executors.newFixedThreadPool(k + 2);
        long t0 = System.nanoTime();
        ex.submit(() -> {                                                   // tầng 1: đọc
            try (BufferedReader r = Files.newBufferedReader(file)) {
                for (String l; (l = r.readLine()) != null; ) lines.put(l);
                for (int i = 0; i < k; i++) lines.put(END);
            } catch (IOException | InterruptedException e) { }
            return null;
        });
        for (int i = 0; i < k; i++) ex.submit(() -> {                        // tầng 2: tách mã status
            try {
                for (String l; (l = lines.take()) != END; ) {
                    int q = l.indexOf('"', l.indexOf('"') + 1);
                    codes.put(l.substring(q + 2, q + 5));
                }
                codes.put(END);
            } catch (InterruptedException e) { }
            return null;
        });
        Future<?> agg = ex.submit(() -> {                                    // tầng 3: cộng dồn
            try {
                int ends = 0;
                while (ends < k) {
                    Object c = codes.take();
                    if (c == END) ends++; else counts.merge((String) c, 1L, Long::sum);
                }
            } catch (InterruptedException e) { }
            return null;
        });
        String how;
        try { agg.get(deadline, TimeUnit.MILLISECONDS); how = "finished"; }
        catch (TimeoutException e) { how = "DEADLINE — cancelled, partial result"; }
        ex.shutdownNow();                                                    // interrupt những ai còn chạy
        boolean clean = ex.awaitTermination(2, TimeUnit.SECONDS);
        long total = counts.values().stream().mapToLong(Long::longValue).sum();
        System.out.printf("%s after %.0f ms: %,d lines counted %s; all threads stopped: %s%n", how,
                (System.nanoTime() - t0) / 1e6, total, new TreeMap<>(counts), clean);
    }
}
