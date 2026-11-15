import java.util.*;

// LC 1353 · Maximum Number of Events That Can Be Attended.
public class L6MaxEvents {
    // #region giai
    static int maxEvents(int[][] events) {
        int[][] s = events.clone();
        Arrays.sort(s, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> ends = new PriorityQueue<>();
        int lastDay = 0;
        for (int[] e : s) lastDay = Math.max(lastDay, e[1]);
        int i = 0, attended = 0;
        for (int day = 1; day <= lastDay; day++) {
            while (i < s.length && s[i][0] == day) ends.offer(s[i++][1]);
            while (!ends.isEmpty() && ends.peek() < day) ends.poll();
            if (!ends.isEmpty()) { ends.poll(); attended++; }
        }
        return attended;
    }
    // #endregion

    static String show(int[][] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(a[i]));
        return sb.append("]").toString();
    }
    public static void main(String[] args) {
        int[][][] cases = {{{1, 3}, {1, 3}, {1, 3}, {2, 2}, {4, 4}}, {{1, 1}, {1, 1}, {1, 1}}, {{1, 5}, {1, 1}, {2, 2}, {2, 3}}, {{3, 4}, {1, 2}}};
        for (int[][] ev : cases) System.out.println(show(ev) + " -> " + maxEvents(ev));
    }
}
