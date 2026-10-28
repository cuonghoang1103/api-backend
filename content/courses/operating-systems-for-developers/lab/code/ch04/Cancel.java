// Cancel.java — hạn chờ và huỷ việc trong Java. Huỷ là HỢP TÁC: Java chỉ ĐẶT CỜ interrupt, việc phải tự nhìn cờ đó.
//   java Cancel.java sleep     việc chờ 2 s (như gọi mạng) · get(300 ms) hết hạn → cancel(true)
//   java Cancel.java spin      việc đốt CPU, KHÔNG xem cờ interrupt · cancel(true) "thành công" mà việc vẫn chạy
//   java Cancel.java check     như spin nhưng vòng lặp xem Thread.interrupted() mỗi vòng
//   java Cancel.java http      HttpRequest.timeout(300 ms) cho một API trả lời sau 2 s
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

public class Cancel {
    static long t0 = System.nanoTime();
    static String at() { return String.format("[%4d ms]", (System.nanoTime() - t0) / 1_000_000); }

    public static void main(String[] a) throws Exception {
        String mode = a[0];
        if (mode.equals("http")) {
            HttpRequest r = HttpRequest.newBuilder(URI.create("http://localhost:9000/?ms=2000")).timeout(Duration.ofMillis(300)).build();
            try { HttpClient.newHttpClient().send(r, HttpResponse.BodyHandlers.ofString()); }
            catch (HttpTimeoutException e) { System.out.println(at() + " " + e); }
            return;
        }
        ExecutorService ex = Executors.newSingleThreadExecutor();
        AtomicLong progress = new AtomicLong(), stoppedAt = new AtomicLong(-1);
        Future<?> f = ex.submit(() -> {
            if (mode.equals("sleep")) {
                try { Thread.sleep(2000); }
                catch (InterruptedException e) { stoppedAt.set((System.nanoTime() - t0) / 1_000_000); }   // sleep() ném khi bị interrupt
            } else {
                while (progress.incrementAndGet() > 0) {
                    if (mode.equals("check") && Thread.interrupted()) { stoppedAt.set((System.nanoTime() - t0) / 1_000_000); return; }
                }
            }
        });
        try { f.get(300, TimeUnit.MILLISECONDS); }
        catch (TimeoutException e) { System.out.println(at() + " get() timed out → cancel(true): " + f.cancel(true) + ", isCancelled=" + f.isCancelled()); }
        long p1 = progress.get();
        Thread.sleep(500);
        System.out.println(at() + (stoppedAt.get() < 0 ? " the task never noticed the cancel" : " the task stopped itself at " + stoppedAt.get() + " ms"));
        if (!mode.equals("sleep")) System.out.printf("%s 500 ms after cancel the task did %,d more iterations%n", at(), progress.get() - p1);
        ex.shutdownNow();
        System.out.println(at() + " awaitTermination(1 s): " + ex.awaitTermination(1, TimeUnit.SECONDS));
        System.exit(0);
    }
}
