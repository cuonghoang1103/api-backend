import java.util.*;

// Real life: put exams into time slots so that no student has two exams in the same slot (graph colouring).
public class LichThi {
    // #region xep
    static int[] schedule(int nExams, int[][] conflicts, int slots) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < nExams; i++) adj.add(new ArrayList<>());
        for (int[] c : conflicts) { adj.get(c[0]).add(c[1]); adj.get(c[1]).add(c[0]); }
        int[] slotOf = new int[nExams];
        Arrays.fill(slotOf, -1);
        return bt(0, adj, slotOf, slots) ? slotOf : null;
    }

    static boolean bt(int e, List<List<Integer>> adj, int[] slotOf, int slots) {
        if (e == slotOf.length) return true;
        for (int s = 0; s < slots; s++) {
            boolean clash = false;
            for (int o : adj.get(e)) if (slotOf[o] == s) { clash = true; break; }
            if (clash) continue;
            slotOf[e] = s;
            if (bt(e + 1, adj, slotOf, slots)) return true;
            slotOf[e] = -1;
        }
        return false;
    }
    // #endregion

    public static void main(String[] args) {
        String[] exams = {"SWT301", "FER202", "SWR302", "JPD123", "LAB211", "MAS291"};
        int[][] conflicts = {{0, 1}, {0, 2}, {1, 2}, {1, 3}, {2, 3}, {3, 4}, {4, 0}, {5, 0}, {5, 2}, {4, 5}};
        for (int slots : new int[]{2, 3}) {
            int[] plan = schedule(exams.length, conflicts, slots);
            if (plan == null) { System.out.println(slots + " slots: impossible"); continue; }
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < exams.length; i++) sb.append(i == 0 ? "" : ", ").append(exams[i]).append("->").append(plan[i] + 1);
            System.out.println(slots + " slots: " + sb);
        }
    }
}
