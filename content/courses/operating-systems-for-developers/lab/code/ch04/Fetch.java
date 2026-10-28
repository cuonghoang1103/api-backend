// Fetch.java — việc I/O: gọi API chậm (slow.js, mỗi lời gọi chờ 100 ms) N lần, bằng bốn cách.
//   java Fetch.java MODE N [T]     MODE = seq | pool (T luồng) | virtual | async
import java.lang.management.ManagementFactory;
import java.net.URI;
import java.net.http.*;
import java.util.*;
import java.util.concurrent.*;

public class Fetch {
    static final HttpClient http = HttpClient.newHttpClient();
    static final HttpRequest req = HttpRequest.newBuilder(URI.create("http://localhost:9000/?ms=100")).build();

    static String call() {
        try { return http.send(req, HttpResponse.BodyHandlers.ofString()).body(); }
        catch (Exception e) { throw new RuntimeException(e); }
    }

    public static void main(String[] args) throws Exception {
        String mode = args[0];
        int n = Integer.parseInt(args[1]);
        int t = args.length > 2 ? Integer.parseInt(args[2]) : 0;
        long t0 = System.nanoTime();
        int ok = 0;
        switch (mode) {
            case "seq" -> { for (int i = 0; i < n; i++) if (call().startsWith("ok")) ok++; }
            case "pool", "virtual" -> {
                try (ExecutorService ex = mode.equals("pool") ? Executors.newFixedThreadPool(t)
                                                              : Executors.newVirtualThreadPerTaskExecutor()) {
                    List<Future<String>> fs = new ArrayList<>();
                    for (int i = 0; i < n; i++) fs.add(ex.submit(Fetch::call));
                    for (Future<String> f : fs) if (f.get().startsWith("ok")) ok++;
                }
            }
            case "async" -> {   // không luồng nào bị chặn: HttpClient tự chờ trên selector (epoll) của nó
                List<CompletableFuture<String>> fs = new ArrayList<>();
                for (int i = 0; i < n; i++) fs.add(http.sendAsync(req, HttpResponse.BodyHandlers.ofString()).thenApply(HttpResponse::body));
                for (CompletableFuture<String> f : fs) if (f.join().startsWith("ok")) ok++;
            }
            default -> throw new IllegalArgumentException(mode);
        }
        int peak = ManagementFactory.getThreadMXBean().getPeakThreadCount();   // luồng NỀN TẢNG (= luồng nhân) cao nhất
        System.out.printf("%-7s %s calls=%d ok=%d  peak platform threads=%d  %6.0f ms%n",
                mode, t > 0 ? "x" + t : "   ", n, ok, peak, (System.nanoTime() - t0) / 1e6);
    }
}
