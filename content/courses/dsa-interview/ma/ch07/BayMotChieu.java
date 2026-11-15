import java.util.*;

public class BayMotChieu {
    static boolean reach(int n, int[][] edges, int s, int t, boolean both) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            if (both) adj.get(e[1]).add(e[0]);
        }
        boolean[] seen = new boolean[n];
        Deque<Integer> st = new ArrayDeque<>();
        st.push(s);
        seen[s] = true;
        while (!st.isEmpty()) {
            int u = st.pop();
            if (u == t) return true;
            for (int v : adj.get(u)) if (!seen[v]) { seen[v] = true; st.push(v); }
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] friendships = {{0, 1}, {1, 2}};
        System.out.println("one arc  : 0 → 2 ? " + reach(3, friendships, 0, 2, false) + "   2 → 0 ? " + reach(3, friendships, 2, 0, false));
        System.out.println("two arcs : 0 → 2 ? " + reach(3, friendships, 0, 2, true) + "   2 → 0 ? " + reach(3, friendships, 2, 0, true));
    }
}
