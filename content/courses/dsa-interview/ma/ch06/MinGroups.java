import java.util.*;

// Minimum rooms / groups: min-heap of end times, or a +1/-1 sweep. closed = LC 2406, half-open = meeting rooms.
public class MinGroups {
    // #region heap
    static int minRoomsHeap(int[][] intervals, boolean closed) {
        int[][] s = intervals.clone();
        Arrays.sort(s, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> ends = new PriorityQueue<>();
        for (int[] iv : s) {
            boolean free = !ends.isEmpty() && (closed ? ends.peek() < iv[0] : ends.peek() <= iv[0]);
            if (free) ends.poll();
            ends.offer(iv[1]);
        }
        return ends.size();
    }
    // #endregion

    // #region sweep
    static int minRoomsSweep(int[][] intervals, boolean closed) {
        long[][] ev = new long[intervals.length * 2][];
        int k = 0;
        for (int[] iv : intervals) {
            ev[k++] = new long[]{iv[0], +1};
            ev[k++] = new long[]{closed ? (long) iv[1] + 1 : iv[1], -1};
        }
        Arrays.sort(ev, (a, b) -> a[0] != b[0] ? Long.compare(a[0], b[0]) : Long.compare(a[1], b[1]));
        int cur = 0, best = 0;
        for (long[] e : ev) { cur += e[1]; best = Math.max(best, cur); }
        return best;
    }
    // #endregion

    static String show(int[][] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(a[i]));
        return sb.append("]").toString();
    }
    public static void main(String[] args) {
        int[][] labs = {{9, 11}, {10, 12}, {11, 13}, {13, 14}, {9, 10}};
        System.out.println("lab bookings " + show(labs));
        System.out.println("  half-open (meeting rooms): heap=" + minRoomsHeap(labs, false) + " sweep=" + minRoomsSweep(labs, false));
        System.out.println("  closed (LC 2406 groups)  : heap=" + minRoomsHeap(labs, true) + " sweep=" + minRoomsSweep(labs, true));
        int[][][] more = {{{1, 3}, {5, 6}, {8, 10}, {11, 13}}, {{1, 5}, {2, 6}, {3, 7}}, {{4, 4}, {4, 4}}};
        for (int[][] iv : more) System.out.println(show(iv) + ": closed heap=" + minRoomsHeap(iv, true) + " sweep=" + minRoomsSweep(iv, true));
    }
}
