// Vt.java — 10 000 việc "chờ I/O" (ngủ 2 s): luồng nền tảng (1 việc = 1 luồng nhân) vs virtual thread (Java 21).
import java.nio.file.*;
import java.util.concurrent.*;

public class Vt {
    static String status() throws Exception {
        StringBuilder sb = new StringBuilder();
        for (String l : Files.readAllLines(Path.of("/proc/self/status")))
            if (l.startsWith("Threads:") || l.startsWith("VmRSS:")) sb.append(l.replaceAll("\\s+", " ")).append("  ");
        return sb.toString();
    }
    public static void main(String[] a) throws Exception {
        String mode = a[0];
        int n = Integer.parseInt(a[1]);
        long t0 = System.nanoTime();
        ExecutorService ex = mode.equals("virtual")
            ? Executors.newVirtualThreadPerTaskExecutor()
            : Executors.newThreadPerTaskExecutor(Thread.ofPlatform().factory());
        for (int i = 0; i < n; i++) ex.submit(() -> { Thread.sleep(2000); return null; });
        Thread.sleep(1000);
        System.out.printf("%-8s tasks=%d  while waiting: %s%n", mode, n, status());
        ex.shutdown();
        ex.awaitTermination(1, TimeUnit.MINUTES);
        System.out.printf("%-8s all done in %d ms%n", mode, (System.nanoTime() - t0) / 1_000_000);
    }
}
