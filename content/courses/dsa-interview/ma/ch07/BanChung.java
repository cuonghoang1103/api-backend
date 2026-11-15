import java.util.*;

public class BanChung {
    // #region giai
    static List<String> suggest(int n, int[][] edges, int me) {
        List<List<Integer>> out = new ArrayList<>();
        for (int i = 0; i < n; i++) out.add(new ArrayList<>());
        for (int[] e : edges) out.get(e[0]).add(e[1]);
        Set<Integer> level1 = new HashSet<>(out.get(me));
        Map<Integer, List<Integer>> mutual = new HashMap<>();
        for (int f : out.get(me))
            for (int x : out.get(f)) {
                if (x == me || level1.contains(x)) continue;
                mutual.computeIfAbsent(x, k -> new ArrayList<>()).add(f);
            }
        List<Map.Entry<Integer, List<Integer>>> es = new ArrayList<>(mutual.entrySet());
        es.sort((a, b) -> a.getValue().size() != b.getValue().size()
            ? b.getValue().size() - a.getValue().size() : a.getKey() - b.getKey());
        List<String> res = new ArrayList<>();
        for (var e : es) {
            StringBuilder via = new StringBuilder();
            for (int i = 0; i < e.getValue().size(); i++) via.append(i > 0 ? ", " : "").append(e.getValue().get(i));
            res.add(e.getKey() + " (via " + via + ")");
        }
        return res;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] follows = {{0, 1}, {0, 2}, {0, 3}, {1, 4}, {1, 5}, {2, 4}, {2, 6}, {3, 4}, {3, 0}, {4, 7}};
        System.out.println("suggestions for 0: " + suggest(8, follows, 0));
        System.out.println("suggestions for 1: " + suggest(8, follows, 1));
    }
}
