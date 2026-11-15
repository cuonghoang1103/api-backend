import java.util.*;

// @thoi-gian
// "HashMap is O(1)" is an AVERAGE. Give it a key whose hashCode() always collides and watch it degrade.
public class VaChamBam {
    // #region khoa
    static final class GoodKey {
        final int v;
        GoodKey(int v) { this.v = v; }
        @Override public int hashCode() { return Integer.hashCode(v); }
        @Override public boolean equals(Object o) { return o instanceof GoodKey && ((GoodKey) o).v == v; }
    }
    static final class BadKey {               // every key lands in the SAME bucket
        final int v;
        BadKey(int v) { this.v = v; }
        @Override public int hashCode() { return 42; }
        @Override public boolean equals(Object o) { return o instanceof BadKey && ((BadKey) o).v == v; }
    }
    // #endregion
    static double fill(boolean bad, int n) {
        long t = System.nanoTime();
        Map<Object, Integer> m = new HashMap<>();
        for (int i = 0; i < n; i++) m.put(bad ? new BadKey(i) : new GoodKey(i), i);
        for (int i = 0; i < n; i++) m.get(bad ? new BadKey(i) : new GoodKey(i));
        return (System.nanoTime() - t) / 1e6;
    }
    public static void main(String[] args) {
        fill(false, 50_000); fill(true, 2_000);   // warm up the JIT
        System.out.printf("%8s | %14s | %16s%n", "n", "good hashCode", "hashCode() = 42");
        for (int n : new int[]{1_000, 5_000, 20_000, 40_000}) {
            System.out.printf("%8s | %11.1f ms | %13.1f ms%n", String.format("%,d", n), fill(false, n), fill(true, n));
        }
    }
}
