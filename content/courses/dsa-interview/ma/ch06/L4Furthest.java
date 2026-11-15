import java.util.*;

// LC 1642 · Furthest Building You Can Reach.
public class L4Furthest {
    // #region giai
    static int furthestBuilding(int[] heights, int bricks, int ladders) {
        PriorityQueue<Integer> onLadder = new PriorityQueue<>();
        for (int i = 0; i + 1 < heights.length; i++) {
            int climb = heights[i + 1] - heights[i];
            if (climb <= 0) continue;
            onLadder.offer(climb);
            if (onLadder.size() > ladders) bricks -= onLadder.poll();
            if (bricks < 0) return i;
        }
        return heights.length - 1;
    }
    // #endregion

    public static void main(String[] args) {
        int[] h = {3, 8, 6, 12, 13, 9, 15, 20};
        System.out.println("[3,8,6,12,13,9,15,20] bricks=6 ladders=1 -> " + furthestBuilding(h, 6, 1));
        System.out.println("[3,8,6,12,13,9,15,20] bricks=12 ladders=1 -> " + furthestBuilding(h, 12, 1));
        System.out.println("[5,4,3,2] bricks=0 ladders=0 -> " + furthestBuilding(new int[]{5, 4, 3, 2}, 0, 0));
        System.out.println("[1,100] bricks=0 ladders=0 -> " + furthestBuilding(new int[]{1, 100}, 0, 0));
    }
}
