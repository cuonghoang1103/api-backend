import java.lang.management.*;
import java.util.*;

// Gc.java — keep ~60 MB alive and churn through 4 GB of short-lived garbage, then report the collector's work.
public class Gc {
    public static void main(String[] a) {
        List<byte[]> live = new ArrayList<>();
        for (int i = 0; i < 60; i++) live.add(new byte[1 << 20]);           // 60 MB that stays
        byte[][] recent = new byte[1024][];                                    // like requests in flight
        long t0 = System.nanoTime(), sink = 0;
        for (int i = 0; i < 4_000_000; i++) {
            byte[] tmp = new byte[1024];                                      // 1 KB garbage, 4M times
            recent[i & 1023] = tmp;                                           // escapes, so the JIT can't skip it
            sink += tmp.length;
            if (i % 40_000 == 0) live.set(i / 40_000 % 60, new byte[1 << 20]); // old data slowly replaced
        }
        System.out.printf("max heap %d MB, allocated %d MB of garbage in %d ms%n",
            Runtime.getRuntime().maxMemory() >> 20, sink >> 20, (System.nanoTime() - t0) / 1_000_000);
        for (GarbageCollectorMXBean g : ManagementFactory.getGarbageCollectorMXBeans())
            System.out.printf("  %-24s %4d collections, %5d ms total%n", g.getName(), g.getCollectionCount(), g.getCollectionTime());
    }
}
