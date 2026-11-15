import java.util.*;

// Two comparator bugs that silently reorder a priority queue — and the one-word fix.
public class ComparatorTran {
    record Job(String name, long deadline) {}

    public static void main(String[] args) {
        // #region tran
        int[] prio = {5, 2_000_000_000, -7, -2_000_000_000, 0};
        PriorityQueue<Integer> wrong = new PriorityQueue<>((a, b) -> a - b);          // overflows
        PriorityQueue<Integer> right = new PriorityQueue<>((a, b) -> Integer.compare(a, b));
        for (int p : prio) { wrong.offer(p); right.offer(p); }
        List<Integer> w = new ArrayList<>(), r = new ArrayList<>();
        while (!wrong.isEmpty()) w.add(wrong.poll());
        while (!right.isEmpty()) r.add(right.poll());
        System.out.println("(a, b) -> a - b          : " + w);
        System.out.println("Integer.compare(a, b)    : " + r);
        System.out.println("2_000_000_000 - (-2_000_000_000) as int = " + (2_000_000_000 - (-2_000_000_000)));
        // #endregion

        // #region deadline
        long now = 1_763_200_000_000L;                         // epoch milliseconds (Nov 2025)
        long day = 86_400_000L;
        Job[] jobs = {
            new Job("send-otp (due now)", now),
            new Job("weekly-report (in 7 days)", now + 7 * day),
            new Job("attacker (in 30 days)", now + 30 * day),
        };
        PriorityQueue<Job> bad = new PriorityQueue<>((a, b) -> (int) (a.deadline() - b.deadline())); // truncates
        PriorityQueue<Job> good = new PriorityQueue<>(Comparator.comparingLong(Job::deadline));
        for (Job j : jobs) { bad.offer(j); good.offer(j); }
        System.out.println("(int) (a - b) runs first : " + bad.peek().name());
        System.out.println("comparingLong runs first : " + good.peek().name());
        System.out.println("(int) (30 days in ms) = " + (int) (30 * day) + "   (int) (7 days in ms) = " + (int) (7 * day));
        // #endregion
    }
}
