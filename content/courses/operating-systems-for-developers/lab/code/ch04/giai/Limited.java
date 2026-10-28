// giai/Limited.java — LỜI GIẢI bài tự viết 4.2: gọi API chậm 300 lần bằng virtual thread, nhưng KHÔNG BAO GIỜ quá 20
// lời gọi cùng lúc (API bên kia — hay pool CSDL — chỉ chịu được chừng đó). Virtual thread rẻ ⇒ giới hạn phải tự đặt.
//   java Limited.java 300 20
import java.net.URI;
import java.net.http.*;
import java.util.*;
import java.util.concurrent.*;

public class Limited {
    public static void main(String[] a) throws Exception {
        int n = Integer.parseInt(a[0]), limit = Integer.parseInt(a[1]);
        HttpClient http = HttpClient.newHttpClient();
        HttpRequest req = HttpRequest.newBuilder(URI.create("http://localhost:9000/?ms=100")).build();
        http.send(HttpRequest.newBuilder(URI.create("http://localhost:9000/stats")).build(), HttpResponse.BodyHandlers.discarding()); // đặt lại bộ đếm của server
        Semaphore permits = new Semaphore(limit);                        // tối đa `limit` người được vào cùng lúc
        long t0 = System.nanoTime();
        int ok = 0;
        try (ExecutorService ex = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<String>> fs = new ArrayList<>();
            for (int i = 0; i < n; i++) fs.add(ex.submit(() -> {
                permits.acquire();                                       // chờ tới lượt (virtual thread chờ rẻ)
                try { return http.send(req, HttpResponse.BodyHandlers.ofString()).body(); }
                finally { permits.release(); }                           // LUÔN trả chỗ, kể cả khi lỗi
            }));
            for (Future<String> f : fs) if (f.get().startsWith("ok")) ok++;
        }
        String stats = http.send(HttpRequest.newBuilder(URI.create("http://localhost:9000/stats")).build(), HttpResponse.BodyHandlers.ofString()).body().trim();
        System.out.printf("calls=%d ok=%d limit=%d server %s  %6.0f ms%n", n, ok, limit, stats, (System.nanoTime() - t0) / 1e6);
    }
}
