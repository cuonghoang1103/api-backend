import java.util.*;

// @thoi-gian
// Same experiment in Java: count words with a prefix by scanning, by a trie with counts, by binary search on a sorted array.
public class TrieDo {
    static class TNode { TNode[] next = new TNode[26]; int count; }
    static long seed;
    static int rnd(int m) { seed = (seed * 48271L) % 2147483647L; return (int) (seed % m); }
    static String[] makeWords(int n) {
        String[] out = new String[n];
        for (int i = 0; i < n; i++) {
            int len = 3 + rnd(8);
            StringBuilder sb = new StringBuilder();
            for (int k = 0; k < len; k++) sb.append((char) ('a' + rnd(6)));
            out[i] = sb.toString();
        }
        return out;
    }
    static TNode buildTrie(String[] words) {
        TNode root = new TNode();
        for (String w : words) {
            TNode node = root;
            for (int i = 0; i < w.length(); i++) {
                int c = w.charAt(i) - 'a';
                if (node.next[c] == null) node.next[c] = new TNode();
                node = node.next[c];
                node.count++;
            }
        }
        return root;
    }
    static int countTrie(TNode root, String p) {
        TNode node = root;
        for (int i = 0; i < p.length() && node != null; i++) node = node.next[p.charAt(i) - 'a'];
        return node == null ? 0 : node.count;
    }
    static int countScan(String[] words, String p) { int c = 0; for (String w : words) if (w.startsWith(p)) c++; return c; }
    static int lowerBound(String[] a, String x) { int lo = 0, hi = a.length; while (lo < hi) { int m = (lo + hi) >>> 1; if (a[m].compareTo(x) < 0) lo = m + 1; else hi = m; } return lo; }
    static int countSorted(String[] s, String p) { return lowerBound(s, p + "{") - lowerBound(s, p); }
    interface Job { long run(); }
    static double[] best(Job f, int lap) {
        double ms = Double.MAX_VALUE; long r = 0;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); r = f.run(); ms = Math.min(ms, (System.nanoTime() - t) / 1e6); }
        return new double[]{ms, r};
    }
    public static void main(String[] args) {
        int Q = 2_000;
        System.out.printf("%9s | %11s | %9s | %15s | %10s | same answers%n", "words", "scan", "trie", "sorted+bsearch", "trie nodes");
        for (int n : new int[]{10_000, 100_000, 1_000_000}) {
            seed = 2026;
            String[] words = makeWords(n);
            String[] queries = new String[Q];
            for (int i = 0; i < Q; i++) { String w = words[rnd(n)]; queries[i] = w.substring(0, Math.min(w.length(), 1 + rnd(4))); }
            TNode root = buildTrie(words);
            int nodes = 0; Deque<TNode> st = new ArrayDeque<>(); st.push(root);
            while (!st.isEmpty()) { TNode x = st.pop(); nodes++; for (TNode c : x.next) if (c != null) st.push(c); }
            String[] sorted = words.clone(); Arrays.sort(sorted);
            double[] a = n <= 100_000 ? best(() -> { long s = 0; for (String q : queries) s += countScan(words, q); return s; }, n == 100_000 ? 1 : 3) : new double[]{Double.NaN, Double.NaN};
            double[] b = best(() -> { long s = 0; for (String q : queries) s += countTrie(root, q); return s; }, 5);
            double[] c = best(() -> { long s = 0; for (String q : queries) s += countSorted(sorted, q); return s; }, 5);
            boolean ok = (Double.isNaN(a[1]) || a[1] == b[1]) && b[1] == c[1];
            System.out.printf("%9s | %11s | %9s | %15s | %10s | %s%n", String.format("%,d", n),
                Double.isNaN(a[0]) ? "skipped" : String.format("%.1f ms", a[0]), String.format("%.2f ms", b[0]),
                String.format("%.2f ms", c[0]), String.format("%,d", nodes), ok);
        }
        System.out.printf("%,d prefix queries per row · java %s · %s%n", Q, System.getProperty("java.version"), System.getProperty("os.arch"));
    }
}
