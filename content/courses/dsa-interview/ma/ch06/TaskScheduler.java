import java.util.*;

// LC 621 · Task Scheduler — max-heap + cooldown queue, and the counting formula.
public class TaskScheduler {
    // #region heap
    static int leastIntervalHeap(char[] tasks, int n) {
        int[] count = new int[26];
        for (char t : tasks) count[t - 'A']++;
        PriorityQueue<Integer> ready = new PriorityQueue<>(Collections.reverseOrder());
        for (int c : count) if (c > 0) ready.offer(c);
        ArrayDeque<int[]> cooling = new ArrayDeque<>();          // {remaining, readyAt}
        int time = 0;
        while (!ready.isEmpty() || !cooling.isEmpty()) {
            time++;
            if (!ready.isEmpty()) {
                int c = ready.poll() - 1;
                if (c > 0) cooling.offer(new int[]{c, time + n});
            }
            if (!cooling.isEmpty() && cooling.peek()[1] == time) ready.offer(cooling.poll()[0]);
        }
        return time;
    }
    // #endregion

    // #region congthuc
    static int leastIntervalFormula(char[] tasks, int n) {
        int[] count = new int[26];
        for (char t : tasks) count[t - 'A']++;
        int maxC = 0, numMax = 0;
        for (int c : count) maxC = Math.max(maxC, c);
        for (int c : count) if (c == maxC) numMax++;
        return Math.max(tasks.length, (maxC - 1) * (n + 1) + numMax);
    }
    // #endregion

    public static void main(String[] args) {
        String[] ss = {"AAABBC", "AAAABBBB", "CCCDD", "ABCDEFA", "AAAAAABCDEFG"};
        int[] ns = {2, 1, 0, 2, 2};
        for (int i = 0; i < ss.length; i++) {
            char[] t = ss[i].toCharArray();
            System.out.println("tasks=" + ss[i] + " n=" + ns[i] + ": heap=" + leastIntervalHeap(t, ns[i]) + " formula=" + leastIntervalFormula(t, ns[i]));
        }
    }
}
