import java.util.*;

// LC 502 · IPO — min-heap by capital (locked) + max-heap by profit (affordable).
public class Ipo {
    // #region giai
    static int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        PriorityQueue<Integer> locked = new PriorityQueue<>((a, b) -> Integer.compare(capital[a], capital[b]));
        PriorityQueue<Integer> open = new PriorityQueue<>((a, b) -> Integer.compare(profits[b], profits[a]));
        for (int i = 0; i < profits.length; i++) locked.offer(i);
        for (int round = 0; round < k; round++) {
            while (!locked.isEmpty() && capital[locked.peek()] <= w) open.offer(locked.poll());
            if (open.isEmpty()) break;
            w += profits[open.poll()];
        }
        return w;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("k=3 w=1 profits=[3,1,5,2] capital=[0,1,4,2] -> " + findMaximizedCapital(3, 1, new int[]{3, 1, 5, 2}, new int[]{0, 1, 4, 2}));
        System.out.println("k=2 w=0 profits=[2,4] capital=[1,0] -> " + findMaximizedCapital(2, 0, new int[]{2, 4}, new int[]{1, 0}));
        System.out.println("k=3 w=0 profits=[5] capital=[1] -> " + findMaximizedCapital(3, 0, new int[]{5}, new int[]{1}));
    }
}
