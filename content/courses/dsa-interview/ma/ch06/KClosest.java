import java.util.*;

// LC 973 · K Closest Points to Origin — max-heap of size k on squared distance.
public class KClosest {
    // #region giai
    static int[][] kClosest(int[][] points, int k) {
        PriorityQueue<int[]> h = new PriorityQueue<>(
            (a, b) -> Integer.compare(b[0] * b[0] + b[1] * b[1], a[0] * a[0] + a[1] * a[1])); // farthest on top
        for (int[] p : points) {
            h.offer(p);
            if (h.size() > k) h.poll();
        }
        int[][] out = new int[h.size()][];
        for (int i = out.length - 1; i >= 0; i--) out[i] = h.poll();   // fill from the back: closest first
        return out;
    }
    // #endregion

    public static void main(String[] args) {
        int[][][] cases = {
            {{3, 3}, {5, -1}, {-2, 4}, {1, 1}, {0, -2}, {2, 2}},
            {{2, 3}, {-1, 2}},
            {{0, 1}, {1, 0}, {2, 2}},
            {{10000, 10000}, {-10000, -10000}, {1, -1}},
        };
        int[] ks = {3, 1, 2, 1};
        for (int t = 0; t < cases.length; t++) System.out.println("k=" + ks[t] + ": " + Arrays.deepToString(kClosest(cases[t], ks[t])));
    }
}
