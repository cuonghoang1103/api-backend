import java.util.*;

public class MonFpt {
    static final String[][] EDGES = {
        {"PRF192", "PRO192"}, {"PRO192", "CSD201"}, {"PRO192", "LAB211"}, {"PRO192", "PRJ301"}, {"DBI202", "PRJ301"},
        {"PRO192", "SWE201c"}, {"PRJ301", "SWP391"}, {"SWE201c", "SWP391"}, {"LAB211", "SWP391"}, {"WED201c", "FER202"},
        {"FER202", "SDN302"}, {"DBI202", "SDN302"}, {"FER202", "MMA301"}, {"PRO192", "PRN212"}, {"DBI202", "PRN212"},
        {"SWE201c", "SWT301"}, {"SWE201c", "SWR302"}, {"JPD113", "JPD123"},
    };
    static List<String> stuck;

    // #region tang
    static List<List<String>> levels(String[][] edges) {
        Map<String, List<String>> out = new HashMap<>();
        Map<String, Integer> indeg = new HashMap<>();
        for (String[] e : edges) for (String x : e) { out.putIfAbsent(x, new ArrayList<>()); indeg.putIfAbsent(x, 0); }
        for (String[] e : edges) { out.get(e[0]).add(e[1]); indeg.merge(e[1], 1, Integer::sum); }
        List<String> level = new ArrayList<>();
        for (var en : indeg.entrySet()) if (en.getValue() == 0) level.add(en.getKey());
        Collections.sort(level);
        List<List<String>> result = new ArrayList<>();
        while (!level.isEmpty()) {
            result.add(level);
            List<String> next = new ArrayList<>();
            for (String u : level) for (String v : out.get(u)) if (indeg.merge(v, -1, Integer::sum) == 0) next.add(v);
            Collections.sort(next);
            level = next;
        }
        stuck = new ArrayList<>();
        for (var en : indeg.entrySet()) if (en.getValue() > 0) stuck.add(en.getKey());
        Collections.sort(stuck);
        return result;
    }
    // #endregion

    public static void main(String[] args) {
        List<List<String>> r = levels(EDGES);
        int total = 0;
        for (int i = 0; i < r.size(); i++) { System.out.println("term " + (i + 1) + ": " + String.join(", ", r.get(i))); total += r.get(i).size(); }
        System.out.println("subjects: " + total + ", minimum terms: " + r.size() + ", stuck: " + stuck);
        String[][] bad = Arrays.copyOf(EDGES, EDGES.length + 1);
        bad[EDGES.length] = new String[]{"SWP391", "PRO192"};
        int placed = 0;
        for (List<String> l : levels(bad)) placed += l.size();
        System.out.println("with the typo: " + placed + " subjects placed, stuck: " + stuck);
    }
}
