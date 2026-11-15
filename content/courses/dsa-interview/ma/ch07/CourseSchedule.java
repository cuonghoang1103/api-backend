import java.util.*;

public class CourseSchedule {
    // #region kahn
    static int[] findOrder(int n, int[][] prerequisites) {
        List<List<Integer>> out = new ArrayList<>();
        for (int i = 0; i < n; i++) out.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] p : prerequisites) { out.get(p[1]).add(p[0]); indeg[p[0]]++; }   // p[1] → p[0]
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int v = 0; v < n; v++) if (indeg[v] == 0) q.add(v);
        int[] order = new int[n];
        int k = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order[k++] = u;
            for (int v : out.get(u)) if (--indeg[v] == 0) q.add(v);
        }
        return k == n ? order : new int[0];
    }
    static boolean canFinish(int n, int[][] pre) { return findOrder(n, pre).length == n; }
    // #endregion

    public static void main(String[] args) {
        int[][][] tests = {{{1, 0}}, {{1, 0}, {0, 1}}, {{1, 0}, {2, 0}, {3, 1}, {3, 2}}, {{1, 0}, {2, 0}, {3, 1}, {3, 2}, {5, 4}}, {{1, 0}, {2, 1}, {0, 2}}};
        int[] ns = {2, 2, 4, 6, 3};
        for (int i = 0; i < tests.length; i++)
            System.out.println(Arrays.toString(findOrder(ns[i], tests[i])) + " " + canFinish(ns[i], tests[i]));
    }
}
