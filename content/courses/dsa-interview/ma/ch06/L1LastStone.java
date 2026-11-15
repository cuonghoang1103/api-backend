import java.util.*;

// LC 1046 · Last Stone Weight.
public class L1LastStone {
    // #region giai
    static int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> h = new PriorityQueue<>(Collections.reverseOrder());
        for (int s : stones) h.offer(s);
        while (h.size() > 1) {
            int y = h.poll(), x = h.poll();
            if (y != x) h.offer(y - x);
        }
        return h.isEmpty() ? 0 : h.peek();
    }
    // #endregion

    public static void main(String[] args) {
        int[][] cases = {{6, 9, 4, 1, 7}, {4, 4, 3, 2, 1}, {10, 3}, {5}, {2, 2}};
        for (int[] s : cases) System.out.println(Arrays.toString(s) + " -> " + lastStoneWeight(s));
    }
}
