// giai/FalseShare.java — LỜI GIẢI bài tự viết 4.6: false sharing trong Java. 4 luồng, mỗi luồng tăng ĐẾM RIÊNG 50 triệu lần.
//   adjacent: bốn AtomicLong nằm sát nhau trong một AtomicLongArray (chỉ số 0,1,2,3 — cùng một dòng cache)
//   padded  : cùng mảng nhưng chỉ số 0,16,32,48 (cách nhau 16 long = 128 byte = một dòng cache của Apple M1)
//   adder   : một LongAdder dùng chung (JDK tự rải ra nhiều ô có đệm khi có tranh chấp)
//   local   : biến cục bộ trong luồng, cuối cùng mới cộng vào kết quả — không chia sẻ gì cả
import java.util.concurrent.atomic.*;

public class FalseShare {
    static final int T = 4; static final long N = 50_000_000L;

    static long run(String mode) throws Exception {
        AtomicLongArray arr = new AtomicLongArray(16 * T);
        LongAdder adder = new LongAdder();
        AtomicLong total = new AtomicLong();
        int stride = mode.equals("padded") ? 16 : 1;
        Thread[] th = new Thread[T];
        long t0 = System.nanoTime();
        for (int i = 0; i < T; i++) {
            final int slot = i * stride;
            th[i] = new Thread(() -> {
                switch (mode) {
                    case "adder" -> { for (long k = 0; k < N; k++) adder.increment(); }
                    case "local" -> { long x = 0; for (long k = 0; k < N; k++) x++; total.addAndGet(x); }
                    default -> { for (long k = 0; k < N; k++) arr.incrementAndGet(slot); }
                }
            });
            th[i].start();
        }
        for (Thread t : th) t.join();
        long ms = (System.nanoTime() - t0) / 1_000_000;
        long sum = mode.equals("adder") ? adder.sum() : mode.equals("local") ? total.get() : 0;
        if (sum == 0) for (int i = 0; i < arr.length(); i++) sum += arr.get(i);
        System.out.printf("%-8s sum=%,d  %5d ms%n", mode, sum, ms);
        return ms;
    }
    public static void main(String[] a) throws Exception {
        for (String m : new String[] {"adjacent", "padded", "adder", "local"}) run(m);
    }
}
