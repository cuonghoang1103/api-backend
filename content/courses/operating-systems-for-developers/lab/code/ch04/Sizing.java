// Sizing.java — chọn số luồng bằng đo. Mỗi việc: đốt C ms CPU (đo bằng ĐỒNG HỒ CPU của luồng, không phải đồng hồ tường)
// rồi chờ W ms (như gọi CSDL). Chạy cùng 200 việc trên pool có cỡ khác nhau, in thông lượng.
//   java Sizing.java C_MS W_MS size1 size2 …
// Công thức (Goetz, Java Concurrency in Practice): N_threads ≈ N_cpu × (1 + W/C)
import java.lang.management.*;
import java.util.*;
import java.util.concurrent.*;

public class Sizing {
    static final ThreadMXBean MX = ManagementFactory.getThreadMXBean();

    static void burnCpu(long ms) {                       // đúng ms mili-giây CPU của CHÍNH luồng này
        long end = MX.getCurrentThreadCpuTime() + ms * 1_000_000;
        long x = 0;
        while (MX.getCurrentThreadCpuTime() < end) for (int i = 0; i < 1000; i++) x += i;
        if (x == 42) System.out.print("");
    }

    public static void main(String[] a) throws Exception {
        long c = Long.parseLong(a[0]), w = Long.parseLong(a[1]);
        int cpus = Runtime.getRuntime().availableProcessors(), tasks = 200;
        System.out.printf("cpus=%d  C=%d ms  W=%d ms  formula: %d x (1 + %d/%d) = %d threads%n",
                cpus, c, w, cpus, w, c, cpus * (1 + w / c));
        for (int i = 2; i < a.length; i++) {
            int n = Integer.parseInt(a[i]);
            for (int run = 0; run < 2; run++) {           // lần 0 khởi động JIT, in lần 1
                ExecutorService ex = Executors.newFixedThreadPool(n);
                long t0 = System.nanoTime();
                List<Future<?>> fs = new ArrayList<>();
                for (int k = 0; k < tasks; k++) fs.add(ex.submit(() -> { burnCpu(c); try { Thread.sleep(w); } catch (InterruptedException e) {} }));
                for (Future<?> f : fs) f.get();
                double ms = (System.nanoTime() - t0) / 1e6;
                ex.shutdown();
                if (run == 1) System.out.printf("pool %3d threads: %4.0f tasks/s  %5.0f ms%n", n, tasks / ms * 1000, ms);
            }
        }
    }
}
