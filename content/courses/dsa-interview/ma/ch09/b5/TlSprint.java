import java.util.*;

// A toy version of the sprint planner (planSprint): greedy in rank order vs a 0/1 knapsack on points only.
public class TlSprint {
    record Issue(String key, int points) {}

    // #region greedy
    static List<Issue> planGreedy(List<Issue> items, int cap) {
        List<Issue> picked = new ArrayList<>();
        int total = 0;
        for (Issue it : items) {                          // rank order = the product owner's priority
            if (total + it.points() > cap) continue;      // too big for what is left -> skip
            picked.add(it);
            total += it.points();
        }
        return picked;
    }
    // #endregion

    static List<Issue> planKnapsack(List<Issue> items, int cap) {
        int n = items.size();
        int[][] dp = new int[n + 1][cap + 1];
        for (int i = 1; i <= n; i++)
            for (int w = 0; w <= cap; w++) {
                dp[i][w] = dp[i - 1][w];
                int p = items.get(i - 1).points();
                if (p <= w) dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - p] + p);
            }
        LinkedList<Issue> picked = new LinkedList<>();
        for (int i = n, w = cap; i > 0; i--)
            if (dp[i][w] != dp[i - 1][w]) { picked.addFirst(items.get(i - 1)); w -= items.get(i - 1).points(); }
        return picked;
    }

    static String show(List<Issue> s) {
        StringBuilder sb = new StringBuilder();
        int sum = 0;
        for (Issue x : s) { if (sb.length() > 0) sb.append(' '); sb.append(x.key()).append('(').append(x.points()).append(')'); sum += x.points(); }
        return sb + " = " + sum + " pts";
    }

    public static void main(String[] args) {
        List<Issue> backlog = List.of(new Issue("CTW-1", 8), new Issue("CTW-2", 13), new Issue("CTW-3", 5),
            new Issue("CTW-4", 3), new Issue("CTW-5", 2), new Issue("CTW-6", 1));
        int target = 20;
        System.out.println("target " + target + " points");
        System.out.println("greedy by rank : " + show(planGreedy(backlog, target)));
        System.out.println("knapsack (max) : " + show(planKnapsack(backlog, target)));
    }
}
