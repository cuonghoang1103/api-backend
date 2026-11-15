import java.util.*;
import java.util.function.IntPredicate;

// Largest batch size that fits in GPU memory: galloping + firstTrue. Simulated memory model (reproducible).
public class NguongBatch {
    static final int GPU_MB = 24_576;
    static int probes = 0;
    static List<String> log = new ArrayList<>();
    static boolean fits(int batch) {
        probes++;
        long usedMb = 1_830 + 42L * batch;
        boolean ok = usedMb <= GPU_MB;
        log.add(batch + (ok ? "" : "!"));
        return ok;
    }
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region gallop
    static int largestBatch() {
        int good = 1;
        if (!fits(good)) return 0;
        while (fits(good * 2)) good *= 2;
        return firstTrue(good + 1, good * 2, b -> !fits(b)) - 1;
    }
    // #endregion
    public static void main(String[] args) {
        int best = largestBatch();
        System.out.println("largest batch that fits: " + best + "  (uses " + (1_830 + 42 * best) + " MB of " + GPU_MB + "; " + (best + 1) + " would need " + (1_830 + 42 * (best + 1)) + " MB)");
        System.out.println("probes: " + probes + "   order tried (! = out of memory): " + String.join(" ", log));
        System.out.println("a linear search 1, 2, 3, ... would launch " + (best + 1) + " steps");
    }
}
