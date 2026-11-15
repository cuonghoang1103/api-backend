import java.util.*;

// LC 2402 · Meeting Rooms III — free rooms (by number) + busy rooms (by end time, then number). Times in long!
public class L7MeetingRoomsIII {
    // #region giai
    static int mostBooked(int n, int[][] meetings) {
        int[][] s = meetings.clone();
        Arrays.sort(s, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> free = new PriorityQueue<>();
        for (int r = 0; r < n; r++) free.offer(r);
        PriorityQueue<long[]> busy = new PriorityQueue<>((a, b) -> a[0] != b[0] ? Long.compare(a[0], b[0]) : Long.compare(a[1], b[1]));
        int[] used = new int[n];
        for (int[] m : s) {
            while (!busy.isEmpty() && busy.peek()[0] <= m[0]) free.offer((int) busy.poll()[1]);
            if (!free.isEmpty()) {
                int r = free.poll();
                busy.offer(new long[]{m[1], r}); used[r]++;
            } else {
                long[] b = busy.poll();
                busy.offer(new long[]{b[0] + (m[1] - m[0]), b[1]}); used[(int) b[1]]++;  // delays add up: long
            }
        }
        int best = 0;
        for (int r = 1; r < n; r++) if (used[r] > used[best]) best = r;
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("n=3 [[1,20],[2,10],[3,5],[4,9],[6,8]] -> room " + mostBooked(3, new int[][]{{1, 20}, {2, 10}, {3, 5}, {4, 9}, {6, 8}}));
        System.out.println("n=2 [[0,5],[1,2],[2,3],[3,4],[4,9]] -> room " + mostBooked(2, new int[][]{{0, 5}, {1, 2}, {2, 3}, {3, 4}, {4, 9}}));
        System.out.println("n=1 [[5,6],[1,3]] -> room " + mostBooked(1, new int[][]{{5, 6}, {1, 3}}));
    }
}
