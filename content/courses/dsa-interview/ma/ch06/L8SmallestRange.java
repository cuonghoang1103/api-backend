import java.util.*;

// LC 632 · Smallest Range Covering Elements from K Lists.
public class L8SmallestRange {
    // #region giai
    static int[] smallestRange(List<List<Integer>> nums) {
        PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0])); // {value, list, index}
        int curMax = Integer.MIN_VALUE;
        for (int k = 0; k < nums.size(); k++) {
            int v = nums.get(k).get(0);
            h.offer(new int[]{v, k, 0});
            curMax = Math.max(curMax, v);
        }
        int[] best = {h.peek()[0], curMax};
        while (true) {
            int[] t = h.poll();
            if ((long) curMax - t[0] < (long) best[1] - best[0]) best = new int[]{t[0], curMax};
            if (t[2] + 1 == nums.get(t[1]).size()) break;
            int nx = nums.get(t[1]).get(t[2] + 1);
            h.offer(new int[]{nx, t[1], t[2] + 1});
            curMax = Math.max(curMax, nx);
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        int[][][] cases = {{{1, 9, 17}, {4, 10, 22}, {6, 11, 20}}, {{1, 2, 3}, {1, 2, 3}, {1, 2, 3}}, {{10}, {3, 11}, {5, 12, 30}}};
        for (int[][] c : cases) {
            List<List<Integer>> nums = new ArrayList<>();
            StringBuilder sb = new StringBuilder("[");
            for (int k = 0; k < c.length; k++) {
                List<Integer> l = new ArrayList<>();
                for (int x : c[k]) l.add(x);
                nums.add(l);
                sb.append(k > 0 ? "," : "").append(l);
            }
            System.out.println(sb.append("]") + " -> " + Arrays.toString(smallestRange(nums)));
        }
    }
}
