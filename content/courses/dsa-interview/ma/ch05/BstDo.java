import java.util.*;

// @thoi-gian
// Same experiment in Java, plus java.util.TreeMap (a red-black tree: it rebalances itself) on the SORTED input.
public class BstDo {
    static class Node { int key; Node left, right; Node(int k) { key = k; } }
    static Node insert(Node root, int key) {
        Node fresh = new Node(key);
        if (root == null) return fresh;
        Node cur = root;
        while (true) {
            if (key < cur.key) { if (cur.left == null) { cur.left = fresh; break; } cur = cur.left; }
            else { if (cur.right == null) { cur.right = fresh; break; } cur = cur.right; }
        }
        return root;
    }
    static int height(Node root) {
        int h = 0; List<Node> level = new ArrayList<>(); if (root != null) level.add(root);
        while (!level.isEmpty()) { h++; List<Node> next = new ArrayList<>(); for (Node n : level) { if (n.left != null) next.add(n.left); if (n.right != null) next.add(n.right); } level = next; }
        return h;
    }
    static int[] shuffled(int n) {
        int[] a = new int[n]; for (int i = 0; i < n; i++) a[i] = i;
        long s = 12345;
        for (int i = n - 1; i > 0; i--) { s = (s * 48271L) % 2147483647L; int j = (int) (s % (i + 1)); int t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
    }
    static Node last;
    static double run(int[] keys) {
        double best = Double.MAX_VALUE;
        for (int k = 0; k < 3; k++) {
            long t = System.nanoTime(); Node root = null;
            for (int x : keys) root = insert(root, x);
            best = Math.min(best, (System.nanoTime() - t) / 1e6); last = root;
        }
        return best;
    }
    static double treeMap(int[] keys) {
        double best = Double.MAX_VALUE;
        for (int k = 0; k < 3; k++) {
            long t = System.nanoTime(); TreeMap<Integer, Integer> m = new TreeMap<>();
            for (int x : keys) m.put(x, x);
            best = Math.min(best, (System.nanoTime() - t) / 1e6);
        }
        return best;
    }
    public static void main(String[] args) {
        System.out.printf("%9s | %13s %7s | %15s %7s | %15s%n", "n", "sorted: time", "height", "shuffled: time", "height", "TreeMap sorted");
        for (int n : new int[]{1_000, 10_000, 50_000, 1_000_000}) {
            int[] sorted = new int[n]; for (int i = 0; i < n; i++) sorted[i] = i;
            String st = "skipped", sh = "-";
            if (n <= 50_000) { st = String.format("%.1f ms", run(sorted)); sh = String.format("%,d", height(last)); }
            String rt = String.format("%.1f ms", run(shuffled(n)));
            int rh = height(last);
            System.out.printf("%9s | %13s %7s | %15s %7d | %15s%n", String.format("%,d", n), st, sh, rt, rh, String.format("%.1f ms", treeMap(sorted)));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
