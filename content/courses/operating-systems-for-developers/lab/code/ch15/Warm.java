// Warm.java — cùng một việc (báo cáo 4 000 đơn, bản đã sửa dùng HashSet) chạy 10 vòng × 300 lần, in thời gian từng vòng.
// Vòng đầu chậm vì JVM còn THÔNG DỊCH; JIT (C1 rồi C2) biên dịch dần mã nóng ⇒ vòng sau nhanh hơn (bài 15.6).
//   java Warm.java
import java.util.*;

public class Warm {
  public static void main(String[] a) {
    String[] cust = new String[20000];
    long[] cents = new long[20000];
    for (int i = 0; i < 20000; i++) { cust[i] = String.format("C-%05d", (i * 7919L) % 2500); cents[i] = 1000 + (i * 104729L) % 90000; }
    long sink = 0;
    for (int round = 1; round <= 10; round++) {
      long t = System.nanoTime();
      for (int r = 0; r < 300; r++) {
        Set<String> s = new HashSet<>();
        Map<String, Long> tot = new HashMap<>();
        for (int i = 0; i < 4000; i++) { s.add(cust[i]); tot.merge(cust[i], cents[i], Long::sum); }
        sink += s.size() + tot.size();
      }
      System.out.printf("round %2d: %6.1f ms%n", round, (System.nanoTime() - t) / 1e6);
    }
    if (sink == 42) System.out.println();
  }
}
